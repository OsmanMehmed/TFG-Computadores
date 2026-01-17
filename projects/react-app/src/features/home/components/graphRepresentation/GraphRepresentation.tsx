/* eslint-disable no-extra-boolean-cast */
import { Fragment, useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./graphRepresentation.css";
import { Constants } from "../../../shared/utils/constants";
import { Config, Data, Layout } from "plotly.js";
import { getRandomColorHexadecimal } from "../../../shared/utils/functions";
import React from "react";

interface Props {
  dependantVariable: { name: string; values: number[][] };
  independentVariables: Record<string, string[]>;
  reDrawGraph: boolean;
  adjustingSize: boolean;
  showTraceBetweenDots: boolean;
}

const GrapRepresentation = React.memo((props: Props): JSX.Element => {
  const [
    dataDependingOfNumberOfFunctions,
    setDataDependingOfNumberOfFunctions,
  ] = useState<Data[]>([]);

  const [
    layoutDependingOfNumberOfFunctions,
    setLayoutDependingOfNumberOfFunctions,
  ] = useState<Partial<Layout>>(undefined);

  const [
    configDependingOfNumberOfFunctions,
    setConfigDependingOfNumberOfFunctions,
  ] = useState<Partial<Config>>(undefined);

  function loadPlotDataLayoutConfig(): void {
    let varNames: string[] = [];
    let varValues: number[][] = [];

    if (!!props.independentVariables) {
      varNames = Object?.entries(props.independentVariables).map(
        ([varName, varValues]) => `${varName}`,
      );
      varValues = Object.entries(props.independentVariables).map(
        ([varName, varValues]) =>
          varValues.map((stringNumber) => parseFloat(stringNumber)),
      );
    }

    setDataDependingOfNumberOfFunctions(
      props.dependantVariable.values.map(
        (dependantFunctionResults, index): Data => {
          if (varValues.length === 2) {
            return {
              type: "scatter3d",
              mode: props.showTraceBetweenDots ? "lines+markers" : "markers",
              name: `${Constants.FUNCTION}${index}`,
              x: varValues[0],
              z: props.dependantVariable.values[index],
              y: varValues[1],
              marker: {
                color:
                  index === 0
                    ? Constants.primaryPaletteColor
                    : getRandomColorHexadecimal(),
              },
            };
          } else {
            return {
              x: varValues[0],
              y: props.dependantVariable.values[index],
              name: `${Constants.FUNCTION}${index}`,
              type: "scatter",
              mode: props.showTraceBetweenDots ? "lines+markers" : "markers",
              marker: {
                color:
                  index === 0
                    ? Constants.primaryPaletteColor
                    : getRandomColorHexadecimal(),
              },
            };
          }
        },
      ),
    );

    if (varValues.length === 2) {
      setLayoutDependingOfNumberOfFunctions({
        paper_bgcolor: "#E8ECF3",
        plot_bgcolor: "#E8ECF3",
        margin: { t: 40, b: 60, l: 120, r: 80 },
        autosize: true,
        scene: {
          xaxis: { title: { text: varNames[0] } },
          yaxis: { title: { text: varNames[1] } },
          zaxis: { title: { text: props.dependantVariable.name } },
        },
      });

      setConfigDependingOfNumberOfFunctions({
        displaylogo: false,
        responsive: true,
        displayModeBar: true,
        editable: true,
      });
    } else {
      setLayoutDependingOfNumberOfFunctions({
        paper_bgcolor: "#E8ECF3",
        plot_bgcolor: "#E8ECF3",
        margin: { t: 40, b: 60, l: 120, r: 80 },
        autosize: true,
        xaxis: { title: { text: varNames[0] } },
        yaxis: { title: { text: props.dependantVariable.name } },
      });

      setConfigDependingOfNumberOfFunctions({
        displaylogo: false,
        responsive: true,
        displayModeBar: true,
        editable: true,
        modeBarButtonsToRemove: ["lasso2d", "select2d"],
      });
    }
  }

  useEffect(() => {
    loadPlotDataLayoutConfig();
  }, [props.reDrawGraph]);

  return (
    <Fragment>
      {!props.adjustingSize &&
      (!!props.independentVariables
        ? Object.entries(props.independentVariables).length < 3
        : true) ? (
        (
          !!props.independentVariables
            ? Object.entries(props.independentVariables).length === 2
            : false
        ) ? (
          <Plot
            className="plot"
            data={dataDependingOfNumberOfFunctions}
            layout={layoutDependingOfNumberOfFunctions}
            config={configDependingOfNumberOfFunctions}
          />
        ) : (
          <Plot
            className="plot"
            data={dataDependingOfNumberOfFunctions}
            layout={layoutDependingOfNumberOfFunctions}
            config={configDependingOfNumberOfFunctions}
          />
        )
      ) : (
        <Fragment>
          <div className="message__container">
            <span className="message__text">
              {props.adjustingSize
                ? Constants.AdjustingSize
                : Constants.excededDimensions}
            </span>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
});

export default GrapRepresentation;
