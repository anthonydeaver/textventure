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

    function _finalizeLayout() {

        $('<div>').addClass('locator').prependTo("#" + Engine.console);
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


    Layout.addButtons = function(buttons) {
        var btns,
            func = function() { Engine.log("click"); };

        for(var id in buttons) {
            var config = buttons[id];

             btns = $('#buttons', config.parent);

            if (typeof(config.click) != 'undefined') {
                func = config.click
            }

            var btn = $('<div>')
                .attr('id', typeof(config.id) != 'undefined' ? config.id : "BTN_" + Engine.GUID())
                .addClass('button')
                .text(typeof(config.label) != 'undefined' ? config.label : "button")
                .click(function() { 
                    $(this).data("handler")($(this));
                })
                .data("handler",  func ).appendTo(btns);
        }
    }

    Layout.button = function(button) {
        var func = function() { Engine.log("click"); };

        if (typeof(button.click) != 'undefined') {
            func = button.click;
        }

        var btn = $('<div>')
            .attr('id', typeof(button.id) != 'undefined' ? button.id : "BTN_" + Engine.GUID())
            .addClass('button')
            .text(typeof(button.label) != 'undefined' ? button.label : "button")
            .click(function() { 
                $(this).data("handler")($(this));
            })
            .data("handler",  func );

        if(button.options) {
            var ops = button.options;
            for (var id in ops) {
                btn.data(id, ops[id]);
            } 
        }
        return btn;
    }

    return Layout;
})();
