load('constants.js')
load('util.js')

function tc(moves, period, bonus, bonusType) {
    return {
        moves:     moves,
        period:    period,
        bonus:     bonus,
        bonusType: bonusType
    };
}

var stdTimeControls = [
    [tc(40,  90), tc(constants.tcMoves.suddenDeath, 30, 30, constants.tcBonus.increment)],
    [tc(40, 120), tc(constants.tcMoves.suddenDeath, 60,  5, constants.tcBonus.delay)],
    [tc(40, 115), tc(constants.tcMoves.suddenDeath, 60,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game, 120, 30, constants.tcBonus.increment)],
    [tc(constants.tcMoves.game, 120,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game, 115,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  90, 30, constants.tcBonus.increment)],
    [tc(constants.tcMoves.game,  90,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  60, 30, constants.tcBonus.increment)],
    [tc(constants.tcMoves.game,  60,  5, constants.tcBonus.delay)],
    [tc(30, 30), tc(constants.tcMoves.suddenDeath, 30, 5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  30,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  25,  5, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  25,  3, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  15,  3, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  10,  3, constants.tcBonus.delay)],
    [tc(constants.tcMoves.game,  10)],
    [tc(constants.tcMoves.game,   5)],
    [tc(constants.tcMoves.game,   3,  2, constants.tcBonus.increment)]
];

var fideFederations = [
  {
      value: 1,
      region: 'Africa',
      name: 'Algeria'
  },
  {
      value: 2,
      region: 'Africa',
      name: 'Angola'
  },
  {
      value: 3,
      region: 'Africa',
      name: 'Botswana'
  },
  {
      value: 4,
      region: 'Africa',
      name: 'Burkina Faso'
  },
  {
      value: 5,
      region: 'Africa',
      name: 'Burundi'
  },
  {
      value: 6,
      region: 'Africa',
      name: 'Cameroon'
  },
  {
      value: 7,
      region: 'Africa',
      name: 'Central African Republic'
  },
  {
      value: 8,
      region: 'Africa',
      name: 'Comoros Islands'
  },
  {
      value: 9,
      region: 'Africa',
      name: 'Congo'
  },
  {
      value: 10,
      region: 'Africa',
      name: 'Cote d\'Ivoire'
  },
  {
      value: 11,
      region: 'Africa',
      name: 'Egypt'
  },
  {
      value: 12,
      region: 'Africa',
      name: 'Ethiopia'
  },
  {
      value: 13,
      region: 'Africa',
      name: 'Gabon'
  },
  {
      value: 14,
      region: 'Africa',
      name: 'Gambia'
  },
  {
      value: 15,
      region: 'Africa',
      name: 'Ghana'
  },
  {
      value: 16,
      region: 'Africa',
      name: 'Kenya'
  },
  {
      value: 17,
      region: 'Africa',
      name: 'Lesotho'
  },
  {
      value: 18,
      region: 'Africa',
      name: 'Libya'
  },
  {
      value: 19,
      region: 'Africa',
      name: 'Madagascar'
  },
  {
      value: 20,
      region: 'Africa',
      name: 'Malawi'
  },
  {
      value: 21,
      region: 'Africa',
      name: 'Mali'
  },
  {
      value: 22,
      region: 'Africa',
      name: 'Mauritania'
  },
  {
      value: 23,
      region: 'Africa',
      name: 'Mauritius'
  },
  {
      value: 24,
      region: 'Africa',
      name: 'Morocco'
  },
  {
      value: 25,
      region: 'Africa',
      name: 'Mozambique'
  },
  {
      value: 26,
      region: 'Africa',
      name: 'Namibia'
  },
  {
      value: 27,
      region: 'Africa',
      name: 'Nigeria'
  },
  {
      value: 28,
      region: 'Africa',
      name: 'Rwanda'
  },
  {
      value: 29,
      region: 'Africa',
      name: 'Sao Tome and Principe'
  },
  {
      value: 30,
      region: 'Africa',
      name: 'Senegal'
  },
  {
      value: 31,
      region: 'Africa',
      name: 'Seychelles'
  },
  {
      value: 32,
      region: 'Africa',
      name: 'Sierra Leone'
  },
  {
      value: 33,
      region: 'Africa',
      name: 'Somalia'
  },
  {
      value: 34,
      region: 'Africa',
      name: 'South Africa'
  },
  {
      value: 35,
      region: 'Africa',
      name: 'Sudan'
  },
  {
      value: 36,
      region: 'Africa',
      name: 'Swaziland'
  },
  {
      value: 37,
      region: 'Africa',
      name: 'Tanzania'
  },
  {
      value: 38,
      region: 'Africa',
      name: 'Togo'
  },
  {
      value: 39,
      region: 'Africa',
      name: 'Tunisia'
  },
  {
      value: 40,
      region: 'Africa',
      name: 'Uganda'
  },
  {
      value: 41,
      region: 'Africa',
      name: 'Zambia'
  },
  {
      value: 42,
      region: 'Africa',
      name: 'Zimbabwe'
  },
  {
      value: 43,
      region: 'Asia',
      name: 'Afghanistan'
  },
  {
      value: 44,
      region: 'Asia',
      name: 'Australia'
  },
  {
      value: 45,
      region: 'Asia',
      name: 'Bahrain'
  },
  {
      value: 46,
      region: 'Asia',
      name: 'Bangladesh'
  },
  {
      value: 47,
      region: 'Asia',
      name: 'Bhutan'
  },
  {
      value: 48,
      region: 'Asia',
      name: 'Brunei Darussalam'
  },
  {
      value: 49,
      region: 'Asia',
      name: 'Cambodia'
  },
  {
      value: 50,
      region: 'Asia',
      name: 'China'
  },
  {
      value: 51,
      region: 'Asia',
      name: 'Chinese Taipei'
  },
  {
      value: 52,
      region: 'Asia',
      name: 'Fiji'
  },
  {
      value: 53,
      region: 'Asia',
      name: 'Guam'
  },
  {
      value: 54,
      region: 'Asia',
      name: 'Hong Kong'
  },
  {
      value: 55,
      region: 'Asia',
      name: 'India'
  },
  {
      value: 56,
      region: 'Asia',
      name: 'Indonesia'
  },
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
      name: 'Papau New Guinea'
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
  }];

