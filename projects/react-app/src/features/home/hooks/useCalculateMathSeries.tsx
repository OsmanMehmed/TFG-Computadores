/* eslint-disable no-extra-boolean-cast */
import MathSeriesFormModel from "../models/mathSeriesFormModel";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import useCalculateMathFunction from "./useCalculateMathFunction";
import { Constants } from "../../shared/utils/constants";
import MathFunctionFormModel from "../models/mathFunctionFormModel";
import { isSomeImportantAtributeMathSeriesNull } from "../../shared/utils/functions";

export default function useCalculateMathSeries(): {
  mathSeriesResultValuesList: number[][];
  mathSeriesFormList: MathSeriesFormModel[];
  calculateSeriesAddOrResetForms: (form: MathSeriesFormModel) => void;
  addDisabledMathSeriesFormEarseValues: (
    matSeriesForm: MathSeriesFormModel,
  ) => void;
  deleteMathSeriesForm: (seriesVarname: string) => void;
  deleteAllCalculatedForms: () => void;
  processedMathSeriesCalculationPetition: boolean;
} {
  const [
    processedMathSeriesCalculationPetition,
    setProcessedMathSeriesCalculationPetition,
  ] = useState<boolean>(false);

  const [mathSeriesResultValuesList, setMathSeriesResultValuesList]: [
    number[][],
    Dispatch<SetStateAction<number[][]>>,
  ] = useState<number[][]>([]);

  const [mathSeriesFormList, setMathSeriesFormList]: [
    MathSeriesFormModel[],
    Dispatch<SetStateAction<MathSeriesFormModel[]>>,
  ] = useState<MathSeriesFormModel[]>([]);

  const { mathFunctionsResultValues, convertMathFunctionForm } =
    useCalculateMathFunction();

  const [successionFormIndexToAdd, setSuccessionFormIndexToAdd] =
    useState<number>(0);

  const [calculatedMathFunction, setCalculatedMathFunction] =
    useState<boolean>(false);

  function deleteAllCalculatedForms(): void {
    setMathSeriesResultValuesList([]);
    setMathSeriesFormList([]);
  }

  function calculateSeriesAddOrResetForms(form: MathSeriesFormModel): void {
    let seriesFunction = "";
    const tmpParamList: Record<string, string> = {};
    const tmpVarList: Record<string, string[]> = {};

    let tmpMathSeriesFormList = mathSeriesFormList.map((seriesForm) => {
      return { ...seriesForm };
    });

    function getRangeFromTo(from: number, to: number): string[] {
      const valuesList: string[] = [];

      for (let loopIndex: number = from; loopIndex <= to; loopIndex++) {
        valuesList.push(`${loopIndex}`);
      }
      return valuesList;
    }

    if (!!form && !isSomeImportantAtributeMathSeriesNull(form)) {
      if (tmpMathSeriesFormList.length > 0) {
        if (
          !!tmpMathSeriesFormList.find(
            (mathSeriesForm) =>
              mathSeriesForm.seriesVarName === form.seriesVarName,
          )
        ) {
          tmpMathSeriesFormList = tmpMathSeriesFormList.map(
            (mathSeriesForm) => {
              if (mathSeriesForm.seriesVarName === form.seriesVarName) {
                return form;
              } else {
                return mathSeriesForm;
              }
            },
          );
        } else {
          tmpMathSeriesFormList.push(form);
        }
      } else {
        tmpMathSeriesFormList.push(form);
      }

      setMathSeriesFormList(tmpMathSeriesFormList);

      if (form.isArithmeticProgression) {
        const starting2BecauseKnowFirstIterationByDefinition = 2;
        const plus1CauseNotStartingCountFrom0 = 1;
        seriesFunction = Constants.mathArithmeticProgressionFormula;

        tmpParamList[
          Constants.differenceParameterArithmeticProgressionFormula
        ] = `${form.difference}`;

        tmpParamList[Constants.initialValueArithmeticProgressionFormula] =
          `${form.initialNValue}`;

        tmpVarList[Constants.variableArithmeticProgressionFormula] =
          getRangeFromTo(
            starting2BecauseKnowFirstIterationByDefinition,
            form.finalNValue + plus1CauseNotStartingCountFrom0,
          );
      } else {
        seriesFunction = form.seriesFunction;
        tmpVarList[Constants.variableArithmeticProgressionFormula] =
          getRangeFromTo(form.initialNValue, form.finalNValue);
      }

      const mathFunctionFormToSend: MathFunctionFormModel = {
        functions: [seriesFunction],
        varList: tmpVarList,
        paramList: tmpParamList,
      };

      convertMathFunctionForm(mathFunctionFormToSend);
      setSuccessionFormIndexToAdd(parseInt(form.seriesVarName.substring(3)));
      setCalculatedMathFunction(!calculatedMathFunction);
    }
  }

  function addDisabledMathSeriesFormEarseValues(
    matSeriesForm: MathSeriesFormModel,
  ): void {
    if (
      !!mathSeriesFormList &&
      mathSeriesFormList.length > 0 &&
      !!mathSeriesResultValuesList
    ) {
      const tmpMathSeriesResultValuesList: number[][] = [];
      const tmpMathSeriesFormList = mathSeriesFormList.map((seriesForm) => {
        return { ...seriesForm };
      });

      mathSeriesResultValuesList.forEach((valueList, index) => {
        if (index !== parseInt(matSeriesForm.seriesVarName.substring(3))) {
          tmpMathSeriesResultValuesList[index] = valueList;
        }
      });

      const mathSeriesDisableIndex = mathSeriesFormList.findIndex(
        (mathSeries) =>
          mathSeries.seriesVarName === matSeriesForm.seriesVarName,
      );

      if (mathSeriesDisableIndex > -1) {
        tmpMathSeriesFormList[mathSeriesDisableIndex] = matSeriesForm;
      }

      setMathSeriesFormList(
        !!tmpMathSeriesFormList ? tmpMathSeriesFormList : [],
      );
      setMathSeriesResultValuesList(
        !!tmpMathSeriesResultValuesList ? tmpMathSeriesResultValuesList : [],
      );
      setProcessedMathSeriesCalculationPetition(
        !processedMathSeriesCalculationPetition,
      );
    }
  }

  function deleteMathSeriesForm(seriesVarname: string): void {
    if (
      !!mathSeriesFormList &&
      mathSeriesFormList.length > 0 &&
      !!mathSeriesResultValuesList
    ) {
      const tmpMathSeriesResultValuesList: number[][] = [];
      const tmpMathSeriesFormList: MathSeriesFormModel[] = [];

      mathSeriesResultValuesList.forEach((valueList, index) => {
        if (index !== parseInt(seriesVarname.substring(3))) {
          tmpMathSeriesResultValuesList[
            index > parseInt(seriesVarname.substring(3)) ? index - 1 : index
          ] = valueList;
        }
      });

      mathSeriesFormList.forEach((matseries) => {
        if (
          parseInt(matseries.seriesVarName.substring(3)) !==
          parseInt(seriesVarname.substring(3))
        ) {
          if (
            parseInt(matseries.seriesVarName.substring(3)) >
            parseInt(seriesVarname.substring(3))
          ) {
            matseries.seriesVarName = `${Constants.VAR}${parseInt(matseries.seriesVarName.substring(3)) - 1}`;
            tmpMathSeriesFormList[
              parseInt(matseries.seriesVarName.substring(3)) - 1
            ] = matseries;
          } else {
            tmpMathSeriesFormList[
              parseInt(matseries.seriesVarName.substring(3))
            ] = matseries;
          }
        }
      });

      setMathSeriesFormList(
        !!tmpMathSeriesFormList ? tmpMathSeriesFormList : [],
      );
      setMathSeriesResultValuesList(
        !!tmpMathSeriesResultValuesList ? tmpMathSeriesResultValuesList : [],
      );
      setProcessedMathSeriesCalculationPetition(
        !processedMathSeriesCalculationPetition,
      );
    }
  }

  useEffect(() => {
    if (!!mathSeriesFormList && mathSeriesFormList.length > 0) {
      const tmpMathSeriesResultValuesList = !!mathSeriesResultValuesList
        ? mathSeriesResultValuesList
        : [];

      if (
        !!mathSeriesFormList[successionFormIndexToAdd] &&
        !!mathSeriesFormList[successionFormIndexToAdd]
          ?.isArithmeticProgression &&
        mathSeriesFormList[successionFormIndexToAdd].isArithmeticProgression
      ) {
        const tmpSiftedValues = mathFunctionsResultValues[0].slice();
        tmpSiftedValues.unshift(
          mathSeriesFormList[successionFormIndexToAdd].initialNValue,
        );
        tmpMathSeriesResultValuesList[successionFormIndexToAdd] =
          tmpSiftedValues;
        setMathSeriesResultValuesList(tmpMathSeriesResultValuesList);
      } else {
        tmpMathSeriesResultValuesList[successionFormIndexToAdd] =
          mathFunctionsResultValues[0].slice();
        setMathSeriesResultValuesList(tmpMathSeriesResultValuesList);
      }
      setProcessedMathSeriesCalculationPetition(
        !processedMathSeriesCalculationPetition,
      );
    }
  }, [
    calculatedMathFunction,
    successionFormIndexToAdd,
    mathSeriesFormList,
    mathFunctionsResultValues,
  ]);

  return {
    mathSeriesResultValuesList,
    mathSeriesFormList,
    calculateSeriesAddOrResetForms,
    addDisabledMathSeriesFormEarseValues,
    deleteMathSeriesForm,
    processedMathSeriesCalculationPetition,
    deleteAllCalculatedForms,
  };
}
