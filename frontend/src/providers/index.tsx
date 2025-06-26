"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { monadTestnet, anvil } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const wagmiConfig = getDefaultConfig({
  appName: "Simple Defi",
  projectId: "383bde0d30cde408c7f223876495f1b1",
  chains: [monadTestnet, anvil],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
