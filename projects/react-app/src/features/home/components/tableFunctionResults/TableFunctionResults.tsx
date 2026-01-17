import { Fragment } from 'react'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { Constants } from '../../../shared/utils/constants'
import MathResultModel from '../../models/mathResultModel'
import './tableFunctionResults.css'
import { cutIfLongName } from '../../../shared/utils/functions'
import React from 'react'

interface Props {
  input: MathResultModel;
  upperRoundingFloat: number;
}

const TableFunctionResults = React.memo((props: Props): JSX.Element => {
  return (
    <Fragment>
      <div className="function-results-table__container">
        <TableContainer>
          <Table size="small">
            <TableBody>
              {props.input.resultValues.map((functionValueList, index) => (
                <Fragment key={`${Constants.FUNCTION}${Constants.Values}${index}`}>
                  {index === 0 && (
                    <Fragment key={Constants.INDEX}>
                      <TableRow className="function-results-table__row">
                        <TableCell className="function-results-table__index-name">{`${Constants.INDEX}`}</TableCell>
                        {functionValueList.map((value, index) => (
                          <Fragment key={`${Constants.INDEX}${index}`}>
                            <TableCell className="function-results-table__index-values" align="center">
                              {index + 1}
                            </TableCell>
                          </Fragment>
                        ))}
                      </TableRow>
                    </Fragment>
                  )}

                  <TableRow key={`${Constants.FUNCTION}${Constants.Row}${index}`} className="function-results-table__row">
                    <TableCell className="function-results-table__variable-name">{`${Constants.FUNCTION}${index}`}</TableCell>
                    {functionValueList.map((value, index) => (
                      <Fragment key={`${Constants.FUNCTION}${Constants.Value}${index}`}>
                        <TableCell className="function-results-table__variable-values" align="center">
                          {Number.isInteger(value)
                            ? `${value}`.length > 8
                              ? value.toPrecision(props.upperRoundingFloat)
                              : value
                            : `${value}`.length > 8 && !(!`${value}`.includes(Constants.MathE) && `${value}`.includes(Constants.Dot))
                              ? value.toPrecision(props.upperRoundingFloat)
                              : value.toFixed(props.upperRoundingFloat)}
                        </TableCell>
                      </Fragment>
                    ))}
                  </TableRow>
                </Fragment>
              ))}

              {Object.entries(props.input.varList).map(([varName, varValues]) => (
                <Fragment key={`${Constants.VAR}${Constants.Row}${varName}`}>
                  <TableRow className="function-results-table__row">
                    <TableCell className="function-results-table__variable-name">{cutIfLongName(varName, Constants.cutTableParamNameIfGreatherThan)}</TableCell>
                    {varValues.map((value, index) => (
                      <Fragment key={`${Constants.VAR}${Constants.Value}${varName}${index}`}>
                        <TableCell className="function-results-table__variable-values" align="center">
                          {parseInt(value) === parseFloat(value)
                            ? `${parseInt(value)}`.length > 8
                              ? parseFloat(value).toPrecision(props.upperRoundingFloat)
                              : parseInt(value)
                            : `${parseFloat(value)}`.length > 8 && !(!`${parseFloat(value)}`.includes(Constants.MathE) && `${parseFloat(value)}`.includes(Constants.Dot))
                              ? parseFloat(value).toPrecision(props.upperRoundingFloat)
                              : parseFloat(value).toFixed(props.upperRoundingFloat)}
                        </TableCell>
                      </Fragment>
                    ))}
                  </TableRow>
                </Fragment>
              ))}

              {Object.entries(props.input.paramList).map(([paramName, paramValue]) => (
                <Fragment key={`${Constants.PARAM}${Constants.Row}${paramName}`}>
                  <TableRow key={paramName} className="function-results-table__param-row">
                    <TableCell className="function-results-table__variable-name">{cutIfLongName(paramName, Constants.cutTableParamNameIfGreatherThan)}</TableCell>
                    <TableCell className="function-params-table__param-value" align="center">
                      {parseInt(paramValue) === parseFloat(paramValue)
                        ? `${parseInt(paramValue)}`.length > 8
                          ? parseFloat(paramValue).toPrecision(props.upperRoundingFloat)
                          : parseInt(paramValue)
                        : `${parseFloat(paramValue)}`.length > 8 && !(!`${parseFloat(paramValue)}`.includes(Constants.MathE) && `${parseFloat(paramValue)}`.includes(Constants.Dot))
                          ? parseFloat(paramValue).toPrecision(props.upperRoundingFloat)
                          : parseFloat(paramValue).toFixed(props.upperRoundingFloat)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Fragment>
  )
})

export default TableFunctionResults
