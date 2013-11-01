var Creatures = function(parent) {
    'use strict';
    var CREATURE_LIST = {},

        _super_ = parent,
        my = {};

    function handleLoadedCreatures(data) {
        STATS = data.stats;
        console.log('user stats: ', STATS);
    }

    my.init = function() {
        _super_.loadData('js/creatures.json', handleLoadedCreatures);
    };

    my.aquireSkill = function(skill) {
        SKILL_SET.push(skill);
    };

    my.getSkills = function() {
        return SKILL_SET;
    };

    my.killUser = function() {
        ITEMS = [];
    };

    return my;
};