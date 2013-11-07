var Engine = (function() {
    'use strict';
    var DEBUG = true,
        _console,
        _navPanel;

    function parseConfig(json) {

        Engine.assert(json.console,'A default Console must be defined');
        _console = json.console;

        Engine.assert(json.locations,'A locations panel must be defined');
        _navPanel = json.locations;

        if (!User) {
            throw new Error('Unable to locate User class');
        }

        $('.close').on('click', function() {
            $(this).closest('.panel').hide();
        });

        User.initialize();
        Layout.initialize();
        // Rooms.initialize();

    }

    function Engine(app) {
        var _defaults = {
                vars : {
                    squirrel: { value : 'nutPicker', muteable: true},
                    coconut: { value : 'treenut', muteable: false}
                }
            },
            self = {};

        this.initialize.apply(this.arguments);
    }

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

    Engine.log = function(str) {
        if (DEBUG) {
            console.log('[TXTVENTURE]: ' + str);
        }
    };

    // Generates and returns a guid
    Engine.GUID = function() {
        var d = Date.now();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
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
    }


    Engine.alert = function(msg) {
        Engine.log(msg);
    }

    Engine.setLocation = function(location) {
        $('.locator span').text(location);
    }

    // Getters and Setters
    Engine.prototype.getConfig = function(attr) {
        return _defaults[config[attr]];
    };

    // Generic: Values must exist in _defaults.vars and be muteable
    Engine.prototype.get = function(str) {
        str = str.toLowerCase();
        if (_defaults.vars[str] !== undefined) { return _defaults.vars[str].value; }
        return false;
    };

    Engine.prototype.set = function(attr, val) {
        attr = attr.toLowerCase();
        if (_defaults.vars[attr] !== undefined && _defaults.vars[attr].muteable) {
            _defaults.vars[attr].value = val;
            return true;
        }
        return false;
    };

    // Utility functions
    Engine.loadJSON = function(path, callback) {
        var httpRequest = new XMLHttpRequest(),
            that = this;
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

})();