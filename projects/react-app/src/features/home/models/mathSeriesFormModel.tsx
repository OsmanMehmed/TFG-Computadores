export default interface MathSeriesFormModel {
  seriesFunction: string;
  initialNValue: number;
  finalNValue: number;
  isArithmeticProgression: boolean;
  difference: number;
  seriesVarName: string;
  valid?: boolean;
}
