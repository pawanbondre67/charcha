import React, { createContext, useContext, useEffect } from 'react';
import { lightColors, darkColors } from './Colors';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext({
  dark: false,
  Colors: lightColors,
  setScheme: (scheme: any) => {},
});

export const ThemeProvider = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const defaultTheme = {
    dark: isDarkMode,
    Colors: isDarkMode ? darkColors : lightColors,
    setScheme: (scheme: any) => setIsDarkMode(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

// Creating a hook to use the theme
export const useTheme = () => useContext(ThemeContext);
