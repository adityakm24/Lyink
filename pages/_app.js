// pages/_app.js
import "../styles/globals.css";
import { useState, useEffect, createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from NextAuth

// Create a context for global state (if needed)
const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [globalState, setGlobalState] = useState({}); // Example global state

  useEffect(() => {
    // Initialize or fetch global state here if needed
  }, []);

  return (
    <SessionProvider session={session}>
      {" "}
      {/* Wrap the entire application in SessionProvider */}
      <GlobalContext.Provider value={{ globalState, setGlobalState }}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
