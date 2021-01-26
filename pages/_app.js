import Head from 'next/head';
import { AuthProvider } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Walkerino</title>
      </Head>

      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
