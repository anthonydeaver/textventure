var User = (function() {
    'use strict';
    var CURRENT_LEVEL = 0,
        HIT_POINTS = 20,
        SKILL_SET = [], // Skills a User has acquired
        INVENTORY = [], // What User can pick from
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        // These are default stats. They can bee modified by calling addStat()
        STATS = { strength: 0, fighting: 0, recovery: 0},
        // There are no default skills. They can be modified by calling addSkill()
        SKILLS = {};

    function configUser(data) {
        Engine.log('user data loaded');
        var s = data.stats;
        var key;
        for (key in STATS) {
            STATS[key] = s[key] || 0;
        }
    }

    var User = function() {
        // this.initialize.apply(this, arguments);
    };

    User.addSkill = function(skill, rating) {
        Engine.assert(rating,'A skill must be rated to be valid');
        SKILLS[skill] = rating;
    };
    User.aquireSkill = function(skill) {
        Engine.assert(skill,'A skill must be defined to be added');
        SKILL_SET.push(skill);
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

    User.getSkills = function() {
        return SKILL_SET;
    };

    User.killUser = function() {
        ITEMS = [];
    };

    User.dump = function(skill) {
        Engine.log('stats: '+ JSON.stringify(STATS));
        Engine.log('skills: '+ JSON.stringify(SKILLS));
    };

    User.initialize = function() {
        Engine.loadJSON('js/app/resources/user.json', configUser);
    };

    return User;
})();