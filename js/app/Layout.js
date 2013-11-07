var Layout = (function () {
    'use strict';
    var _views = [],
        i = 0;


    function _parseLayout(json) {
        Engine.log('layout JSON loaded');
        var x,
            // THis is the default layout structure. Probably overkill but it's fun :)
            // // Not used yet.
            layouts = json.layouts,
            views = json.views;

        for (x = 0; x < views.length; x++) {
            //_layout.prototype.createPanel(json.panels[x]);
            _createView(views[x]);
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
                $('#' + href).trigger('activate');
                e.preventDefault();
 
                $('#viewNav div').removeClass('selected');
                $(this).addClass('selected');
            });

        nav.appendTo('nav#viewNav');

        var view = $('<div>')
            .attr('id', _id)
            .addClass('view');

            if(!_views.length) { view.addClass('active'); }

        view.appendTo('div#viewSlider');

        // We can only have one view 'active' at a time
        // if(_views.length) { $(view).toggle();}

        _views.push(view);

        // Add panels
        for (var x = 0; x < config.panels.length; x++) {
            _createPanel(config.panels[x], '#' + _id);
        };

    }

    function _createPanel(_panel,parent) {
        console.log('making panel')
        // parent = "#" + parent;
        var panel = $('<div>')
            .attr('id', typeof(_panel.id) != 'undefined' ? _panel.id : "BLK_")
            .addClass((_panel.class) ? _panel.class : '')
            .addClass('panel')
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
            .addClass('button')
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

        $('<div>').addClass('locator').html('<h2>Location: <span></span></h2>').prependTo("#" + Engine.console);
        _createPanel({id: 'exits', title: 'Exits'},'.locator');
        _createPanel({id: 'actions', title: 'Actions'},'.locator');

        var slides = $('#viewSlider .view');
        console.log('slide: ', slides);
        slides.on('activate', function(e) {
            console.log('setting active');
            slides.eq(i).removeClass('active');

            $(e.target).addClass('active');

            // Update the active slide index
            i = slides.index(e.target);
        });

        Rooms.initialize();
    };

    function Layout() {};

    Layout.initialize = function () {
        console.log('loading');
        Engine.loadJSON('js/app/resources/layout.json', _parseLayout);
    }

    return Layout;
})();
