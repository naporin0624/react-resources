export const timer = (ms: number = 1000, flag = true) => {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => (flag ? resolve(ms) : reject("aaaa")), ms);
  });
};
