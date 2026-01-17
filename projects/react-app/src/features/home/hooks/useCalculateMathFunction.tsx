/* eslint-disable no-extra-boolean-cast */
import { Dispatch, SetStateAction, useState } from 'react'
import MathFunctionFormModel from '../models/mathFunctionFormModel'
import { compile } from 'mathjs'

export default function useCalculateMathFunction(): {
  mathFunctionsResultValues: number[][];
  mathFunctionForm: MathFunctionFormModel;
  convertMathFunctionForm: (form: MathFunctionFormModel) => void;
  mathFunctionCalculated: boolean;
  } {
  const [mathFunctionsResultValues, setMathFunctionsResultValues]: [number[][], Dispatch<SetStateAction<number[][]>>] = useState<number[][]>([])

  const [mathFunctionForm, setMathFunctionForm]: [MathFunctionFormModel, Dispatch<SetStateAction<MathFunctionFormModel>>] = useState<MathFunctionFormModel>(undefined)

  const [mathFunctionCalculated, setMathFunctionCalculated] = useState<boolean>(false)

  function convertMathFunctionForm(form: MathFunctionFormModel): void {
    const operationResultList: number[][] = []

    setMathFunctionForm({...form})

    form.functions.forEach( (functionExpression, index) => {

      const tmpFunctionResultList = []

      if (!!functionExpression && functionExpression.length > 0){

        const mathFunction = functionExpression.replace(/\s+/g, '')
        
        const tmpCompileFunctionObject: {
            [key: string]: number;
          } = {}

        Object.entries(form.paramList).forEach(([paramName, paramValue]) => {
          tmpCompileFunctionObject[paramName] = parseFloat(paramValue)
        })

        for (let loopIndex = 0; loopIndex < Object.entries(form.varList)[0][1].length; loopIndex++) {
          

          Object.entries(form.varList).forEach(([varName, values]) => {
            tmpCompileFunctionObject[varName] = parseFloat(values[loopIndex])
          })

          const mathFunctionCompiled = compile(mathFunction)
          tmpFunctionResultList.push(mathFunctionCompiled.evaluate(tmpCompileFunctionObject))
        }
      }

      if (!!tmpFunctionResultList && tmpFunctionResultList.length > 0){
        operationResultList[index] = tmpFunctionResultList.slice()
      }
    })


    setMathFunctionsResultValues(operationResultList)
    setMathFunctionCalculated(!mathFunctionCalculated)
  }

  return {
    mathFunctionsResultValues,
    mathFunctionForm,
    convertMathFunctionForm,
    mathFunctionCalculated
  }
}
