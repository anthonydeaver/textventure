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
        var room = _rooms[rm];
        Engine.setLocation(rm);
        $( "#log .inner" ).prepend( $('<div>').addClass('logEntry').text(room.desc) );
        for (var x = 0; x < room.exits.length; x++) {
            var exit = _rooms[room.exits[x]];
            var btn = $('<div>')
                .addClass('grid_1 button')
                .text(exit.name);
            console.log('exit: ', exit.name);
            btn.appendTo("#" + Engine.navPanel);
        }
    };

    return Rooms;
})();