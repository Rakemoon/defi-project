import {
  simpleDexAddress,
} from "@/constants/contracts/simple-dex";
import {  useQuery } from "@tanstack/react-query";
import { parseAbiItem } from "viem";
import { useBlockNumber, usePublicClient } from "wagmi";

export function useLogs(blockRange: bigint) {
  const { data: currentBlockNumber } = useBlockNumber();
  const client = usePublicClient();

  const fetchLogs = (from: bigint, to: bigint) => {
    if (!client || !currentBlockNumber) return;
    return client?.getLogs({
      address: simpleDexAddress,
      event: parseAbiItem(
        `event Swap(address indexed user, uint256 amountAIn, uint256 amountBIn, uint256 amountAOut, uint256 amountBOut)`
      ),
      fromBlock: from,
      toBlock: to,
    });
  };

  const data = useQuery({
    queryKey: ["logs", blockRange.toString(), currentBlockNumber?.toString()],
    queryFn: async () => {
      if (!currentBlockNumber) return null as never;
      const promises = [];
      for (
        let i = currentBlockNumber - blockRange;
        i < currentBlockNumber;
        i += BigInt(100)
      ) {
        const from = i;
        const to = i + BigInt(100);
        promises.push(fetchLogs(from, to));
      }

      return (await Promise.all(promises)).flat();
    },
    enabled: Boolean(currentBlockNumber),
  });

  console.log(data.data);
}
