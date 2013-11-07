var Rooms = (function(parent) {
    'use strict';
    var _default = '',
        _rooms;

    function parseRooms(json) {
        _rooms = json.rooms;
        _default = _rooms.default;
        Rooms.loadRoom(_default);
    }

    var Rooms = {};

    Rooms.initialize = function() {
        Engine.loadJSON('js/app/resources/rooms.json', parseRooms);
    };

    Rooms.loadRoom = function(rm) {
    	// $("#" + Engine.navPanel).html('');
    	$('.locator #exits .button').remove();
        var room = _rooms[rm];
    	console.log('loading room: ', room);
        Engine.setLocation(room.name);
        $( "#log .inner" ).prepend( $('<div>').addClass('logEntry').text(room.desc) );
        for (var x = 0; x < room.exits.length; x++) {
            var exit = _rooms[room.exits[x]];
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
            console.log('exit: ', exit.name);
            btn.appendTo("#exits");
        }
    };

    return Rooms;
})();