var Monsters = (function() {
    'use strict';
    var CREATURE_LIST = {},
        Monsters = {};

    function handleLoadedMonsters(data) {
        CREATURE_LIST = data.monsters;
    }

    Monsters.getMonster = function(name) {
        return CREATURE_LIST[name];
    };

    Monsters.killMonster = function(_monster) {
        Engine.clearModal();
        var title = $('.title', Engine.activeModal()),
            desc = $('#message', Engine.activeModal()),
            btns = $('#buttons', Engine.activeModal()),
            loot = '',
            i,
            item,
            exp = Math.floor((User.level + _monster.level) * (Math.random() * 10) + 1);

        User.gainExp(exp);

        $('<h2>').text('Victory!').appendTo(title);

        loot = $('<div>');
        loot.append($('<p>').text("You defeated the " + _monster.name + "!"));
        loot.append($('<p>').text("You gained " + exp + " experience points."));
        // Loop through the loot
        for (i in _monster.loot) {
            console.log('looing over ' + _monster.loot[i]);
            item = _monster.loot[i];
            if(Math.random() > item.chance) {
                loot.append($('<p>').text("You found a " + item.desc + "."));
                User.addItemToInventory(item);
            }
        }
        $('<div>').html(loot).appendTo(desc);

        Layout.button({ label: 'Continue...', click: function() {  Engine.closeModal(); } }).appendTo(btns);
    };

    Monsters.initialize = function() {
        Engine.loadJSON('js/app/resources/monsters.json', handleLoadedMonsters);
    };

    return Monsters;
}());