import MathSeriesFormModel from './mathSeriesFormModel'

export default interface UseMathSeriesFormProps {
    isModeProgression: boolean;
    onFormChange: (form: MathSeriesFormModel) => void;
    mathSeriesFormIdentifier: string;
    mathSeriesFormLoaded: MathSeriesFormModel;
}