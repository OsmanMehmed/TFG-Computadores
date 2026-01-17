import MathFunctionFormModel from "./mathFunctionFormModel";
import MathSeriesFormModel from "./mathSeriesFormModel";

export default interface ExportableImportableFormModel {
  functionsResults: string[][];
  mathFunctionForm: MathFunctionFormModel;
  mathSeriesFormList?: MathSeriesFormModel[];
  valid?: boolean;
}
