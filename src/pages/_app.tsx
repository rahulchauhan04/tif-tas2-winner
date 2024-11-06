import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import DataProvider from "../containers/home/DataProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <DataProvider> {/* Wraping the app with DataProvider  */}
        <Component {...pageProps} />
      </DataProvider>
    </ChakraProvider>
  );
}

export default MyApp;
