/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import propaMapIcon from "../../../../../resources/images/propagamapIconInverted.png";
import { Constants } from "../../../shared/utils/constants";
import "./navBar.css";

function ResponsiveAppBar(): React.ReactElement {
  return (
    <AppBar position="static" className="main">
      <Container className="container">
        <Toolbar disableGutters className="toolbar">
          <img src={propaMapIcon} className="propaMapIcon" />
          <Typography variant="h6" component="a" className="title">
            {Constants.NavBarTitle}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
