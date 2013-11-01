var Engine = function(config, data) {
    'use strict';
    var DEBUG = true,
        _defaults = {
            vars : {
                squirrel: { value : 'nutPicker', muteable: true},
                coconut: { value : 'treenut', muteable: false}
            }
        },
        _config = config,
        _data = data,
        self = {},
        $System = {};

    /** 
        Enforce module. 
        This ensures that this is a Engine object, 
        not a Window Object
    */
    if (!(this instanceof Engine)) {
        return new Engine(_config, _data);
    }

    function createButton(config) {
        var func = function() { $System.log("click"); },
        that = $System;
        if (typeof(config.click) != 'undefined') {
            var arr = config.click.split('.');
            if (arr.length > 1) {
                func = self[arr[0]][arr[1]];
            } else {
                func = that[arr[0]];
            }
        }
        var btn = $('<div>')
            .attr('id', typeof(config.id) != 'undefined' ? config.id : "BTN_")
            .addClass('grid_1 button')
            .text(typeof(config.label) != 'undefined' ? config.label : "button")
            .click(function() { 
                $(this).data("handler")($(this));
            })
            // .data("handler",  (typeof(config.click) != 'undefined') ? self[config.click.class.toLowerCase()][ config.click.method] : function() { $System.log("click"); });
            .data("handler",  func );

        if(config.width) {
            btn.css('width', config.width);
        }
        btn.appendTo(config.target);
    }

    $System.toggleLog = function() {
        console.log('toggle');
        $('#log').toggle();
    }

    $System.initialize = function() {
        // Not in debug mode, remove the log
        if(!DEBUG) {
            var ele = document.getElementById("log");
            ele.parentNode.removeChild(ele);
        }

        if (!User) {
            throw new Error('Unable to locate User class');
        }
        var game = this;
            var l = Layout();
            self.layout = new l(game);
            // u = new User(game);
            var t = User();
            self.user = new t(game);
        // u.init();
        // this.user = u;
    };

    // Getters and Setters for Chart
    $System.getConfig = function(attr) {
        return _defaults[config[attr]];
    };

    // Generic: Values must exist in _defaults.vars and be muteable
    $System.get = function(str) {
        str = str.toLowerCase();
        if (_defaults.vars[str] !== undefined) { return _defaults.vars[str].value; }
        return false;
    };

    $System.set = function(attr, val) {
        attr = attr.toLowerCase();
        if (_defaults.vars[attr] !== undefined && _defaults.vars[attr].muteable) {
            _defaults.vars[attr].value = val;
            return true;
        }
        return false;
    };

    // Utility functions
    $System.loadData = function(path, callback) {
        var httpRequest = new XMLHttpRequest(),
            that = this;
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if(DEBUG) that.log('data set loaded');
                    if (callback) { callback(data); }
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    };

    // Wrapper functions
    $System.createButton = function(cfg) {
        createButton(cfg);
    };

    $System.log = function(str) {
        if (DEBUG) {
            $( "#log .inner" ).prepend( $('<div>').addClass('logEntry').text(str) );
            // var theDiv = document.getElementById("log"),
            //     newp = document.createElement("p"),
            //     content = document.createTextNode(str);

            // if(theDiv) {
            //     newp.appendChild(content);
            //     theDiv.appendChild(newp);
            // }
        } else {
            console.log(str);
        }
    };


    return $System;
};
