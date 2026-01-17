export class Constants {
  public static readonly NBS: string = " ";
  public static readonly NavBarTitle: string = "Propamap";
  public static readonly Accept: string = "Accept";
  public static readonly Cancel: string = "Cancel";
  public static readonly CleanForm: string = "Clean Form";
  public static readonly SelectFunction: string = "Select math function";
  public static readonly SelectFunctionToFill: string = "Select which to fill";
  public static readonly MathFunction: string = "Math function";
  public static readonly Precision: string = "Precision";
  public static readonly FunctionResults: string = "Function results";
  public static readonly FunctionElement: string = `Function${Constants.NBS}element`;
  public static readonly ExportedFileName: string = "propagamap-file";
  public static readonly FunctionGraph: string = "Function graph";
  public static readonly ConfigurationTitle: string = "Configuration panel";
  public static readonly LoadFile: string = "Introduce data by file";
  public static readonly ManualInput: string = "Introduce data manually";
  public static readonly FirstValue: string = "First func. value";
  public static readonly FirstnValue: string = "First n value";
  public static readonly ValuesDifference: string = "Values difference";
  public static readonly SuccessionFormulaErrorOnlyReservedWords: string =
    "Please structure the succesion only with n variable, rational numbers and operators";
  public static readonly FormulaErrorExpression: string =
    "The structure of the expression can not be calculated, please check it";
  public static readonly MatrixCantBeRepresented: string =
    "Matrix can not be represented";
  public static readonly ComplexNumbersCantBeRepresented: string =
    "Complex numbers can not be represented";
  public static readonly FunctionFormHasErrors: string =
    "Function elements have errors, please check them";
  public static readonly differenceParameterArithmeticProgressionFormula: string =
    "d";
  public static readonly variableArithmeticProgressionFormula: string = "n";
  public static readonly initialValueArithmeticProgressionFormula: string =
    "n1";
  public static readonly mathArithmeticProgressionFormula: string =
    Constants.initialValueArithmeticProgressionFormula +
    "+(" +
    Constants.variableArithmeticProgressionFormula +
    "-1)*" +
    Constants.differenceParameterArithmeticProgressionFormula;
  public static readonly ExportData: string = "Export data";
  public static readonly ImportData: string = "Import data";
  public static readonly Identifier: string = "Identifier";
  public static readonly Row: string = "Row";
  public static readonly Variables: string = "Variables";
  public static readonly Value: string = "Value";
  public static readonly Values: string = "Values";
  public static readonly NewValue: string = "New Value";
  public static readonly EditableValues: string = "Editable values";
  public static readonly ReadOnlyValues: string = "Read-only values";
  public static readonly Parameters: string = "Parameters";
  public static readonly VariableNames: string = "Variable names";
  public static readonly VariableValues: string = "Variable values";
  public static readonly Constants: string = "Constants";
  public static readonly IntroduceMathSeries: string =
    "Use mathematical succession";
  public static readonly ApplyArithmeticProgression: string =
    "Arithmetic progression";
  public static readonly MathSeries: string = "Math succession";
  public static readonly ApplyFunction: string = "Apply function";
  public static readonly Modify: string = "Modify";
  public static readonly LastNValue = "Last n value";
  public static readonly NumberElements = "Elements number";
  public static readonly ImportedDataFromFile: string =
    "Imported data from file";
  public static readonly Required: string = "Required";
  public static readonly BiggerThanToIndex: string = "Value > To Index";
  public static readonly LessThanFromIndex: string = "Value < From Index";
  public static readonly MaxLengthPrecision: string = "Max precission";
  public static readonly MaxLengthTableIndex: string =
    "Index > table values length";
  public static readonly SelectRowTableToModify: string =
    "Please select row to modify";
  public static readonly OnlyIntegers: string = "Only integers";
  public static readonly OnlyNatural: string = "Only natural";
  public static readonly OnlyNumbers: string = "Only rational num";
  public static readonly NoNumbers: string = "No numbers";
  public static readonly OnlyNumbersSeparatedCommas: string =
    "Only numbers separated by commas";
  public static readonly GreaterThanFinal: string = "Must be > than n";
  public static readonly GreaterThanFinalProgression: string =
    "Must be > than VAR1";
  public static readonly LessThanInitial: string = "Must be < than N";
  public static readonly MaxElementLength: string = "Max element";
  public static readonly LessThanN: string = "Must be less than N";
  public static readonly VarsMustHaveSameLength: string =
    "All variables must have same length";
  public static readonly DIFF: string = "DIFF";
  public static readonly Plus: string = "+";
  public static readonly Minus: string = "-";
  public static readonly Multiplication: string = "*";
  public static readonly ParenthesesOpen: string = "(";
  public static readonly ParenthesesClose: string = ")";
  public static readonly None: string = "None";
  public static readonly arrowRight: string = ">";
  public static readonly InitialN: string = "n0";
  public static readonly A: string = "a";
  public static readonly Y: string = "y";
  public static readonly RESULT: string = "RESULT";
  public static readonly FUNCTION: string = "FUNCTION";
  public static readonly FUNCTIONS: string = "FUNCTIONS";
  public static readonly INDEX: string = "INDEX";
  public static readonly FromIndex: string = "From index (included)";
  public static readonly ToIndex: string = "To index (included)";
  public static readonly VAR: string = "VAR";
  public static readonly PARAM: string = "PARAM";
  public static readonly N: string = "n";
  public static readonly N_UPPER: string = "N";
  public static readonly MathE: string = "e";
  public static readonly Zero: string = "0";
  public static readonly ONE: string = "1";
  public static readonly TWO: string = "2";
  public static readonly THREE: string = "3";
  public static readonly FOUR: string = "4";
  public static readonly FIVE: string = "5";
  public static readonly SIX: string = "6";
  public static readonly SEVEN: string = "7";
  public static readonly EIGHT: string = "8";
  public static readonly NINE: string = "9";
  public static readonly nEqualsTo: string = "n=";
  public static readonly treeDots: string = "…";
  public static readonly Dot: string = ".";
  public static readonly MathSeriesPlaceHolderList: string[] = [
    "(n+1)*(n+2)",
    "n",
    "n*100",
    "(n+5)^2",
    "n^2/n",
  ];
  public static readonly Equals: string = "=";
  public static readonly BlankSpace: string = " ";
  public static readonly primaryPaletteColor: string = "#1D488A";
  public static readonly GeneralFunctionReservedWords: string[] = [
    "*",
    "/",
    "(pi)",
    "(e)",
    "%",
    "cos(",
    "cosh(",
    "acosh(",
    "asinh(",
    "sinh(",
    "tanh(",
    "atanh(",
    "log(",
    "(",
    ")",
    "sin(",
    "tan(",
    "atan(",
    "asin(",
    "acos(",
    "sqrt(",
    "=",
    "+",
    "-",
    "^",
  ];
  public static readonly SuccessionFunctionReservedWords: string[] = [
    ...Constants.GeneralFunctionReservedWords,
    "n",
  ];
  public static readonly defaultFunctionlist: string[] = [
    "cos(x)",
    "sin(x)",
    "m*x",
    "m*x + n",
    "a*x^2 + b*x + c + d + c + e +f",
    "k/x",
    "c*sqrt(a*x+b)",
    "a*x+   b*x+  c",
  ];
  public static readonly cutFileNameIfGreatherThan: number = 26;
  public static readonly cutParamNameIfGreatherThan: number = 3;
  public static readonly cutTableParamNameIfGreatherThan: number = 5;
  public static readonly regexReservedVarNameVARn: RegExp = /^(VAR\d+)$/;
  public static readonly addSuccession: string = "Add succession";
  public static readonly deleteSuccession: string = "Delete succession";
  public static readonly excededDimensions: string =
    "Variable number exceeds 3 dimensions, can not be represented";
  public static readonly AdjustingSize: string = "Adjusting size";
  public static readonly functionResultsTxtFormat: string = "results-FUNCTION";
  public static readonly varTxtFormat: string = "var-";
  public static readonly paramTxtFormat: string = "param-";
  public static readonly seriesFunctionTxtFormat: string = "seriesFunction";
  public static readonly initialNValueTxtFormat: string = "initialNValue";
  public static readonly finalNValueTxtFormat: string = "finalNValue";
  public static readonly isArithmeticProgressionTxtFormat: string =
    "isArithmeticProgression";
  public static readonly differenceTxtFormat: string = "difference";
  public static readonly seriesVarNameTxtFormat: string = "seriesVarName";
  public static readonly validTxtFormat: string = "valid";
  public static readonly ExportDialogTitle: string =
    "Configuration panel data diffier from results table";
  public static readonly ExportDialogBody: string = "¿What will you do?";
  public static readonly ExportDialogExportOnlyConfig: string =
    "Export data from config panel";
  public static readonly ExportDialogExportCalculatedFunctionData: string =
    "Export data from results table";
  public static readonly CheckConfigDataBeforeExporting: string =
    "Please check configuration value errors before exporting";
  public static readonly ReservedVariablesSnackBarActive: string =
    "Already used variables can not be declared again, neither reserved words named VAR(number)";
  public static readonly NoVarNumbersFunctionSnackBarActive: string =
    "Declaring variables with numbers is not permited";
  public static readonly SpacingIsNotAllowed: string =
    "Spacing is not allowed there";
  public static readonly GeneralError: string =
    "An unexpected error has occurred";
  public static readonly PleaseDontExceedMaxElementsPerSuccessionSnackBarActive: string =
    "Please dont exceed max elements per succesion, maximum is set to 1000";
  public static readonly FillFunctionDialogTitle: string =
    "Select which function to fill with the expression";
  public static readonly ModifyPrecission: string =
    "Modify floating point precission (Upper rounding applied): ";
  public static readonly ModifyTableValues: string =
    "Modify non-constant table values by index: ";
  public static readonly SelectRowNameTable: string = "Select row";
  public static readonly EnableTraceBetweenPoints: string =
    "¿Enable trace between values?";
  public static readonly ExitModeCleanDialogTitle: string =
    "If you exit the mode, configuration values will be earsed";
  public static readonly QuotationMarksNotPermited: string =
    "Quotation marks not permited";
}
