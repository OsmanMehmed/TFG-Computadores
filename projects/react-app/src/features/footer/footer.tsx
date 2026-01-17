/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import './footer.css'

function ResponsiveFooterBar(): React.ReactElement {
  return (
    <AppBar className="footer__app-bar">
      <Container className="footer__toolbar-container">
        <Toolbar disableGutters className="footer__toolbar">
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveFooterBar