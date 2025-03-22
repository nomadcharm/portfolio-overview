export const setToFixed = (data: string | number, fixedNum: number): number => {
  if (typeof data === "string") {
    data = parseFloat(data);
  }

  return Number(data.toFixed(fixedNum));
};