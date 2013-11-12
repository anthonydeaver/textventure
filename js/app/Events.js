var Events = (function() {
	'use strict';
	var _eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0'),
	_monster,
	_monsterAttackTimer;

	function startCombat() {
		Engine.modal({title: 'Fight!', msg: _monster.msg, buttons: [{label: 'Attack', click: launchPlayerAttack}]})
		var desc = $('#message', Engine.activeModal());
		createFighter(User, 'You').attr('id','player').appendTo(desc);
		createFighter(_monster).attr('id','monster').appendTo(desc);

		// Creates spped factor. _monster.speed is as 'fast' as a monster can move
		var vector = Math.floor(Math.random() * ((_monster.speed * 2) - _monster.speed) + _monster.speed);
		console.log('vector: ', vector);
		_monsterAttackTimer = setTimeout(launchMonsterAttack, vector * 1000);
	}

	function createFighter(char, name) {
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
		f.data('hp', _monster.hp);
		updateFighter(f);

		if(_monster.hp <= 0) {
			killMonster();
		}
	};

	function launchMonsterAttack() {
		console.log('monster attack');
		var f = $('#player', Engine.activeModal());
		User.takeDamage(1);
		f.data('hp', User.hp);
		updateFighter(f);

		if(User.hp <= 0) {
			clearTimeout(_monsterAttackTimer);
			killPlayer();
		} else {
			// Creates spped factor. _monster.speed is as 'fast' as a monster can move
			var vector = Math.floor(Math.random() * ((_monster.speed * 2) - _monster.speed) + _monster.speed);
			console.log('vector: ', vector);
			_monsterAttackTimer = setTimeout(launchMonsterAttack, vector * 1000);

		}
	};

	function killMonster() {
		console.log('monster dead!');
	}

	function killPlayer() {
		console.log('player dead! Awww...');
	}

	function Events() {}

	Events.triggerEvent = function(event) {
		if(event.type === 'combat') Events.combat(event.enemy)
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
	}

	return Events;
})();

 