"use server";

import { db } from "@/db";
import { indexer } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createPublicClient, http, parseAbiItem } from "viem";
import { monadTestnet } from "viem/chains";

const client = createPublicClient({ chain: monadTestnet, transport: http() });
const getState = async (name: string) => {
  return (
    (await db.select().from(indexer).where(eq(indexer.name, name)))[0] ?? {
      name,
      lastBlock: "22729445",
      lastBlockTimestamp: "0",
    }
  );
};

// [
//   {
//     eventName: 'Swap',
//     args: {
//       user: '0xe4C1F059Ca50A7E28Aa2f418972932ecc1aEa700',
//       amountAIn: 3000000000000000000n,
//       amountBIn: 0n,
//       amountAOut: 0n,
//       amountBOut: 5987970n
//     },
//     address: '0xe26a2b8614cfab4d4e5ed3f2f8ca56c1d896a3fd',
//     topics: [
//       '0x49926bbebe8474393f434dfa4f78694c0923efa07d19f2284518bfabd06eb737',
//       '0x000000000000000000000000e4c1f059ca50a7e28aa2f418972932ecc1aea700'
//     ],
//     data: '0x00000000000000000000000000000000000000000000000029a2241af62c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b5e82',
//     blockHash: '0x57688c81a2002fe8047e99a8a7db06091e544c148046a70e04c8ff604e15b409',
//     blockNumber: 22794429n,
//     blockTimestamp: '0x685806cf',
//     transactionHash: '0x662c59db77203db4240078a27e03907ec27e40aa611f30f70cd1104221d6bf3a',
//     transactionIndex: 42,
//     logIndex: 127,
//     removed: false
//   }
// ]

export async function syncIndexerAction() {
  const swapState = await getState("swap");
  const nowBlock = await client.getBlockNumber();

  let swapI = BigInt(swapState.lastBlock);
  while (swapI < nowBlock) {
    const [swapLogs, liquidityAddedLogs, liquidityRemovedLogs] =
      await Promise.all([
        client.getLogs({
          event: parseAbiItem(
            `event Swap(address indexed user, uint256 amountAIn, uint256 amountBIn, uint256 amountAOut, uint256 amountBOut)`
          ),
          address: process.env.NEXT_PUBLIC_SIMPLE_DEX_ADDRESS! as `0x${string}`,
          fromBlock: swapI,
          toBlock: swapI + BigInt(100),
        }),
        client.getLogs({
          event: parseAbiItem(
            `event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity)`
          ),
          address: process.env.NEXT_PUBLIC_SIMPLE_DEX_ADDRESS! as `0x${string}`,
          fromBlock: swapI,
          toBlock: swapI + BigInt(100),
        }),
        client.getLogs({
          event: parseAbiItem(
            `event LiquidityRemoved(address indexed provider, uint256 amountA,uint256 amountB,uint256 liquidity)`
          ),
          address: process.env.NEXT_PUBLIC_SIMPLE_DEX_ADDRESS! as `0x${string}`,
          fromBlock: swapI,
          toBlock: swapI + BigInt(100),
        }),
      ]);
    swapI += BigInt(100);
  }
  swapState.lastBlock = swapI.toString();
  swapState.lastBlockTimestamp = Date.now().toString();
  await db
    .insert(indexer)
    .values(swapState)
    .onConflictDoUpdate({
      target: indexer.name,
      set: {
        lastBlock: swapState.lastBlock,
        lastBlockTimestamp: swapState.lastBlockTimestamp,
      },
    });
}
