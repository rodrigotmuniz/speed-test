export const calculateSpeed = (payloadSize: number, parallelCounter: number, end: number, startTime: number) => {
  const speed = (payloadSize * parallelCounter * 8) / ((end - startTime) / 1000)
  return Math.round(speed)
}