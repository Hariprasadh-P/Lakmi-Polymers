const units = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
  'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
  'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
];

const tens = [
  '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += units[Math.floor(n / 100)] + ' HUNDRED ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += units[n] + ' ';
  }
  return str.trim();
}

/**
 * Converts a number to Indian Currency Words format (Lakhs, Crores)
 * e.g., 159300 -> "ONE LAKH FIFTY NINE THOUSAND THREE HUNDRED RUPEES ONLY"
 */
export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return 'ZERO RUPEES ONLY';
  }

  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const parts = rounded.toString().split('.');
  let num = parseInt(parts[0], 10);
  const paise = parts.length > 1 ? parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10) : 0;

  if (num === 0 && paise === 0) {
    return 'ZERO RUPEES ONLY';
  }

  let words = '';

  // Crores
  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    words += convertBelowThousand(crore) + ' CRORE ';
    num %= 10000000;
  }

  // Lakhs
  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    words += convertBelowThousand(lakh) + ' LAKH ';
    num %= 100000;
  }

  // Thousands
  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    words += convertBelowThousand(thousand) + ' THOUSAND ';
    num %= 1000;
  }

  // Hundreds & Below
  if (num > 0) {
    words += convertBelowThousand(num) + ' ';
  }

  words = words.trim();

  let result = '';
  if (words) {
    result += words + ' RUPEES';
  }

  if (paise > 0) {
    const paiseWords = convertBelowThousand(paise);
    if (result) {
      result += ' AND ' + paiseWords + ' PAISE';
    } else {
      result += paiseWords + ' PAISE';
    }
  }

  return (result + ' ONLY').replace(/\s+/g, ' ').trim();
}

/**
 * Formats a number in Indian comma format (e.g. 135000 -> "1,35,000")
 */
export function formatIndianCurrency(amount: number | string, forceDecimals = false): string {
  if (amount === '' || amount === null || amount === undefined) return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';

  const hasDecimals = num % 1 !== 0 || forceDecimals;
  const fixed = hasDecimals ? num.toFixed(2) : Math.round(num).toString();
  const [intPart, decPart] = fixed.split('.');

  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return decPart ? `${formattedInt}.${decPart}` : formattedInt;
}
