function sqrt(x: bigint) {
  if (x == 0n) return 0n;
  let z = (x + 1n) / 2n; // 3
  let y = x; // 5
  while (Number(z) < Number(y)) {
    y = z; // 3
    z = (x / z + z) / 2n;
  }
  return y;
}

console.log(sqrt(5n));
