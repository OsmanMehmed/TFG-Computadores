import { Dialog, DialogTitle, DialogActions, Stack, Button } from '@mui/material'
import { Fragment } from 'react'
import { Constants } from '../../../shared/utils/constants'
import './exitModeCleanFormDialog.css'
import { UserGenericModalSelection } from '../../models/modalModels'
import React from 'react'

interface Props {
    open: boolean;
    onDecisionMade: (userSelection: UserGenericModalSelection) => void;
  }
  
const ExitModeCleanFormDialog = React.memo((props: Props): JSX.Element => {  
  return (
    <Fragment>
      <Dialog sx={{bgcolor: '#1d498a1a'}} open={props.open}>
        <DialogTitle sx={{width: 370, bgcolor: '#1d498a1a', userSelect: 'none' }}>{Constants.ExitModeCleanDialogTitle}</DialogTitle>
        <DialogActions sx={{width: 400, bgcolor: '#1d498a1a'}}>
          <Stack direction="row" sx={{ mb: '5px', marginInline: '10px' }} spacing={29}>
            <div className="exitmode-cleanform-dialog__accept-button">
              <Button variant="contained" onClick={() => props.onDecisionMade(UserGenericModalSelection.Accept)}>
                {Constants.Accept}
              </Button>
            </div>
            <div className="exitmode-cleanform-dialog__cancel-button">
              <Button variant="contained" onClick={() => props.onDecisionMade(UserGenericModalSelection.Cancel)}>
                {Constants.Cancel}
              </Button>
            </div>
          </Stack>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
})
  
export default ExitModeCleanFormDialog
  