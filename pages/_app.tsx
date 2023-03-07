import type { AppProps } from "next/app";
import Head from 'next/head';
import React, {FC, ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../src/style/style.css"
import "../src/style/tiny-mce-editor.css"
import 'react-toastify/dist/ReactToastify.css';

import {strings} from "@/strings";
import Header from "@/components/header";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};


interface DefaultAppProps extends AppProps {
  Component: NextPageWithLayout;
  isHomePage?: boolean
}

const App: FC<DefaultAppProps> = (props) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const [, setIsProgress] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const start = () => {
      setIsProgress(true);
    };
    const stop = () => {
      setIsProgress(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", stop);
    router.events.on("routeChangeError", stop);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", stop);
      router.events.off("routeChangeError", stop);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>{strings.projectName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <>
        <Header/>
        {getLayout(<Component {...pageProps} />)}
      </>
    </>
  );
}

export default App


