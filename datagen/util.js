module.exports = {
    promptToExit: function () {
        var rl = require('readline');
        var prompts = rl.createInterface(process.stdin, process.stdout);
        prompts.question("Press any key to exit...", function () {
            process.exit();
        });
    },

    swissRounds: function(players) {
        return Math.ceil(Math.log(players) / Math.log(2));
    },

    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomBool: function () {
        return Math.random() < .5;
    },

    randomDate: function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
};