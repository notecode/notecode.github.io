// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2017-02-17 17:34:31
 
requirejs(['./modules/header/main', './modules/footer/main'], function(header) {
    var app = new T.Application();
    app.registerModules();
    app.start();

})


