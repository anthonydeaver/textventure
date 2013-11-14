var Engine = (function() {
    'use strict';
    var DEBUG = true,
        _console,
        _navPanel,
        _modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
        // _terminal = $('#terminal');

    function parseConfig(json) {

        Engine.assert(json.console, 'A default Console must be defined');
        _console = json.console;

        Engine.assert(json.locations, 'A locations panel must be defined');
        _navPanel = json.locations;

        if (!User) {
            throw new Error('Unable to locate User class');
        }

        $('.close').on('click', function() {
            $(this).closest('.panel').hide();
        });

        $('<div>').addClass('title').appendTo(_modalPanel);
        $('<div>').attr('id', 'message').appendTo(_modalPanel);
        $('<div>').attr('id', 'buttons').appendTo(_modalPanel);

        Layout.initialize();
        User.initialize();
        Monsters.initialize();
    }

    function Engine() {}

    // getter / setter for debug
    Object.defineProperty(Engine, "debug", {
        set: function (x) {
            DEBUG = x;
        },
        get: function () {
            return DEBUG;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Engine, "console", {
        get: function () {
            return _console;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Engine, "navPanel", {
        get: function () {
            return _navPanel;
        },
        enumerable: true,
        configurable: true
    });

    Engine.activeModal = function() {
        return _modalPanel;
    };

    Engine.log = function(str) {
        if (DEBUG) {
            console.log('[TXTVENTURE]: ' + str);
        }
    };

    // Generates and returns a guid
    Engine.GUID = function() {
        var d = Date.now(),
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
            });
        return uuid;
    };

    Engine.assert = function(test, message) {
        if (test) {
            return;
        }
        throw new Error("[TXTVENTURE] " + message);
    };

    Engine.init = function() {

        Engine.loadJSON('js/app/resources/app.json', parseConfig);
    };


    Engine.alert = function(msg) {
        Engine.modal({title: 'Alert',msg: msg });
    };

    Engine.popup = function(obj) {
        // obj.buttons = [
        //     {label: 'Yes'},
        //     {label: 'No'}
        // ];

        Engine.modal(obj);
    };

    Engine.modal = function(obj) {
        $('#gameboard').append(_modalPanel);

        Engine.clearModal();

        var title = $('.title', _modalPanel),
            desc = $('#message', _modalPanel),
            btns = $('#buttons', _modalPanel),
            buttons,
            i;

        $('<h2>').text(obj.title).appendTo(title);
        $('<p>').attr('id','banner').html(obj.msg).appendTo(desc);

        _modalPanel.animate({opacity: 1}, 200, 'linear');

        if (obj.buttons) {
            buttons = obj.buttons;
            for (i in buttons) {
                if (buttons.hasOwnProperty(i)) {
                    Layout.button(buttons[i]).appendTo(btns);
                }
            }
        } else {
            Layout.button({ label: 'OK', click: function() {  Engine.closeModal(); } }).appendTo(btns);
        }

    };

    Engine.closeModal = function() {
        // _modalPanel = _modalPanel;
        _modalPanel.animate({opacity: 0}, 200, 'linear');
        _modalPanel.remove();
        // _modalPanel = null;
    };

    Engine.clearModal = function() {
        $('.title', _modalPanel).empty();
        $('#message', _modalPanel).empty();
        $('#buttons', _modalPanel).empty();
    };

    Engine.setLocation = function(location) {
        $('#terminal h2').text(location.name);
        User.travelTo(location);
    };

    // Utility functions
    Engine.loadJSON = function(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) { callback(data); }
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    };

    return Engine;

}());

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};