function generateLookups() {
    return {
        fideFederations: fideFederations
    };
}

function getTitle(rating, gender) {
    var stdTitles = ['WCM', 'WFM', 'WIM', 'WGM', 'NM', 'CM', 'FM', 'IM', 'GM'];
    if (rating < 2000) return null;
    if (rating < 2100 && gender === constants.gender.female) return 'WCM';
    if (rating < 2200 && gender === constants.gender.female) return 'WFM';
    if (rating < 2200) return 'NM';
    if (rating < 2300 && gender === constants.gender.female) return 'WIM';
    if (rating < 2300) return 'CM';
    if (rating < 2400 && gender === constants.gender.female) return 'WGM';
    if (rating < 2400) return 'FM';
    if (rating < 2500) return 'IM';
    return 'GM';
}

function generateFullName(gender) {
    var maleNames = ['Roosevelt', 'Antone', 'Pasquale', 'Tomas', 'Clifford',
                      'Rocco', 'Thao', 'Saul', 'Brice', 'Pete', 'Osvaldo',
                       'Austin', 'Magen', 'Judson', 'Gerard'];
    var femaleNames = ['Inell', 'Kazuko', 'Hien', 'Aleta', 'Larraine',
                       'Bethany', 'Ariel', 'Joana', 'Lorraine', 'Lizette',
                       'Emmy', 'Jolynn', 'Maranda', 'Melany', 'Miyoko', ];
    var surnames = ['Gleghorn', 'Bishopp', 'Mariacher', 'Fike', 'Popper', 'Schoenbeck', 'Palone', 'Beliard', 'Kinabrew', 'Bohan',
                    'Fedoriw', 'Pannhoff', 'Schaff', 'Seidler', 'Garing', 'Christesen', 'Schooler', 'Hershey', 'Stewardson', 'Roller',
                    'Mirelez', 'Zavadoski', 'Heywood', 'Wyse', 'Condello', 'Brensnan', 'Sippel', 'Dinsmoor', 'Yenglin', 'Trampe'];
    var name = (gender === constants.gender.female)
        ? femaleNames[util.randomInt(0, femaleNames.length)]
        : maleNames[util.randomInt(0, maleNames.length)];
    var surname = surnames[util.randomInt(0, surnames.length)];
    return [name, surname];
}

function generatePlayers(count) {
    var players = [];

    for (var i = 0; i != count; ++i) {
        var rating = util.randomInt(1000, 2600);
        var gender = util.randomInt(0, 2);
        var fullName = generateFullName(gender);
        var title = getTitle(rating, gender);

        players.push({
            name:             fullName[0],
            surname:          fullName[1],
            gender:           gender,
            title:            title,
            fideRating:       (title && title !== 'NM') ? rating : null,
            federationRating: rating,
            birth:            util.randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)),
            federation:       fideFederations[util.randomInt(0, fideFederations.length)].value
        });
    }

    return players;
}

