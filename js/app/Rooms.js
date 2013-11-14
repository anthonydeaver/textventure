var Rooms = (function() {
    'use strict';
    var _default = '',
        _rooms,
        Rooms = {};

    function parseRooms(json) {
        _rooms = json.rooms;
        _default = _rooms.start;
        Rooms.loadRoom(_default);
        User.travelTo(_rooms[_default]);
    }

    Rooms.initialize = function() {
        Engine.loadJSON('js/app/resources/rooms.json', parseRooms);
    };

    Rooms.loadRoom = function(rm) {
        var room = _rooms[rm],
            x, item;

        if (room.locked && !User.hasItem(room.lockedReqs)) {
            Engine.popup({title: 'Locked Room', msg: "That room is locked. You need to " + room.lockedReqs + " to access it."});
            return;
        }
        $('.locator #exits .button').remove();
        $('.locator #actions .button').remove();
        Engine.setLocation(room);
        $("#terminal .desc").html($('<div>').addClass('roomEntry').text(room.desc));
        for (x = 0; x < room.exits.length; x++) {
            var exit = _rooms[room.exits[x]];
            if (exit.hidden) {
                if (!User.hasItem(exit.reqs)) { continue; }
            }

           Layout.button({
            	id: exit.id,
            	label: exit.name,
            	click: function(scope) {
            		var id = scope.attr('id');
            		console.log('room: ', scope)
            		Rooms.loadRoom(id);
            	}
            }).appendTo('#exits');
        }

        for(x in room.items) {
        	item = room.items[x];
        	console.log('pre item: ', item);
            Layout.button({
            	id: item.id,
            	label: item.desc,
            	click: function(scope) {
            		var i =scope.data('item');
            		if(i.type === 'item') {
	            		if(User.addItemToInventory(i)) {
	            			Rooms.removeItemFromRoom(room,i.id);
	            			scope.remove();
	            		}
	            	}
            		if(i.type === 'weapon') {
	            		if(User.aquireWeapon(i)) {
	            			scope.remove();
	            		}
	            	}
            	},
            	options: {'item' : item, 'idx': x}
            }).appendTo('#actions');
        }

        $("#exits .button").last().css( "margin", "0px" );

        if (room.hasMonster) {
            if (Math.random() < room.hasMonster) {
                Events.triggerEvent({type: 'combat',enemy: room.monsters});
            }
        }
    };

    Rooms.removeItemFromRoom = function(room, id) {
    	var x, tmp = room.items;

    	for(x = 0; x < tmp.length; x++) {
    		if(room.items[x].id === id) {
    			tmp.splice(x,1);
    		}
    	}
    	room.items = tmp;
    }

    return Rooms;
})();