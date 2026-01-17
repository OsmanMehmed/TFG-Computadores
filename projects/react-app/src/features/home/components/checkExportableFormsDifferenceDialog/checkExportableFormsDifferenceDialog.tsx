import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import './checkExportableFormsDifferenceDialog.css'
import { Fragment } from 'react'
import { Constants } from '../../../shared/utils/constants'
import { ExportWhich } from '../../models/modalModels'
import React from 'react'

interface Props {
  open: boolean;
  onDecisionMade: (exportTypeSelected: ExportWhich) => void;
}

const CheckExportableFormsDifferenceDialog = React.memo((props: Props): JSX.Element => {
  function handleDecideOption(exportWhich: ExportWhich): void {
    props.onDecisionMade(exportWhich)
  }

  return (
    <Fragment>
      <Dialog className="export-dialog__main" open={props.open} onClose={() => handleDecideOption(ExportWhich.Cancel)}>
        <DialogTitle className="export-dialog__title">{Constants.ExportDialogTitle}</DialogTitle>
        <DialogContent className="export-dialog__content">
          <DialogContentText className="export-dialog__content-text">{Constants.ExportDialogBody}</DialogContentText>
        </DialogContent>
        <DialogActions className="export-dialog__actions">
          <Stack direction="row" sx={{mb: '10px'}} spacing={8}>
            <div className="export-dialog__export-buttons">
              <Button variant="contained" onClick={() => handleDecideOption(ExportWhich.TakeConfigForm)}>
                {Constants.ExportDialogExportOnlyConfig}
              </Button>
            </div>
            <div className="export-dialog__export-buttons">
              <Button variant="contained" onClick={() => handleDecideOption(ExportWhich.TakeResultsForm)}>
                {Constants.ExportDialogExportCalculatedFunctionData}
              </Button>
            </div>
          </Stack>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
})

export default CheckExportableFormsDifferenceDialog
