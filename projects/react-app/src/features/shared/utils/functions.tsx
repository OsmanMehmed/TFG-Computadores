import { Constants } from "./constants";

export function cutIfLongName(name: string, cutIfGreatherThan: number): string {
  if (name.length > cutIfGreatherThan) {
    const shortedName = name
      .substring(0, name.length - 1)
      .substring(0, cutIfGreatherThan);

    return `${shortedName}${Constants.treeDots}`;
  }

  return name;
}

export function cutIfLongFileName(
  fileName: string,
  cutIfGreatherThan: number,
): string {
  if (fileName.length > cutIfGreatherThan) {
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
    const shortedName = fileName
      .substring(0, fileName.length - extension.length - 1)
      .substring(0, cutIfGreatherThan);

    return `${shortedName}${Constants.treeDots}${Constants.Dot}${extension}`;
  }

  return fileName;
}

export function getFunctionParameters(
  functionList: string[],
  variableList: string[] | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  existingParams: string[],
  currentParams: Record<string, string>,
  reservedWords: string[],
): Record<string, string> {
  const params: Record<string, string> = {};
  const uniqueParams = new Set<string>();

  functionList.forEach((func) => {
    const tokens = func.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

    tokens.forEach((token) => {
      if (reservedWords.includes(token)) return;
      if (variableList && variableList.includes(token)) return;

      uniqueParams.add(token);
    });
  });

  uniqueParams.forEach((param) => {
    if (
      currentParams &&
      Object.prototype.hasOwnProperty.call(currentParams, param)
    ) {
      params[param] = currentParams[param];
    } else {
      params[param] = "";
    }
  });

  return params;
}

export function getRandomColorHexadecimal(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSomeImportantAtributeMathSeriesNull(
  mathSeriesForm: any,
): boolean {
  if (!mathSeriesForm) {
    return true;
  }

  if (
    mathSeriesForm.initialNValue === undefined ||
    mathSeriesForm.initialNValue === null
  ) {
    return true;
  }

  if (
    mathSeriesForm.finalNValue === undefined ||
    mathSeriesForm.finalNValue === null
  ) {
    return true;
  }

  if (!mathSeriesForm.seriesVarName) {
    return true;
  }

  return false;
}
