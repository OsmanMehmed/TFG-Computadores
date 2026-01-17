import ExportableImportableFormModel from "../models/exportableFormModel";
import MathFunctionFormModel from "../models/mathFunctionFormModel";
import MathSeriesFormModel from "../models/mathSeriesFormModel";

export default function areEqual2ExportableImportableForm(
  exportableForm1: ExportableImportableFormModel,
  exportableForm2: ExportableImportableFormModel,
): boolean {
  if (
    !compareFunctionResults(
      exportableForm1.functionsResults,
      exportableForm2.functionsResults,
    )
  ) {
    return false;
  }

  if (
    !compareMathFunctionForms(
      exportableForm1.mathFunctionForm,
      exportableForm2.mathFunctionForm,
    )
  ) {
    return false;
  }

  if (
    !compareMathSeriesFormLists(
      { ...exportableForm1.mathSeriesFormList },
      { ...exportableForm2.mathSeriesFormList },
    )
  ) {
    return false;
  }

  if (exportableForm1.valid !== exportableForm2.valid) {
    return false;
  }

  return true;
}

function compareFunctionResults(
  functionResults1: string[][],
  functionResults2: string[][],
): boolean {
  if (JSON.stringify(functionResults1) !== JSON.stringify(functionResults2)) {
    return false;
  }
  return true;
}

function compareMathFunctionForms(
  mathFunctionForm1: MathFunctionFormModel,
  mathFunctionForm2: MathFunctionFormModel,
): boolean {
  if (
    JSON.stringify(mathFunctionForm1.functions) !==
    JSON.stringify(mathFunctionForm2.functions)
  ) {
    return false;
  }

  if (
    JSON.stringify(mathFunctionForm1.varList) !==
    JSON.stringify(mathFunctionForm2.varList)
  ) {
    return false;
  }

  if (
    JSON.stringify(mathFunctionForm1.paramList) !==
    JSON.stringify(mathFunctionForm2.paramList)
  ) {
    return false;
  }

  return true;
}

function compareMathSeriesFormLists(
  mathSeriesFormList1?: MathSeriesFormModel[],
  mathSeriesFormList2?: MathSeriesFormModel[],
): boolean {
  if (!mathSeriesFormList1 || !mathSeriesFormList2) {
    return !mathSeriesFormList1 && !mathSeriesFormList2;
  }

  if (mathSeriesFormList1.length !== mathSeriesFormList2.length) {
    return false;
  }

  for (let i = 0; i < mathSeriesFormList1.length; i++) {
    if (
      !compareMathSeriesForms(mathSeriesFormList1[i], mathSeriesFormList2[i])
    ) {
      return false;
    }
  }

  return true;
}

function compareMathSeriesForms(
  mathSeriesForm1: MathSeriesFormModel,
  mathSeriesForm2: MathSeriesFormModel,
): boolean {
  if (mathSeriesForm1.seriesFunction !== mathSeriesForm2.seriesFunction) {
    return false;
  }

  if (
    mathSeriesForm1.initialNValue !== mathSeriesForm2.initialNValue ||
    mathSeriesForm1.finalNValue !== mathSeriesForm2.finalNValue
  ) {
    return false;
  }

  if (
    mathSeriesForm1.isArithmeticProgression !==
    mathSeriesForm2.isArithmeticProgression
  ) {
    return false;
  }

  if (mathSeriesForm1.difference !== mathSeriesForm2.difference) {
    return false;
  }

  if (mathSeriesForm1.seriesVarName !== mathSeriesForm2.seriesVarName) {
    return false;
  }

  if (mathSeriesForm1.valid !== mathSeriesForm2.valid) {
    return false;
  }

  return true;
}
