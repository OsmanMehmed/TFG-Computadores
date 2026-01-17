/* eslint-disable no-extra-boolean-cast */
import { useState } from "react";
import ExportableImportableFormModel from "../models/exportableFormModel";
import MathSeriesFormModel from "../models/mathSeriesFormModel";
import { Constants } from "../../shared/utils/constants";
import { isSomeImportantAtributeMathSeriesNull } from "../../shared/utils/functions";

export function useLoadDataFile(): {
  fileName: string;
  fileObject: ExportableImportableFormModel;
  handleFileInputChange: React.ChangeEventHandler<HTMLInputElement>;
} {
  const [fileName, setFileName] = useState("");
  const [fileObject, setFileObject] = useState<ExportableImportableFormModel>();

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    let file: File;
    if (!!e) {
      file = e.target.files[0];
    } else {
      file = null;
    }

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setFileObject(transformIntoInputModel(reader.result));
      };
    } else {
      setFileName(null);
      setFileObject(null);
    }
  };

  return {
    fileName,
    fileObject,
    handleFileInputChange,
  };
}

function transformIntoInputModel(
  fileUnformatedData: string | ArrayBuffer,
): ExportableImportableFormModel {
  const clonableMathSeriesForm: MathSeriesFormModel = {
    seriesFunction: undefined,
    initialNValue: undefined,
    finalNValue: undefined,
    isArithmeticProgression: undefined,
    difference: undefined,
    seriesVarName: undefined,
  };

  const importableForm: ExportableImportableFormModel = {
    functionsResults: [],
    mathFunctionForm: {
      functions: [],
      varList: {},
      paramList: {},
    },
    mathSeriesFormList: undefined,
  };

  const importableMathSeriesFormList: MathSeriesFormModel[] = [];
  importableMathSeriesFormList.push(Object.assign({}, clonableMathSeriesForm));

  let inputString: string;
  if (fileUnformatedData instanceof ArrayBuffer) {
    const decoder = new TextDecoder("utf-8");
    inputString = decoder.decode(fileUnformatedData);
  } else {
    inputString = fileUnformatedData;
  }

  const lines = inputString.split("\n").map((line) => line.replace(/\s+/g, ""));

  const functionIdentifierRegex = new RegExp(`^${Constants.FUNCTION}\\d+$`);

  const functionResultsIdentifierRegex = new RegExp(
    `^${Constants.functionResultsTxtFormat}\\d+$`,
  );

  const functionIdentifierRegexExtractNumber = new RegExp(
    `${Constants.FUNCTION}(\\d+)`,
  );

  const functionResultsIdentifierRegexExtractNumber = new RegExp(
    `${Constants.functionResultsTxtFormat}(\\d+)`,
  );

  const parameterDetectioncounters = {
    seriesFunction: 0,
    initialNValue: 0,
    finalNValue: 0,
    isArithmeticProgression: 0,
    difference: 0,
    seriesVarName: 0,
    valid: 0,
  };

  lines.forEach((line) => {
    const [key, value] = line.split("=");

    if (functionResultsIdentifierRegex.test(key)) {
      importableForm.functionsResults[
        parseInt(
          key.replace(functionResultsIdentifierRegexExtractNumber, "$1"),
          10,
        )
      ] = value.split(",");
    } else if (key.startsWith(`${Constants.varTxtFormat}`)) {
      const varName = key.substring(4);
      importableForm.mathFunctionForm.varList[varName] = value.split(",");
    } else if (key.startsWith(`${Constants.paramTxtFormat}`)) {
      const paramName = key.substring(6);
      importableForm.mathFunctionForm.paramList[paramName] = value;
    } else if (key === `${Constants.seriesFunctionTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[
          parameterDetectioncounters.seriesFunction
        ]?.seriesFunction
      ) {
        parameterDetectioncounters.seriesFunction =
          parameterDetectioncounters.seriesFunction + 1;

        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.seriesFunction
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.seriesFunction
        ].seriesFunction = value;
      } else {
        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.seriesFunction
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.seriesFunction
          ].seriesFunction = value;
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.seriesFunction
          ].seriesFunction = value;
        }
      }
    } else if (key === `${Constants.initialNValueTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[parameterDetectioncounters.initialNValue]
          ?.initialNValue
      ) {
        parameterDetectioncounters.initialNValue =
          parameterDetectioncounters.initialNValue + 1;

        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.initialNValue
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.initialNValue
        ].initialNValue = parseFloat(value);
      } else {
        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.initialNValue
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.initialNValue
          ].initialNValue = parseFloat(value);
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.initialNValue
          ].initialNValue = parseFloat(value);
        }
      }
    } else if (key === `${Constants.finalNValueTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[parameterDetectioncounters.finalNValue]
          ?.finalNValue
      ) {
        parameterDetectioncounters.finalNValue =
          parameterDetectioncounters.finalNValue + 1;

        if (
          !importableMathSeriesFormList[parameterDetectioncounters.finalNValue]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.finalNValue
        ].finalNValue = parseFloat(value);
      } else {
        if (
          !importableMathSeriesFormList[parameterDetectioncounters.finalNValue]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.finalNValue
          ].finalNValue = parseFloat(value);
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.finalNValue
          ].finalNValue = parseFloat(value);
        }
      }
    } else if (key === `${Constants.isArithmeticProgressionTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[
          parameterDetectioncounters.isArithmeticProgression
        ]?.isArithmeticProgression ||
        importableMathSeriesFormList[
          parameterDetectioncounters.isArithmeticProgression
        ]?.isArithmeticProgression === false
      ) {
        parameterDetectioncounters.isArithmeticProgression =
          parameterDetectioncounters.isArithmeticProgression + 1;

        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.isArithmeticProgression
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.isArithmeticProgression
        ].isArithmeticProgression = value === "true";
      } else {
        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.isArithmeticProgression
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.isArithmeticProgression
          ].isArithmeticProgression = value === "true";
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.isArithmeticProgression
          ].isArithmeticProgression = value === "true";
        }
      }
    } else if (key === `${Constants.differenceTxtFormat}`) {
      if (
        importableMathSeriesFormList[parameterDetectioncounters.difference]
          ?.difference !== undefined
      ) {
        parameterDetectioncounters.difference =
          parameterDetectioncounters.difference + 1;

        if (
          !importableMathSeriesFormList[parameterDetectioncounters.difference]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.difference
        ].difference = parseFloat(value === "undefined" ? "0" : value);
      } else {
        if (
          !importableMathSeriesFormList[parameterDetectioncounters.difference]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.difference
          ].difference = parseFloat(value === "undefined" ? "0" : value);
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.difference
          ].difference = parseFloat(value === "undefined" ? "0" : value);
        }
      }
    } else if (key === `${Constants.seriesVarNameTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[parameterDetectioncounters.seriesVarName]
          ?.seriesVarName
      ) {
        parameterDetectioncounters.seriesVarName =
          parameterDetectioncounters.seriesVarName + 1;

        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.seriesVarName
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[
          parameterDetectioncounters.seriesVarName
        ].seriesVarName = value;
      } else {
        if (
          !importableMathSeriesFormList[
            parameterDetectioncounters.seriesVarName
          ]
        ) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[
            parameterDetectioncounters.seriesVarName
          ].seriesVarName = value;
        } else {
          importableMathSeriesFormList[
            parameterDetectioncounters.seriesVarName
          ].seriesVarName = value;
        }
      }
    } else if (key === `${Constants.validTxtFormat}`) {
      if (
        !!importableMathSeriesFormList[parameterDetectioncounters.valid]
          ?.valid ||
        importableMathSeriesFormList[parameterDetectioncounters.valid]
          ?.valid === false
      ) {
        parameterDetectioncounters.valid = parameterDetectioncounters.valid + 1;

        if (!importableMathSeriesFormList[parameterDetectioncounters.valid]) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
        }

        importableMathSeriesFormList[parameterDetectioncounters.valid].valid =
          value === "true";
      } else {
        if (!importableMathSeriesFormList[parameterDetectioncounters.valid]) {
          importableMathSeriesFormList.push(
            Object.assign({}, clonableMathSeriesForm),
          );
          importableMathSeriesFormList[parameterDetectioncounters.valid].valid =
            value === "true";
        } else {
          importableMathSeriesFormList[parameterDetectioncounters.valid].valid =
            value === "true";
        }
      }
    } else if (functionIdentifierRegex.test(key)) {
      importableForm.mathFunctionForm.functions[
        parseInt(key.replace(functionIdentifierRegexExtractNumber, "$1"), 10)
      ] = value;
    }
  });

  if (!isSomeImportantAtributeMathSeriesNull(importableMathSeriesFormList[0])) {
    importableForm.mathSeriesFormList = importableMathSeriesFormList.map(
      (matSeriesForm) => {
        const tmpMatSeriesForm: MathSeriesFormModel = { ...matSeriesForm };
        if (matSeriesForm.seriesFunction === "undefined") {
          tmpMatSeriesForm.seriesFunction = undefined;
        }

        if (matSeriesForm.difference === 0) {
          tmpMatSeriesForm.difference = undefined;
        }

        return tmpMatSeriesForm;
      },
    );
  }

  if (
    (!importableForm.mathFunctionForm?.varList ||
      Object.entries(importableForm.mathFunctionForm?.varList).length === 0) &&
    (!!importableForm.mathFunctionForm?.paramList ||
      Object.entries(importableForm.mathFunctionForm?.paramList).length ===
        0) &&
    (!importableForm.mathFunctionForm?.functions ||
      importableForm.mathFunctionForm?.functions.length === 0)
  ) {
    importableForm.valid = false;
  } else {
    importableForm.valid = true;
  }

  return importableForm;
}
