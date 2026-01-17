/* eslint-disable no-extra-boolean-cast */
import { Alert, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, Snackbar } from '@mui/material'
import { Fragment, useState, useEffect } from 'react'
import { Constants } from '../../../shared/utils/constants'
import MathSeriesFormModel from '../../models/mathSeriesFormModel'
import Stack from '@mui/material/Stack'
import './mathSeriesForm.css'
import React from 'react'
import { cutIfLongName, getFunctionParameters } from '../../../shared/utils/functions'
import { useMathSeriesForm } from '../../hooks/useMathSeriesForm'
import MathSeriesFormPropsModel from '../../models/mathSeriesFormPropsModel'
import { useForm } from 'react-hook-form'
import * as math from 'mathjs'

type MathSeriesFormModelKey = keyof MathSeriesFormModel;

const MathSeriesForm = React.memo((props: MathSeriesFormPropsModel): React.ReactElement => {
  const handleFormChange = (form: MathSeriesFormModel): void => {
    props.onFormChange({ ...form })
  }

  const [successionExpressionPlaceholder] = useState<string>(Constants.MathSeriesPlaceHolderList[Math.floor(Math.random() * Constants.MathSeriesPlaceHolderList.length)])

  const [isMaxElementsSuccessionSnackBarActive, setIsMaxElementsSuccessionSnackBarActive] = useState<boolean>(false)

  useEffect(() => {
    clearErrors()
  }, [props.isModeProgression])

  const {
    register,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm()

  const {
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
  } = useMathSeriesForm({
    isModeProgression: props.isModeProgression,
    onFormChange: handleFormChange,
    mathSeriesFormIdentifier: props.mathSeriesFormIdentifier,
    mathSeriesFormLoaded: props.mathSeriesFormLoaded,
  })

  function handleInputChange(value: string, fieldToUpdate: MathSeriesFormModelKey): void {
    switch (fieldToUpdate) {
      case 'finalNValue':
        if (!!value) {
          setLastPossibleNValue(parseFloat(value))
        } else {
          setLastPossibleNValue(undefined)
        }
        break
      case 'initialNValue':
        if (!!value) {
          setInitialNValue(parseFloat(value))
        } else {
          setInitialNValue(undefined)
        }
        break
      case 'difference':
        if (!!value) {
          setDifferenceBetweenNValues(parseFloat(value))
        } else {
          setDifferenceBetweenNValues(undefined)
        }
        break
      case 'seriesFunction':
        if (!!value) {
          setFunctionValue(value)
        } else {
          setFunctionValue(undefined)
        }
        break
      default:
        break
    }
  }

  function handleInputNChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.value) {
      setError('lastPossibleNValue', { type: 'required', message: `${Constants.Required}` })
      handleInputChange(undefined, 'finalNValue')
    } else if (
      (!props.isModeProgression ? !/^[-]?\d+$/.test(event.target.value) : !/^[1-9]\d*$/.test(event.target.value)) ||
      parseFloat(event.target.value) !== parseInt(event.target.value)
    ) {
      if (props.isModeProgression) {
        setError('lastPossibleNValue', { type: 'onlyNatural', message: `${Constants.OnlyNatural}` })
      } else {
        setError('lastPossibleNValue', { type: 'onlyIntegers', message: `${Constants.OnlyIntegers}` })
      }
      
      handleInputChange(undefined, 'finalNValue')
    } else if (parseFloat(event.target.value) <= initialNValue) {
      setError('lastPossibleNValue', {
        type: 'mustBeGreaterThanInitial',
        message: `${props.isModeProgression ? Constants.GreaterThanFinalProgression : Constants.GreaterThanFinal}`,
      })
      handleInputChange(undefined, 'finalNValue')
    } else if (!props.isModeProgression ? parseFloat(event.target.value) - initialNValue > 1000 : parseFloat(event.target.value) > 1000) {
      setIsMaxElementsSuccessionSnackBarActive(true)
      setError('lastPossibleNValue', { type: 'maxElementLength', message: `${Constants.MaxElementLength}` })
      handleInputChange(undefined, 'finalNValue')
    } else {
      clearErrors('lastPossibleNValue')
      handleInputChange(event.target.value, 'finalNValue')
    }
  }

  function handleInputinitialNChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.value) {
      setError('initialNValue', { type: 'required', message: `${Constants.Required}` })
      handleInputChange(undefined, 'initialNValue')
    } else if (props.isModeProgression ? !/^[-]?\d+(\.\d+)?$/.test(event.target.value) : !/^[-]?\d+$/.test(event.target.value) || parseFloat(event.target.value) !== parseInt(event.target.value)) {
      if (props.isModeProgression) {
        setError('initialNValue', { type: 'onlyNumbers', message: `${Constants.OnlyNumbers}` })
      } else {
        setError('initialNValue', { type: 'onlyIntegers', message: `${Constants.OnlyIntegers}` })
      }
      handleInputChange(undefined, 'initialNValue')
    } else if (parseFloat(event.target.value) >= lastPossibleNValue) {
      setError('initialNValue', { type: 'mustBeLessThanFinal', message: `${Constants.LessThanInitial}` })
      handleInputChange(undefined, 'initialNValue')
    } else if (!props.isModeProgression ? lastPossibleNValue - parseFloat(event.target.value) > 1000 : false) {
      setIsMaxElementsSuccessionSnackBarActive(true)
      setError('initialNValue', { type: 'maxElementLength', message: `${Constants.MaxElementLength}` })
      handleInputChange(undefined, 'initialNValue')
    } else {
      clearErrors('initialNValue')
      handleInputChange(event.target.value, 'initialNValue')
    }
  }

  function handleInputDifferenceBetweenNValuesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.value) {
      setError('differenceBetweenNValues', { type: 'required', message: `${Constants.Required}` })
      handleInputChange(undefined, 'difference')
    } else if (!/^[-]?\d+(\.\d+)?$/.test(event.target.value)) {
      setError('differenceBetweenNValues', { type: 'onlyNumbers', message: `${Constants.OnlyNumbers}` })
      handleInputChange(undefined, 'difference')
    } else {
      clearErrors('differenceBetweenNValues')
      handleInputChange(event.target.value, 'difference')
    }
  }

  function handleInputFunctionChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.value) {
      setError('seriesFunction', { type: 'required', message: `${Constants.Required}` })
      handleInputChange(undefined, 'seriesFunction')
    } else if (Object.entries(getFunctionParameters([event.target.value], [], [], {}, Constants.SuccessionFunctionReservedWords)).length > 0) {
      setError('seriesFunction', { type: 'onlyReservedWords', message: `${Constants.SuccessionFormulaErrorOnlyReservedWords}` })
      handleInputChange(undefined, 'seriesFunction')
    } else if (event.target.value.includes('N') || !/^(?!.*n\s+n)(?!.*n{2,}).*$/.test(event.target.value)) {
      setError('seriesFunction', { type: 'badExpression', message: `${Constants.FormulaErrorExpression}` })
      handleInputChange(undefined, 'seriesFunction')
    } else {
      try {
        const tmpCompileFunctionObject: {
          [key: string]: number;
        } = {}

        tmpCompileFunctionObject['n'] = 1
        const expressionToTry = event.target.value.replaceAll('n', '1')
        math.parse(expressionToTry)
        const mathFunctionCompiled = math.compile(event.target.value)
        mathFunctionCompiled.evaluate(tmpCompileFunctionObject)

        clearErrors('seriesFunction')
        handleInputChange(event.target.value, 'seriesFunction')
      } catch (error) {
        setError('seriesFunction', { type: 'badExpression', message: `${Constants.FormulaErrorExpression}` })

        handleInputChange(undefined, 'seriesFunction')
      }
    }
  }

  function maxElementsSuccessionSnackBarClosed(): void {
    setIsMaxElementsSuccessionSnackBarActive(false)
  }

  return (
    <Fragment>
      <Stack direction="row" className="form-series">
        <FormControl error={errors.seriesFunction ? true : false} className="input-series-function">
          <InputLabel>{`${Constants.NBS}${Constants.MathSeries}`}</InputLabel>
          {!props.isModeProgression && (
            <OutlinedInput
              {...register('seriesFunction')}
              className="input-series-function text-function"
              placeholder={`${successionExpressionPlaceholder}${Constants.treeDots}`}
              value={functionValue}
              onChange={handleInputFunctionChange}
              startAdornment={
                <InputAdornment position="start">
                  <div className="function-start input-adornments">
                    <span>
                      {props.mathSeriesFormIdentifier}
                      <sub>{Constants.N}</sub>
                    </span>
                    <span>{`${Constants.BlankSpace}${Constants.Equals}`}</span>
                  </div>
                </InputAdornment>
              }
              label={Constants.MathSeries}
            />
          )}
          {!!props.isModeProgression && (
            <OutlinedInput
              className="input-series-function text-function"
              readOnly={true}
              startAdornment={
                <InputAdornment position="start">
                  <div className="function-start input-adornments">
                    <span>
                      {props.mathSeriesFormIdentifier}
                      <sub>{Constants.N}</sub>
                    </span>
                    <span>{`${Constants.Equals}`}</span>
                    {(!!initialNValue || initialNValue >= 0) && <span>{`${Constants.BlankSpace}${cutIfLongName(`${initialNValue}`, Constants.cutParamNameIfGreatherThan)}`}</span>}
                    {!initialNValue && initialNValue !== 0 && (
                      <span>
                        {`${Constants.BlankSpace}${props.mathSeriesFormIdentifier}`}
                        <sub>{Constants.ONE}</sub>
                      </span>
                    )}
                    <span>
                      {`${Constants.Plus}${Constants.ParenthesesOpen}${Constants.N}${Constants.Minus}${Constants.ONE}${Constants.ParenthesesClose}${Constants.Multiplication}`}
                    </span>
                    {(!!differenceBetweenNValues || differenceBetweenNValues >= 0) && (
                      <span>{cutIfLongName(`${differenceBetweenNValues}`, Constants.cutParamNameIfGreatherThan)}</span>
                    )}
                    {!differenceBetweenNValues && differenceBetweenNValues !== 0 && <span>{Constants.DIFF}</span>}
                  </div>
                </InputAdornment>
              }
              label={Constants.MathSeries}
            />
          )}

          {errors.seriesFunction?.message && (
            <FormHelperText error variant="standard">
              {`${errors.seriesFunction?.message}`}
            </FormHelperText>
          )}
        </FormControl>

        <Stack direction="column" spacing={1}>
          <FormControl error={errors.lastPossibleNValue ? true : false} className="succesion-config-control">
            {!!errors.lastPossibleNValue?.message ? (
              <InputLabel>{`${Constants.NBS.repeat(4)}${errors.lastPossibleNValue?.message}`}</InputLabel>
            ) : (
              <InputLabel>{props.isModeProgression ? `${Constants.NBS.repeat(4)}${Constants.NumberElements}` : `${Constants.NBS.repeat(4)}${Constants.LastNValue}`}</InputLabel>
            )}
            <OutlinedInput
              label={
                errors.lastPossibleNValue?.message ? `${errors.lastPossibleNValue?.message}` : props.isModeProgression ? `${Constants.NumberElements}` : `${Constants.LastNValue}`
              }
              {...register('lastPossibleNValue')}
              inputRef={lastPossibleNValueRef}
              placeholder={`${Constants.NINE.repeat(2)}${Constants.treeDots}`}
              className="succession-config-input"
              onChange={handleInputNChange}
              type="text"
              startAdornment={
                <InputAdornment position="start">
                  <div className="input-adornments">
                    <span>{Constants.N_UPPER}</span>
                    <span>{`${Constants.NBS}${Constants.Equals}`}</span>
                  </div>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl error={errors.initialNValue ? true : false} className="succesion-config-control">
            {errors.initialNValue?.message ? (
              <InputLabel>{`${Constants.NBS.repeat(4)}${errors.initialNValue?.message}`}</InputLabel>
            ) : (
              <InputLabel>{props.isModeProgression ? `${Constants.NBS.repeat(4)}${Constants.FirstValue}` : `${Constants.NBS.repeat(4)}${Constants.FirstnValue}`}</InputLabel>
            )}
            <OutlinedInput
              label={errors.initialNValue?.message ? `${errors.initialNValue?.message}` : props.isModeProgression ? `${Constants.FirstValue}` : `${Constants.FirstnValue}`}
              {...register('initialNValue')}
              inputRef={initialNValueRef}
              placeholder={`${Constants.Zero}${Constants.treeDots}`}
              className="succession-config-input"
              onChange={handleInputinitialNChange}
              type="text"
              startAdornment={
                <InputAdornment position="start">
                  <div className="input-adornments">
                    {!!props.isModeProgression && (
                      <span>
                        {props.mathSeriesFormIdentifier}
                        <sub>{Constants.ONE}</sub>
                      </span>
                    )}
                    {!props.isModeProgression && <span>{Constants.N}</span>}
                    <span>{`${Constants.NBS}${Constants.Equals}`}</span>
                  </div>
                </InputAdornment>
              }
            />
          </FormControl>

          {!!props.isModeProgression && (
            <FormControl error={errors.differenceBetweenNValues ? true : false} className="succesion-config-control">
              {errors.differenceBetweenNValues?.message ? (
                <InputLabel>{`${Constants.NBS.repeat(4)}${errors.differenceBetweenNValues?.message}`}</InputLabel>
              ) : (
                <InputLabel>{props.isModeProgression ? `${Constants.NBS.repeat(4)}${Constants.ValuesDifference}` : ''}</InputLabel>
              )}
              <OutlinedInput
                label={errors.differenceBetweenNValues?.message ? `${errors.differenceBetweenNValues?.message}` : props.isModeProgression ? `${Constants.ValuesDifference}` : ''}
                {...register('differenceBetweenNValues')}
                inputRef={differenceBetweenNValuesRef}
                placeholder={`${Constants.ONE}${Constants.treeDots}`}
                className="succession-config-input"
                onChange={handleInputDifferenceBetweenNValuesChange}
                startAdornment={
                  <InputAdornment position="start">
                    <div className="input-adornments">
                      <span>{Constants.DIFF}</span>
                      <span>{`${Constants.NBS}${Constants.Equals}`}</span>
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        </Stack>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMaxElementsSuccessionSnackBarActive}
        autoHideDuration={10000}
        onClose={() => maxElementsSuccessionSnackBarClosed()}
      >
        <Alert variant="filled" severity="error" onClose={() => maxElementsSuccessionSnackBarClosed()}>
          {Constants.PleaseDontExceedMaxElementsPerSuccessionSnackBarActive}
        </Alert>
      </Snackbar>
    </Fragment>
  )
})

export default MathSeriesForm
