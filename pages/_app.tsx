import '../styles/main.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import FooterMenu from '../components/FooterMenu';


const { chains, provider, webSocketProvider } = configureChains(
  [
    goerli,
    polygonMumbai,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: "IccI4wsgF0qeGPn7IkdedKP8rL6-RWZx",
    }),
    publicProvider(),
  ]
);


const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});


const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/kourin1996/playdao_mumbai_2"
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ApolloProvider client={client}>
          <main>
            <div className=' bg-base-900 min-h-screen p-6 w-full text-base-100 text-xl flex flex-row content-center justify-center h-auto'>
              <div className='flex flex-col h-auto'>
                <div className='flex flex-col items-center w-full mb-12'>
                  <ConnectButton />
                </div>
                <Head>
                  <title>playdao.ai</title>
                  <meta
                    name="description"
                    content="Generated by @rainbow-me/create-rainbowkit"
                  />
                  <link rel="icon" href="/favicon.ico" />
                </Head>
                <Component {...pageProps} />
                <FooterMenu></FooterMenu>
              </div>
            </div>
          </main>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
