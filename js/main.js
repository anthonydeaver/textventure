requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        extra: '../extras'
    }
});

requirejs([
        'jquery', // third-party libs       
        'app/Engine', 'app/Layout', 'app/User', // App engine
        // 'extra/User'// Extras
    ],
	function(Engine, layout, User) {
        console.log('Engine: ', Engine);
        Engine.init();
	}
);