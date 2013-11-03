var User = (function() {
    'use strict';
    var CURRENT_LEVEL = 0,
        SKILL_SET = [],
        INVENTORY = [], // What User can pick from
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        STATS = { strength: 0, hitpoints: 0, fighting: 0, recovery: 0};

    function configUser(data) {
        $Engine.log('user data loaded');
        var s = data.stats;
        var key;
        for (key in STATS) {
            STATS[key] = s[key] || 0;
        }
    }
});
var User2 = function () {
    'use strict';
    var CURRENT_LEVEL = 0,
        SKILL_SET = [],
        INVENTORY = [], // What User can pick from
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        STATS = { strength: 0, hitpoints: 0, fighting: 0, recovery: 0},

        $Engine;

    function configUser(data) {
        $Engine.log('user data loaded');
        var s = data.stats;
        var key;
        for (key in STATS) {
            STATS[key] = s[key] || 0;
        }
    }

    var user = function() {
        this.initialize.apply(this, arguments);
    };

    user.prototype.aquireSkill = function(skill) {
        SKILL_SET.push(skill);
    };

    user.prototype.getSkills = function() {
        return SKILL_SET;
    };

    user.prototype.killUser = function() {
        ITEMS = [];
    };

    user.prototype.dumpData = function(skill) {
        $Engine.log('stats: '+ JSON.stringify(STATS));
    };

    user.prototype.initialize = function(parent) {
        $Engine = parent;
        $Engine.loadData('js/app/resources/user.json', configUser);
    };

    return user;
};

