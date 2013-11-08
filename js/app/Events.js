var Events = (function() {
	'use strict';
	var _eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');

	function Events() {}

	Events.triggerEvent = function(event) {
		Events.startEvent();
		// _eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
		// if(event.type === 'combat') Events.startCOmbat
	}

	Events.startEvent = function() {
		$('<div>').addClass('eventTitle').html($('<h2>').text('Event')).appendTo(_eventPanel);
		$('<div>').attr('id', 'description').appendTo(_eventPanel);
		$('<div>').attr('id', 'buttons').appendTo(_eventPanel);
		// Events.loadScene('start');
		$('#gameboard').append(_eventPanel);
		_eventPanel.animate({opacity: 1}, 200, 'linear');
	}

	return Events;
})();

/*
eventPanel: function() {
		return Events.activeEvent().eventPanel;
	},
    
    startEvent: function(event, options) {
		if(event) {
			Engine.event('game event', 'event');
			Engine.keyLock = true;
			Events.eventStack.unshift(event);
			event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
			if(options != null && options.width != null) {
				Events.eventPanel().css('width', options.width);
			}
			$('<div>').addClass('eventTitle').text(Events.activeEvent().title).appendTo(Events.eventPanel());
			$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
			$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
			Events.loadScene('start');
			$('div#wrapper').append(Events.eventPanel());
			Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
		}
    },
*/
 