function generateSections(count, tournamentStartDate, tournamentEndDate) {
    var sections = [];
    
    for (var i = 0; i != count; ++i) {
        var sectionNames = ['A', 'B', 'C', 'D', 'Open', 'Closed', 'Youth', 'Novice', 'Expert'];
        var fees = [0, 50, 100, 150, 200, 250];

        // Determine play system based on no. of participants.
        var maxPlayers = util.randomInt(6, 201);
        var playSystem = util.randomInt(0, 2);
        var maxRounds = (playSystem + 1) * (maxPlayers - 1);
        if (maxRounds > 10) {
            playSystem = constants.playSystem.swiss;
        }

        var tieBreaks = (playSystem === constants.playSystem.swiss)
            ? [util.randomInt(1, 4)]
            : [constants.tieBreak.neustadl];
        var rounds = (playSystem === constants.playSystem.swiss)
            ? util.swissRounds(maxPlayers)
            : 0;

        var registrationStartDate = new Date(tournamentStartDate);
        registrationStartDate.setDate(tournamentStartDate.getDate() - 30);

        sections.push({
            name:                  sectionNames[util.randomInt(0, sectionNames.length)] + ' Section',
            playSystem:            playSystem,
            tieBreaks:             tieBreaks,
            rounds:                rounds,
            maxPlayers:            maxPlayers,
            startDate:             tournamentStartDate,
            endDate:               tournamentEndDate,
            registrationStartDate: registrationStartDate,
            registrationEndDate:   tournamentStartDate,
            chiefArbiter:          generateFullName(util.randomInt(0, 2)).join(' '),
            timeControls:          stdTimeControls[util.randomInt(0, stdTimeControls.length)],
            entryFee:              fees[util.randomInt(0, fees.length)],
            invitationOnly:        util.randomBool()
            // TODO: prizes
        });
    }

    return sections;
}

function generateTournaments(count) {
    var cities = ['Durban', 'Johannesburg', 'Cape Town', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'Germiston', 'Newcastle',
                  'Klerksdorp', 'Kimberley', 'Secunda', 'Vereeniging', 'Dundee', 'Kuruman', 'Pietermaritzburg', 'Randfontein',
                  'Welkom', 'Pholokwane', 'Wartburg', 'Port Shepstone', 'Richards Bay'];
    var types = ['Open', 'Closed', 'Cup', 'Championship', 'Memorial', 'Rapid', 'Blitz'];
    var durations = [1, 2, 3, 5, 7];
    var tournaments = [];

    for (var i = 0; i != count; ++i) {
        var city = cities[util.randomInt(0, cities.length)];
        var startDate = util.randomDate(new Date(2013, 0, 1), new Date(2015, 0, 1));
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durations[util.randomInt(0, durations.length)]);

        var sectionCount = util.randomInt(1, 4);
        var sections = generateSections(sectionCount, startDate, endDate);

        tournaments.push({
            name:      city + ' ' + types[util.randomInt(0, types.length)],
            location:  city,
            startDate: startDate,
            endDate:   endDate,
            sections:  sections
        });
    }

    return tournaments;
}

function generateUsers() {
    var users = [{
        name:         'Tester',
        surname:      'Chester',
        email:        'testerchester@gmail.com',
        passwordHash: '$2a$12$645qA8AOc2N4ac7XIhwOlunepzSa.4kKzZjTYm8VJL2hSdyUDhto6', // password1234$
    }];

    // TODO: Add more users

    return users;
}

function generateSettings() {
    var settings = {
        sessionLifeSpanInDays: 7
    };
    return settings;
}

function populateDb() {
    // 1. Clear collections
    db.settings.drop();
    db.lookups.drop();
    db.users.drop();
    db.tournaments.drop();
    db.players.drop();
    
    // 2. Create sample data
    var settings    = generateSettings();
    var lookups     = generateLookups();
    var users       = generateUsers();
    var tournaments = generateTournaments(10);
    var players     = generatePlayers(50);

    // 3. Populate collections

    // Settings
    db.settings.insert(settings);

    // Lookups
    db.lookups.insert(lookups);

    // Users
    var bulk = db.users.initializeUnorderedBulkOp();
    for (var i = 0; i != users.length; ++i) {
        bulk.insert(users[i]);
    }
    bulk.execute();
    db.users.ensureIndex({ email: 1 });

    // Tournaments
    bulk = db.tournaments.initializeUnorderedBulkOp();
    for (var i = 0; i != tournaments.length; ++i) {
        bulk.insert(tournaments[i]);
    }
    bulk.execute();

    // Players
    bulk = db.players.initializeUnorderedBulkOp();
    for (var i = 0; i != players.length; ++i) {
        bulk.insert(players[i]);
    }
    bulk.execute();
}