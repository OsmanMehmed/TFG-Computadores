import { Dispatch, SetStateAction, useState } from 'react'
import MathFunctionFormModel from '../models/mathFunctionFormModel'
import { compile } from 'mathjs'

export default function useCalculateMathFunction(): {
  mathFunctionResultValues: number[];
  mathFunctionForm: MathFunctionFormModel;
  convertMathFunctionForm: (form: MathFunctionFormModel) => void;
  } {
  const [mathFunctionResultValues, setMathFunctionResultValues]: [number[], Dispatch<SetStateAction<number[]>>] = useState<number[]>([])

  const [mathFunctionForm, setMathFunctionForm]: [MathFunctionFormModel, Dispatch<SetStateAction<MathFunctionFormModel>>] = useState<MathFunctionFormModel>(undefined)

  const convertMathFunctionForm = (form: MathFunctionFormModel): void => {
    const operationResultList: number[] = []

    setMathFunctionForm(form)

    let mathFunction = form.function.replace(/\s+/g, '')

    Object.entries(form.paramList).forEach(([paramName, paramValue]) => {
      mathFunction = mathFunction.replaceAll(paramName, paramValue)
    })

    for (let loopIndex = 0; loopIndex < Object.entries(form.varList)[0][1].length; loopIndex++) {
      const tmpCompileFunctionObject: {
        [key: string]: number;
      } = {}

      Object.entries(form.varList).forEach(([varName, values]) => {
        tmpCompileFunctionObject[varName] = parseFloat(values[loopIndex])
      })

      const mathFunctionCompiled = compile(mathFunction)
      operationResultList.push(mathFunctionCompiled.evaluate(tmpCompileFunctionObject))
    }

    setMathFunctionResultValues(operationResultList)
  }

  return {
    mathFunctionResultValues,
    mathFunctionForm,
    convertMathFunctionForm,
  }
}
