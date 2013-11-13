var User = (function() {
    'use strict';
    var CURRENT_LEVEL = 0,
        HIT_POINTS = 20,
        SKILL_SET = [], // Skills a User has acquired
        INVENTORY = [], // What User can pick from
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        // These are default stats. They can be modified by calling addStat()
        STATS = { strength: 10, fighting: 0, recovery: 0},
        // There are no default skills. They can be modified by calling addSkill()
        SKILLS = {},
        WEAPONS = {},
        EXP_POINTS = 0,
        LOCATION = {},
        PLACES = [],
        MONEY = {"gold" : 0, "silver" : 0, "bronze" : 0},
        CURRENT_LOCATION = null;

    function configUser(data) {
        Engine.log('user data loaded');
        var s = data.stats,
            key;

        for (key in STATS) {
            STATS[key] = s[key] || STATS[key];
        }

        CURRENT_LEVEL = 1;

        updateStatsPanel();
        updateInventoryPanel();
        updateSkillsPanel();
    }

    function updateStatsPanel(){
        var board = $('#stats'),
            stat;

        board.empty();
        $('<h2>').text('Stats').appendTo(board);

        stat = $('<ul>');
        stat.append($('<li>').addClass('level').text("Level: " + CURRENT_LEVEL));
        stat.append($('<li>').addClass('hp').text("Hit Points: " + HIT_POINTS));
        stat.append($('<li>').addClass('exp').text("Experience Points: " + EXP_POINTS));
        for(var coin in MONEY) {
            stat.append($('<li>').addClass(coin).text(coin.capitalize() + ": " + MONEY[coin]));
        }
        for(var attr in STATS) {
            stat.append($('<li>').addClass(attr).text(attr.capitalize() + ": " + STATS[attr]));
        }
        // stat.append($('<p>').text("You gained " + exp + " experience points."));
        
        stat.appendTo(board);
    }

    function updateInventoryPanel(){
        var board = $('#inventory'),
            item,
            entry;

        board.empty();
        $('<h2>').text('Inventory').appendTo(board);

        item = $('<ul>');
        for(var e in INVENTORY) {
            entry = INVENTORY[e];
            item.append($('<li>').addClass(entry.id).text(entry.desc + " (" + entry.quantity + ")"));
        }
        
        item.appendTo(board);
    }

    function updateSkillsPanel(){
        var board = $('#skills'),
            item,
            entry;

        board.empty();
        $('<h2>').text('Skills').appendTo(board);

        item = $('<ul>');
        for(var e in SKILLS) {
            skill = SKILLS[e];
            item.append($('<li>').addClass(skill.id).text(skill.desc + " (L: " + skill.level + ")"));
        }
        
        item.appendTo(board);
    }

    function resetGame() {
        var locale = PLACES[0];
        Engine.closeModal();
        Rooms.loadRoom(locale.id);
        WEAPONS = {};
        ITEMS = [];
        PLACES = [];
        CURRENT_LOCATION = locale;
        HIT_POINTS = 20;
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

    Object.defineProperty(Engine, "exp", {
        set: function (x) {
            EXP_POINTS += x;
        },
        get: function () {
            return EXP_POINTS;
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

    User.hasItem = function(id) {
        var item;
        for (var x in INVENTORY) {
            item = INVENTORY[x];
            if (item.id === id) {
                console.log('return true');
                return true;
            }
        }
        console.log('return false');
        return false;
    };

    User.addItemToInventory = function(item) {
        var id = item.id,
            board ='';
        if(item.amount) {
            board = $('#stats');
            MONEY[item.id] += item.amount;

            // var c = $('.' + item.id, board);
            // c.text(item.id.capitalize() + ": " + MONEY[item.id]);
        } else {
            if(!User.hasItem(id)) {
                board = $('#inventory');
                item.quantity = 1;
                INVENTORY.push(item);
                $('<li>').attr('id',item.id).text(item.desc + " (" + item.quantity + ")").appendTo(board);
            } else {
                User.updateInventory(item);
            }
        }

        updateStatsPanel();
    };

    User.updateInventory = function(item) {
        var id = item.id,
            pack = $('#inventory');

        for (var x in INVENTORY) {
            var entry = INVENTORY[x];
            if (entry.id === id) {
                console.log('found item');
                if(entry.limit && entry.quantity >= entry.limit) { console.log('can only have one ' + entry.id); return; }
                entry.quantity += 1;
                // var e = $('#' + entry.id, pack);
                // e.text(entry.desc + " (" + entry.quantity + ")");
            }
        }
        updateInventoryPanel();
    }

    User.travelTo = function(location) {
        if(CURRENT_LOCATION !== null) { PLACES.push(CURRENT_LOCATION); }
        CURRENT_LOCATION = location;
    };

    User.gainExp = function(val) {
        EXP_POINTS += val;
        updateStatsPanel();
    };

    User.addSkill = function(skill, rating) {
        Engine.assert(rating,'A skill must be rated to be valid');
        SKILLS[skill] = rating;
    };
    User.acquireSkill = function(skill) {
        Engine.assert(skill,'A skill must be defined to be added');
        SKILL_SET.push(skill);
        updateSkillsPanel();
    };

    User.takeDamage = function(damage) {
        HIT_POINTS -= damage;
       updateStatsPanel();
    };

    User.getSkills = function() {
        return SKILL_SET;
    };

    User.killUser = function() {
        // Engine.alert('You died.');
        Engine.modal({title: 'You died.', buttons: [{label: 'Start Over', click: resetGame}]});
    };

    User.dump = function(skill) {
        Engine.log('STATS: '+ JSON.stringify(STATS));
        Engine.log('SLILLS: '+ JSON.stringify(SKILLS));
        Engine.log('PLACES: ' + JSON.stringify(PLACES));
        Engine.log('CURRENT_LOCATION: ' + CURRENT_LOCATION);
        Engine.log('EXP: ' + JSON.stringify(EXP_POINTS));
        Engine.log('INVENTORY: ' + JSON.stringify(INVENTORY));
        Engine.log('MONEY: ' + JSON.stringify(MONEY));

    };

    User.initialize = function() {
        Engine.loadJSON('js/app/resources/user.json', configUser);
    };

    return User;
})();