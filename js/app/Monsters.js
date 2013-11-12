var Monsters = (function() {
    'use strict';
    var CREATURE_LIST = {};

    function handleLoadedMonsters(data) {
        CREATURE_LIST = data.monsters;
    }

    Monsters = function() {
    };

    Monsters.getMonster = function(name) {
        return CREATURE_LIST[name];
    };

    Monsters.initialize = function() {
        Engine.loadJSON('js/app/resources/monsters.json', handleLoadedMonsters);
    };

    return Monsters;
})();