var Events = (function() {
	'use strict';
	var _eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0'),
	_monster,
	_monsterAttackTimer;

	function startCombat() {
		Engine.modal({title: 'Fight!', msg: _monster.msg, buttons: [{label: 'Attack', click: launchPlayerAttack}]});
		var desc = $('#message', Engine.activeModal());
		createCombatant(User, 'You').attr('id','player').appendTo(desc);
		createCombatant(_monster).attr('id','monster').appendTo(desc);

		// Creates spped factor. _monster.speed is as 'fast' as a monster can move
		var vector = getMonsterAttackSpeed();
		_monsterAttackTimer = setTimeout(launchMonsterAttack, vector * 1000);
	}

	function getMonsterAttackSpeed(){
		return Math.floor(Math.random() * ((_monster.speed * 2) - _monster.speed) + _monster.speed);
	}

	function createCombatant(char, name) {
		var fighter = $('<div>').addClass('fighter').text(name || char.name).data('hp', char.hp).data('fighter',char).data('maxHP',char.hp);
		$('<div>').addClass('hp').text(char.hp+'/'+char.hp).appendTo(fighter);
		return fighter;
	}
	
	function updateFighter(fighter) {
		$('.hp', fighter).text(fighter.data('hp') + '/' + fighter.data('maxHP'));
	}

	function launchPlayerAttack() {
		var f = $('#monster', Engine.activeModal());
		_monster.hp -= 1;
		var w = User.getWeapon();
		console.log('weapon: ', w);
		_monster.hp -= w.damage;
		f.data('hp', _monster.hp);
		updateFighter(f);

		if(_monster.hp <= 0) {
			killMonster();
		}
	}

	function launchMonsterAttack() {
		var f = $('#player', Engine.activeModal()),
			banner = $('#banner', Engine.activeModal()),
			dmg = 0,
			succeed = (Math.random() > 0.5),
			weapon = _monster.weapons[Math.floor(Math.random() * _monster.weapons.length)],
			attackStr = '';

		clearTimeout(_monsterAttackTimer);

		// Math.floor((Math.random() * _monster.strength) + 1);
		// First things first, determine the type of weapon
		attackStr = weapon.attack.replace(/%s/g, _monster.name);
		// Next, see if the monsters attack succeeds
		// successfulAttack = (Math.random() > 0.5);

		if (succeed) {
			attackStr += " doing " + weapon.damage + " damage.";
			User.takeDamage(weapon.damage);
			f.data('hp', User.hp);
			updateFighter(f);
		} else {
			attackStr += ", and misses.";
		}

		// pretty fade out/in
		banner.fadeOut(function() {
			$(this).text(attackStr).fadeIn();
		});

		if(User.hp <= 0) {
			User.killUser();
		} else {
			// Creates spped factor. _monster.speed is as 'fast' as a monster can move
			var vector = getMonsterAttackSpeed();
			_monsterAttackTimer = setTimeout(launchMonsterAttack, vector * 1000);

		}
	}

	function killMonster() {
		clearTimeout(_monsterAttackTimer);
		Monsters.killMonster(_monster);
	}

	function Events() {}

	Events.triggerEvent = function(event) {
		if (event.type === 'combat') { Events.combat(event.enemy); }
	};

	Events.combat = function(enemies) {
		var id = Math.floor(Math.random() * ( enemies.length -  0));
		var monster = Monsters.getMonster(enemies[id]);
		_monster = $.extend(true, {}, monster);
		if (_monster.level > User.level) {
			// If monster is stronger than player then ignore player... for now.
			return;
		}
		startCombat();
	};

	return Events;
})();

 