requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['jquery', 
           'app/Engine', 
           'app/Layout', 
           'app/User'],
	function() {
        Engine.init();
	}
);