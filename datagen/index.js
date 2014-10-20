'use strict'

var Const   = require('./constants.js');
var Util    = require('./util.js');
var Data    = require('./data.js');
var Gen     = require('./generate.js');
var Mongo   = require('mongodb');
var Q       = require('q');
var sprintf = require('sprintfjs');

Q.longStackSupport = true;

function populatePlayers(db, count) {   
    var col = db.collection('players');
    var batch = col.initializeUnorderedBulkOp();
    for (var i = 0; i != count; ++i) {
        var player = Gen.generatePlayer()
        batch.insert(player);
    }
    return Q.ninvoke(batch, 'execute')
        .then(function () { return db; });
}

function populateSections(db, tournaments) {
    var batch = db.collection('sections').initializeUnorderedBulkOp();
    
    for (var i = 0; i != tournaments.length; ++i) {
        var tm = tournaments[i];
        var numSections = Util.randomInt(1, 4);
        
        for (var k = 0; k != numSections; ++k) {
            var section = Gen.generateSection(tm);
            batch.insert(section);
        }
    }
    
    return Q.ninvoke(batch, 'execute')
    .then(function () { return db; });
}

function populateTournaments(db, count, ownerUserId) {
    var col = db.collection('tournaments');
    var batch = col.initializeUnorderedBulkOp();

    for (var i = 0; i != count; ++i) {
        var tournament = Gen.generateTournament(ownerUserId);
        batch.insert(tournament);
    }
    
    return Q.ninvoke(batch, 'execute')
    .then(function () { return Q.ninvoke(col.find(), 'toArray'); });
}

function populateAdminUser(db) {
    var p1 = Gen.generatePlayer(Const.gender.male, ['Admin', 'User']);

    var colPlayers = db.collection('players');
    return Q.ninvoke(colPlayers, 'insert', p1)
        .then(function (players) {
            var u1 = {
                email:        'chessrank@outlook.com',
                passwordHash: '$2a$12$r2J9LpUc0XEwzLu1CCzL7ONNYKlz4orj4P3JB99muNyNbZEE1oYX.', // Password1234$
                playerId:     players[0]._id,
                status:       Const.userStatus.active
            };
        
            var colUsers = db.collection('users');
            return Q.ninvoke(colUsers, 'insert', u1);
        })
        .then(function (users) { return users[0]._id; });
}

function populateDummyUsers(db) {
    var p1 = Gen.generatePlayer(Const.gender.female, ['Player', 'One']);
    
    var colPlayers = db.collection('players');
    return Q.ninvoke(colPlayers, 'insert', p1)
        .then(function (players) {
        var u1 = {
            email: 'playerone@gmail.com',
            passwordHash: '$2a$12$r2J9LpUc0XEwzLu1CCzL7ONNYKlz4orj4P3JB99muNyNbZEE1oYX.', // Password1234$
            playerId: players[0]._id,
            status: Const.userStatus.active
        };
        
        var colUsers = db.collection('users');
        return Q.ninvoke(colUsers, 'insert', u1);
        })
        .then(function () { return db; });
}

function populateSettings(db) {
    var settings = {
        session_lifespan: 7, // in days
        cookie_secret: '2Sht+AfTRESND20cSXB4XxXdBsYkOkxUoWCWnoXzVok=',
        smtp_config: {
            host: 'smtp-mail.outlook.com', 
            user: 'chessrank@outlook.com', 
            password: '3Dcff$25631%4dA6',
            from: 'chessrank@outlook.com'
        }
    };
    var col = db.collection('settings');
    return Q.ninvoke(col, 'insert', settings)
        .then(function () { return db; });
}

function populateLookups(db) {
    var lookups = {
        fideFederations: Data.fideFederations,
        currencies: Data.currencies,
        stdTimeControls: Data.stdTimeControls,
    };
    var col = db.collection('lookups');
    return Q.ninvoke(col, 'insert', lookups)
        .then(function () { return db; });
}

function dropDatabase(db) {
    return Q.ninvoke(db, 'dropDatabase')
        .then(function () { return db; });
}

function connect() {
    var client = Mongo.MongoClient;
    return Q.ninvoke(client, 'connect', 'mongodb://127.0.0.1:27017/chessrank');
}

function disconnect(db) {
    return Q.ninvoke(db, 'close');
}

function populatePlayerRegistrations(db) {
    var promises = [Q.ninvoke(db.collection('sections').find(), 'toArray'),
                    Q.ninvoke(db.collection('players').find(), 'toArray')];

    return Q.spread(promises, function (sections, players) {
        var section = Gen.registerPlayers(sections, players);
        if (section) {
            return Q.ninvoke(db.collection('tournaments').find({ _id: section.tournamentId }), 'toArray')
            .then(function (tournaments) {
                return Q.ninvoke(db.collection('sections'), 'save', section)
                .then(function () {
                    console.log(sprintf('%d players registered in the %s of the %s (section id: %s)',
                        section.registeredPlayerIds.length,
                        section.name,
                        tournaments[0].name,
                        section._id.toString()));
                })
            });
        } else {
            console.warn('No players registered!');
        }
    })
    .then(function () { return db; });
}

function populateCollections(db) {
    return Q.all([populateSettings(db), populateLookups(db), populatePlayers(db, 50), 
        populateDummyUsers(db)])
        .then(function () { return populateAdminUser(db); })
        .then(function (userId) { return populateTournaments(db, 10, userId); })
        .then(function (tournaments) { return populateSections(db, tournaments); })
        .then(populatePlayerRegistrations);
}

function main() {
    connect()
        .then(dropDatabase)
        .then(populateCollections)
        .then(disconnect)
        .done(Util.promptToExit);
}

main();
