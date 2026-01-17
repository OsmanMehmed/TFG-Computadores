import { createTheme, Theme } from '@mui/material/styles'
import { Constants } from './constants'

export class Palette {
  public static getPalette(): Theme {
    const theme = createTheme({
      palette: {
        primary: {
          main: Constants.primaryPaletteColor,
        },
      },
    })
    return theme
  }
}
