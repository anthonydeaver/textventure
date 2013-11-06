var Layout = (function () {
    'use strict';
    var _views = [],
        i = 0;

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

        _finalizeLayout();

    };

    function _createView(config) {
        var that = this;
        var _id = typeof(config.id) != 'undefined' ? config.id : "VEW_" + Engine.GUID();
        var nav = $('<div>')
            .data('location', _id)
            .addClass('navButton')
            .addClass((_views.length === 0) ? 'selected' : '')
            .text(typeof(config.name) != 'undefined' ? config.name  : "")
            .on('click', function(e) {
                    var href = $(e.currentTarget).data('location');
                console.log('target: ', href);

                    $('#' + href).trigger('activate');

                    e.preventDefault();
 
            //     $('#viewNav div').removeClass('selected');
            //     $(this).addClass('selected');
            //     toggleView($(this).data('location'));
            });

        nav.appendTo('nav#viewNav');

        var view = $('<div>')
            .attr('id', _id)
            .addClass('view')
            .html('<p>' + Engine.GUID() + '</p>');

            if(!_views.length) { view.addClass('active'); }

        view.appendTo('div#viewSlider');

        // We can only have one view 'active' at a time
        // if(_views.length) { $(view).toggle();}

        _views.push(view);

        // Add panels
        for (var x = 0; x < config.panels.length; x++) {
            _createPanel(config.panels[x], _id);
        };

    }

    function _createPanel(_panel,parent) {
        console.log('making panel')
        parent = "#" + parent;
        var panel = $('<div>')
            .attr('id', typeof(_panel.id) != 'undefined' ? _panel.id : "BLK_")
            .addClass(_panel.class + ' panel')
            .html(typeof(_panel.title) != 'undefined' ? $("<h2>").text(_panel.title)  : "");

        if(_panel.width) {
            panel.css('width', _panel.width);
        }
        if(_panel.border) {
            panel.css('border', _panel.border);

            console.log('parent: ', parent);
        }
        panel.appendTo(parent);
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

    function _finalizeLayout() {
        var slides = $('#viewSlider .view');
        console.log('slide: ', slides);
        slides.on('activate', function(e) {
            console.log('setting active');
            slides.eq(i).removeClass('active');

            $(e.target).addClass('active');

            // Update the active slide index
            i = slides.index(e.target);
        });
    };

    function toggleView(locale) {
        // console.log('showing ', locale);
        // $('#viewSlider div.view').each(function() {
        //     $(this).hide();
        // });

        // $('#viewSlider #' + locale).show();
    }


    function Layout() {
    }

    Layout.init = function () {
        console.log('loading');
        Engine.loadJSON('js/app/resources/layout.json', _parseLayout);
    }

    return Layout;
})();
