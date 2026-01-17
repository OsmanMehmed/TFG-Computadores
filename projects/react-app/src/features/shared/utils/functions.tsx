import MathSeriesFormModel from '../../home/models/mathSeriesFormModel'
import { Constants } from './constants'

export function cutIfLongName(name: string, cutIfGreatherThan: number): string {
  if (name.length > cutIfGreatherThan) {
    const shortedName = name.substring(0, name.length - 1).substring(0, cutIfGreatherThan)

    return `${shortedName}${Constants.treeDots}`
  }

  return name
}

export function cutIfLongFileName(fileName: string, cutIfGreatherThan: number): string {
  if (fileName.length > cutIfGreatherThan) {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
    const shortedName = fileName.substring(0, fileName.length - extension.length - 1).substring(0, cutIfGreatherThan)

    return `${shortedName}${Constants.treeDots}${Constants.Dot}${extension}`
  }

  return fileName
}

export function getRandomColorHexadecimal(): string{
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function isSomeImportantAtributeMathSeriesNull(form: MathSeriesFormModel): boolean {
  return ((!form.finalNValue && form.finalNValue !== 0) || (!form.initialNValue && form.initialNValue !== 0) || (!form.isArithmeticProgression ? !form.seriesFunction : !form.difference && form.difference !== 0) || !form.seriesVarName)
}

export function getFunctionParameters(
  functionList: string[],
  variablesToDiscard: string[],
  parametersToDiscard: string[],
  oldParameterHashMap: Record<string, string>,
  reservedWords: string[]
): Record<string, string> {
  const newNewParameterHashMap: Record<string, string> = {}
  const escapedWords = reservedWords.map((word) => escapeRegExp(word))
  const regexPattern = new RegExp(escapedWords.join('|'), 'gi')

  const functionSTRRemovedReservedWords = functionList.join('()').replace(/\s+/g, '').split(regexPattern)

  functionSTRRemovedReservedWords
    .filter((element) => isNaN(Number(element)))
    .forEach((parameter) => {
      if ((!!variablesToDiscard && variablesToDiscard.length > 0) || (!!parametersToDiscard && parametersToDiscard.length > 0)) {
        if (!variablesToDiscard.includes(parameter) && !parametersToDiscard.includes(parameter)) {
          newNewParameterHashMap[parameter] = ''
        } else {
          if (parametersToDiscard.includes(parameter)) {
            if (!variablesToDiscard.includes(parameter)) {
              newNewParameterHashMap[parameter] = oldParameterHashMap[parameter]
            }
          }
        }
      } else {
        newNewParameterHashMap[parameter] = ''
      }
    })

  return newNewParameterHashMap
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}