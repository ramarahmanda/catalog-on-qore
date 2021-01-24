import Head from "next/head";
import '../styles/antd.less'
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css" integrity="sha512-+WF6UMXHki/uCy0vATJzyA9EmAcohIQuwpNz0qEO+5UeE5ibPejMRdFuARSrl1trs3skqie0rY/gNiolfaef5w==" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
