import { Box, IconButton, Menu, Theme, ThemeProvider } from "@mui/material";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import "./infoPopUp.css";
import { Palette } from "../../../shared/utils/palette";
import { Constants } from "../../../shared/utils/constants";

const theme: Theme = Palette.getPalette();

const InfoPopUp = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleOpenDropdown(
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  return (
    <div className="main-container">
      <ThemeProvider theme={theme}>
        <IconButton onClick={handleOpenDropdown} color="primary">
          <InfoIcon></InfoIcon>
        </IconButton>
      </ThemeProvider>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ minHeight: "400px", maxWidth: "500px", top: "-5px" }}
        className="menu"
        transformOrigin={{
          vertical: "top",
          horizontal: "right", // establecer en 'right'
        }}
      >
        <Box className="info-container">
          <h3 className="title">Relevant Information</h3>
          <ul className="body">
            <li className="body-element">
              Graph dimensions can be changed by dragging each border, or
              corner.
            </li>
            <li className="body-element--list">
              Reserved words that can be applied to math functions:
            </li>
            <ul className="list-horizontal">
              <li className="list-horizontal-element">
                {Constants.GeneralFunctionReservedWords.join(", ")}
              </li>
            </ul>
            <li className="body-element">
              To refresh and calculate function parameters, press the button at
              the right of each function.
            </li>
            <li className="body-element">
              To export or apply function, the form have to be filled and clean
              of errors.
            </li>
            <li className="body-element">
              Max elements per math sucesion is set to 1000.
            </li>
            <li className="body-element">
              VAR(integer value) variable names are reserved for the app.
            </li>
            <li className="body-element">
              Numbers in variables are not permitted.
            </li>
            <li className="body-element">
              Each variable must have the same length.
            </li>
            <li className="body-element">
              Representation of complex numbers is not contemplated.
            </li>
          </ul>
        </Box>
      </Menu>
    </div>
  );
};

export default InfoPopUp;
