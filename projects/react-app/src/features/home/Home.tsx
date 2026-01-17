/* eslint-disable no-extra-boolean-cast */
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
  Theme,
  ThemeProvider,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLoadDataFile } from "./hooks/useLoadDataFile";
import { Constants } from "../shared/utils/constants";
import { Palette } from "../shared/utils/palette";
import useFunctionsToApply from "./hooks/useLoadFunctionList";
import CachedIcon from "@mui/icons-material/Cached";
import ForwardIcon from "@mui/icons-material/Forward";
import MathSeriesFormModel from "./models/mathSeriesFormModel";
import "./home.css";
import useCalculateMathSeries from "./hooks/useCalculateMathSeries";
import MathFunctionFormModel from "./models/mathFunctionFormModel";
import ExportableImportableFormModel from "./models/exportableFormModel";
import useCalculateMathFunction from "./hooks/useCalculateMathFunction";
import {
  cutIfLongFileName,
  cutIfLongName,
  getFunctionParameters,
} from "../shared/utils/functions";
import MathSeriesForm from "./components/mathSeriesForm/MathSeriesForm";
import TableFunctionResults from "./components/tableFunctionResults/TableFunctionResults";
import DropDown from "./components/dropdown/Dropdown";
import GrapRepresentation from "./components/graphRepresentation/GraphRepresentation";
import exportFormsToTxtFile from "./functions/exportFormsToTxtFile";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import areEqual2ExportableImportableForm from "./functions/areEqual2ExportableImportableForm";
import CheckExportableFormsDifferenceDialog from "./components/checkExportableFormsDifferenceDialog/checkExportableFormsDifferenceDialog";
import React from "react";
import { Resizable } from "re-resizable";
import NavBar from "../navBar/NavBar";
import Footer from "../footer/footer";
import ChooseFunctionToFillDialog from "./components/chooseFunctionToFillDialog/ChooseFunctionToFillDialog";
import ExitModeCleanFormDialog from "./components/exitModeCleanFormDialog/exitModeCleanFormDialog";
import { ExportWhich, UserGenericModalSelection } from "./models/modalModels";
import { useForm } from "react-hook-form";
import * as math from "mathjs";
import InfoPopUp from "./components/infoPopUp/infoPopUp";

const theme: Theme = Palette.getPalette();

function removeDeclarationFromFunction(functionString: string): string {
  const functionContent = functionString.split("=");
  return functionContent.length > 1 ? functionContent[1] : functionContent[0];
}

function getDefaultVarListIdentifiers(): Record<string, string> {
  const resetVarListIdentifiers: Record<string, string> = {};
  resetVarListIdentifiers[`${Constants.VAR}${0}`] = "";

  return resetVarListIdentifiers;
}

function getDefaultVarListValues(): Record<string, string[]> {
  const resetVarListValues: Record<string, string[]> = {};
  resetVarListValues[`${Constants.VAR}${0}`] = [""];

  return resetVarListValues;
}

