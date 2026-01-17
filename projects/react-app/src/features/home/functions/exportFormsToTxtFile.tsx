/* eslint-disable no-extra-boolean-cast */
import { Constants } from '../../shared/utils/constants'
import ExportableImportableFormModel from '../models/exportableFormModel'
import MathSeriesFormModel from '../models/mathSeriesFormModel'

function longestValueLength(matrix: string[][], array: string[]): number {
  let maxLength = 0
  let longestValue = ''

  matrix.forEach((row) => {
    row.forEach((value) => {
      if (value.length > maxLength) {
        maxLength = value.length
        longestValue = value
      }
    })
  })

  array.forEach((value) => {
    if (value.length > maxLength) {
      maxLength = value.length
      longestValue = value
    }
  })

  return longestValue.length
}

export default function exportFormsToTxtFile(exportableForm: ExportableImportableFormModel): void {
  const tmpExportableForm = { ...exportableForm }
  let formattedData = ''

  tmpExportableForm.mathFunctionForm.functions.forEach((functionExpression, index) => {
    formattedData += `${Constants.FUNCTION}${index}${Constants.Equals}${functionExpression}\n`
  })

  formattedData += '\n'

  const variables = tmpExportableForm.mathFunctionForm.varList
  const variableNames = Object.keys(variables)

  const parameters = tmpExportableForm.mathFunctionForm.paramList
  const paramNames = Object.keys(parameters)

  const variableValues = Object.values(variables)
  const paramValues = Object.values(parameters)
  const numberOfRows = variableValues.reduce((acc, val) => Math.max(acc, val.length), 0)

  const minimumPaddingEnd = 26

  const headerRow = tmpExportableForm.mathFunctionForm.functions
    .map((functionExpression, index): string => `${Constants.FUNCTION}${index}`)
    .concat(variableNames)
    .concat(paramNames)
  formattedData += headerRow
    .map((h) => h.padEnd(longestValueLength(variableValues, paramValues) > minimumPaddingEnd ? longestValueLength(variableValues, paramValues)+1 : minimumPaddingEnd))
    .join('')
  formattedData += '\n'

  for (let i = 0; i < numberOfRows; i++) {
    const rowValues = tmpExportableForm.functionsResults
      .map((functionResultList) => functionResultList[i] || '')
      .concat(variableValues.map((vals) => vals[i] || ''))
      .concat(paramValues.map((val) => (i === 0 ? val : '')))
    formattedData += rowValues
      .map((val) => val.padEnd(longestValueLength(variableValues, paramValues) > minimumPaddingEnd ? longestValueLength(variableValues, paramValues)+1 : minimumPaddingEnd))
      .join('')
    formattedData += '\n'
  }

  formattedData += '\n\n'

  tmpExportableForm.functionsResults.forEach((functionResultList, index) => {
    formattedData += `${Constants.functionResultsTxtFormat}${index}${Constants.Equals}${functionResultList.join(',')}\n`
  })

  formattedData += '\n'

  Object.entries(tmpExportableForm.mathFunctionForm.varList).forEach(([varName, varValues]) => {
    formattedData += `${Constants.varTxtFormat}${varName}${Constants.Equals}`
    formattedData += varValues.join(',')
    formattedData += '\n\n'
  })

  Object.entries(tmpExportableForm.mathFunctionForm.paramList).forEach(([paramName, paramValue]) => {
    formattedData += `${Constants.paramTxtFormat}${paramName}${Constants.Equals}${paramValue}\n\n`
  })

  if (!!tmpExportableForm.mathSeriesFormList) {
    const tmpMathSeriesFormModelList = Object.values(tmpExportableForm.mathSeriesFormList).map((form) => {
      return form as MathSeriesFormModel
    })

    tmpMathSeriesFormModelList.forEach((form) => {
      formattedData += '\n'
      formattedData += `${Constants.seriesFunctionTxtFormat}${Constants.Equals}${form.seriesFunction}\n`
      formattedData += `${Constants.initialNValueTxtFormat}${Constants.Equals}${form.initialNValue}\n`
      formattedData += `${Constants.finalNValueTxtFormat}${Constants.Equals}${form.finalNValue}\n`
      formattedData += `${Constants.isArithmeticProgressionTxtFormat}${Constants.Equals}${form.isArithmeticProgression}\n`
      formattedData += `${Constants.differenceTxtFormat}${Constants.Equals}${form.difference}\n`
      formattedData += `${Constants.seriesVarNameTxtFormat}${Constants.Equals}${form.seriesVarName}\n`
      formattedData += `${Constants.validTxtFormat}${Constants.Equals}${form.valid}\n`
    })
  }

  const element = document.createElement('a')
  const file = new Blob([formattedData], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = `${Constants.ExportedFileName}.txt`
  document.body.appendChild(element)
  element.click()
}
