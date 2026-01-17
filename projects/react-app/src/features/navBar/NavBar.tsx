/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PolyGraphIcon from "../../../resources/images/PolyGraphIconInverted.svg";
import { Constants } from "../shared/utils/constants";
import "./navBar.css";

function ResponsiveAppBar(): React.ReactElement {
  return (
    <AppBar position="sticky" className="app-bar">
      <Container className="toolbar-container">
        <Toolbar disableGutters className="toolbar">
          <img src={PolyGraphIcon} className="PolyGraphIcon" />
          <Typography variant="h6" component="a" className="title-text">
            {Constants.NavBarTitle}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
