import { FC, useMemo } from 'react';

import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

//
import breakpoints from './breakpoints';
import GlobalCss from './defaultCss';
import componentsOverride from './overrides';
import palette from './palette';
import shape from './shape';
import typography from './typography';

declare module '@mui/material/styles' {
  interface TypeBackground {
    bg: string;
    transparendBg: string;
    primaryGradient: string;
    blueGradient: string;
  }
  interface PalatteOptions {
    success: string;
  }
}

// ----------------------------------------------------------------------

const ThemeConfig: FC = ({ children }) => {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      breakpoints,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalCss />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeConfig;
