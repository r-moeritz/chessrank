'use strict'

var Const = require('./constants.js');
var Gen = require('./generate.js');
var Mongo = require('mongodb');
var Q = require('q');

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

function populateTournaments(db, count) {
    var col = db.collection('tournaments');
    var batch = col.initializeUnorderedBulkOp();
    for (var i = 0; i != count; ++i) {
        var tournament = Gen.generateTournament();
        batch.insert(tournament);
    }
    return Q.ninvoke(batch, 'execute')
        .then(function () { return db; });
}

function populateUsers(db) {
    var p1 = Gen.generatePlayer(Const.gender.male, ['John', 'Smith']);

    var colPlayers = db.collection('players');
    return Q.ninvoke(colPlayers, 'insert', p1)
        .then(function (players) {
            var u1 = {
                email:        'johnsmith@gmail.com',
                passwordHash: '$2a$12$645qA8AOc2N4ac7XIhwOlunepzSa.4kKzZjTYm8VJL2hSdyUDhto6', // password1234$
                playerId:     players[0]._id
            };
        
            var colUsers = db.collection('users');
            return Q.ninvoke(colUsers, 'insert', u1);
        })
        .then(function () { return db; });
}

function populateSettings(db) {
    var settings = {
        sessionLifeSpanInDays: 7
    };
    var col = db.collection('settings');
    return Q.ninvoke(col, 'insert', settings)
        .then(function () { return db; });
}

function populateLookups(db) {
    var lookups = {
        fideFederations: Const.fideFederations
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

function populateCollections(db) {
    return Q.all([populateSettings(db), populateLookups(db), populateUsers(db),
            populatePlayers(db, 50), populateTournaments(db, 10)])
        .then(function () { return db; });
}

function main() {
    connect()
        .then(dropDatabase)
        .then(populateCollections)
        .then(disconnect)
        .done();
}

main();
