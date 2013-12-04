var User = (function() {
    'use strict';
    var CURRENT_LEVEL = 0,
        HIT_POINTS = 20,
        SKILL_SET = [], // Skills a User has acquired
        INVENTORY = [], // What User can pick from
        INVENTORY_LIMIT = 2,
        ITEMS = [],     // What user is carrying. Emptied when death occurs
        // These are default stats. They can be modified by calling addStat()
        STATS = { strength: 10, fighting: 0, recovery: 0},
        // There are no default skills. They can be modified by calling addSkill()
        SKILLS = {},
        WEAPON = {},
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
        WEAPON = {};
        ITEMS = [];
        PLACES = [];
        CURRENT_LOCATION = locale;
        HIT_POINTS = 20;
    }

    var User = function() {
        // this.initialize.apply(this, arguments);
    };

    Object.defineProperty(User, "hp", {
        get: function () {
            return HIT_POINTS;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(User, "exp", {
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

    // Weapons Locker
    User.aquireWeapon = function(item) {
        console.log('holy carp!');
        if(item.hands === 2) {
            // Only allowed to carry a single two handed weapon
            // // FIrst check slotted weapons
            for(var k in WEAPON) {
                if(WEAPON[k].hands === 2) {
                    Engine.modal({
                        title: '', 
                        msg: "Sorry, you are only allowed to carry a single two-handed weapon You must drop the " + INVENTORY[k].desc + " first.", 
                        buttons: [
                            {label: 'Drop ' + INVENTORY[k].desc, click: function() { User.dropWeapon(INVENTORY[k])}},
                            {label: 'OK', click: function() {  Engine.closeModal(); } }
                        ]
                    });
                    return false;
                }
            }
            // Next, check INVENTORY in case it isn't equiped
            for(var k in INVENTORY) {
                if(INVENTORY[k].type === 'weapon' && INVENTORY[k].hands === 2) {
                    Engine.modal({
                        title: '', 
                        msg: "Sorry, you are only allowed to carry a single two-handed weapon You must drop the " + INVENTORY[k].desc + " first.", 
                        buttons: [
                            {label: 'Drop ' + INVENTORY[k].desc, click: function() { User.dropWeapon(INVENTORY[k])}},
                            {label: 'OK', click: function() {  Engine.closeModal(); } }
                        ]
                    });
                    return false;
                }
            }

        }
        User.addItemToInventory(item);
        return true;
    }
    User.equipWeapon = function(weapon) {
        // This works like so:
        // User can carry one two-handed weapon or multi one handed weapons but can only use two at a time
        // i.e. Short sword and nunchucks.
    };

    User.dropWeapon = function(weapon) {
        console.log('dropping: ', weapon);
        User.dropItem(weapon);
        Engine.closeModal();
    };

    User.getWeapon = function() {
        console.log('WEAPON: ', WEAPON);
        if(WEAPON.damage == undefined) { 
            return {"id" : "hands",  "type": "weapon", "desc" : "hands", "hands" : 1, "damage" : 1}; 
        }
    }

    // INVENTORY control
    User.hasItem = function(id) {
        var item;
        for (var x in INVENTORY) {
            item = INVENTORY[x];
            if (item.id === id) {
                return true;
            }
        }
        return false;
    };

    User.addItemToInventory = function(item) {
        var id = item.id,
            board ='';

        if(id === "pack") {
            User.dropItem(item);
            INVENTORY_LIMIT = item.maxItems;
        }
        if(item.amount) {
            board = $('#stats');
            MONEY[item.id] += item.amount;

            // var c = $('.' + item.id, board);
            // c.text(item.id.capitalize() + ": " + MONEY[item.id]);
        } else {
            if(!User.hasItem(id)) {
                board = $('#inventory');
                item.quantity = 1;
                if(User.tooManyItems()) { Engine.alert('You are carrying too many items. You must drop something before picking this up or find a larger pack.'); return false; }
                INVENTORY.push(item);
                $('<li>').attr('id',item.id).text(item.desc + " (" + item.quantity + ")").appendTo(board);
            } else {
                User.updateInventory(item);
            }
        }

        updateStatsPanel();
        return true;
    };

    User.tooManyItems = function() {
        var x, cnt = 0;
        for (x in INVENTORY) {
            cnt += INVENTORY[x].quantity;
        }
        if(cnt >= INVENTORY_LIMIT) { return true; }
        return false;
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

    User.dropItem = function(item){
        var x, cnt = 0;
        for (x in INVENTORY) {
            if(INVENTORY[x].id === item.id) {
                delete INVENTORY[x];
            }
        }
        updateInventoryPanel();
    };

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