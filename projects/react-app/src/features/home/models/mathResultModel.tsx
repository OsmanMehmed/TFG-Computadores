export default interface MathResultModel {
  resultValues: number[][];
  varList: Record<string, string[]>;
  paramList: Record<string, string>;
}
