import { useState, useEffect, useRef } from 'react'
import { Constants } from '../../shared/utils/constants'
import MathSeriesFormModel from '../models/mathSeriesFormModel'

type UseMathSeriesFormProps = {
  isModeProgression: boolean;
  onFormChange: (form: MathSeriesFormModel) => void;
};

type UseMathSeriesFormOutput = {
  differenceBetweenNValues: number | undefined;
  initialNValue: number | undefined;
  lastPossibleNValue: number | undefined;
  functionValue: string | undefined;
  setDifferenceBetweenNValues: (value: number | undefined) => void;
  setInitialNValue: (value: number | undefined) => void;
  setLastPossibleNValue: (value: number | undefined) => void;
  setFunctionValue: (value: string | undefined) => void;
  differenceBetweenNValuesRef: React.MutableRefObject<HTMLInputElement | null>;
  initialNValueRef: React.MutableRefObject<HTMLInputElement | null>;
  lastPossibleNValueRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const useMathSeriesForm = (props: UseMathSeriesFormProps): UseMathSeriesFormOutput => {
  const [differenceBetweenNValues, setDifferenceBetweenNValues] = useState<number>()
  const [initialNValue, setInitialNValue] = useState<number>()
  const [lastPossibleNValue, setLastPossibleNValue] = useState<number>()
  const [functionValue, setFunctionValue] = useState<string>('')
  const differenceBetweenNValuesRef = useRef<HTMLInputElement | null>(null)
  const lastPossibleNValueRef = useRef<HTMLInputElement | null>(null)
  const initialNValueRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDifferenceBetweenNValues(undefined)
    setInitialNValue(undefined)
    setLastPossibleNValue(undefined)
    setFunctionValue(undefined)

    return () => {
      if (differenceBetweenNValuesRef?.current) {
        differenceBetweenNValuesRef.current.value = ''
      }

      if (lastPossibleNValueRef?.current) {
        lastPossibleNValueRef.current.value = ''
      }

      if (initialNValueRef?.current) {
        initialNValueRef.current.value = ''
      }
    }
  }, [props.isModeProgression])

  useEffect(() => {
    const tmpMathSeriesModel: MathSeriesFormModel = getActualFormValue()

    if (isMathSeriesFormValid(tmpMathSeriesModel)) {
      props.onFormChange(tmpMathSeriesModel)
    }
  }, [differenceBetweenNValues, initialNValue, lastPossibleNValue, functionValue])

  function getActualFormValue(): MathSeriesFormModel {
    const tmpMathSeriesModel: MathSeriesFormModel = {
      seriesFunction: functionValue,
      isArithmeticProgression: props.isModeProgression,
      finalNValue: lastPossibleNValue,
      initialNValue: initialNValue,
      difference: differenceBetweenNValues,
      seriesVarName: `${Constants.VAR}${0}`,
    }

    return tmpMathSeriesModel
  }

  function isMathSeriesFormValid(form: MathSeriesFormModel): boolean {
    if (form.isArithmeticProgression) {
      if ((!!form?.finalNValue || form?.finalNValue === 0) && (!!form?.initialNValue || form?.initialNValue === 0) && !!form?.difference) {
        return true
      } else {
        return false
      }
    } else {
      if ((!!form?.finalNValue || form?.finalNValue === 0) && (!!form?.initialNValue || form?.initialNValue === 0) && !!form?.seriesFunction) {
        return true
      } else {
        return false
      }
    }
  }

  return {
    differenceBetweenNValues,
    initialNValue,
    lastPossibleNValue,
    functionValue,
    setDifferenceBetweenNValues,
    setInitialNValue,
    setLastPossibleNValue,
    setFunctionValue,
    differenceBetweenNValuesRef,
    initialNValueRef,
    lastPossibleNValueRef,
  }
}
