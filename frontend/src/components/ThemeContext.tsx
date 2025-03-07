import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Class that wraps the main app in order to dynamically update dark mode settings

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("darkMode");
      setIsDarkMode(storedTheme === "true");
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      AsyncStorage.setItem("darkMode", newTheme.toString());
      console.log("newTheme " + newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// import in classes in order to determine styling for dark mode
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
