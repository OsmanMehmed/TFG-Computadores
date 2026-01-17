/* eslint-disable no-extra-boolean-cast */
import { Fragment, useState } from "react";
import "./ChooseFunctionToFillDialog.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Constants } from "../../../shared/utils/constants";
import DropDown from "../dropdown/Dropdown";
import { Input } from "@material-ui/core";
import React from "react";

interface Props {
  open: boolean;
  howManyFunctionsAdded: number;
  onDecisionMade: (functionNumberToFill: number | undefined | null) => void;
}

const ChooseFunctionToFillDialog = React.memo((props: Props): JSX.Element => {
  const [selectedFunction, setSelectedFunction] = useState<string>(undefined);

  function handleDecideOption(acceptAction: boolean): void {
    if (acceptAction) {
      const tmpSelectedFunctionNumber = !!selectedFunction
        ? parseInt(selectedFunction.substring(8))
        : undefined;
      props.onDecisionMade(tmpSelectedFunctionNumber);
    } else {
      props.onDecisionMade(null);
    }
  }

  function handleSelectedFunctionDropDown(selectedFunction: string): void {
    setSelectedFunction(selectedFunction);
  }

  return (
    <Fragment>
      <Dialog className="fill-function-dialog__main" open={props.open}>
        <DialogTitle className="fill-function-dialog__title">
          {Constants.FillFunctionDialogTitle}
        </DialogTitle>
        <DialogContent className="fill-function-dialog__content">
          <div className="fill-function-dialog__Dropdown">
            <DropDown
              disabled={false}
              buttonContent={Constants.SelectFunctionToFill}
              onSelection={handleSelectedFunctionDropDown}
              options={Array.from(
                { length: props.howManyFunctionsAdded },
                (_, index) => index,
              ).map((number) => `${Constants.FUNCTION}${number}`)}
            />
          </div>
          <div className="fill-function-dialog__selected-value">
            <Input
              disabled
              className="fill-function-dialog__selected-value-input"
              value={
                !!selectedFunction
                  ? selectedFunction.padStart(14, Constants.NBS)
                  : undefined
              }
            />
          </div>
        </DialogContent>
        <DialogActions className="fill-function-dialog__actions">
          <Stack direction="row" sx={{ mr: "30px", mb: "10px" }} spacing={34}>
            <div className="fill-function-dialog__accept-button">
              <Button
                variant="contained"
                onClick={() => handleDecideOption(true)}
              >
                {Constants.Accept}
              </Button>
            </div>
            <div className="fill-function-dialog__cancel-button">
              <Button
                variant="contained"
                onClick={() => handleDecideOption(false)}
              >
                {Constants.Cancel}
              </Button>
            </div>
          </Stack>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});

export default ChooseFunctionToFillDialog;
