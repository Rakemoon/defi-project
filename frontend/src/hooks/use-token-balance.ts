import { campBalanceOpt, usdcBalanceOpt } from "@/constants/contracts/erc20-token";
import { simpleDexAddress } from "@/constants/contracts/simple-dex";
import { erc20Abi } from "viem";
import { useReadContract, useAccount } from "wagmi";

export const useTokenBalance = (token: {
  address: `0x${string}`;
  symbol: string;
  name: string;
}) => {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading,
    refetch,
  } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: Boolean(token) && Boolean(address),
      refetchInterval: 30_000, // Refetch every 30 seconds
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, simpleDexAddress],
    query: {
      enabled: Boolean(token) && Boolean(address),
      refetchInterval: 30_000, // Refetch every 30 seconds
    },
  });

  return {
    balance: (balance as bigint) || BigInt(0),
    allowance: (allowance as bigint) || BigInt(0),
    isLoading,
    refetch,
    refetchAllowance,
  };
};

export const useTokenBalances = () => {
  // Create individual hooks for each token
  const campBalance = useTokenBalance(campBalanceOpt);
  const usdcBalance = useTokenBalance(usdcBalanceOpt);

  const balances = {
    CAMP: campBalance.balance,
    USDC: usdcBalance.balance,
  };

  const isLoading = campBalance.isLoading || usdcBalance.isLoading;

  const refetchAll = () => {
    campBalance.refetch();
    usdcBalance.refetch();
  };

  return {
    balances,
    isLoading,
    refetchAll,
  };
};
