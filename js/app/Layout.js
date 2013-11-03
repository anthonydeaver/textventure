var Layout = function() {
	var $Engine;

    /**
     * Break-up the config and render the 
     * @param  {[type]} json
     * @return {[type]}
     */
	function configLayout(json) {
		$Engine.log('layout JSON loaded');

		var x;

		// We build panels first since buttons and
		// text might go inside them
		for (x = 0; x < json.panels.length; x++) {
			_layout.prototype.createPanel(json.panels[x]);
		};


		// Draw any default buttons
		for (x = 0; x < json.buttons.length; x++) {
			$Engine.createButton(json.buttons[x]);
		};
	};

    var _layout = function() {
        this.initialize.apply(this, arguments);
    };

    // createPanel is here because it's pure layout and doesn't 
    // depend
    /**
     * createPanel creates a simple container div for logs, buttons,
     * and various other acoutrement. It is pure layout and doesn't
     * depend on any other classes like button
     * @param  {Object} config
     */
    _layout.prototype.createPanel = function(config) {
    	console.log()
        var panel = $('<div>')
            .attr('id', typeof(config.id) != 'undefined' ? config.id : "PNL_")
            .addClass(config.class + ' panel')
            .html(typeof(config.title) != 'undefined' ? $("<h2>").text(config.title)  : "")

        if(config.width) {
            panel.css('width', config.width);
        }
        if(config.border) {
            panel.css('border', config.border);
        }
        panel.appendTo('div#gameboard');
    };

    /**
     * store parent and load up the layout info
     * @param  {Class} parent
     */
    _layout.prototype.initialize = function(parent) {
        $Engine = parent;
        $Engine.loadData('js/app/resources/layout.json', configLayout);
        $Engine.log('layout init');
    };

    return _layout;
	
}