import {
  simpleDexAbi,
  simpleDexAddress,
} from "@/constants/contracts/simple-dex";
import { useReadContract } from "wagmi";

export function usePoolData() {
  const {
    data: poolData,
    isLoading,
    refetch,
  } = useReadContract({
    address: simpleDexAddress,
    abi: simpleDexAbi,
    functionName: "getPoolInfo",
    query: {
      refetchInterval: 15_000, // Refetch every 15 seconds
    },
  });

  const { data: price, refetch: refetchPrice } = useReadContract({
    address: simpleDexAddress,
    abi: simpleDexAbi,
    functionName: "getPrice",
    query: {
      refetchInterval: 15_000,
    },
  });

  const poolInfo = {
    reserveA: poolData?.[0] ?? BigInt(0),
    reserveB: poolData?.[1] ?? BigInt(0),
    totalLiquidity: poolData?.[2] ?? BigInt(0),
    price: poolData?.[3] ?? BigInt(0),
  };

  const currentPrice = price ?? BigInt(0);

  const refetchAll = () => {
    refetch();
    refetchPrice();
  };

  return {
    poolInfo,
    currentPrice,
    isLoading,
    refetch: refetchAll,
  };
}
