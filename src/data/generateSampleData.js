load('constants.js')
load('util.js')

function generatePlayers(count) {
    var maleNames =  ['Roosevelt', 'Antone', 'Pasquale', 'Tomas', 'Clifford',
                      'Rocco', 'Thao', 'Saul', 'Brice', 'Pete', 'Osvaldo', 
                       'Austin', 'Magen', 'Judson', 'Gerard'];
    var femaleNames = ['Inell', 'Kazuko', 'Hien', 'Aleta', 'Larraine', 
                       'Bethany', 'Ariel', 'Joana', 'Lorraine', 'Lizette', 
                       'Emmy', 'Jolynn', 'Maranda', 'Melany', 'Miyoko',];
    var surnames = ['Gleghorn', 'Bishopp', 'Mariacher', 'Fike', 'Popper', 'Schoenbeck', 'Palone', 'Beliard', 'Kinabrew', 'Bohan',
                    'Fedoriw', 'Pannhoff', 'Schaff', 'Seidler', 'Garing', 'Christesen', 'Schooler', 'Hershey', 'Stewardson', 'Roller',
                    'Mirelez', 'Zavadoski', 'Heywood', 'Wyse', 'Condello', 'Brensnan', 'Sippel', 'Dinsmoor', 'Yenglin', 'Trampe'];
    var players = [];

    for (var i = 0; i != count; ++i) {
        var gender = util.randomInt(0, 2);
        players.push({
            name: (gender == constants.gender.female) 
                ? femaleNames[util.randomInt(0, femaleNames.length)] 
                : maleNames[util.randomInt(0, maleNames.length)],
            surname: surnames[util.randomInt(0, surnames.length)],
            gender:  gender,
            rating:  util.randomInt(1000, 2200),
            birth:   util.randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1))
        });
    }

    return players;
}

function generateSections(count, tournamentStartDate, tournamentEndDate) {
    var sections = [];
    
    for (var i = 0; i != count; ++i) {
        var sectionNames = ['A', 'B', 'C', 'D', 'Open', 'Closed', 'Youth', 'Novice', 'Expert'];

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

        sections.push({
            name:       sectionNames[util.randomInt(0, sectionNames.length)] + ' Section',
            playSystem: playSystem,
            tieBreaks:  tieBreaks,
            rounds:     rounds,
            maxPlayers: maxPlayers,
            startDate:  tournamentStartDate,
            endDate:    tournamentEndDate
            // TODO: prizes and time controls
        });
    }

    return sections;
}

function generateTournaments(count) {
    var cities = ['Durban', 'Johannesburg', 'Cape Town', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'Germiston', 'Newcastle',
                  'Klerksdorp', 'Kimberley', 'Secunda', 'Vereeniging', 'Dundee', 'Kuruman', 'Pietermaritzburg', 'Randfontein'];
    var types = ['Open', 'Closed', 'Cup', 'Championship', 'Memorial', 'Rapid', 'Blitz'];
    var durations = [1, 2, 3, 5, 7];
    var tournaments = [];

    for (var i = 0; i != count; ++i) {
        var city = cities[util.randomInt(0, cities.length)];
        var startDate = util.randomDate(new Date(), new Date(2015, 0, 1));
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

function populateDb() {
    // Clear collections
    db.tournaments.drop()
    db.players.drop()
    
    // Create sample data
    var tournaments = generateTournaments(5);
    var players     = generatePlayers(50);

    // Bulk populate collections
    var bulk = db.tournaments.initializeUnorderedBulkOp();
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