const Home = React.memo((): React.ReactElement => {
  const [isVisibleSumationForm, setIsVisibleSumationForm] =
    useState<boolean>(false);

  const [isVisibleManualInputForm, setIsVisibleManualInputForm] =
    useState<boolean>(false);

  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);

  const [isReadyToProcessFunctions, setIsReadyToProcessFunctions] =
    useState<boolean>(false);

  const [isReadyToExportData, setIsReadyToExportData] =
    useState<boolean>(false);

  const [
    areVarIdentifiersRecentlyModified,
    setAreVarIdentifiersRecentlyModified,
  ] = useState<boolean>(false);

  const [parameterListRecentlyModified, setParameterListRecentlyModified] =
    useState<boolean>(false);

  const [areMathSeriesRecentlyImported, setAreMathSeriesRecentlyImported] =
    useState<boolean>(false);

  const [isOpenedTypeExportDialog, setIsOpenedTypeExportDialog] =
    useState<boolean>(false);

  const [isOpenedExitModeCleanFormDialog, setIsOpenedExitModeCleanFormDialog] =
    useState<boolean>(false);

  const [isOpenedFunctionToFillDialog, setIsOpenedFunctionToFillDialog] =
    useState<boolean>(false);

  const [
    isReservedVariablesSnackBarActive,
    setIsReservedVariablesSnackBarActive,
  ] = useState<boolean>(false);

  const [
    isOpenedCheckFormsBeforeExportingConfigSnackBarActive,
    setIsOpenedCheckFormsBeforeExportingConfigSnackBarActive,
  ] = useState<boolean>(false);

  const [
    isNoVarNumbersFunctionSnackBarActive,
    setIsNoVarNumbersFunctionSnackBarActive,
  ] = useState<boolean>(false);

  const [
    isNoQuotationMarksFunctionSnackBarActive,
    setIsNoQuotationMarksFunctionSnackBarActive,
  ] = useState<boolean>(false);

  const [isNoSpacingSnackBarActive, setIsNoSpacingSnackBarActive] =
    useState<boolean>(false);

  const [
    isFormWaitingToBeValidToProceedCalculation,
    setFormWaitingToBeValidToProceedCalculation,
  ] = useState<boolean>(false);

  const [reDrawGraph, setReDrawGraph] = useState<boolean>(false);

  const [adjustingGraphHeight, setAdjustingGraphHeight] =
    useState<boolean>(false);

  const [showTraceBetweenDotsGraph, setShowTraceBetweenDotsGraph] =
    useState<boolean>(true);

  const [
    functionToCalculateListRecentlyModified,
    setFunctionToCalculateListRecentlyModified,
  ] = useState<boolean>(false);

  const [
    { exportableFormConfigModal, exportableFormResultsModal },
    setExportableForms,
  ] = useState<{
    exportableFormConfigModal: ExportableImportableFormModel;
    exportableFormResultsModal: ExportableImportableFormModel;
  }>({
    exportableFormConfigModal: undefined,
    exportableFormResultsModal: undefined,
  });

  const {
    mathSeriesResultValuesList,
    mathSeriesFormList,
    calculateSeriesAddOrResetForms,
    addDisabledMathSeriesFormEarseValues,
    deleteMathSeriesForm,
    processedMathSeriesCalculationPetition,
    deleteAllCalculatedForms,
  } = useCalculateMathSeries();

  const functions = useFunctionsToApply();

  const [functionToCalculateList, setFunctionToCalculateList] = useState<
    string[]
  >([""]);

  const [calculateMathSeriesListBuffer, setCalculateMathSeriesListBuffer] =
    useState<MathSeriesFormModel[]>(undefined);

  const [mathSeriesFormListImported, setMathSeriesFormListImported] =
    useState<MathSeriesFormModel[]>(undefined);

  const { fileName, fileObject, handleFileInputChange } = useLoadDataFile();

  const {
    mathFunctionsResultValues,
    mathFunctionForm,
    convertMathFunctionForm,
    mathFunctionCalculated,
  } = useCalculateMathFunction();

  const [
    mathFunctionsResultValuesCopyCanAlter,
    setMathFunctionsResultValuesCopyCanAlter,
  ] = useState<number[][]>([]);

  const [mathFunctionFormCopyCanAlter, setMathFunctionFormCopyCanAlter] =
    useState<MathFunctionFormModel>(undefined);

  const [mathSeriesShownFormCounter, setMathSeriesShownFormCounter] =
    useState(0);

  const [
    mathSeriesFormListWhenCalculatedFunction,
    setMathSeriesFormListWhenCalculatedFunction,
  ] = useState<MathSeriesFormModel[]>([]);

  const [varListIdentifiers, setVarListIdentifiers] = useState<
    Record<string, string>
  >(getDefaultVarListIdentifiers());

  const [varListValues, setVarListValues] = useState<Record<string, string[]>>(
    getDefaultVarListValues(),
  );

  const [parameterList, setParameterList] = useState<Record<string, string>>(
    {},
  );

  const [
    isArithmeticProgressionListChecked,
    setArithmeticProgressionListChecked,
  ] = useState<boolean[]>([false]);

  const [functionExpressionSelected, setFunctionExpressionSelected] =
    useState<string>(undefined);

  const [precissionFloatingPoint, setPrecissionFloatingPoint] =
    useState<number>(4);

  const [rowNameTableToBeModified, setRowNameTableToBeModified] =
    useState<string>(undefined);

  const fromIndexTableModify = useRef<HTMLInputElement | null>(null);

  const toIndexTableModify = useRef<HTMLInputElement | null>(null);

  const valueTableModify = useRef<HTMLInputElement | null>(null);

  const {
    register,
    setError,
    formState: { errors, touchedFields },
    clearErrors,
    reset,
  } = useForm();

  const tableForm = useForm();

  const mathFunctionFormCopyCanAlterMemoEnvolved = useMemo(() => {
    return mathFunctionFormCopyCanAlter;
  }, [mathFunctionFormCopyCanAlter]);

  const loadFunctionList = useCallback(() => {
    if (
      isFileLoaded &&
      !!fileObject?.mathFunctionForm.functions &&
      fileObject?.mathFunctionForm.functions.length > 0
    ) {
      const functionsToLoad = functions.slice();

      fileObject.mathFunctionForm.functions.forEach((functionExpression) => {
        if (
          !functionsToLoad.includes(
            `${Constants.FUNCTION}${Constants.Equals}${functionExpression}`,
          )
        ) {
          functionsToLoad.unshift(
            `${Constants.FUNCTION}${Constants.Equals}${functionExpression}`,
          );
        }
      });

      return functionsToLoad;
    } else {
      return functions;
    }
  }, [isFileLoaded, fileObject, functions]);

  useEffect(() => {
    if (!!fileObject) {
      if (fileObject?.valid) {
        setIsFileLoaded(true);

        if (!!fileObject.mathFunctionForm) {
          setMathFunctionFormCopyCanAlter({ ...fileObject.mathFunctionForm });
        }

        if (
          !!fileObject.mathFunctionForm?.varList &&
          Object.entries(fileObject.mathFunctionForm?.varList).length > 0
        ) {
          const tmpVarListIdentifiers: Record<string, string> = {};
          const tmpVarListValues: Record<string, string[]> = {};

          Object.entries(fileObject.mathFunctionForm?.varList).forEach(
            ([varName, varValues], index) => {
              tmpVarListIdentifiers[`${Constants.VAR}${index}`] = varName;
              tmpVarListValues[varName] = varValues;
            },
          );

          setVarListIdentifiers({ ...tmpVarListIdentifiers });
          setAreVarIdentifiersRecentlyModified(
            !areVarIdentifiersRecentlyModified,
          );
          setVarListValues({ ...tmpVarListValues });
        }

        if (
          !!fileObject?.mathFunctionForm.functions &&
          fileObject?.mathFunctionForm.functions.length > 0
        ) {
          setFunctionToCalculateList(fileObject?.mathFunctionForm.functions);
          setFunctionToCalculateListRecentlyModified(
            !functionToCalculateListRecentlyModified,
          );
        }

        if (
          !!fileObject?.mathFunctionForm.paramList &&
          Object.entries(fileObject?.mathFunctionForm.paramList).length > 0
        ) {
          const tmpParameterList: Record<string, string> = { ...parameterList };

          Object.entries(fileObject.mathFunctionForm?.paramList).forEach(
            ([paramName, paramValue]) => {
              tmpParameterList[paramName] = paramValue;
            },
          );

          setParameterList(tmpParameterList);
          setParameterListRecentlyModified(!parameterListRecentlyModified);
        }

        if (!!fileObject?.mathSeriesFormList) {
          const tmpArithmeticProgressionListChecked: boolean[] = [];
          fileObject?.mathSeriesFormList.forEach((mathSeriesForm) => {
            tmpArithmeticProgressionListChecked.push(
              mathSeriesForm.isArithmeticProgression,
            );
          });

          setArithmeticProgressionListChecked(
            tmpArithmeticProgressionListChecked.slice(),
          );
          setMathSeriesFormListImported(fileObject.mathSeriesFormList.slice());
          setCalculateMathSeriesListBuffer(
            fileObject.mathSeriesFormList.slice(),
          );
          setMathSeriesFormListWhenCalculatedFunction(
            fileObject.mathSeriesFormList.slice(),
          );
          setMathSeriesShownFormCounter(fileObject.mathSeriesFormList.length);
          setAreMathSeriesRecentlyImported(!areMathSeriesRecentlyImported);
          setIsVisibleSumationForm(true);
        } else {
          setIsVisibleManualInputForm(true);
        }

        if (
          !!fileObject.functionsResults &&
          fileObject.functionsResults.length > 0
        ) {
          setMathFunctionsResultValuesCopyCanAlter(
            fileObject.functionsResults.map((functionResultList) =>
              functionResultList.map((item) => parseFloat(item)),
            ),
          );
          setReDrawGraph(!reDrawGraph);
        }
      } else {
        resetSharedFormValues();
      }
    }
  }, [fileObject]);

  useEffect((): void => {
    if (
      !calculateMathSeriesListBuffer ||
      (!!calculateMathSeriesListBuffer &&
        calculateMathSeriesListBuffer.length === 0)
    ) {
      calculateVarListValuesByMathSeries();
    } else {
      const tmpCalculateMathSeriesListBuffer =
        calculateMathSeriesListBuffer.slice();
      tmpCalculateMathSeriesListBuffer.shift();
      setCalculateMathSeriesListBuffer(tmpCalculateMathSeriesListBuffer);
    }
  }, [processedMathSeriesCalculationPetition]);

  useEffect((): void => {
    if (
      !!calculateMathSeriesListBuffer &&
      calculateMathSeriesListBuffer.length > 0
    ) {
      handleMathSeriesFormChange(calculateMathSeriesListBuffer[0]);
    }
  }, [calculateMathSeriesListBuffer]);

  useEffect((): void => {
    handleRefreshParameters();
  }, [functionExpressionSelected]);

  useEffect((): void => {
    setMathSeriesFormListImported(undefined);
  }, [areMathSeriesRecentlyImported]);

  useEffect((): void => {
    setMathFunctionsResultValuesCopyCanAlter(mathFunctionsResultValues);
    setMathFunctionFormCopyCanAlter({ ...mathFunctionForm });
    setReDrawGraph(!reDrawGraph);
  }, [mathFunctionCalculated]);

  useEffect((): void => {
    if (isReadyToExportData) {
      const exportableFormResults: ExportableImportableFormModel = {
        functionsResults: [],
        mathFunctionForm: {
          functions: [""],
          varList: {},
          paramList: {},
        },
        mathSeriesFormList: undefined,
      };

      const exportableFormConfiguration: ExportableImportableFormModel = {
        functionsResults: [],
        mathFunctionForm: {
          functions: [""],
          varList: {},
          paramList: {},
        },
        mathSeriesFormList: undefined,
      };

      if (
        !!mathFunctionsResultValuesCopyCanAlter &&
        mathFunctionsResultValuesCopyCanAlter.length > 0
      ) {
        exportableFormResults.functionsResults =
          mathFunctionsResultValuesCopyCanAlter.map((functionResultValues) =>
            functionResultValues.map((value) => `${value}`),
          );
        exportableFormResults.mathFunctionForm = {
          ...mathFunctionFormCopyCanAlterMemoEnvolved,
        };

        if (
          !!mathSeriesFormListWhenCalculatedFunction &&
          mathSeriesFormListWhenCalculatedFunction.length > 0
        ) {
          exportableFormResults.mathSeriesFormList = {
            ...mathSeriesFormListWhenCalculatedFunction,
          };
        } else {
          exportableFormResults.mathSeriesFormList = { ...mathSeriesFormList };
        }
      }

      if (isVisibleManualInputForm || isVisibleSumationForm) {
        const tmpMathFunctionForm: MathFunctionFormModel = {
          functions: functionToCalculateList,
          varList: { ...varListValues },
          paramList: { ...parameterList },
        };

        exportableFormConfiguration.functionsResults =
          !!mathFunctionsResultValues && mathFunctionsResultValues.length > 0
            ? mathFunctionsResultValues.map((functionResultValues) =>
                functionResultValues.map((value) => `${value}`),
              )
            : mathFunctionsResultValuesCopyCanAlter.map(
                (functionResultValues) =>
                  functionResultValues.map((value) => `${value}`),
              );
        exportableFormConfiguration.mathFunctionForm = tmpMathFunctionForm;

        if (isVisibleSumationForm) {
          exportableFormConfiguration.mathSeriesFormList = {
            ...mathSeriesFormList,
          };
        }

        if (
          !!mathFunctionsResultValuesCopyCanAlter &&
          mathFunctionsResultValuesCopyCanAlter.length > 0
        ) {
          const areEqualsExportableForms: boolean =
            areEqual2ExportableImportableForm(
              exportableFormConfiguration,
              exportableFormResults,
            );

          if (areEqualsExportableForms) {
            exportFormsToTxtFile(exportableFormResults);
            setFormWaitingToBeValidToProceedCalculation(false);
          } else {
            setIsOpenedTypeExportDialog(true);
            setExportableForms({
              exportableFormConfigModal: exportableFormConfiguration,
              exportableFormResultsModal: exportableFormResults,
            });
          }
        } else {
          if (areFormsValid()) {
            exportFormsToTxtFile(exportableFormConfiguration);
          } else {
            setFormWaitingToBeValidToProceedCalculation(true);
            setIsOpenedCheckFormsBeforeExportingConfigSnackBarActive(true);
          }
        }
      } else {
        if (
          !!mathFunctionsResultValuesCopyCanAlter &&
          mathFunctionsResultValuesCopyCanAlter.length > 0
        ) {
          exportFormsToTxtFile(exportableFormResults);
        }
      }

      setIsReadyToExportData(false);
    }
  }, [isReadyToExportData]);

  useEffect(() => {
    checkIfAnyValueIsComplexInFunctions();
  }, [varListValues]);

  useEffect((): void => {
    functionToCalculateList.forEach((functionExpression, index) => {
      clearErrors(`Function${index}`);
    });
    updateFunctionsValidity();
  }, [functionToCalculateListRecentlyModified]);

  useEffect((): void => {
    if (isReadyToProcessFunctions) {
      if (areFormsValid()) {
        const mathFunctionFormToSend: MathFunctionFormModel = {
          functions: functionToCalculateList,
          varList: { ...varListValues },
          paramList: { ...parameterList },
        };

        convertMathFunctionForm(mathFunctionFormToSend);

        if (isVisibleSumationForm) {
          setMathSeriesFormListWhenCalculatedFunction(
            mathSeriesFormList.slice(),
          );
        } else {
          setMathSeriesFormListWhenCalculatedFunction([]);
        }

        setFormWaitingToBeValidToProceedCalculation(false);
      } else {
        setFormWaitingToBeValidToProceedCalculation(true);
      }
      setIsReadyToProcessFunctions(false);
    }
  }, [isReadyToProcessFunctions]);

  useEffect((): void => {
    if (
      Object.entries(varListIdentifiers).length > 0 &&
      isVisibleSumationForm
    ) {
      if (
        !!mathSeriesResultValuesList &&
        mathSeriesResultValuesList.length > 0 &&
        !Object.entries(varListIdentifiers).find(
          ([varSumationName, varName]) => varName === "",
        )
      ) {
        calculateVarListValuesByMathSeries();
      }
      updateVariablesValidity();
    }
    handleRefreshParameters();
  }, [areVarIdentifiersRecentlyModified]);

  function handleSumationFormButton(): void {
    if (isVisibleSumationForm) {
      setIsOpenedExitModeCleanFormDialog(true);
    } else {
      clearErrors();
      setIsVisibleSumationForm(true);
      setMathSeriesShownFormCounter(1);
    }
  }

  function handleManualFormButton(): void {
    if (isVisibleManualInputForm) {
      setIsOpenedExitModeCleanFormDialog(true);
    } else {
      clearErrors();
      setIsVisibleManualInputForm(true);
    }
  }

  function changeVisibilityFileInputForm(): void {
    if (isVisibleSumationForm || isVisibleManualInputForm) {
      setIsOpenedExitModeCleanFormDialog(true);
    }
  }

  function changeMathSeriesFormat(booleanIndex: number): void {
    setArithmeticProgressionListChecked(
      isArithmeticProgressionListChecked.map(
        (isArithmeticProgressionCheckedBoolean: boolean, index): boolean => {
          if (booleanIndex === index) {
            return !isArithmeticProgressionCheckedBoolean;
          } else {
            return isArithmeticProgressionCheckedBoolean;
          }
        },
      ),
    );
    calculateSeriesAddOrResetForms(undefined);
  }

  function handleSelectedFunctionDropDown(mathFunction: string): void {
    setFunctionExpressionSelected(mathFunction);

    if (!!functionToCalculateList && functionToCalculateList.length > 1) {
      setIsOpenedFunctionToFillDialog(true);
    } else {
      const tmpFunctionToCalculateList = functionToCalculateList.slice();
      tmpFunctionToCalculateList[0] =
        removeDeclarationFromFunction(mathFunction);
      setFunctionToCalculateList(tmpFunctionToCalculateList);
      setFunctionToCalculateListRecentlyModified(
        !functionToCalculateListRecentlyModified,
      );
    }
  }

  function handleFunctionToFillDialog(functionNumberToFill: number): void {
    if (!!functionNumberToFill || functionNumberToFill === 0) {
      const tmpFunctionToCalculateList = functionToCalculateList.slice();
      tmpFunctionToCalculateList[functionNumberToFill] =
        removeDeclarationFromFunction(functionExpressionSelected);
      setFunctionToCalculateList(tmpFunctionToCalculateList);
      setFunctionToCalculateListRecentlyModified(
        !functionToCalculateListRecentlyModified,
      );
    }
    setIsOpenedFunctionToFillDialog(false);
  }

  function updateVariablesValidity(): void {
    Object.entries(varListIdentifiers).forEach(
      ([varIdentifier, varName], index) => {
        setErrorsVarIdentifierInputValue(varName, index);
      },
    );

    Object.entries(varListValues).forEach(([varName, varValues], index) => {
      varValues.forEach((varValue) =>
        setErrorsVarValuesInputValue(varValue, index),
      );
    });
  }

  function updateFunctionsValidity(): void {
    functionToCalculateList.forEach((functionExpression, index) => {
      if (!functionExpression.replace(/\s/g, "")) {
        setError(`Function${index}`, {
          type: "required",
          message: `${Constants.Required}`,
        });
      }

      try {
        const tmpCompileFunctionObject: {
          [key: string]: number;
        } = {};

        const mathFunction = functionExpression.replace(/\s+/g, "");

        Object.entries(varListValues).forEach(([varName, varValues]) => {
          tmpCompileFunctionObject[varName] = 1;
        });

        Object.entries(
          getFunctionParameters(
            functionToCalculateList.slice(),
            !!varListIdentifiers
              ? Object.entries(varListIdentifiers).map(
                  ([parameterName, value]): string => {
                    return value;
                  },
                )
              : null,
            !!parameterList && Object.entries(parameterList).length > 0
              ? Object.entries(parameterList).map(([key, value]) => key)
              : [],
            parameterList,
            Constants.GeneralFunctionReservedWords,
          ),
        ).forEach(([paramName, paramValue]) => {
          tmpCompileFunctionObject[paramName] = 1;
        });

        const mathFunctionCompiled = math.compile(mathFunction);
        const tmpTestFunctionResult = mathFunctionCompiled.evaluate(
          tmpCompileFunctionObject,
        );

        if (math.isMatrix(tmpTestFunctionResult)) {
          setError(`Function${index}`, {
            type: "badExpression",
            message: `${Constants.MatrixCantBeRepresented}`,
          });
        } else if (math.isComplex(tmpTestFunctionResult)) {
          setError(`Function${index}`, {
            type: "badExpression",
            message: `${Constants.ComplexNumbersCantBeRepresented}`,
          });
        }
      } catch (error) {
        setError(`Function${index}`, {
          type: "badExpression",
          message: `${Constants.FormulaErrorExpression}`,
        });
      }
    });
  }

  function checkIfAnyValueIsComplexInFunctions(): void {
    const tmpCompileFunctionObject: {
      [key: string]: number;
    } = {};

    Object.entries(
      getFunctionParameters(
        functionToCalculateList.slice(),
        !!varListIdentifiers
          ? Object.entries(varListIdentifiers).map(
              ([parameterName, value]): string => {
                return value;
              },
            )
          : null,
        !!parameterList && Object.entries(parameterList).length > 0
          ? Object.entries(parameterList).map(([key, value]) => key)
          : [],
        parameterList,
        Constants.GeneralFunctionReservedWords,
      ),
    ).forEach(([paramName, paramValue]) => {
      tmpCompileFunctionObject[paramName] = !!parseFloat(paramValue)
        ? parseFloat(paramValue)
        : 1;
    });

    functionToCalculateList.forEach((functionExpression, index) => {
      let foundError = false;
      Object.entries(varListValues).forEach(([varName, varValues]) => {
        varValues.forEach((value) => {
          tmpCompileFunctionObject[varName] = !!parseFloat(value)
            ? parseFloat(value)
            : 1;

          const mathFunctionCompiled = math.compile(functionExpression);
          const tmpTestFunctionResult = mathFunctionCompiled.evaluate(
            tmpCompileFunctionObject,
          );

          if (math.isComplex(tmpTestFunctionResult)) {
            foundError = true;
            setError(`Function${index}`, {
              type: "badExpression",
              message: `${Constants.ComplexNumbersCantBeRepresented}`,
            });
          }
        });
      });

      if (!foundError) {
        clearErrors(`Function${index}`);
      }
    });

    updateFunctionsValidity();
  }

  function handleRefreshParameters(): void {
    const tmpNewCalculatedParameters = getFunctionParameters(
      functionToCalculateList,
      !!varListIdentifiers
        ? Object.entries(varListIdentifiers).map(
            ([parameterName, value]): string => {
              return value;
            },
          )
        : null,
      !!parameterList && Object.entries(parameterList).length > 0
        ? Object.entries(parameterList).map(([key, value]) => key)
        : [],
      parameterList,
      Constants.GeneralFunctionReservedWords,
    );

    if (!!parameterList && Object.entries(parameterList).length > 0) {
      const tmpOldParamNames = Object.entries(parameterList).map(
        ([key, value]) => key,
      );
      const tmpNewParamNames = Object.entries(tmpNewCalculatedParameters).map(
        ([key, value]) => key,
      );

      tmpOldParamNames.forEach((paramName) => {
        if (!tmpNewParamNames.includes(paramName)) {
          clearErrors(`Param${paramName}`);
        }
      });
    }

    setParameterList(tmpNewCalculatedParameters);
    setParameterListRecentlyModified(!parameterListRecentlyModified);
  }

  function calculateVarListValuesByMathSeries(): void {
    const tmpVarListValues: Record<string, string[]> = {};

    Object.entries(varListIdentifiers).forEach(
      ([varSumationName, varName], index): void => {
        if (!!varName && varName.length > 0) {
          if (
            !!mathSeriesResultValuesList &&
            !!mathSeriesResultValuesList[parseInt(varSumationName.substring(3))]
          ) {
            tmpVarListValues[varName] = mathSeriesResultValuesList[
              parseInt(varSumationName.substring(3))
            ].map((valueResult: number) => `${valueResult}`);
            clearErrors(`VarValue${index}`);
          } else {
            if (index > mathSeriesShownFormCounter - 1) {
              tmpVarListValues[varName] = varListValues[varName];
              clearErrors(`VarValue${index}`);
            } else {
              tmpVarListValues[varName] = [""];
              setError(`VarValue${index}`, {
                type: "required",
                message: `${Constants.Required}`,
              });
            }
          }
        } else {
          if (
            !!mathSeriesResultValuesList &&
            !!mathSeriesResultValuesList[parseInt(varSumationName.substring(3))]
          ) {
            tmpVarListValues[varSumationName] = mathSeriesResultValuesList[
              parseInt(varSumationName.substring(3))
            ].map((valueResult: number) => `${valueResult}`);
            clearErrors(`VarValue${index}`);
          } else {
            if (index > mathSeriesShownFormCounter - 1) {
              tmpVarListValues[varSumationName] =
                varListValues[varSumationName];
              clearErrors(`VarValue${index}`);
            } else {
              tmpVarListValues[varSumationName] = [""];
              setError(`VarValue${index}`, {
                type: "required",
                message: `${Constants.Required}`,
              });
            }
          }
        }
      },
    );

    if (Object.entries(tmpVarListValues).length > 0) {
      setVarListValues({ ...tmpVarListValues });
    }
  }

  function handleUpdateFunctionValue(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    functionNumber: number,
  ): void {
    const tmpFunctionToCalculateList = functionToCalculateList.slice();
    tmpFunctionToCalculateList[functionNumber] = event.target.value;

    const tmpParameters = getFunctionParameters(
      tmpFunctionToCalculateList,
      [],
      !!parameterList && Object.entries(parameterList).length > 0
        ? Object.entries(parameterList).map(([key, value]) => key)
        : [],
      parameterList,
      Constants.GeneralFunctionReservedWords,
    );

    let presenceOfNumbersInFunctionVariables = false;
    let presenceOfQuotationMarksInFunctionVariables = false;

    Object.entries(tmpParameters).forEach(([paramName, paramValue]) => {
      if (!/^[^\d]*$/.test(paramName)) {
        presenceOfNumbersInFunctionVariables = true;
      }

      if (/['"]/.test(paramName)) {
        presenceOfQuotationMarksInFunctionVariables = true;
      }
    });

    if (
      !presenceOfNumbersInFunctionVariables &&
      !presenceOfQuotationMarksInFunctionVariables
    ) {
      setFunctionToCalculateList(tmpFunctionToCalculateList);
      setFunctionToCalculateListRecentlyModified(
        !functionToCalculateListRecentlyModified,
      );
    } else if (presenceOfNumbersInFunctionVariables) {
      setIsNoVarNumbersFunctionSnackBarActive(true);
    } else {
      setIsNoQuotationMarksFunctionSnackBarActive(true);
    }
  }

  function handleFileInputChangeSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    changeVisibilityFileInputForm();
    handleFileInputChange(event);
  }

  function handleApplyFunction(): void {
    setIsReadyToProcessFunctions(true);
    handleRefreshParameters();
  }

  function handleExportData(): void {
    handleRefreshParameters();
    setIsReadyToExportData(true);
  }

  function areFormsValid(): boolean {
    let checkFormValid = true;

    if (!!varListIdentifiers) {
      Object.entries(varListIdentifiers).forEach(
        ([varIdentifier, varName], index) => {
          touchedFields[`VarDefinition${index}`] = true;
          if (!varName.replace(/\s/g, "")) {
            setError(`VarDefinition${index}`, {
              type: "required",
              message: `${Constants.Required}`,
            });
            checkFormValid = false;
          }
        },
      );
    } else {
      touchedFields[`VarDefinition${0}`] = true;
      setError(`VarDefinition${0}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
      checkFormValid = false;
    }

    let varsWithDifferentLength = false;

    if (!!varListValues) {
      Object.entries(varListValues).forEach(([varName, varValues], index) => {
        touchedFields[`VarValue${index}`] = true;
        if (
          !varValues ||
          varValues?.length === 0 ||
          (!varValues[0].replace(/\s/g, "") && varValues.length === 1)
        ) {
          setError(`VarValue${index}`, {
            type: "required",
            message: `${Constants.Required}`,
          });
          checkFormValid = false;
        }

        Object.entries(varListValues).forEach(
          ([varNameCheckByElement, varValuesCheckByElement], index) => {
            if (varValuesCheckByElement.length !== varValues.length) {
              varsWithDifferentLength = true;
            }
          },
        );
      });

      if (varsWithDifferentLength) {
        checkFormValid = false;
        Object.entries(varListValues).forEach(([varName, varValues], index) => {
          setError(`VarValue${index}`, {
            type: "mustHaveSameLength",
            message: `${Constants.VarsMustHaveSameLength}`,
          });
        });
      }
    } else {
      touchedFields[`VarValue${0}`] = true;
      setError(`VarValue${0}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
      checkFormValid = false;
    }

    if (!!functionToCalculateList) {
      functionToCalculateList.forEach((functionExpression, index) => {
        touchedFields[`Function${index}`] = true;
        if (!functionExpression.replace(/\s/g, "")) {
          setError(`Function${index}`, {
            type: "required",
            message: `${Constants.Required}`,
          });
          checkFormValid = false;
        }
      });
    } else {
      touchedFields[`Function${0}`] = true;
      setError(`Function${0}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
      checkFormValid = false;
    }

    if (!!parameterList) {
      Object.entries(parameterList).forEach(([paramName, paramValue]) => {
        touchedFields[`Param${paramName}`] = true;
        if (!paramValue) {
          setError(`Param${paramName}`, {
            type: "required",
            message: `${Constants.Required}`,
          });
          checkFormValid = false;
        }
      });
    }

    if (isVisibleSumationForm) {
      if (
        !!mathSeriesResultValuesList &&
        checkFormValid &&
        Object.keys(errors).length === 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (checkFormValid && Object.keys(errors).length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  function handleVariableValueInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    variableName: string,
    varIdentifier: string,
    varIdentifierIndex: number,
  ): void {
    setErrorsVarValuesInputValue(event.target.value, varIdentifierIndex);
    touchedFields[`VarValue${varIdentifierIndex}`] = true;

    if (/\s/.test(event.target.value)) {
      setIsNoSpacingSnackBarActive(true);
    } else {
      const tmpVarListValues: Record<string, string[]> = { ...varListValues };

      if (!!variableName && variableName.length > 0) {
        tmpVarListValues[variableName] = event.target.value.split(",");
      } else {
        tmpVarListValues[varIdentifier] = event.target.value.split(",");
      }
      setVarListValues({ ...tmpVarListValues });
    }
  }

  function setErrorsVarValuesInputValue(
    value: string,
    varIdentifierIndex: number,
  ): void {
    const onlyNumbersSeparatedByCommasRegExp =
      /^-?\d+(?:\.\d+)?(?:,-?\d+(?:\.\d+)?)*$/;
    if (!value.replace(/\s/g, "")) {
      setError(`VarValue${varIdentifierIndex}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
    } else if (!onlyNumbersSeparatedByCommasRegExp.test(value)) {
      setError(`VarValue${varIdentifierIndex}`, {
        type: "onlyNumbersSeparatedCommas",
        message: `${Constants.OnlyNumbersSeparatedCommas}`,
      });
    } else {
      clearErrors(`VarValue${varIdentifierIndex}`);
    }
  }

  function checkIfIntroducedVarNameIsNotReserved(
    varNameIntroduced: string,
  ): boolean {
    if (
      !Constants.regexReservedVarNameVARn.test(varNameIntroduced) &&
      !Object.entries(varListIdentifiers).find(
        ([varIdentifier, varName]) => varName === varNameIntroduced,
      )
    ) {
      return true;
    } else {
      setIsReservedVariablesSnackBarActive(true);
      return false;
    }
  }

  function handleFloatingPointPrecisionTableModified(value: string): void {
    if (
      !!value &&
      !isNaN(parseInt(value)) &&
      parseInt(value) !== 0 &&
      parseInt(value) > 0
    ) {
      if (parseInt(value) > 100) {
        tableForm.setError("pointPrecision", {
          type: "maxLengthPrecision",
          message: `${Constants.MaxLengthPrecision}`,
        });
      } else {
        tableForm.clearErrors("pointPrecision");
        setPrecissionFloatingPoint(parseInt(value));
      }
    } else {
      if (!value) {
        tableForm.setError("pointPrecision", {
          type: "required",
          message: `${Constants.Required}`,
        });
      } else {
        tableForm.setError("pointPrecision", {
          type: "onlyNatural",
          message: `${Constants.OnlyNatural}`,
        });
      }
    }
  }

  function handleFromIndexChanged(
    value: string,
    refreshValidity: boolean,
  ): void {
    if (
      !!value &&
      !isNaN(parseInt(value)) &&
      parseInt(value) !== 0 &&
      parseInt(value) > 0
    ) {
      if (parseInt(value) > mathFunctionsResultValuesCopyCanAlter[0].length) {
        tableForm.setError("FromIndex", {
          type: "maxLengthPrecision",
          message: `${Constants.MaxLengthTableIndex}`,
        });
      } else if (parseInt(value) > parseInt(toIndexTableModify.current.value)) {
        tableForm.setError("FromIndex", {
          type: "BiggerThanToIndex",
          message: `${Constants.BiggerThanToIndex}`,
        });
      } else {
        if (!refreshValidity) {
          handleToIndexChanged(toIndexTableModify.current.value, true);
        }
        tableForm.clearErrors("FromIndex");
      }
    } else {
      if (!value) {
        tableForm.setError("FromIndex", {
          type: "required",
          message: `${Constants.Required}`,
        });
      } else {
        tableForm.setError("FromIndex", {
          type: "onlyNatural",
          message: `${Constants.OnlyNatural}`,
        });
      }
    }
  }

  function handleNewValueChanged(
    value: string,
    refreshValidity: boolean,
  ): void {
    if (!value) {
      tableForm.setError("NewValue", {
        type: "required",
        message: `${Constants.Required}`,
      });
    } else if (!/^[-]?\d+(\.\d+)?$/.test(value)) {
      tableForm.setError("NewValue", {
        type: "onlyNumbers",
        message: `${Constants.OnlyNumbers}`,
      });
    } else {
      tableForm.clearErrors("NewValue");
    }
  }

  function handleToIndexChanged(value: string, refreshValidity: boolean): void {
    if (
      !!value &&
      !isNaN(parseInt(value)) &&
      parseInt(value) !== 0 &&
      parseInt(value) > 0
    ) {
      if (parseInt(value) > mathFunctionsResultValuesCopyCanAlter[0].length) {
        tableForm.setError("ToIndex", {
          type: "maxLengthVariables",
          message: `${Constants.MaxLengthTableIndex}`,
        });
      } else if (
        parseInt(fromIndexTableModify.current.value) > parseInt(value)
      ) {
        tableForm.setError("ToIndex", {
          type: "BiggerThanToIndex",
          message: `${Constants.LessThanFromIndex}`,
        });
      } else {
        if (!refreshValidity) {
          handleFromIndexChanged(fromIndexTableModify.current.value, true);
        }
        tableForm.clearErrors("ToIndex");
      }
    } else {
      if (!value) {
        tableForm.setError("ToIndex", {
          type: "required",
          message: `${Constants.Required}`,
        });
      } else {
        tableForm.setError("ToIndex", {
          type: "onlyNatural",
          message: `${Constants.OnlyNatural}`,
        });
      }
    }
  }

  function handleVariableInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    variableIdentifier: string,
    varIdentifierIndex: number,
  ): void {
    const inputValue = event.target.value.replace(/\s/g, "");
    setErrorsVarIdentifierInputValue(inputValue, varIdentifierIndex);
    touchedFields[`VarDefinition${varIdentifierIndex}`] = false;

    if (/\s/.test(event.target.value)) {
      setIsNoSpacingSnackBarActive(true);
    } else {
      if (
        !!inputValue && inputValue.length > 0
          ? checkIfIntroducedVarNameIsNotReserved(inputValue)
          : true
      ) {
        const tmpVarListIdentifiers: Record<string, string> = {
          ...varListIdentifiers,
        };
        const tmpVarListValues: Record<string, string[]> = {};

        Object.entries(varListValues).forEach(([varName, varValues]) => {
          if (
            varName === tmpVarListIdentifiers[variableIdentifier] ||
            varName === variableIdentifier
          ) {
            if (
              !!inputValue &&
              inputValue.length > 0 &&
              !Constants.regexReservedVarNameVARn.test(inputValue)
            ) {
              tmpVarListValues[inputValue] = varValues;
            } else {
              tmpVarListValues[variableIdentifier] = varValues;
            }
          } else {
            tmpVarListValues[varName] = varValues;
          }
        });

        if (
          !!inputValue &&
          inputValue.length > 0 &&
          !Object.entries(tmpVarListValues).find(
            ([varName, varValues]) => varName === inputValue,
          )
        ) {
          if (
            !!inputValue &&
            inputValue.length > 0 &&
            !Constants.regexReservedVarNameVARn.test(inputValue)
          ) {
            tmpVarListValues[inputValue] = [""];
          } else {
            tmpVarListValues[variableIdentifier] = [""];
          }
        }

        tmpVarListIdentifiers[variableIdentifier] = inputValue;

        setVarListIdentifiers(tmpVarListIdentifiers);

        if (!(Object.entries(tmpVarListValues).length > 0)) {
          setVarListValues({ ...getDefaultVarListValues() });
        } else {
          setVarListValues({ ...tmpVarListValues });
        }

        setAreVarIdentifiersRecentlyModified(
          !areVarIdentifiersRecentlyModified,
        );
      }
    }
  }

  function setErrorsVarIdentifierInputValue(
    value: string,
    varIdentifierIndex: number,
  ): void {
    if (!value.replace(/\s/g, "")) {
      setError(`VarDefinition${varIdentifierIndex}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
    } else if (!/^[^0-9]*$/.test(value)) {
      setError(`VarDefinition${varIdentifierIndex}`, {
        type: "noNumbers",
        message: `${Constants.NoNumbers}`,
      });
    } else {
      clearErrors(`VarDefinition${varIdentifierIndex}`);
    }
  }

  function setErrorsParameterIdentifierInputValue(
    value: string,
    paramName: string,
  ): void {
    if (!value.replace(/\s/g, "")) {
      setError(`Param${paramName}`, {
        type: "required",
        message: `${Constants.Required}`,
      });
    } else if (!/^[-]?\d+(\.\d+)?$/.test(value)) {
      setError(`Param${paramName}`, {
        type: "onlyNumbers",
        message: `${Constants.OnlyNumbers}`,
      });
    } else {
      clearErrors(`Param${paramName}`);
    }
  }

  function handleParameterInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    parameterName: string,
  ): void {
    const inputValue = event.target.value.replace(/\s/g, "");
    setErrorsParameterIdentifierInputValue(inputValue, parameterName);
    touchedFields[`Param${parameterName}`] = true;

    if (/\s/.test(event.target.value)) {
      setIsNoSpacingSnackBarActive(true);
    } else {
      const tmpParameterList: Record<string, string> = { ...parameterList };
      tmpParameterList[parameterName] = inputValue;
      setParameterList(tmpParameterList);
      setParameterListRecentlyModified(!parameterListRecentlyModified);
    }
  }

  function handleMathSeriesFormChange(
    mathSeriesForm: MathSeriesFormModel,
  ): void {
    if (!!mathSeriesForm && mathSeriesForm?.valid) {
      calculateSeriesAddOrResetForms(mathSeriesForm);
    } else {
      if (!!mathSeriesForm && !mathSeriesForm?.valid) {
        addDisabledMathSeriesFormEarseValues(mathSeriesForm);
      }
    }
  }

  function resetSharedFormValues(): void {
    setVarListIdentifiers(getDefaultVarListIdentifiers());
    setAreVarIdentifiersRecentlyModified(false);
    setVarListValues({ ...getDefaultVarListValues() });
    setParameterList({});
    clearErrors();
    setParameterListRecentlyModified(!parameterListRecentlyModified);
    setFunctionToCalculateList([""]);
    setFunctionToCalculateListRecentlyModified(false);
    setArithmeticProgressionListChecked([false]);
    calculateSeriesAddOrResetForms(undefined);
    setFormWaitingToBeValidToProceedCalculation(false);
    setIsFileLoaded(false);
    reset({ touched: {} });
    handleFileInputChange(undefined);
    setMathSeriesFormListImported(undefined);
    deleteAllCalculatedForms();
    setReDrawGraph(!reDrawGraph);
  }

  function handleAddVariableIdentifier(varIdentifierIndex: number): void {
    const tmpVarListIdentifiers = { ...varListIdentifiers };
    tmpVarListIdentifiers[`${Constants.VAR}${varIdentifierIndex + 1}`] = "";
    setVarListIdentifiers(tmpVarListIdentifiers);

    const tmpVarListValues: Record<string, string[]> = { ...varListValues };
    tmpVarListValues[`${Constants.VAR}${varIdentifierIndex + 1}`] = [""];
    setVarListValues({ ...tmpVarListValues });

    handleRefreshParameters();
    setAreVarIdentifiersRecentlyModified(!areVarIdentifiersRecentlyModified);
  }

  function handleDeleteVariableIdentifier(varIdentifierIndex: number): void {
    let varIdentifierFound = false;
    let varNameAssociatedFound = "";
    let varNameIndexFound = 0;

    const tmpVarListIdentifiers: Record<string, string> = {};

    Object.entries(varListIdentifiers).forEach(
      ([varIdentifier, varName], index) => {
        if (index === varIdentifierIndex) {
          varIdentifierFound = true;
          varNameAssociatedFound =
            !!varName && varName.length > 0
              ? varName
              : `${Constants.VAR}${index}`;
          varNameIndexFound = index;
        } else {
          if (!varIdentifierFound) {
            tmpVarListIdentifiers[varIdentifier] = varName;
          } else {
            tmpVarListIdentifiers[`${Constants.VAR}${index - 1}`] = varName;
          }
        }
      },
    );

    if (!!varNameAssociatedFound && varNameAssociatedFound.length > 0) {
      const tmpVarListValues: Record<string, string[]> = {};

      Object.entries(varListValues).forEach(([varName, varValue], index) => {
        if (varName !== varNameAssociatedFound) {
          if (
            Constants.regexReservedVarNameVARn.test(varName) &&
            parseInt(varName.substring(3)) > varNameIndexFound
          ) {
            tmpVarListValues[
              `${Constants.VAR}${parseInt(varName.substring(3)) - 1}`
            ] = varValue;
          } else {
            tmpVarListValues[varName] = varValue;
          }
        }
      });

      if (!(Object.entries(tmpVarListValues).length > 0)) {
        setVarListValues({ ...getDefaultVarListValues() });
      } else {
        setVarListValues({ ...tmpVarListValues });
      }
    }

    if (!(Object.entries(tmpVarListIdentifiers).length > 0)) {
      setVarListIdentifiers(getDefaultVarListIdentifiers());
    } else {
      setVarListIdentifiers(tmpVarListIdentifiers);
    }

    handleRefreshParameters();
    clearErrors(`VarValue${Object.entries(tmpVarListIdentifiers).length}`);
    clearErrors(`VarDefinition${Object.entries(tmpVarListIdentifiers).length}`);
    touchedFields[`VarValue${Object.entries(tmpVarListIdentifiers).length}`] =
      false;
    touchedFields[
      `VarDefinition${Object.entries(tmpVarListIdentifiers).length}`
    ] = false;
    setAreVarIdentifiersRecentlyModified(!areVarIdentifiersRecentlyModified);
  }

  function addSuccessionForm(): void {
    const tmpArithmeticProgressionListChecked =
      isArithmeticProgressionListChecked;
    tmpArithmeticProgressionListChecked.push(false);
    setArithmeticProgressionListChecked(tmpArithmeticProgressionListChecked);
    setMathSeriesShownFormCounter(mathSeriesShownFormCounter + 1);
  }

  function deleteSuccessionForm(successionIdentifier: string): void {
    const tmpArithmeticProgressionListChecked =
      isArithmeticProgressionListChecked;
    tmpArithmeticProgressionListChecked.splice(
      parseInt(successionIdentifier.substring(3)),
      1,
    );

    mathSeriesFormList.forEach((matSeriesForm) => {
      if (
        parseInt(matSeriesForm.seriesVarName.substring(3)) >
        parseInt(successionIdentifier.substring(3))
      ) {
        const tmpMatListMakeLoadForms: MathSeriesFormModel[] = [];
        const tmpMatSeriesForm = { ...matSeriesForm };
        tmpMatSeriesForm.seriesVarName = `${Constants.VAR}${parseInt(matSeriesForm.seriesVarName.substring(3)) - 1}`;
        tmpMatListMakeLoadForms[
          parseInt(matSeriesForm.seriesVarName.substring(3)) - 1
        ] = tmpMatSeriesForm;
        setMathSeriesFormListImported(tmpMatListMakeLoadForms);
        setAreMathSeriesRecentlyImported(!areMathSeriesRecentlyImported);
      }
    });

    setArithmeticProgressionListChecked(tmpArithmeticProgressionListChecked);
    deleteMathSeriesForm(successionIdentifier);
    setMathSeriesShownFormCounter(mathSeriesShownFormCounter - 1);
    const tmpVarListValues: Record<string, string[]> = {};

    Object.entries(varListValues).forEach(([varName, varValues], index) => {
      if (index < mathSeriesShownFormCounter - 1) {
        tmpVarListValues[varName] = varValues;
      } else {
        tmpVarListValues[varName] = [""];
      }
    });

    setVarListValues({ ...tmpVarListValues });
  }

  function handleExportDialog(exportTypeSelected: ExportWhich): void {
    if (exportTypeSelected === ExportWhich.TakeResultsForm) {
      exportFormsToTxtFile(exportableFormResultsModal);
      setFormWaitingToBeValidToProceedCalculation(false);
    }

    if (exportTypeSelected === ExportWhich.TakeConfigForm) {
      if (areFormsValid()) {
        exportFormsToTxtFile(exportableFormConfigModal);
        setFormWaitingToBeValidToProceedCalculation(false);
      } else {
        setFormWaitingToBeValidToProceedCalculation(true);
        setIsOpenedCheckFormsBeforeExportingConfigSnackBarActive(true);
      }
    }

    setIsOpenedTypeExportDialog(false);
  }

  function handleExitModeCleanForm(
    userSelection: UserGenericModalSelection,
  ): void {
    if (userSelection === UserGenericModalSelection.Accept) {
      if (isVisibleSumationForm) {
        setIsVisibleSumationForm(false);
        setMathSeriesShownFormCounter(0);
      }

      if (isVisibleManualInputForm) {
        setIsVisibleManualInputForm(false);
      }
      resetSharedFormValues();
    }
    setIsOpenedExitModeCleanFormDialog(false);
  }

  function handleRefreshParametersClickedButton(
    functionIndexWhereClicked: number,
  ): void {
    if (!errors[`Function${functionIndexWhereClicked}`]?.message) {
      handleRefreshParameters();
    }
  }

  function reservedVariablesSnackBarClosed(): void {
    setIsReservedVariablesSnackBarActive(false);
  }

  function noVarNumbersFunctionSnackBarClosed(): void {
    setIsNoVarNumbersFunctionSnackBarActive(false);
  }

  function noQuotationMarkFunctionSnackBarClosed(): void {
    setIsNoQuotationMarksFunctionSnackBarActive(false);
  }

  function noSpacingSnackBarClosed(): void {
    setIsNoSpacingSnackBarActive(false);
  }

  function checkFormsBeforeExportingConfigSnackBarClosed(): void {
    setIsOpenedCheckFormsBeforeExportingConfigSnackBarActive(false);
  }

  function handleAddFunction(): void {
    const tmpFunctionToCalculateList = functionToCalculateList.slice();
    tmpFunctionToCalculateList.push("");
    setFunctionToCalculateList(tmpFunctionToCalculateList);
    setFunctionToCalculateListRecentlyModified(
      !functionToCalculateListRecentlyModified,
    );
  }

  function handleDeleteFunction(functionIndex: number): void {
    const tmpFunctionToCalculateList = functionToCalculateList.slice();
    tmpFunctionToCalculateList.splice(functionIndex, 1);
    setFunctionToCalculateList(tmpFunctionToCalculateList);
    setFunctionToCalculateListRecentlyModified(
      !functionToCalculateListRecentlyModified,
    );
    clearErrors(`Function${tmpFunctionToCalculateList.length}`);
    touchedFields[`Function${tmpFunctionToCalculateList.length}`] = false;
  }

  function handleRowTableToModify(rowNameSelected: string): void {
    tableForm.clearErrors("ModifyTableButton");
    setRowNameTableToBeModified(rowNameSelected);
  }

  function handleModifyTable(): void {
    tableForm.clearErrors("pointPrecision");
    handleToIndexChanged(toIndexTableModify.current.value, true);
    handleFromIndexChanged(fromIndexTableModify.current.value, true);
    handleNewValueChanged(valueTableModify.current.value, true);

    if (!!rowNameTableToBeModified) {
      if (Object.keys(tableForm.formState.errors).length === 0) {
        const functionIdentifierRegex = new RegExp(
          `^${Constants.FUNCTION}\\d+$`,
        );

        if (functionIdentifierRegex.test(rowNameTableToBeModified)) {
          const resultsIndexToAlter = parseInt(
            rowNameTableToBeModified.substring(8),
          );
          const tmpMathFunctionsResultValuesCopyCanAlter =
            mathFunctionsResultValuesCopyCanAlter
              .slice()
              .map((values, index) => {
                if (index === resultsIndexToAlter) {
                  const modifiedValues = values.map((value, index) => {
                    if (
                      index >=
                        parseInt(fromIndexTableModify.current.value) - 1 &&
                      index <= parseInt(toIndexTableModify.current.value) - 1
                    ) {
                      return parseFloat(valueTableModify.current.value);
                    } else {
                      return value;
                    }
                  });
                  return modifiedValues;
                } else {
                  return values;
                }
              });
          setMathFunctionsResultValuesCopyCanAlter(
            tmpMathFunctionsResultValuesCopyCanAlter,
          );
          setReDrawGraph(!reDrawGraph);
        } else {
          const tmpMathFunctionFormCopyCanAlter = {
            ...mathFunctionFormCopyCanAlterMemoEnvolved,
          };

          Object.entries({
            ...mathFunctionFormCopyCanAlterMemoEnvolved.varList,
          }).forEach(([varName, varValues]) => {
            if (varName === rowNameTableToBeModified) {
              const modifiedValues = varValues.map((value, index) => {
                if (
                  index >= parseInt(fromIndexTableModify.current.value) - 1 &&
                  index <= parseInt(toIndexTableModify.current.value) - 1
                ) {
                  return valueTableModify.current.value;
                } else {
                  return value;
                }
              });
              tmpMathFunctionFormCopyCanAlter.varList[varName] = modifiedValues;
            }
          });
          setMathFunctionFormCopyCanAlter({
            ...tmpMathFunctionFormCopyCanAlter,
          });
          setReDrawGraph(!reDrawGraph);
        }
      }
    } else {
      tableForm.setError("ModifyTableButton", {
        type: "selectRow",
        message: `${Constants.SelectRowTableToModify}`,
      });
    }
  }

  const parameterComponentList = useCallback((): JSX.Element[] => {
    return !!parameterList
      ? Object?.entries(parameterList).map(
          ([parameterName, value]): JSX.Element => {
            return (
              <FormControl
                key={parameterName}
                error={
                  errors[`Param${parameterName}`] &&
                  touchedFields[`Param${parameterName}`]
                    ? true
                    : false
                }
              >
                {errors[`Param${parameterName}`]?.message &&
                  touchedFields[`Param${parameterName}`] && (
                    <InputLabel>{`${errors[`Param${parameterName}`]?.message}`}</InputLabel>
                  )}
                <OutlinedInput
                  label={
                    errors[`Param${parameterName}`]?.message &&
                    touchedFields[`Param${parameterName}`]
                      ? `${errors[`Param${parameterName}`]?.message}`
                      : ""
                  }
                  {...register(`Param${parameterName}`)}
                  className="parameter-definition-input"
                  size="small"
                  value={!!parameterList ? parameterList[parameterName] : ""}
                  defaultValue={
                    !!parameterList ? parameterList[parameterName] : ""
                  }
                  onChange={(event) =>
                    handleParameterInputChange(event, parameterName)
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <div className="parameter-definition-input__adornment input-adornments">
                        <span>
                          {cutIfLongName(
                            parameterName,
                            Constants.cutParamNameIfGreatherThan,
                          )}
                        </span>
                        <span>{`${Constants.BlankSpace}${Constants.Equals}`}</span>
                      </div>
                    </InputAdornment>
                  }
                />
              </FormControl>
            );
          },
        )
      : null;
  }, [parameterListRecentlyModified]);

  const correspondingInputForDeterminatedVarIdentifier = useCallback(
    (varIdentifierName: string, varIdentifierIndex: number): JSX.Element => {
      return (
        <Fragment>
          <FormControl
            variant="standard"
            error={
              errors[`VarValue${varIdentifierIndex}`] &&
              !!touchedFields[`VarValue${varIdentifierIndex}`]
                ? true
                : false
            }
          >
            <InputLabel shrink={true} className="variable-values__input-label">
              {isVisibleSumationForm &&
              (varIdentifierIndex < mathSeriesShownFormCounter ||
                varIdentifierIndex === 0)
                ? errors[`VarValue${varIdentifierIndex}`]?.message &&
                  !!touchedFields[`VarValue${varIdentifierIndex}`]
                  ? `${errors[`VarValue${varIdentifierIndex}`]?.message}`
                  : Constants.ReadOnlyValues
                : errors[`VarValue${varIdentifierIndex}`]?.message &&
                    !!touchedFields[`VarValue${varIdentifierIndex}`]
                  ? `${errors[`VarValue${varIdentifierIndex}`]?.message}`
                  : Constants.EditableValues}
            </InputLabel>

            <Input
              {...register(`VarValue${varIdentifierIndex}`)}
              readOnly={
                isVisibleSumationForm &&
                (varIdentifierIndex < mathSeriesShownFormCounter ||
                  varIdentifierIndex === 0)
              }
              value={
                !!varListIdentifiers
                  ? !!varListValues
                    ? varListValues[
                        !!varListIdentifiers[varIdentifierName] &&
                        varListIdentifiers[varIdentifierName].length > 0
                          ? varListIdentifiers[varIdentifierName]
                          : varIdentifierName
                      ]
                    : ""
                  : ""
              }
              onChange={(event) =>
                handleVariableValueInputChange(
                  event,
                  !!varListIdentifiers
                    ? varListIdentifiers[varIdentifierName]
                    : "",
                  varIdentifierName,
                  varIdentifierIndex,
                )
              }
              className="variable-values__input"
            />
          </FormControl>
        </Fragment>
      );
    },
    [varListValues, mathSeriesShownFormCounter, errors],
  );

  function getVariableInputComponent(
    varIdentifierName: string,
    varIdentifierIndex: number,
  ): JSX.Element {
    return (
      <Stack
        direction="row"
        spacing={2}
        className="variable-definition__stack"
        key={varIdentifierName}
      >
        <div className="variable-definition__create-vars-container">
          {((varIdentifierIndex ===
            Object.entries(varListIdentifiers).length - 1 &&
            Object.entries(varListIdentifiers).length > 1) ||
            (Object.entries(varListIdentifiers).length <= 1 &&
              varIdentifierIndex === 0)) && (
            <IconButton
              className="variable-definition__add-variable"
              onClick={() => handleAddVariableIdentifier(varIdentifierIndex)}
            >
              <ControlPointIcon color="primary" />
            </IconButton>
          )}
        </div>

        <div className="variable-definition__container">
          <FormControl
            error={
              errors[`VarDefinition${varIdentifierIndex}`] &&
              !!touchedFields[`VarDefinition${varIdentifierIndex}`]
                ? true
                : false
            }
          >
            {errors[`VarDefinition${varIdentifierIndex}`]?.message &&
              !!touchedFields[`VarDefinition${varIdentifierIndex}`] && (
                <InputLabel>{`${errors[`VarDefinition${varIdentifierIndex}`]?.message}`}</InputLabel>
              )}
            <OutlinedInput
              label={
                errors[`VarDefinition${varIdentifierIndex}`]?.message &&
                !!touchedFields[`VarDefinition${varIdentifierIndex}`]
                  ? `${errors[`VarDefinition${varIdentifierIndex}`]?.message}`
                  : ""
              }
              {...register(`VarDefinition${varIdentifierIndex}`)}
              className="variable-definition__input"
              size="small"
              value={
                !!varListIdentifiers
                  ? varListIdentifiers[varIdentifierName]
                  : ""
              }
              onChange={(event) =>
                handleVariableInputChange(
                  event,
                  varIdentifierName,
                  varIdentifierIndex,
                )
              }
              startAdornment={
                <InputAdornment
                  position="start"
                  className="variable-definition-input__adornment"
                >
                  <div className="variable-definition-input__adornment-container input-adornments">
                    <span>
                      {varIdentifierName}
                      {isVisibleSumationForm &&
                        varIdentifierIndex < mathSeriesShownFormCounter && (
                          <sub>{Constants.N}</sub>
                        )}
                    </span>
                    <span>{`${Constants.BlankSpace}${Constants.Equals}`}</span>
                  </div>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div className="variable-values__icon-container">
          <ForwardIcon color="primary" className="variable-values__icon" />
        </div>
        <div className="variable-values__container">
          {correspondingInputForDeterminatedVarIdentifier(
            varIdentifierName,
            varIdentifierIndex,
          )}
        </div>

        <div className="variable-definition__delete-vars-container">
          {varIdentifierIndex > 0 && (
            <IconButton
              onClick={() => handleDeleteVariableIdentifier(varIdentifierIndex)}
            >
              <HighlightOffIcon color="error" />
            </IconButton>
          )}
        </div>
      </Stack>
    );
  }

  const variableComponentList = useCallback((): JSX.Element[] => {
    return !!varListIdentifiers && Object.entries(varListIdentifiers).length > 1
      ? Object?.entries(varListIdentifiers).map(
          ([varIdentifierName, varName], index): JSX.Element => {
            return getVariableInputComponent(varIdentifierName, index);
          },
        )
      : [getVariableInputComponent(`${Constants.VAR}${0}`, 0)];
  }, [
    areVarIdentifiersRecentlyModified,
    varListValues,
    mathSeriesShownFormCounter,
    errors,
  ]);

  function getMathSuccessionComponent(
    successionIdentifier: string,
    varIdentifierIndex: number,
  ): JSX.Element {
    return (
      <Fragment key={successionIdentifier}>
        {(varIdentifierIndex < mathSeriesShownFormCounter ||
          varIdentifierIndex === 0) && (
          <Stack direction="row" spacing={2} className="mathseries-container">
            <Stack direction="column" spacing={1}>
              {varIdentifierIndex === 0 ? (
                <Button
                  onClick={handleSumationFormButton}
                  variant="contained"
                  component="label"
                  disabled={isVisibleManualInputForm}
                  color={!isVisibleSumationForm ? "success" : "error"}
                  className="mathseries-container__enable-button"
                >
                  {!isVisibleSumationForm
                    ? Constants.IntroduceMathSeries
                    : Constants.Cancel}
                </Button>
              ) : (
                <Button
                  onClick={() => deleteSuccessionForm(successionIdentifier)}
                  variant="outlined"
                  disabled={isVisibleManualInputForm}
                  color={"error"}
                >
                  {Constants.deleteSuccession}
                </Button>
              )}
              <div>
                {isVisibleSumationForm && (
                  <FormControlLabel
                    className="mathseries-container__checkbox-type-series"
                    control={
                      <Checkbox
                        checked={
                          isArithmeticProgressionListChecked[varIdentifierIndex]
                        }
                        onChange={() =>
                          changeMathSeriesFormat(varIdentifierIndex)
                        }
                      />
                    }
                    labelPlacement="start"
                    label={Constants.ApplyArithmeticProgression}
                  />
                )}
              </div>

              {varIdentifierIndex === mathSeriesShownFormCounter - 1 &&
                !(
                  varIdentifierIndex ===
                  Object.entries(varListIdentifiers).length - 1
                ) && (
                  <Button
                    onClick={() => addSuccessionForm()}
                    variant="outlined"
                    disabled={isVisibleManualInputForm}
                    color={"primary"}
                    className="mathseries-container__add-succession-button"
                  >
                    {Constants.addSuccession}
                  </Button>
                )}
            </Stack>

            {isVisibleSumationForm && (
              <MathSeriesForm
                onFormChange={(form) => handleMathSeriesFormChange(form)}
                isModeProgression={
                  isArithmeticProgressionListChecked[varIdentifierIndex]
                }
                mathSeriesFormLoaded={
                  !!mathSeriesFormListImported
                    ? !!mathSeriesFormListImported[varIdentifierIndex]
                      ? { ...mathSeriesFormListImported[varIdentifierIndex] }
                      : undefined
                    : undefined
                }
                mathSeriesFormIdentifier={successionIdentifier}
              />
            )}
          </Stack>
        )}
      </Fragment>
    );
  }

  const mathSuccessionComponentList: JSX.Element[] =
    !!varListIdentifiers &&
    isVisibleSumationForm &&
    Object.entries(varListIdentifiers).length > 1
      ? Object?.entries(varListIdentifiers).map(
          ([varIdentifierName, varName], index): JSX.Element => {
            return getMathSuccessionComponent(varIdentifierName, index);
          },
        )
      : [getMathSuccessionComponent(`${Constants.VAR}${0}`, 0)];

  function getFunctionComponent(
    functionIdentifier: string,
    functionIndex: number,
  ): JSX.Element {
    return (
      <Fragment key={functionIdentifier}>
        {(isVisibleSumationForm || isVisibleManualInputForm) && (
          <FormControl
            className="math-function__container"
            error={
              errors[`Function${functionIndex}`] &&
              touchedFields[`Function${functionIndex}`]
                ? true
                : false
            }
          >
            <InputLabel>
              {errors[`Function${functionIndex}`]?.message &&
              touchedFields[`Function${functionIndex}`]
                ? `${errors[`Function${functionIndex}`]?.message}`
                : Constants.MathFunction}
            </InputLabel>
            <OutlinedInput
              label={
                errors[`Function${functionIndex}`]?.message &&
                touchedFields[`Function${functionIndex}`]
                  ? `${errors[`Function${functionIndex}`]?.message}`
                  : Constants.MathFunction
              }
              {...register(`Function${functionIndex}`)}
              id="math-function"
              value={functionToCalculateList[functionIndex]}
              disabled={!(isVisibleSumationForm || isVisibleManualInputForm)}
              onChange={(event) =>
                handleUpdateFunctionValue(event, functionIndex)
              }
              startAdornment={
                <InputAdornment position="start">
                  {functionIndex === functionToCalculateList.length - 1 ? (
                    <IconButton
                      className="math-function__add-function"
                      onClick={() => handleAddFunction()}
                    >
                      <ControlPointIcon color="primary" />
                    </IconButton>
                  ) : (
                    <span>{Constants.NBS.repeat(5)}</span>
                  )}
                  <div className="input-adornments math-function__identifier">
                    <span>{`${Constants.FUNCTION}${functionIndex}${Constants.NBS}${Constants.Equals}`}</span>
                  </div>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      handleRefreshParametersClickedButton(functionIndex)
                    }
                  >
                    <CachedIcon color="primary" />
                  </IconButton>
                  <div className="math-function__delete-function">
                    {functionToCalculateList.length > 1 &&
                      functionIndex !== 0 && (
                        <IconButton
                          onClick={() => handleDeleteFunction(functionIndex)}
                        >
                          <HighlightOffIcon color="error" />
                        </IconButton>
                      )}
                  </div>
                </InputAdornment>
              }
            />
          </FormControl>
        )}
      </Fragment>
    );
  }

  const functionComponentList: JSX.Element[] =
    !!functionToCalculateList && functionToCalculateList.length > 0
      ? Object?.entries(functionToCalculateList).map(
          (functionExpression, index): JSX.Element => {
            return getFunctionComponent(`${Constants.FUNCTION}${index}`, index);
          },
        )
      : [getFunctionComponent(`${Constants.FUNCTION}${0}`, 0)];

  return (
    <Fragment>
      <main>
        <NavBar />
        <ThemeProvider theme={theme}>
          <div className="major-flexbox">
            <Paper elevation={3} className="configuration">
              <div className="configuration__title-container">
                <span className="configuration__title-text">
                  {Constants.ConfigurationTitle}
                </span>
                <InfoPopUp />
              </div>

              <Stack
                direction="column"
                spacing={1}
                justifyContent="space-evenly"
                alignItems="normal"
                className="configuration__first-stack"
              >
                <Button
                  variant="contained"
                  component="label"
                  color={!isVisibleManualInputForm ? "primary" : "error"}
                  className="manual-input-data-button"
                  disabled={isVisibleSumationForm}
                  onClick={handleManualFormButton}
                >
                  {!isVisibleManualInputForm
                    ? Constants.ManualInput
                    : Constants.Cancel}
                </Button>

                <Box display="flex" flexWrap="wrap" flexDirection="row">
                  {mathSuccessionComponentList.map((element) => (
                    <Box key={element.key}>{element}</Box>
                  ))}
                </Box>
              </Stack>

              <Stack
                direction="column"
                spacing={2}
                className="configuration__second-stack"
              >
                {(isVisibleManualInputForm || isVisibleSumationForm) && (
                  <div className="dropdown">
                    <DropDown
                      disabled={
                        !(isVisibleSumationForm || isVisibleManualInputForm)
                      }
                      options={loadFunctionList()}
                      onSelection={handleSelectedFunctionDropDown}
                      buttonContent={Constants.SelectFunction}
                    />
                  </div>
                )}

                {(isVisibleManualInputForm || isVisibleSumationForm) && (
                  <div>
                    <div className="variables-title-text">
                      <span>{Constants.Variables}</span>
                    </div>

                    {variableComponentList()?.length > 0 && (
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        {variableComponentList().map((element) => (
                          <Box key={element.key}>{element}</Box>
                        ))}
                      </Box>
                    )}
                  </div>
                )}

                {parameterComponentList()?.length > 0 && (
                  <div>
                    <div className="parameters-title-text">
                      <span>{Constants.Parameters}</span>
                    </div>

                    <Box
                      className="parameter-definition-container"
                      display="flex"
                      flexWrap="wrap"
                      flexDirection="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      {parameterComponentList().map((element) => (
                        <Box key={element.key} p={1}>
                          {element}
                        </Box>
                      ))}
                    </Box>
                  </div>
                )}

                <Box display="flex" flexDirection="column">
                  {functionComponentList.map((functionElement) => (
                    <Box
                      className="function-definition-container"
                      key={functionElement.key}
                      p={1}
                    >
                      {functionElement}
                    </Box>
                  ))}
                </Box>
              </Stack>

              <FormHelperText
                error
                variant="standard"
                className="form-has-errors"
              >
                {isFormWaitingToBeValidToProceedCalculation &&
                Object.keys(errors).length > 0
                  ? `${Constants.FunctionFormHasErrors}`
                  : null}
              </FormHelperText>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="configuration__third-stack"
              >
                <div>
                  <Button
                    variant="contained"
                    disabled={
                      !(isVisibleSumationForm || isVisibleManualInputForm)
                    }
                    onClick={handleApplyFunction}
                    color="primary"
                  >
                    {Constants.ApplyFunction}
                  </Button>
                </div>

                <Stack direction="row" spacing={3}>
                  <Stack direction="row" spacing={1}>
                    <div className="loaded-filename-container">
                      <span className="loaded-filename-container__literal">
                        {!!fileName ? Constants.ImportedDataFromFile : ""}
                      </span>
                      <br />
                      <span className="loaded-filename-container__filename">
                        {!!fileName
                          ? cutIfLongFileName(
                              fileName,
                              Constants.cutFileNameIfGreatherThan,
                            )
                          : ""}
                      </span>
                    </div>

                    {!isFileLoaded && (
                      <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        className="import-data-button"
                        disabled={
                          isVisibleSumationForm || isVisibleManualInputForm
                        }
                      >
                        {Constants.ImportData}
                        <input
                          hidden
                          id="file-input"
                          type="file"
                          onChange={(event) =>
                            handleFileInputChangeSelected(event)
                          }
                        />
                      </Button>
                    )}
                    {isFileLoaded && (
                      <Button
                        variant="contained"
                        component="label"
                        color="error"
                        className="import-data-button"
                        onClick={changeVisibilityFileInputForm}
                      >
                        {Constants.Cancel}
                      </Button>
                    )}
                  </Stack>

                  <Button
                    variant="contained"
                    component="label"
                    color="success"
                    disabled={
                      !(isVisibleSumationForm || isVisibleManualInputForm) &&
                      !(
                        !!mathFunctionsResultValuesCopyCanAlter &&
                        mathFunctionsResultValuesCopyCanAlter.length > 0
                      )
                    }
                    onClick={handleExportData}
                  >
                    {Constants.ExportData}
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <div className="graph__container">
              <Paper elevation={3} className="graph__paper">
                <Resizable
                  className="graph__component-container"
                  defaultSize={{ width: "auto", height: 350 }}
                  onResizeStart={() => {
                    setAdjustingGraphHeight(true);
                  }}
                  onResizeStop={() => {
                    setAdjustingGraphHeight(false);
                    setReDrawGraph(!reDrawGraph);
                  }}
                  enable={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent={"space-between"}
                    className="graph__title-header"
                  >
                    <span className="graph__title-header-title">
                      {Constants.FunctionGraph}
                    </span>
                    <Box sx={{ mr: 3 }}>
                      <span>{Constants.EnableTraceBetweenPoints}</span>
                      <Checkbox
                        checked={showTraceBetweenDotsGraph}
                        onChange={() => {
                          setShowTraceBetweenDotsGraph(
                            !showTraceBetweenDotsGraph,
                          );
                          setReDrawGraph(!reDrawGraph);
                        }}
                      ></Checkbox>
                    </Box>
                  </Stack>

                  <GrapRepresentation
                    dependantVariable={{
                      name: Constants.FUNCTION,
                      values: mathFunctionsResultValuesCopyCanAlter,
                    }}
                    independentVariables={
                      !!mathFunctionFormCopyCanAlterMemoEnvolved?.varList &&
                      Object?.entries(
                        mathFunctionFormCopyCanAlterMemoEnvolved?.varList,
                      ).length > 0
                        ? mathFunctionFormCopyCanAlterMemoEnvolved?.varList
                        : undefined
                    }
                    reDrawGraph={reDrawGraph}
                    adjustingSize={adjustingGraphHeight}
                    showTraceBetweenDots={showTraceBetweenDotsGraph}
                  />
                </Resizable>
              </Paper>
            </div>

            <Paper elevation={3} className="function-results-container">
              <Stack
                direction="row"
                flexWrap={"wrap"}
                justifyContent="space-between"
                className="function-results-container__header"
              >
                <div className="function-results-container__header-title-text">
                  <span>{Constants.FunctionResults}</span>
                </div>
                {!!mathFunctionsResultValuesCopyCanAlter &&
                  mathFunctionsResultValuesCopyCanAlter.length > 0 && (
                    <Stack
                      direction="row"
                      flexWrap={"wrap"}
                      spacing={5}
                      className="function-results-container__header-modify-table-options-container"
                    >
                      <div className="function-results-container__header-modify-precision">
                        <span>{`${Constants.ModifyPrecission}${Constants.NBS}`}</span>
                        <Box
                          sx={{
                            width: 100,
                            height: 60,
                            mr: "6.5rem",
                            textAlignLast: "center",
                          }}
                        >
                          <TextField
                            error={
                              tableForm.formState.errors?.pointPrecision
                                ?.message
                                ? true
                                : false
                            }
                            variant="standard"
                            label={
                              !!tableForm.formState.errors.pointPrecision
                                ?.message
                                ? `${tableForm.formState.errors.pointPrecision?.message}`
                                : `${Constants.Precision}`
                            }
                            {...tableForm.register("pointPrecision")}
                            defaultValue={precissionFloatingPoint}
                            value={
                              !tableForm.formState.errors?.pointPrecision
                                ?.message
                                ? precissionFloatingPoint
                                : undefined
                            }
                            onChange={(event) =>
                              handleFloatingPointPrecisionTableModified(
                                event.target.value,
                              )
                            }
                          />
                        </Box>
                      </div>

                      <Stack
                        direction="row"
                        flexWrap={"wrap"}
                        className="function-results-container__header-modify-values"
                      >
                        <span>{`${Constants.ModifyTableValues}${Constants.NBS}`}</span>
                        <Stack direction="row" flexWrap={"wrap"}>
                          <TextField
                            error={
                              tableForm.formState.errors?.FromIndex?.message
                                ? true
                                : false
                            }
                            label={
                              tableForm.formState.errors?.FromIndex?.message
                                ? `${tableForm.formState.errors.FromIndex?.message}`
                                : `${Constants.FromIndex}`
                            }
                            {...tableForm.register("FromIndex")}
                            inputRef={fromIndexTableModify}
                            sx={{
                              width: 160,
                              height: 60,
                              textAlignLast: "center",
                              mr: 2,
                            }}
                            variant="standard"
                            onChange={(event) =>
                              handleFromIndexChanged(event.target.value, false)
                            }
                          />
                          <TextField
                            error={
                              tableForm.formState.errors?.ToIndex?.message
                                ? true
                                : false
                            }
                            label={
                              tableForm.formState.errors?.ToIndex?.message
                                ? `${tableForm.formState.errors.ToIndex?.message}`
                                : `${Constants.ToIndex}`
                            }
                            {...tableForm.register("ToIndex")}
                            inputRef={toIndexTableModify}
                            sx={{
                              width: 160,
                              height: 60,
                              textAlignLast: "center",
                              mr: 2,
                            }}
                            variant="standard"
                            onChange={(event) =>
                              handleToIndexChanged(event.target.value, false)
                            }
                          />
                          <TextField
                            error={
                              tableForm.formState.errors?.NewValue?.message
                                ? true
                                : false
                            }
                            label={
                              tableForm.formState.errors?.NewValue?.message
                                ? `${tableForm.formState.errors.NewValue?.message}`
                                : `${Constants.NewValue}`
                            }
                            {...tableForm.register("NewValue")}
                            inputRef={valueTableModify}
                            sx={{
                              width: 95,
                              height: 60,
                              textAlignLast: "center",
                              mr: 2,
                            }}
                            variant="standard"
                            onChange={(event) =>
                              handleNewValueChanged(event.target.value, false)
                            }
                          />
                          <Box sx={{ alignSelf: "center", pr: 4.5 }}>
                            <DropDown
                              width={140}
                              disabled={false}
                              buttonContent={
                                !!rowNameTableToBeModified
                                  ? rowNameTableToBeModified
                                  : Constants.SelectRowNameTable
                              }
                              options={Array.from(
                                {
                                  length:
                                    mathFunctionsResultValuesCopyCanAlter.length,
                                },
                                (_, index) => index,
                              )
                                .map(
                                  (number) => `${Constants.FUNCTION}${number}`,
                                )
                                .concat(
                                  Object.entries(
                                    mathFunctionFormCopyCanAlterMemoEnvolved.varList,
                                  ).map(([varName, varValue]) => varName),
                                )}
                              onSelection={(optionSelected) =>
                                handleRowTableToModify(optionSelected)
                              }
                            />
                          </Box>
                          <Box sx={{ alignSelf: "center" }}>
                            <Button
                              sx={{
                                width: 140,
                                height: 30,
                                alignSelf: "center",
                                mr: 4.5,
                                mt: tableForm.formState.errors
                                  ?.ModifyTableButton?.message
                                  ? "4px"
                                  : "0px",
                              }}
                              {...tableForm.register("ModifyTableButton")}
                              variant="contained"
                              component="label"
                              color="success"
                              onClick={() => handleModifyTable()}
                            >
                              {Constants.Modify}
                            </Button>
                            {tableForm.formState.errors?.ModifyTableButton
                              ?.message && (
                              <FormHelperText
                                error
                                variant="standard"
                                sx={{ height: "4px" }}
                              >
                                {`${tableForm.formState.errors?.ModifyTableButton?.message}`}
                              </FormHelperText>
                            )}
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
              </Stack>

              {!!mathFunctionsResultValuesCopyCanAlter &&
                mathFunctionsResultValuesCopyCanAlter.length > 0 && (
                  <TableFunctionResults
                    input={{
                      resultValues:
                        mathFunctionsResultValuesCopyCanAlter.slice(),
                      varList:
                        !!mathFunctionFormCopyCanAlterMemoEnvolved.varList &&
                        Object.entries(
                          mathFunctionFormCopyCanAlterMemoEnvolved.varList,
                        ).length > 0
                          ? mathFunctionFormCopyCanAlterMemoEnvolved.varList
                          : {},
                      paramList:
                        !!mathFunctionFormCopyCanAlterMemoEnvolved.paramList &&
                        Object.entries(
                          mathFunctionFormCopyCanAlterMemoEnvolved.paramList,
                        ).length > 0
                          ? mathFunctionFormCopyCanAlterMemoEnvolved.paramList
                          : {},
                    }}
                    upperRoundingFloat={precissionFloatingPoint}
                  />
                )}
            </Paper>
          </div>

          <ExitModeCleanFormDialog
            open={isOpenedExitModeCleanFormDialog}
            onDecisionMade={(userSelection: UserGenericModalSelection) =>
              handleExitModeCleanForm(userSelection)
            }
          />

          <CheckExportableFormsDifferenceDialog
            open={isOpenedTypeExportDialog}
            onDecisionMade={(exportTypeSelected: ExportWhich) =>
              handleExportDialog(exportTypeSelected)
            }
          />

          <ChooseFunctionToFillDialog
            open={isOpenedFunctionToFillDialog}
            onDecisionMade={(functionNumberToFill: number) =>
              handleFunctionToFillDialog(functionNumberToFill)
            }
            howManyFunctionsAdded={
              !!functionToCalculateList ? functionToCalculateList.length : 0
            }
          />

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isReservedVariablesSnackBarActive}
            autoHideDuration={10000}
            onClose={() => reservedVariablesSnackBarClosed()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => reservedVariablesSnackBarClosed()}
            >
              {Constants.ReservedVariablesSnackBarActive}
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isOpenedCheckFormsBeforeExportingConfigSnackBarActive}
            autoHideDuration={10000}
            onClose={() => checkFormsBeforeExportingConfigSnackBarClosed()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => checkFormsBeforeExportingConfigSnackBarClosed()}
            >
              {Constants.CheckConfigDataBeforeExporting}
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isNoVarNumbersFunctionSnackBarActive}
            autoHideDuration={10000}
            onClose={() => noVarNumbersFunctionSnackBarClosed()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => noVarNumbersFunctionSnackBarClosed()}
            >
              {Constants.NoVarNumbersFunctionSnackBarActive}
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isNoQuotationMarksFunctionSnackBarActive}
            autoHideDuration={10000}
            onClose={() => noQuotationMarkFunctionSnackBarClosed()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => noQuotationMarkFunctionSnackBarClosed()}
            >
              {Constants.QuotationMarksNotPermited}
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isNoSpacingSnackBarActive}
            autoHideDuration={10000}
            onClose={() => noSpacingSnackBarClosed()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => noSpacingSnackBarClosed()}
            >
              {Constants.SpacingIsNotAllowed}
            </Alert>
          </Snackbar>
        </ThemeProvider>
        <Footer />
      </main>
    </Fragment>
  );
});

export default Home;
