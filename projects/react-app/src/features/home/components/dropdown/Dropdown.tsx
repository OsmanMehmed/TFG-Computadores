/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { Button, Menu, Theme, ThemeProvider } from "@mui/material";
import { Palette } from "../../../shared/utils/palette";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./dropdown.css";

const theme: Theme = Palette.getPalette();

interface Props {
  options: string[];
  onSelection: (optionSelected: string) => void;
  disabled: boolean;
  buttonContent: string;
  width?: number;
}

const DropDown = React.memo((props: Props): JSX.Element => {
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

  function selectItem(optionSelected: string): void {
    props.onSelection(optionSelected);
    setAnchorEl(null);
  }

  function menuItems(): JSX.Element[] {
    return props.options.map((option: string, index): JSX.Element => {
      return (
        <MenuItem
          className="menu-item"
          sx={!!props?.width ? { width: props.width } : null}
          onClick={() => selectItem(option)}
          key={`${option}${index}`}
        >
          {option}
        </MenuItem>
      );
    });
  }

  return (
    <div className="main-container">
      <ThemeProvider theme={theme}>
        <Button
          onClick={handleOpenDropdown}
          className="button"
          sx={!!props?.width ? { width: props.width } : null}
          variant="contained"
          disabled={props.disabled}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {props.buttonContent}
        </Button>
      </ThemeProvider>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="menu"
      >
        {menuItems()}
      </Menu>
    </div>
  );
});

export default DropDown;
