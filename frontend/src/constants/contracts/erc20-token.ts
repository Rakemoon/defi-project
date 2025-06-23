export const campBalanceOpt = {
  address: "0x0902d7D6CcF82b4900161C046Ea0f059806E05F1",
  name: "Zuz Coin",
  symbol: "ZUZ",
  logo: "📖",
  decimals: 18,
} as const;

export const usdcBalanceOpt = {
  address: "0x4c23aDbA6Db5d67FECe4B70C043FDA0f07187F59",
  name: "USD Coin",
  symbol: "USDC",
  logo: "💲",
  decimals: 6,
} as const;

export const TOKEN = {
    CAMP: campBalanceOpt,
    USDC: usdcBalanceOpt
}