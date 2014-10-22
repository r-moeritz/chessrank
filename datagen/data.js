var Const = require('./constants.js');

function tc(moves, period, bonus, bonusType) {
    return {
        moves: moves,
        period: period,
        bonus: bonus || 0,
        bonusType: bonusType || Const.tcBonus.delay
    };
}

module.exports = {
    fideFederations: [
      { value: 1, region: 'Africa', name: 'Algeria' },
      { value: 2, region: 'Africa', name: 'Angola' },
      { value: 3, region: 'Africa', name: 'Botswana' },
      { value: 4, region: 'Africa', name: 'Burkina Faso' },
      { value: 5, region: 'Africa', name: 'Burundi' },
      { value: 6, region: 'Africa', name: 'Cameroon' },
      { value: 7, region: 'Africa', name: 'Central African Republic' },
      { value: 8, region: 'Africa', name: 'Comoros Islands' },
      { value: 9, region: 'Africa', name: 'Congo' },
      { value: 10, region: 'Africa', name: 'Cote d\'Ivoire' },
      { value: 11, region: 'Africa', name: 'Egypt' },
      { value: 12, region: 'Africa', name: 'Ethiopia' },
      { value: 13, region: 'Africa', name: 'Gabon' },
      { value: 14, region: 'Africa', name: 'Gambia' },
      { value: 15, region: 'Africa', name: 'Ghana' },
      { value: 16, region: 'Africa', name: 'Kenya' },
      { value: 17, region: 'Africa', name: 'Lesotho' },
      { value: 18, region: 'Africa', name: 'Libya' },
      { value: 19, region: 'Africa', name: 'Madagascar' },
      { value: 20, region: 'Africa', name: 'Malawi' },
      { value: 21, region: 'Africa', name: 'Mali' },
      { value: 22, region: 'Africa', name: 'Mauritania' },
      { value: 23, region: 'Africa', name: 'Mauritius' },
      { value: 24, region: 'Africa', name: 'Morocco' },
      { value: 25, region: 'Africa', name: 'Mozambique' },
      { value: 26, region: 'Africa', name: 'Namibia' },
      { value: 27, region: 'Africa', name: 'Nigeria' },
      { value: 28, region: 'Africa', name: 'Rwanda' },
      { value: 29, region: 'Africa', name: 'Sao Tome and Principe' },
      { value: 30, region: 'Africa', name: 'Senegal' },
      { value: 31, region: 'Africa', name: 'Seychelles' },
      { value: 32, region: 'Africa', name: 'Sierra Leone' },
      { value: 33, region: 'Africa', name: 'Somalia' },
      { value: 34, region: 'Africa', name: 'South Africa' },
      { value: 35, region: 'Africa', name: 'Sudan' },
      { value: 36, region: 'Africa', name: 'Swaziland' },
      { value: 37, region: 'Africa', name: 'Tanzania' },
      { value: 38, region: 'Africa', name: 'Togo' },
      { value: 39, region: 'Africa', name: 'Tunisia' },
      { value: 40, region: 'Africa', name: 'Uganda' },
      { value: 41, region: 'Africa', name: 'Zambia' },
      { value: 42, region: 'Africa', name: 'Zimbabwe' },
      { value: 43, region: 'Asia', name: 'Afghanistan' },
      { value: 44, region: 'Asia', name: 'Australia' },
      { value: 45, region: 'Asia', name: 'Bahrain' },
      { value: 46, region: 'Asia', name: 'Bangladesh' },
      { value: 47, region: 'Asia', name: 'Bhutan' },
      { value: 48, region: 'Asia', name: 'Brunei Darussalam' },
      { value: 49, region: 'Asia', name: 'Cambodia' },
      { value: 50, region: 'Asia', name: 'China' },
      { value: 51, region: 'Asia', name: 'Chinese Taipei' },
      { value: 52, region: 'Asia', name: 'Fiji' },
      { value: 53, region: 'Asia', name: 'Guam' },
      { value: 54, region: 'Asia', name: 'Hong Kong' },
      { value: 55, region: 'Asia', name: 'India' },
      { value: 56, region: 'Asia', name: 'Indonesia' },
      {
        value: 57,
        region: 'Asia',
        name: 'Iran'
    },
      {
        value: 58,
        region: 'Asia',
        name: 'Iraq'
    },
      {
        value: 59,
        region: 'Asia',
        name: 'Japan'
    },
      {
        value: 60,
        region: 'Asia',
        name: 'Jordan'
    },
      {
        value: 61,
        region: 'Asia',
        name: 'Kazakhstan'
    },
      {
        value: 62,
        region: 'Asia',
        name: 'Kuwait'
    },
      {
        value: 63,
        region: 'Asia',
        name: 'Kyrgyzstan'
    },
      {
        value: 64,
        region: 'Asia',
        name: 'Laos'
    },
      {
        value: 65,
        region: 'Asia',
        name: 'Lebanon'
    },
      {
        value: 66,
        region: 'Asia',
        name: 'Macau'
    },
      {
        value: 67,
        region: 'Asia',
        name: 'Malaysia'
    },
      {
        value: 68,
        region: 'Asia',
        name: 'Maldives'
    },
      {
        value: 69,
        region: 'Asia',
        name: 'Mongolia'
    },
      {
        value: 70,
        region: 'Asia',
        name: 'Myanmar'
    },
      {
        value: 71,
        region: 'Asia',
        name: 'Nepal'
    },
      {
        value: 72,
        region: 'Asia',
        name: 'New Zealand'
    },
      {
        value: 73,
        region: 'Asia',
        name: 'Oman'
    },
      {
        value: 74,
        region: 'Asia',
        name: 'Pakistan'
    },
      {
        value: 75,
        region: 'Asia',
        name: 'Palau'
    },
      {
        value: 76,
        region: 'Asia',
        name: 'Palestine'
    },
      {
        value: 77,
        region: 'Asia',
        name: 'Papua New Guinea'
    },
      {
        value: 78,
        region: 'Asia',
        name: 'Philippines'
    },
      {
        value: 79,
        region: 'Asia',
        name: 'Qatar'
    },
      {
        value: 80,
        region: 'Asia',
        name: 'Saudi Arabia'
    },
      {
        value: 81,
        region: 'Asia',
        name: 'Singapore'
    },
      {
        value: 82,
        region: 'Asia',
        name: 'Solomon Islands'
    },
      {
        value: 83,
        region: 'Asia',
        name: 'South Korea'
    },
      {
        value: 84,
        region: 'Asia',
        name: 'Sri Lanka'
    },
      {
        value: 85,
        region: 'Asia',
        name: 'Syria'
    },
      {
        value: 86,
        region: 'Asia',
        name: 'Tajikistan'
    },
      {
        value: 87,
        region: 'Asia',
        name: 'Thailand'
    },
      {
        value: 88,
        region: 'Asia',
        name: 'Timor-Leste'
    },
      {
        value: 89,
        region: 'Asia',
        name: 'Turkmenistan'
    },
      {
        value: 90,
        region: 'Asia',
        name: 'United Arab Emirates'
    },
      {
        value: 91,
        region: 'Asia',
        name: 'Uzbekistan'
    },
      {
        value: 92,
        region: 'Asia',
        name: 'Vietnam'
    },
      {
        value: 93,
        region: 'Asia',
        name: 'Yemen'
    },
      {
        value: 94,
        region: 'Europe',
        name: 'Albania'
    },
      {
        value: 95,
        region: 'Europe',
        name: 'Andorra'
    },
      {
        value: 96,
        region: 'Europe',
        name: 'Armenia'
    },
      {
        value: 97,
        region: 'Europe',
        name: 'Austria'
    },
      {
        value: 98,
        region: 'Europe',
        name: 'Azerbaijan'
    },
      {
        value: 99,
        region: 'Europe',
        name: 'Belarus'
    },
      {
        value: 100,
        region: 'Europe',
        name: 'Belgium'
    },
      {
        value: 101,
        region: 'Europe',
        name: 'Bosnia & Herzegovina'
    },
      {
        value: 102,
        region: 'Europe',
        name: 'Bulgaria'
    },
      {
        value: 103,
        region: 'Europe',
        name: 'Croatia'
    },
      {
        value: 104,
        region: 'Europe',
        name: 'Cyprus'
    },
      {
        value: 105,
        region: 'Europe',
        name: 'Czech Republic'
    },
      {
        value: 106,
        region: 'Europe',
        name: 'Denmark'
    },
      {
        value: 107,
        region: 'Europe',
        name: 'England'
    },
      {
        value: 108,
        region: 'Europe',
        name: 'Estonia'
    },
      {
        value: 109,
        region: 'Europe',
        name: 'Faroe Islands'
    },
      {
        value: 110,
        region: 'Europe',
        name: 'Finland'
    },
      {
        value: 111,
        region: 'Europe',
        name: 'France'
    },
      {
        value: 112,
        region: 'Europe',
        name: 'Georgia'
    },
      {
        value: 113,
        region: 'Europe',
        name: 'Germany'
    },
      {
        value: 114,
        region: 'Europe',
        name: 'Greece'
    },
      {
        value: 115,
        region: 'Europe',
        name: 'Guernsey'
    },
      {
        value: 116,
        region: 'Europe',
        name: 'Hungary'
    },
      {
        value: 117,
        region: 'Europe',
        name: 'Iceland'
    },
      {
        value: 118,
        region: 'Europe',
        name: 'Ireland'
    },
      {
        value: 119,
        region: 'Europe',
        name: 'Israel'
    },
      {
        value: 120,
        region: 'Europe',
        name: 'Italy'
    },
      {
        value: 121,
        region: 'Europe',
        name: 'Jersey'
    },
      {
        value: 122,
        region: 'Europe',
        name: 'Latvia'
    },
      {
        value: 123,
        region: 'Europe',
        name: 'Liechtenstein'
    },
      {
        value: 124,
        region: 'Europe',
        name: 'Lithuania'
    },
      {
        value: 125,
        region: 'Europe',
        name: 'Luxembourg'
    },
      {
        value: 126,
        region: 'Europe',
        name: 'Macedonia'
    },
      {
        value: 127,
        region: 'Europe',
        name: 'Malta'
    },
      {
        value: 128,
        region: 'Europe',
        name: 'Moldova'
    },
      {
        value: 129,
        region: 'Europe',
        name: 'Monaco'
    },
      {
        value: 130,
        region: 'Europe',
        name: 'Montenegro'
    },
      {
        value: 131,
        region: 'Europe',
        name: 'Netherlands'
    },
      {
        value: 132,
        region: 'Europe',
        name: 'Norway'
    },
      {
        value: 133,
        region: 'Europe',
        name: 'Poland'
    },
      {
        value: 134,
        region: 'Europe',
        name: 'Portugal'
    },
      {
        value: 135,
        region: 'Europe',
        name: 'Romania'
    },
      {
        value: 136,
        region: 'Europe',
        name: 'Russia'
    },
      {
        value: 137,
        region: 'Europe',
        name: 'San Marino'
    },
      {
        value: 138,
        region: 'Europe',
        name: 'Scotland'
    },
      {
        value: 139,
        region: 'Europe',
        name: 'Serbia'
    },
      {
        value: 140,
        region: 'Europe',
        name: 'Slovakia'
    },
      {
        value: 141,
        region: 'Europe',
        name: 'Slovenia'
    },
      {
        value: 142,
        region: 'Europe',
        name: 'Spain'
    },
      {
        value: 143,
        region: 'Europe',
        name: 'Sweden'
    },
      {
        value: 144,
        region: 'Europe',
        name: 'Switzerland'
    },
      {
        value: 145,
        region: 'Europe',
        name: 'Turkey'
    },
      {
        value: 146,
        region: 'Europe',
        name: 'Ukraine'
    },
      {
        value: 147,
        region: 'Europe',
        name: 'Wales'
    },
      {
        value: 148,
        region: 'Americas',
        name: 'Argentina'
    },
      {
        value: 149,
        region: 'Americas',
        name: 'Aruba'
    },
      {
        value: 150,
        region: 'Americas',
        name: 'Bahamas'
    },
      {
        value: 151,
        region: 'Americas',
        name: 'Barbados'
    },
      {
        value: 152,
        region: 'Americas',
        name: 'Bermuda'
    },
      {
        value: 153,
        region: 'Americas',
        name: 'Bolivia'
    },
      {
        value: 154,
        region: 'Americas',
        name: 'Brazil'
    },
      {
        value: 155,
        region: 'Americas',
        name: 'British Virgin Islands'
    },
      {
        value: 156,
        region: 'Americas',
        name: 'Canada'
    },
      {
        value: 157,
        region: 'Americas',
        name: 'Chile'
    },
      {
        value: 158,
        region: 'Americas',
        name: 'Colombia'
    },
      {
        value: 159,
        region: 'Americas',
        name: 'Costa Rica'
    },
      {
        value: 160,
        region: 'Americas',
        name: 'Cuba'
    },
      {
        value: 161,
        region: 'Americas',
        name: 'Dominican Republic'
    },
      {
        value: 162,
        region: 'Americas',
        name: 'Ecuador'
    },
      {
        value: 163,
        region: 'Americas',
        name: 'El Salvador'
    },
      {
        value: 164,
        region: 'Americas',
        name: 'Guatemala'
    },
      {
        value: 165,
        region: 'Americas',
        name: 'Guyana'
    },
      {
        value: 166,
        region: 'Americas',
        name: 'Haiti'
    },
      {
        value: 167,
        region: 'Americas',
        name: 'Honduras'
    },
      {
        value: 168,
        region: 'Americas',
        name: 'Jamaica'
    },
      {
        value: 169,
        region: 'Americas',
        name: 'Mexico'
    },
      {
        value: 170,
        region: 'Americas',
        name: 'Netherlands Antilles'
    },
      {
        value: 171,
        region: 'Americas',
        name: 'Nicaragua'
    },
      {
        value: 172,
        region: 'Americas',
        name: 'Panama'
    },
      {
        value: 173,
        region: 'Americas',
        name: 'Paraguay'
    },
      {
        value: 174,
        region: 'Americas',
        name: 'Peru'
    },
      {
        value: 175,
        region: 'Americas',
        name: 'Puerto Rico'
    },
      {
        value: 176,
        region: 'Americas',
        name: 'Suriname'
    },
      {
        value: 177,
        region: 'Americas',
        name: 'Trinidad & Tobago'
    },
      {
        value: 178,
        region: 'Americas',
        name: 'United States of America'
    },
      {
        value: 179,
        region: 'Americas',
        name: 'Uruguay'
    },
      {
        value: 180,
        region: 'Americas',
        name: 'US Virgin Islands'
    },
      {
        value: 181,
        region: 'Americas',
        name: 'Venezuela'
    }],

    currencies: [
  { value: 1, code: 'AED', symbol: '\u062f.\u0625;', name: 'UAE dirham' },
  { value: 2, code: 'AFN', symbol: 'Afs', name: 'Afghan afghani' },
  { value: 3, code: 'ALL', symbol: 'L', name: 'Albanian lek' },
  { value: 4, code: 'AMD', symbol: 'AMD', name: 'Armenian dram' },
  { value: 5, code: 'ANG', symbol: 'NA\u0192', name: 'Netherlands Antillean gulden' },
  { value: 6, code: 'AOA', symbol: 'Kz', name: 'Angolan kwanza' },
  { value: 7, code: 'ARS', symbol: '$', name: 'Argentine peso' },
  { value: 8, code: 'AUD', symbol: '$', name: 'Australian dollar' },
  { value: 9, code: 'AWG', symbol: '\u0192', name: 'Aruban florin' },
  { value: 10, code: 'AZN', symbol: 'AZN', name: 'Azerbaijani manat' },
  { value: 11, code: 'BAM', symbol: 'KM', name: 'Bosnia and Herzegovina konvertibilna marka' },
  { value: 12, code: 'BBD', symbol: 'Bds$', name: 'Barbadian dollar' },
  { value: 13, code: 'BDT', symbol: '\u09f3', name: 'Bangladeshi taka' },
  { value: 14, code: 'BGN', symbol: 'BGN', name: 'Bulgarian lev' },
  { value: 15, code: 'BHD', symbol: '.\u062f.\u0628', name: 'Bahraini dinar' },
  { value: 16, code: 'BIF', symbol: 'FBu', name: 'Burundi franc' },
  { value: 17, code: 'BMD', symbol: 'BD$', name: 'Bermudian dollar' },
  { value: 18, code: 'BND', symbol: 'B$', name: 'Brunei dollar' },
  { value: 19, code: 'BOB', symbol: 'Bs.', name: 'Bolivian boliviano' },
  { value: 20, code: 'BRL', symbol: 'R$', name: 'Brazilian real' },
  { value: 21, code: 'BSD', symbol: 'B$', name: 'Bahamian dollar' },
  { value: 22, code: 'BTN', symbol: 'Nu.', name: 'Bhutanese ngultrum' },
  { value: 23, code: 'BWP', symbol: 'P', name: 'Botswana pula' },
  { value: 24, code: 'BYR', symbol: 'Br', name: 'Belarusian ruble' },
  { value: 25, code: 'BZD', symbol: 'BZ$', name: 'Belize dollar' },
  { value: 26, code: 'CAD', symbol: '$', name: 'Canadian dollar' },
  { value: 27, code: 'CDF', symbol: 'F', name: 'Congolese franc' },
  { value: 28, code: 'CHF', symbol: 'Fr.', name: 'Swiss franc' },
  { value: 29, code: 'CLP', symbol: '$', name: 'Chilean peso' },
  { value: 30, code: 'CNY', symbol: '\u00a5', name: 'Chinese/Yuan renminbi' },
  { value: 31, code: 'COP', symbol: 'Col$', name: 'Colombian peso' },
  { value: 32, code: 'CRC', symbol: '\u20a1', name: 'Costa Rican colon' },
  { value: 33, code: 'CUC', symbol: '$', name: 'Cuban peso' },
  { value: 34, code: 'CVE', symbol: 'Esc', name: 'Cape Verdean escudo' },
  { value: 35, code: 'CZK', symbol: 'K\u010d', name: 'Czech koruna' },
  { value: 36, code: 'DJF', symbol: 'Fdj', name: 'Djiboutian franc' },
  { value: 37, code: 'DKK', symbol: 'Kr', name: 'Danish krone' },
  { value: 38, code: 'DOP', symbol: 'RD$', name: 'Dominican peso' },
  { value: 39, code: 'DZD', symbol: '\u062f.\u062c', name: 'Algerian dinar' },
  { value: 40, code: 'EEK', symbol: 'KR', name: 'Estonian kroon' },
  { value: 41, code: 'EGP', symbol: '\u00a3', name: 'Egyptian pound' },
  { value: 42, code: 'ERN', symbol: 'Nfa', name: 'Eritrean nakfa' },
  { value: 43, code: 'ETB', symbol: 'Br', name: 'Ethiopian birr' },
  { value: 44, code: 'EUR', symbol: '\u20ac', name: 'European Euro' },
  { value: 45, code: 'FJD', symbol: 'FJ$', name: 'Fijian dollar' },
  { value: 46, code: 'FKP', symbol: '\u00a3', name: 'Falkland Islands pound' },
  { value: 47, code: 'GBP', symbol: '\u00a3', name: 'British pound' },
  { value: 48, code: 'GEL', symbol: 'GEL', name: 'Georgian lari' },
  { value: 49, code: 'GHS', symbol: 'GH\u20b5', name: 'Ghanaian cedi' },
  { value: 50, code: 'GIP', symbol: '\u00a3', name: 'Gibraltar pound' },
  { value: 51, code: 'GMD', symbol: 'D', name: 'Gambian dalasi' },
  { value: 52, code: 'GNF', symbol: 'FG', name: 'Guinean franc' },
  { value: 53, code: 'GQE', symbol: 'CFA', name: 'Central African CFA franc' },
  { value: 54, code: 'GTQ', symbol: 'Q', name: 'Guatemalan quetzal' },
  { value: 55, code: 'GYD', symbol: 'GY$', name: 'Guyanese dollar' },
  { value: 56, code: 'HKD', symbol: 'HK$', name: 'Hong Kong dollar' },
  { value: 57, code: 'HNL', symbol: 'L', name: 'Honduran lempira' },
  { value: 58, code: 'HRK', symbol: 'kn', name: 'Croatian kuna' },
  { value: 59, code: 'HTG', symbol: 'G', name: 'Haitian gourde' },
  { value: 60, code: 'HUF', symbol: 'Ft', name: 'Hungarian forint' },
  { value: 61, code: 'IDR', symbol: 'Rp', name: 'Indonesian rupiah' },
  { value: 62, code: 'ILS', symbol: '\u20aa', name: 'Israeli new sheqel' },
  { value: 63, code: 'INR', symbol: '\u20B9', name: 'Indian rupee' },
  { value: 64, code: 'IQD', symbol: '\u062f.\u0639', name: 'Iraqi dinar' },
  { value: 65, code: 'IRR', symbol: 'IRR', name: 'Iranian rial' },
  { value: 66, code: 'ISK', symbol: 'kr', name: 'Icelandic kr\u00f3na' },
  { value: 67, code: 'JMD', symbol: 'J$', name: 'Jamaican dollar' },
  { value: 68, code: 'JOD', symbol: 'JOD', name: 'Jordanian dinar' },
  { value: 69, code: 'JPY', symbol: '\u00a5', name: 'Japanese yen' },
  { value: 70, code: 'KES', symbol: 'KSh', name: 'Kenyan shilling' },
  { value: 71, code: 'KGS', symbol: '\u0441\u043e\u043c', name: 'Kyrgyzstani som' },
  { value: 72, code: 'KHR', symbol: '\u17db', name: 'Cambodian riel' },
  { value: 73, code: 'KMF', symbol: 'KMF', name: 'Comorian franc' },
  { value: 74, code: 'KPW', symbol: 'W', name: 'North Korean won' },
  { value: 75, code: 'KRW', symbol: 'W', name: 'South Korean won' },
  { value: 76, code: 'KWD', symbol: 'KWD', name: 'Kuwaiti dinar' },
  { value: 77, code: 'KYD', symbol: 'KY$', name: 'Cayman Islands dollar' },
  { value: 78, code: 'KZT', symbol: 'T', name: 'Kazakhstani tenge' },
  { value: 79, code: 'LAK', symbol: 'KN', name: 'Lao kip' },
  { value: 80, code: 'LBP', symbol: '\u00a3', name: 'Lebanese lira' },
  { value: 81, code: 'LKR', symbol: 'Rs', name: 'Sri Lankan rupee' },
  { value: 82, code: 'LRD', symbol: 'L$', name: 'Liberian dollar' },
  { value: 83, code: 'LSL', symbol: 'M', name: 'Lesotho loti' },
  { value: 84, code: 'LTL', symbol: 'Lt', name: 'Lithuanian litas' },
  { value: 85, code: 'LVL', symbol: 'Ls', name: 'Latvian lats' },
  { value: 86, code: 'LYD', symbol: 'LD', name: 'Libyan dinar' },
  { value: 87, code: 'MAD', symbol: 'MAD', name: 'Moroccan dirham' },
  { value: 88, code: 'MDL', symbol: 'MDL', name: 'Moldovan leu' },
  { value: 89, code: 'MGA', symbol: 'FMG', name: 'Malagasy ariary' },
  { value: 90, code: 'MKD', symbol: 'MKD', name: 'Macedonian denar' },
  { value: 91, code: 'MMK', symbol: 'K', name: 'Myanma kyat' },
  { value: 92, code: 'MNT', symbol: '\u20ae', name: 'Mongolian tugrik' },
  { value: 93, code: 'MOP', symbol: 'P', name: 'Macanese pataca' },
  { value: 94, code: 'MRO', symbol: 'UM', name: 'Mauritanian ouguiya' },
  { value: 95, code: 'MUR', symbol: 'Rs', name: 'Mauritian rupee' },
  { value: 96, code: 'MVR', symbol: 'Rf', name: 'Maldivian rufiyaa' },
  { value: 97, code: 'MWK', symbol: 'MK', name: 'Malawian kwacha' },
  { value: 98, code: 'MXN', symbol: '$', name: 'Mexican peso' },
  { value: 99, code: 'MYR', symbol: 'RM', name: 'Malaysian ringgit' },
  { value: 100, code: 'MZM', symbol: 'MTn', name: 'Mozambican metical' },
  { value: 101, code: 'NAD', symbol: 'N$', name: 'Namibian dollar' },
  { value: 102, code: 'NGN', symbol: '\u20a6', name: 'Nigerian naira' },
  { value: 103, code: 'NIO', symbol: 'C$', name: 'Nicaraguan c\u00f3rdoba' },
  { value: 104, code: 'NOK', symbol: 'kr', name: 'Norwegian krone' },
  { value: 105, code: 'NPR', symbol: 'NRs', name: 'Nepalese rupee' },
  { value: 106, code: 'NZD', symbol: 'NZ$', name: 'New Zealand dollar' },
  { value: 107, code: 'OMR', symbol: 'OMR', name: 'Omani rial' },
  { value: 108, code: 'PAB', symbol: 'B./', name: 'Panamanian balboa' },
  { value: 109, code: 'PEN', symbol: 'S/.', name: 'Peruvian nuevo sol' },
  { value: 110, code: 'PGK', symbol: 'K', name: 'Papua New Guinean kina' },
  { value: 111, code: 'PHP', symbol: '\u20b1', name: 'Philippine peso' },
  { value: 112, code: 'PKR', symbol: 'Rs.', name: 'Pakistani rupee' },
  { value: 113, code: 'PLN', symbol: 'z\u0142', name: 'Polish zloty' },
  { value: 114, code: 'PYG', symbol: '\u20b2', name: 'Paraguayan guarani' },
  { value: 115, code: 'QAR', symbol: 'QR', name: 'Qatari riyal' },
  { value: 116, code: 'RON', symbol: 'L', name: 'Romanian leu' },
  { value: 117, code: 'RSD', symbol: 'din.', name: 'Serbian dinar' },
  { value: 118, code: 'RUB', symbol: 'R', name: 'Russian ruble' },
  { value: 119, code: 'SAR', symbol: 'SR', name: 'Saudi riyal' },
  { value: 120, code: 'SBD', symbol: 'SI$', name: 'Solomon Islands dollar' },
  { value: 121, code: 'SCR', symbol: 'SR', name: 'Seychellois rupee' },
  { value: 122, code: 'SDG', symbol: 'SDG', name: 'Sudanese pound' },
  { value: 123, code: 'SEK', symbol: 'kr', name: 'Swedish krona' },
  { value: 124, code: 'SGD', symbol: 'S$', name: 'Singapore dollar' },
  { value: 125, code: 'SHP', symbol: '\u00a3', name: 'Saint Helena pound' },
  { value: 126, code: 'SLL', symbol: 'Le', name: 'Sierra Leonean leone' },
  { value: 127, code: 'SOS', symbol: 'Sh.', name: 'Somali shilling' },
  { value: 128, code: 'SRD', symbol: '$', name: 'Surinamese dollar' },
  { value: 129, code: 'SYP', symbol: 'LS', name: 'Syrian pound' },
  { value: 130, code: 'SZL', symbol: 'E', name: 'Swazi lilangeni' },
  { value: 131, code: 'THB', symbol: '\u0e3f', name: 'Thai baht' },
  { value: 132, code: 'TJS', symbol: 'TJS', name: 'Tajikistani somoni' },
  { value: 133, code: 'TMT', symbol: 'm', name: 'Turkmen manat' },
  { value: 134, code: 'TND', symbol: 'DT', name: 'Tunisian dinar' },
  { value: 135, code: 'TRY', symbol: 'TRY', name: 'Turkish new lira' },
  { value: 136, code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago dollar' },
  { value: 137, code: 'TWD', symbol: 'NT$', name: 'New Taiwan dollar' },
  { value: 138, code: 'TZS', symbol: 'TZS', name: 'Tanzanian shilling' },
  { value: 139, code: 'UAH', symbol: 'UAH', name: 'Ukrainian hryvnia' },
  { value: 140, code: 'UGX', symbol: 'USh', name: 'Ugandan shilling' },
  { value: 141, code: 'USD', symbol: 'US$', name: 'United States dollar' },
  { value: 142, code: 'UYU', symbol: '$U', name: 'Uruguayan peso' },
  { value: 143, code: 'UZS', symbol: 'UZS', name: 'Uzbekistani som' },
  { value: 144, code: 'VEB', symbol: 'Bs', name: 'Venezuelan bolivar' },
  { value: 145, code: 'VND', symbol: '\u20ab', name: 'Vietnamese dong' },
  { value: 146, code: 'VUV', symbol: 'VT', name: 'Vanuatu vatu' },
  { value: 147, code: 'WST', symbol: 'WS$', name: 'Samoan tala' },
  { value: 148, code: 'XAF', symbol: 'CFA', name: 'Central African CFA franc' },
  { value: 149, code: 'XCD', symbol: 'EC$', name: 'East Caribbean dollar' },
  { value: 150, code: 'XDR', symbol: 'SDR', name: 'Special Drawing Rights' },
  { value: 151, code: 'XOF', symbol: 'CFA', name: 'West African CFA franc' },
  { value: 152, code: 'XPF', symbol: 'F', name: 'CFP franc' },
  { value: 153, code: 'YER', symbol: 'YER', name: 'Yemeni rial' },
  { value: 154, code: 'ZAR', symbol: 'R', name: 'South African rand' },
  { value: 155, code: 'ZMK', symbol: 'ZK', name: 'Zambian kwacha' },
  { value: 156, code: 'ZWR', symbol: 'Z$', name: 'Zimbabwean dollar' }],

  stdTimeControls: [
    [tc(40, 90), tc(Const.tcMoves.suddenDeath, 30, 30, Const.tcBonus.increment)],
    [tc(40, 120), tc(Const.tcMoves.suddenDeath, 60, 5, Const.tcBonus.delay)],
    [tc(40, 115), tc(Const.tcMoves.suddenDeath, 60, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 120, 30, Const.tcBonus.increment)],
    [tc(Const.tcMoves.game, 120, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 115, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 90, 30, Const.tcBonus.increment)],
    [tc(Const.tcMoves.game, 90, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 60, 30, Const.tcBonus.increment)],
    [tc(Const.tcMoves.game, 60, 5, Const.tcBonus.delay)],
    [tc(30, 30), tc(Const.tcMoves.suddenDeath, 30, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 30, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 25, 5, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 25, 3, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 15, 3, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 10, 3, Const.tcBonus.delay)],
    [tc(Const.tcMoves.game, 10)],
    [tc(Const.tcMoves.game, 5)],
    [tc(Const.tcMoves.game, 3, 2, Const.tcBonus.increment)]
  ]
};