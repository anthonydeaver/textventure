var Rooms = (function(parent) {
    'use strict';
    var _default = '',
        _rooms,
        Rooms = {};

    function parseRooms(json) {
        _rooms = json.rooms;
        _default = _rooms.start;
        Rooms.loadRoom(_default);
    }

    Rooms.initialize = function() {
        Engine.loadJSON('js/app/resources/rooms.json', parseRooms);
    };

    Rooms.loadRoom = function(rm) {
        var room = _rooms[rm],
            x,
            getMonster;

        if(room.locked) { 
        	console.log("That room is locked. You need to " + room.lockedReqs + " to access it.");
        	return;
        }
        $('.locator #exits .button').remove();
        Engine.setLocation(room);
        $("#log .inner").prepend($('<div>').addClass('roomEntry').text(room.desc));
        for (x = 0; x < room.exits.length; x++) {
            var exit = _rooms[room.exits[x]];
            if(exit.hidden) {
            	if (!User.hasItem(exit.reqs)) { continue; }
            }
            var btn = $('<div>')
                .addClass('button')
                .attr('id',exit.id)
                .text(exit.name)
                .click(function() { 
                	// Rooms.loadRoom(exit.id);
	                var id = $(this).data("ident");
	                Rooms.loadRoom(id);
	            })
	            .data("ident",  exit.id );
            btn.appendTo("#exits");
        }

        if (room.hasMonster) {
        	if( Math.random() < room.hasMonster) {
                Events.triggerEvent();
            }
        }
    };

    return Rooms;
})();