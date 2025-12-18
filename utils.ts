/**
 * Formats a number to look like the game's scientific notation.
 * Mimics the style: e1.28e990 or 1.28e6
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) {
    // If it's effectively an integer, return it as such
    if (Math.abs(num - Math.round(num)) < 0.001) {
       return Math.round(num).toString();
    }
    // Otherwise show 2 decimal places for multipliers/small amounts
    return num.toFixed(2);
  }
  
  if (num < 1000000) return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  
  const exponent = Math.floor(Math.log10(num));
  const mantissa = num / Math.pow(10, exponent);
  
  return `${mantissa.toFixed(2)}e${exponent}`;
};

export const formatCurrency = (num: number, type: 'FISH' | 'PRESTIGE' | 'MAGMATIC') => {
  return formatNumber(num);
};