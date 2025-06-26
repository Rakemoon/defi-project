export const campBalanceOpt = {
  address: process.env.NEXT_PUBLIC_CAMP_ADDRESS! as `0x${string}`,
  name: "Zuz Coin",
  symbol: "ZUZ",
  logo: "📖",
  decimals: 18,
} as const;

export const usdcBalanceOpt = {
  address: process.env.NEXT_PUBLIC_USDC_ADDRESS! as `0x${string}`,
  name: "USD Coin",
  symbol: "USDC",
  logo: "💲",
  decimals: 6,
} as const;

export const TOKEN = {
  CAMP: campBalanceOpt,
  USDC: usdcBalanceOpt,
};
