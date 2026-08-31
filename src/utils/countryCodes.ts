export interface CountryDialInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  formatRegex?: RegExp;
}

export const COUNTRY_DIAL_CODES: CountryDialInfo[] = [
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', placeholder: '54 429 8306' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', placeholder: '98765 43210' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', placeholder: '50 123 4567' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', placeholder: '3312 3456' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', placeholder: '9123 4567' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', placeholder: '9123 4567' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', placeholder: '3600 1234' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', placeholder: '(555) 000-0000' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', placeholder: '7911 123456' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', placeholder: '(555) 000-0000' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', placeholder: '412 345 678' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', placeholder: '9123 4567' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', placeholder: '12-345 6789' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', placeholder: '100 123 4567' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', placeholder: '300 1234567' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', placeholder: '1712 345678' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', placeholder: '917 123 4567' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', placeholder: '151 23456789' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', placeholder: '6 12 34 56 78' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', placeholder: '312 345 6789' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', placeholder: '612 34 56 78' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', placeholder: '78 123 45 67' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', placeholder: '6 12345678' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', placeholder: '532 123 4567' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', placeholder: '7 9012 3456' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', placeholder: '90-1234-5678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', placeholder: '10-1234-5678' },
];

export function parsePhoneNumber(raw: string, defaultCountryCode: string = 'AE'): {
  country: CountryDialInfo;
  dialCode: string;
  nationalNumber: string;
  formattedDisplay: string;
} {
  const fallbackCountry = COUNTRY_DIAL_CODES.find(c => c.code === defaultCountryCode) || COUNTRY_DIAL_CODES[0];
  if (!raw) {
    return {
      country: fallbackCountry,
      dialCode: fallbackCountry.dialCode,
      nationalNumber: '',
      formattedDisplay: '',
    };
  }
  const clean = raw.trim();
  const digitsOnly = clean.replace(/[^\d+]/g, '');
  const sortedCountries = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dialCode.length - a.dialCode.length);

  for (const country of sortedCountries) {
    const codeWithPlus = country.dialCode;
    const codeDigits = country.dialCode.replace('+', '');
    if (digitsOnly.startsWith(codeWithPlus)) {
      const national = digitsOnly.slice(codeWithPlus.length);
      return {
        country,
        dialCode: country.dialCode,
        nationalNumber: national,
        formattedDisplay: `${country.flag} ${country.dialCode} ${formatDigits(national, country.code)}`,
      };
    }
    if (digitsOnly.startsWith(codeDigits) && digitsOnly.length > codeDigits.length + 5) {
      const national = digitsOnly.slice(codeDigits.length);
      return {
        country,
        dialCode: country.dialCode,
        nationalNumber: national,
        formattedDisplay: `${country.flag} ${country.dialCode} ${formatDigits(national, country.code)}`,
      };
    }
  }

  const national = digitsOnly.replace(/^\+/, '');
  return {
    country: fallbackCountry,
    dialCode: fallbackCountry.dialCode,
    nationalNumber: national,
    formattedDisplay: `${fallbackCountry.flag} ${fallbackCountry.dialCode} ${formatDigits(national, fallbackCountry.code)}`,
  };
}

function formatDigits(national: string, countryCode: string): string {
  const digits = national.replace(/\D/g, '');
  if (!digits) return '';
  if (countryCode === 'AE' && digits.length >= 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (countryCode === 'IN' && digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function formatFullPhone(dialCode: string, nationalNumber: string): string {
  const cleanDigits = nationalNumber.replace(/\D/g, '');
  const prefix = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return `${prefix}${cleanDigits}`;
}
