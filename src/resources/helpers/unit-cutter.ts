export const formatNumber = (price: number) => {
  const numberStr = price.toString();
  const parts = numberStr.split('.');

  if (parts[0] !== '0' && parts[0] !== '0.') {
    if (parts[1]) {
      const decimalPart = parts[1].replace(/(.*[1-9]).*/, '$1').substring(0, 2);
      return parseFloat(parts[0] + '.' + (decimalPart.length === 1 ? decimalPart + '0' : decimalPart));
    } else {
      return parseFloat(parts[0]!);
    }
  } else {
    const nonzeroIndex = parts[1]!.split('').findIndex(digit => digit !== '0');
    if (nonzeroIndex !== -1) {
      return parseFloat('0.' + parts[1]!.substring(0, 2)) === 0 ? price : parseFloat('0.' + parts[1]!.substring(0, 2));
    } else {
      return price;
    }
  }
};
