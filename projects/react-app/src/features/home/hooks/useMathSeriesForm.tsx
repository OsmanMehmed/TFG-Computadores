/* eslint-disable no-extra-boolean-cast */
import { useState, useEffect, useRef } from 'react'
import MathSeriesFormModel from '../models/mathSeriesFormModel'
import MathSeriesFormPropsModel from '../models/mathSeriesFormPropsModel'
import { isSomeImportantAtributeMathSeriesNull } from '../../shared/utils/functions'


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

export const useMathSeriesForm = (props: MathSeriesFormPropsModel): UseMathSeriesFormOutput => {
  const [differenceBetweenNValues, setDifferenceBetweenNValues] = useState<number>()
  const [initialNValue, setInitialNValue] = useState<number>()
  const [lastPossibleNValue, setLastPossibleNValue] = useState<number>()
  const [functionValue, setFunctionValue] = useState<string>('')
  const differenceBetweenNValuesRef = useRef<HTMLInputElement | null>(null)
  const lastPossibleNValueRef = useRef<HTMLInputElement | null>(null)
  const initialNValueRef = useRef<HTMLInputElement | null>(null)

  const [dontCalculateSeriesIfFormLoaded, setDontCalculateSeriesIfFormLoaded] = useState<boolean>(false)

  useEffect(() => {
    setDifferenceBetweenNValues(undefined)
    setInitialNValue(undefined)
    setLastPossibleNValue(undefined)
    setFunctionValue('')

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
    if (!!props.mathSeriesFormLoaded){
      setDifferenceBetweenNValues(props.mathSeriesFormLoaded.difference)
      setInitialNValue(props.mathSeriesFormLoaded.initialNValue)
      setLastPossibleNValue(props.mathSeriesFormLoaded.finalNValue)
      setFunctionValue(!props.isModeProgression ? props.mathSeriesFormLoaded.seriesFunction : '')

      if (!!differenceBetweenNValuesRef?.current) {
        differenceBetweenNValuesRef.current.value = `${props.mathSeriesFormLoaded.difference}`
      }

      if (!!lastPossibleNValueRef?.current) {
        lastPossibleNValueRef.current.value = `${props.mathSeriesFormLoaded.finalNValue}`
      }

      if (!!initialNValueRef?.current) {
        initialNValueRef.current.value = `${props.mathSeriesFormLoaded.initialNValue}`
      }

      setDontCalculateSeriesIfFormLoaded(true)
    }
  }, [props.mathSeriesFormLoaded])

  useEffect(() => {
    const tmpMathSeriesModel: MathSeriesFormModel = getActualFormValue()
    if (!dontCalculateSeriesIfFormLoaded) {
      if (!isSomeImportantAtributeMathSeriesNull(tmpMathSeriesModel)) {
        tmpMathSeriesModel.valid = true
        props.onFormChange(tmpMathSeriesModel)
      } else {
        tmpMathSeriesModel.valid = false
        props.onFormChange(tmpMathSeriesModel)
      }
    } else {
      setDontCalculateSeriesIfFormLoaded(false)
    }
  }, [differenceBetweenNValues, initialNValue, lastPossibleNValue, functionValue])

  function getActualFormValue(): MathSeriesFormModel {
    const tmpMathSeriesModel: MathSeriesFormModel = {
      seriesFunction: functionValue,
      isArithmeticProgression: props.isModeProgression,
      finalNValue: lastPossibleNValue,
      initialNValue: initialNValue,
      difference: differenceBetweenNValues,
      seriesVarName: props.mathSeriesFormIdentifier,
    }

    return tmpMathSeriesModel
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
