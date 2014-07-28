// Globals
var Gender = {
    MALE:   0,
    FEMALE: 1
};

var PlaySystem = {
    ROUND_ROBIN:        0,
    DOUBLE_ROUND_ROBIN: 1,
    SWISS:              2
};

var TieBreak = {
    NEUSTADL:        0,
    BUCHHOLZ:        1,
    MEDIAN:          2,
    MODIFIED_MEDIAN: 3
};

// Helper functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Data Generation functions
function getRandomPlayers(count) {
    var maleNames =  ["Roosevelt", "Antone", "Pasquale", "Tomas", "Clifford",
                      "Rocco", "Thao", "Saul", "Brice", "Pete", "Osvaldo", 
                       "Austin", "Magen", "Judson", "Gerard"];
    var femaleNames = ["Inell", "Kazuko", "Hien", "Aleta", "Larraine", 
                       "Bethany", "Ariel", "Joana", "Lorraine", "Lizette", 
                       "Emmy", "Jolynn", "Maranda", "Melany", "Miyoko",];
    var surnames = ["Gleghorn", "Bishopp", "Mariacher", "Fike", "Popper", "Schoenbeck", "Palone", "Beliard", "Kinabrew", "Bohan",
                    "Fedoriw", "Pannhoff", "Schaff", "Seidler", "Garing", "Christesen", "Schooler", "Hershey", "Stewardson", "Roller",
                    "Mirelez", "Zavadoski", "Heywood", "Wyse", "Condello", "Brensnan", "Sippel", "Dinsmoor", "Yenglin", "Trampe"];
    var players = [];

    for (var i = 0; i != count; ++i) {
        var gender = getRandomInt(0, 2);
        players.push({
            name: (gender == Gender.FEMALE) 
                ? femaleNames[getRandomInt(0, femaleNames.length)] 
                : maleNames[getRandomInt(0, maleNames.length)],
            surname: surnames[getRandomInt(0, surnames.length)],
            gender:  gender,
            rating:  getRandomInt(1000, 2200),
            birth:   getRandomDate(new Date(1950, 0, 1), new Date(2000, 0, 1))
        });
    }

    return players;
}

function getRandomTournaments(count) {
    var cities = ["Durban", "Johannesburg", "Cape Town", "Pretoria", "Bloemfontein", "Port Elizabeth", "Germiston", "Newcastle",
                  "Klerksdorp", "Kimberley", "Secunda", "Vereeniging", "Dundee", "Kuruman", "Pietermaritzburg", "Randfontein"];
    var types = ["Open", "Closed", "Cup", "Championship", "Memorial", "Rapid", "Blitz"];
    var durations = [1, 2, 3, 5, 7];
    var tournaments = [];

    for (var i = 0; i != count; ++i) {
        var city = cities[getRandomInt(0, cities.length)];
        var startDate = getRandomDate(new Date(), new Date(2015, 0, 1));
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durations[getRandomInt(0, durations.length)]);
        var system = getRandomInt(0, 3);

        tournaments.push({
            name:      city + " " + types[getRandomInt(0, types.length)],
            location:  city,
            startDate: startDate,
            endDate:   endDate,
            system:    system,
            tieBreaks: (system == PlaySystem.SWISS)
                ? [getRandomInt(1, 4)]
                : [TieBreak.NEUSTADL],
            rounds:    (system == PlaySystem.SWISS) ? 7 : 0
        });
    }

    return tournaments;
}

function populateDb() {
    // Clear collections
    db.tournaments.drop()
    db.players.drop()
    
    // Create sample data
    var tournaments = getRandomTournaments(5);
    var players     = getRandomPlayers(50);

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