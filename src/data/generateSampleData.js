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
            name:         fullName[0],
            surname:      fullName[1],
            gender:       gender,
            title:        title,
            fideRating: (title && title !== 'NM') ? rating : null,
            nationalRating: rating,
            birth: util.randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1))
            // TODO: federation
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
        username:     'test',
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
    // Clear collections
    db.settings.drop()
    db.users.drop()
    db.tournaments.drop()
    db.players.drop()
    
    // Create sample data
    var settings    = generateSettings();
    var users       = generateUsers();
    var tournaments = generateTournaments(10);
    var players     = generatePlayers(50);

    // Populate collections
    db.settings.insert(settings);

    var bulk = db.users.initializeUnorderedBulkOp();
    for (var i = 0; i != users.length; ++i) {
        bulk.insert(users[i]);
    }
    bulk.execute();
    db.users.ensureIndex({ username: 1 });

    bulk = db.tournaments.initializeUnorderedBulkOp();
    for (var i = 0; i != tournaments.length; ++i) {
        bulk.insert(tournaments[i]);
    }
    bulk.execute();

    bulk = db.players.initializeUnorderedBulkOp();
    for (var i = 0; i != players.length; ++i) {
        bulk.insert(players[i]);
    }
    bulk.execute();
}