var Constants = require('./constants.js');
var Util = require('./util.js');

function getTitle(rating, gender) {
    var stdTitles = ['WCM', 'WFM', 'WIM', 'WGM', 'CM', 'FM', 'IM', 'GM'];
    if (rating < 2000 || gender === Constants.gender.male && rating < 2200) return null;
    if (rating < 2100 && gender === Constants.gender.female) return 'WCM';
    if (rating < 2200 && gender === Constants.gender.female) return 'WFM';
    if (rating < 2300 && gender === Constants.gender.female) return 'WIM';
    if (rating < 2300) return 'CM';
    if (rating < 2400 && gender === Constants.gender.female) return 'WGM';
    if (rating < 2400) return 'FM';
    if (rating < 2500) return 'IM';
    return 'GM';
}

function generateSections(count, tournamentStartDate, tournamentEndDate) {
    var sections = [];
    
    for (var i = 0; i != count; ++i) {
        var sectionNames = ['A', 'B', 'C', 'D', 'Open', 'Closed', 'Youth', 'Novice', 'Expert'];
        var fees = [0, 50, 100, 150, 200, 250];
        
        // Determine play system based on no. of participants.
        var maxPlayers = Util.randomInt(6, 201);
        var playSystem = Util.randomInt(0, 2);
        var maxRounds = (playSystem + 1) * (maxPlayers - 1);
        if (maxRounds > 10) {
            playSystem = Constants.playSystem.swiss;
        }
        
        var tieBreaks = (playSystem === Constants.playSystem.swiss)
            ? [Util.randomInt(1, 4)]
            : [Constants.tieBreak.neustadl];
        var rounds = (playSystem === Constants.playSystem.swiss)
            ? Util.swissRounds(maxPlayers)
            : 0;
        
        var registrationStartDate = new Date(tournamentStartDate);
        registrationStartDate.setDate(tournamentStartDate.getDate() - 60);
        
        sections.push({
            name: sectionNames[Util.randomInt(0, sectionNames.length)] + ' Section',
            playSystem: playSystem,
            tieBreaks: tieBreaks,
            rounds: rounds,
            maxPlayers: maxPlayers,
            startDate: tournamentStartDate,
            endDate: tournamentEndDate,
            registrationStartDate: registrationStartDate,
            registrationEndDate: tournamentStartDate,
            chiefArbiter: generateFullName(Util.randomInt(0, 2)).join(' '),
            timeControls: Util.stdTimeControls[Util.randomInt(0, Util.stdTimeControls.length)],
            entryFee: fees[Util.randomInt(0, fees.length)],
            invitationOnly: Util.randomBool()
        });
    }
    
    return sections;
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
    var name = (gender === Constants.gender.female)
        ? femaleNames[Util.randomInt(0, femaleNames.length)]
        : maleNames[Util.randomInt(0, maleNames.length)];
    var surname = surnames[Util.randomInt(0, surnames.length)];
    return [name, surname];
}

module.exports = {
    generatePlayer: function (gender, fullName) {
        gender = gender ? gender : Util.randomInt(0, 2);
        fullName = fullName ? fullName : generateFullName(gender);
        var fedRating = Util.randomInt(800, 2900);
        fedRating = (fedRating < 1000) ? null : fedRating;
        var fideRating = null;
        var fideTitle = null;
        if (fedRating) {
            fideRating = (fedRating < 1999) ? null : fedRating - 200;
            fideTitle = (fideRating == null) ? null : getTitle(fideRating, gender);
        }
        
        return {
            name: fullName[0],
            surname: fullName[1],
            gender: gender,
            fideRating: fideRating,
            fideTitle: fideTitle,
            federationRating: fedRating,
            federationTitle: null,
            dateOfBirth: Util.randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)),
            federation: Constants.fideFederations[Util.randomInt(0, Constants.fideFederations.length)].value,
            union: null,
            contactNumber: null,
            emailAddress: null
        };
    },
    
    generateTournament: function () {
        var cities = ['Durban', 'Johannesburg', 'Cape Town', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'Germiston', 'Newcastle',
                  'Klerksdorp', 'Kimberley', 'Secunda', 'Vereeniging', 'Dundee', 'Kuruman', 'Pietermaritzburg', 'Randfontein',
                  'Welkom', 'Pholokwane', 'Wartburg', 'Port Shepstone', 'Richards Bay'];
        var types = ['Open', 'Closed', 'Cup', 'Championship', 'Memorial', 'Rapid', 'Blitz'];
        var durations = [1, 2, 3, 5, 7];
        
        var city = cities[Util.randomInt(0, cities.length)];
        var startDate = Util.randomDate(new Date(2013, 0, 1), new Date(2015, 0, 1));
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durations[Util.randomInt(0, durations.length)]);
        
        var sectionCount = Util.randomInt(1, 4);
        var sections = generateSections(sectionCount, startDate, endDate);
        
        return {
            name: city + ' ' + types[Util.randomInt(0, types.length)],
            location: city,
            startDate: startDate,
            endDate: endDate,
            sections: sections
        };
    }
};