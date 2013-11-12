var User = (function() {
    'use strict';
    var CURRENT_LEVEL = 0,
        HIT_POINTS = 20,
        SKILL_SET = [], // Skills a User has acquired
        INVENTORY = [], // What User can pick from
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        // These are default stats. They can be modified by calling addStat()
        STATS = { strength: 0, fighting: 0, recovery: 0},
        // There are no default skills. They can be modified by calling addSkill()
        SKILLS = {},
        WEAPONS = {},
        LOCATION = {},
        PLACES = [],
        CURRENT_LOCATION = null;

    function configUser(data) {
        Engine.log('user data loaded');
        var s = data.stats;
        var key;
        for (key in STATS) {
            STATS[key] = s[key] || 0;
        }

        CURRENT_LEVEL = 1;
    }

    var User = function() {
        // this.initialize.apply(this, arguments);
    };

    User.name = "You";

    Object.defineProperty(User, "hp", {
        get: function () {
            return HIT_POINTS;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(User, "level", {
       get: function () {
            return CURRENT_LEVEL;
        },
        enumerable: true,
        configurable: true
    });

    // Object.defineProperty(User, "name", {
    //    get: function () {
    //         return "You";
    //     },
    //     enumerable: true,
    //     configurable: true
    // });

    User.hasItem = function(item) {
        return true;
    };

    User.travelTo = function(location) {
        if(CURRENT_LOCATION !== null) { PLACES.push(CURRENT_LOCATION); }
        CURRENT_LOCATION = location;
    };

    User.addSkill = function(skill, rating) {
        Engine.assert(rating,'A skill must be rated to be valid');
        SKILLS[skill] = rating;
    };
    User.aquireSkill = function(skill) {
        Engine.assert(skill,'A skill must be defined to be added');
        SKILL_SET.push(skill);
    };

    User.getSkills = function() {
        return SKILL_SET;
    };

    User.takeDamage = function(damage) {
        HIT_POINTS -= damage;
        if(HIT_POINTS <= 0) {
            User.dies();
        }
    };

    User.dies = function() {
        Engine.alert('You died.');
    };

    User.killUser = function() {
        ITEMS = [];
    };

    User.dump = function(skill) {
        Engine.log('stats: '+ JSON.stringify(STATS));
        Engine.log('skills: '+ JSON.stringify(SKILLS));
        Engine.log('places: ' + JSON.stringify(PLACES));
        Engine.log('current: ' + CURRENT_LOCATION);
        Engine.log('User: ' + JSON.stringify(this));

    };

    User.initialize = function() {
        Engine.loadJSON('js/app/resources/user.json', configUser);
    };

    return User;
})();