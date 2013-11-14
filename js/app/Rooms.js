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
            x;

        if (room.locked && !User.hasItem(room.lockedReqs)) {
            Engine.popup({title: 'Locked Room', msg: "That room is locked. You need to " + room.lockedReqs + " to access it."});
            return;
        }
        $('.locator #exits .button').remove();
        Engine.setLocation(room);
        $("#terminal .desc").html($('<div>').addClass('roomEntry').text(room.desc));
        for (x = 0; x < room.exits.length; x++) {
            var exit = _rooms[room.exits[x]];
            if (exit.hidden) {
                if (!User.hasItem(exit.reqs)) { continue; }
            }
            var btn = $('<div>')
                .addClass('button')
                .attr('id', exit.id)
                .text(exit.name)
                .click(function() {
                    // Rooms.loadRoom(exit.id);
                    var id = $(this).data("ident");
                    Rooms.loadRoom(id);
                })
                .data("ident",  exit.id);
            btn.appendTo("#exits");
        }

        $("#exits .button").last().css( "margin", "0px" );

        if (room.hasMonster) {
            if (Math.random() < room.hasMonster) {
                Events.triggerEvent({type: 'combat',enemy: room.monsters});
            }
        }
    };

    return Rooms;
})();