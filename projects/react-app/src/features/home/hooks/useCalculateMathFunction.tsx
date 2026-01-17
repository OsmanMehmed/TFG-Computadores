import { Dispatch, SetStateAction, useState } from "react";
import MathFunctionFormModel from "../models/mathFunctionFormModel";
import { compile } from "mathjs";

export default function useCalculateMathFunction(): {
  mathFunctionsResultValues: number[][];
  mathFunctionForm: MathFunctionFormModel;
  convertMathFunctionForm: (form: MathFunctionFormModel) => void;
  mathFunctionCalculated: boolean;
} {
  const [mathFunctionsResultValues, setMathFunctionsResultValues]: [
    number[][],
    Dispatch<SetStateAction<number[][]>>,
  ] = useState<number[][]>([]);

  const [mathFunctionForm, setMathFunctionForm]: [
    MathFunctionFormModel,
    Dispatch<SetStateAction<MathFunctionFormModel>>,
  ] = useState<MathFunctionFormModel>(undefined);

  const [mathFunctionCalculated, setMathFunctionCalculated] =
    useState<boolean>(false);

  const convertMathFunctionForm = (form: MathFunctionFormModel): void => {
    const operationFunctionsResultList: number[][] = [];

    setMathFunctionForm(form);

    form.functions.forEach((functionExpression) => {
      let mathFunction = functionExpression.replace(/\s+/g, "");

      Object.entries(form.paramList).forEach(([paramName, paramValue]) => {
        mathFunction = mathFunction.replaceAll(paramName, paramValue);
      });

      const operationResultList: number[] = [];

      // Check if varList has entries and if the first entry has values
      const varEntries = Object.entries(form.varList);
      const loopLength = varEntries.length > 0 ? varEntries[0][1].length : 0;

      for (let loopIndex = 0; loopIndex < loopLength; loopIndex++) {
        const tmpCompileFunctionObject: {
          [key: string]: number;
        } = {};

        Object.entries(form.varList).forEach(([varName, values]) => {
          tmpCompileFunctionObject[varName] = parseFloat(values[loopIndex]);
        });

        const mathFunctionCompiled = compile(mathFunction);
        operationResultList.push(
          mathFunctionCompiled.evaluate(tmpCompileFunctionObject),
        );
      }
      operationFunctionsResultList.push(operationResultList);
    });

    setMathFunctionsResultValues(operationFunctionsResultList);
    setMathFunctionCalculated(!mathFunctionCalculated);
  };

  return {
    mathFunctionsResultValues,
    mathFunctionForm,
    convertMathFunctionForm,
    mathFunctionCalculated,
  };
}
