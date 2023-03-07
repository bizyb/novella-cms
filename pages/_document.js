import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import {strings} from "../src/strings";

export default function Document() {
  const title = strings.projectName
  const description = strings.description
  const siteImage = ''
  const url = 'https://bizu.work'
      return (
      <Html lang="en">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/favicon.ico" />
          <link rel='shortcut icon' href='/favicon/favicon.ico' />
          {/*<link rel="manifest" href="/manifest.json" />*/}

          <meta name="description" content={description}/>

          {/*<!-- Google / Search Engine Tags -->*/}
          <meta itemProp="name" content={title}/>
          <meta itemProp="description" content={description}/>
          <meta itemProp="image" content={siteImage}/>

          {/*<!-- Facebook Meta Tags -->*/}
          <meta property="og:title" content={title}/>
          <meta property="og:description" content={description}/>
          <meta property="og:image" content={siteImage}/>
          <meta property="og:url" content={url}/>
          <meta property="og:type" content="website"/>

          {/*<!-- Twitter Meta Tags -->*/}
          <meta name="twitter:title" content={title}/>
          <meta name="twitter:description" content={description}/>
          <meta name="twitter:image" content={siteImage}/>
          <meta name="twitter:card" content="summary_large_image"/>
          
          <meta name="theme-color" content="#fff" />
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="mobile-web-app-capable" content="yes"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />

          <link rel="manifest" href="/favicon/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#da532c" />

          <Script src="/assets/js/tinymce/tinymce.min.js"/>

          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
}

