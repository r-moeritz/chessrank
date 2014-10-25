var Const = require('./constants.js');
var Util = require('./util.js');
var Data = require('./data.js');

function getTitle(rating, gender) {
    if (rating < 2000 || gender === Const.gender.male && rating < 2200) return null;
    if (rating < 2100 && gender === Const.gender.female) return Const.fideTitle.WCM;
    if (rating < 2200 && gender === Const.gender.female) return Const.fideTitle.WFM;
    if (rating < 2300 && gender === Const.gender.female) return Const.fideTitle.WIM;
    if (rating < 2300) return Const.fideTitle.CM;
    if (rating < 2400 && gender === Const.gender.female) return Const.fideTitle.WGM;
    if (rating < 2400) return Const.fideTitle.FM;
    if (rating < 2500) return Const.fideTitle.IM;
    return Const.fideTitle.GM;
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
    var name = (gender === Const.gender.female)
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
            dateOfBirth: Util.randomDate(new Date(Date.UTC(1950, 0, 1)), new Date(Date.UTC(2000, 0, 1))),
            federation: Data.fideFederations[Util.randomInt(0, Data.fideFederations.length)].value,
            union: null,
            contactNumber: null,
            emailAddress: fullName[0].toLowerCase() + fullName[1].toLowerCase() + '@example.com'
        };
    },
    
    generateTournament: function (ownerUserId) {
        var cities = ['Durban', 'Johannesburg', 'Cape Town', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'Germiston', 'Newcastle',
                  'Klerksdorp', 'Kimberley', 'Secunda', 'Vereeniging', 'Dundee', 'Kuruman', 'Pietermaritzburg', 'Randfontein',
                  'Welkom', 'Pholokwane', 'Wartburg', 'Port Shepstone', 'Richards Bay'];
        var types = ['Open', 'Closed', 'Cup', 'Championship', 'Memorial', 'Rapid', 'Blitz'];
        var durations = [1, 2, 3, 5, 7];
        
        var city = cities[Util.randomInt(0, cities.length)];
        var startDate = Util.randomDate(new Date(Date.UTC(2014, 10, 1)), new Date(Date.UTC(2015, 1, 1)));
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durations[Util.randomInt(0, durations.length)]);
        
        return {
            name: city + ' ' + types[Util.randomInt(0, types.length)],
            location: city,
            startDate: startDate,
            endDate: endDate,
            registrationFeeCurrencyId: 154,
            ownerUserId: ownerUserId
        };
    },
    
    generateSection: function(tournament) {
        var sectionNames = ['A', 'B', 'C', 'D', 'Open', 'Closed', 'Youth', 'Novice', 'Expert'];
        var fees = [0, 50, 100, 150, 200, 250];
    
        // Determine play system based on no. of participants.
        var maxPlayers = Util.randomInt(6, 201);
        var playSystem = Util.randomInt(1, 3);
        var maxRounds = (playSystem + 1) * (maxPlayers - 1);
        if (maxRounds > 10) {
            playSystem = Const.playSystem.swiss;
        }
    
        var tieBreaks = (playSystem === Const.playSystem.swiss)
                ? [Util.randomInt(1, 4)]
                : [Const.tieBreak.neustadl];
        var rounds = (playSystem === Const.playSystem.swiss)
                ? Util.swissRounds(maxPlayers)
                : 0;
    
        var registrationStartDate = new Date(tournament.startDate);
        registrationStartDate.setDate(tournament.startDate.getDate() - 60);
    
        return {
            tournamentId: tournament._id,
            ownerUserId: tournament.ownerUserId,
            name: sectionNames[Util.randomInt(0, sectionNames.length)] + ' Section',
            playSystem: playSystem,
            tieBreaks: tieBreaks,
            rounds: rounds,
            maxPlayers: maxPlayers,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            registrationStartDate: registrationStartDate,
            registrationEndDate: tournament.startDate,
            chiefArbiter: generateFullName(Util.randomInt(0, 2)).join(' '),
            timeControls: Data.stdTimeControls[Util.randomInt(0, Data.stdTimeControls.length)],
            registrationFee: fees[Util.randomInt(0, fees.length)],
            invitationOnly: Util.randomBool(),
            provisionalRating: 1000,
            registeredPlayerIds: [],
            confirmedPlayerIds: [],
            registrationManuallyClosed: null,
            roundData: []
        };
    },
    
    registerPlayers: function (sections, players) {
        var sect;
        var gotSwiss = false;

        for (var i = 0; i != sections.length; ++i) {
            sect = sections[i];
            if (sect.playSystem === Const.playSystem.swiss) {
                gotSwiss = true;
                break;
            }
        }
        
        if (!gotSwiss) {
            return null;
        }
        
        sect.registeredPlayerIds = players.map(function (p) {
            return p._id;
        });

        return sect;
    }
};