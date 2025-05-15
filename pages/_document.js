import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PJRMHNSR');`,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
            rel="stylesheet"
          />

          <link rel="preload" as="video" href="/video/bgVideo.webm" type="video/webm" />
          <link rel="preload" as="video" href="/video/tokenAnimation.webm" type="video/webm" />

          <meta name="name" content="VideoNation - Create cinematic videos using AI" />
          <meta name="description" content="VideoNation - Create cinematic videos using AI across multiple categories - realistic, anime, cartoon, ghibli, etc and multiple industry use cases." />
          {<meta
            name='image'
            content='http://localhost:3000/images/logo.svg'
          />}
          <meta property="og:url" content={process.env.NEXT_PUBLIC_WEB_URL} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="VideoNation - Create cinematic videos using AI" />
          <meta property="og:description" content="VideoNation - Create cinematic videos using AI across multiple categories - realistic, anime, cartoon, ghibli, etc and multiple industry use cases." />
          {<meta
            property='og:image'
            content='http://localhost:3000/images/logo.svg'
          />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="VideoNation - Create cinematic videos using AI" />
          <meta name="twitter:description" content="VideoNation - Create cinematic videos using AI across multiple categories - realistic, anime, cartoon, ghibli, etc and multiple industry use cases." />
          {<meta
            name='twitter:image'
            content='http://localhost:3000/images/logo.svg'
          />}
        </Head>
        <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PJRMHNSR"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
