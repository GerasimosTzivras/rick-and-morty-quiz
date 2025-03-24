import React from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./shared/components/theme/theme-provider";
import Quiz from "./app/Quiz";

// Create a React Query client instance for managing data fetching, caching, and state.
const queryClient = new QueryClient();

/**
 * App component - the root component of the application.
 * It wraps the entire application in both ThemeProvider and QueryClientProvider contexts.
 *
 * @returns The application wrapped with theming and data-fetching providers.
 */
const App: React.FC = () => {
  return (
    // ThemeProvider provides the ability to toggle between themes.
    // "defaultTheme" is set to "dark" and the user's preference is stored using "ui-theme" as the key.
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      {/* QueryClientProvider provides React Query context to manage asynchronous data fetching and caching. */}
      <QueryClientProvider client={queryClient}>
        {/* The main Quiz component which holds the quiz logic and UI */}
        <Quiz />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
