var Layout = (function () {
    'use strict';
    var _views = [];

    function _parseLayout(json) {
        Engine.log('layout JSON loaded');
        var x;

        /**
         * There are essentially 2|3 types of [...]
         * _views_: which are containers for [..]
         * _panels_: at the level they are universal.
         * 
         */
        for (x = 0; x < json.views.length; x++) {
            //_layout.prototype.createPanel(json.panels[x]);
            _createView(json.views[x]);
        };


    };

    function _createView(config) {
        // var _id = "VEW_" + Engine.GUID();
        var that = this;
        var _id = typeof(config.id) != 'undefined' ? config.id : "VEW_" + Engine.GUID();
        var nav = $('<div>')
            .data('location', _id)
            .addClass('navButton')
            .addClass((_views.length === 0) ? 'selected' : '')
            .text(typeof(config.name) != 'undefined' ? config.name  : "")
            .on('click', function() {
                $('#viewNav div').removeClass('selected');
                $(this).addClass('selected');
                toggleView($(this).data('location'));
            });

        nav.appendTo('nav#viewNav');

        var view = $('<div>')
            .attr('id', _id)
            .addClass('view')
            .html('<p>' + Engine.GUID() + '</p>');
        view.appendTo('div#viewSlider');

        // We can only have one view 'active' at a time
        if(_views.length) { $(view).toggle();}

        _views.push(view);

    }

    function _createPanel(config) {
        var panel = $('<div>')
            .attr('id', typeof(config.id) != 'undefined' ? config.id : "BLK_")
            .addClass(config.class + ' panel')
            .html(typeof(config.title) != 'undefined' ? $("<h2>").text(config.title)  : "");

        if(config.width) {
            panel.css('width', config.width);
        }
        if(config.border) {
            panel.css('border', config.border);
        }
        panel.appendTo('div#gameboard');
    };

    function _createButton(config) {
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
            .data("handler",  func );

        if(config.width) {
            btn.css('width', config.width);
        }
        btn.appendTo(config.target);
    }

    function toggleView(locale) {
        console.log('showing ', locale);
        $('#viewSlider div.view').each(function() {
            $(this).hide();
        });

        $('#viewSlider #' + locale).show();
    }


    function Layout() {
    }

    Layout.init = function () {
        console.log('loading');
        Engine.loadJSON('js/app/resources/layout.json', _parseLayout);
    }

    return Layout;
})();
