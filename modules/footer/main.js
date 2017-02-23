// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2017-02-18 15:36:58
 
define(function () {
    (function() {
        T.Module.Footer = T.createModule({
            start: function(resolve, reject) {
                var mod = this;
                console.log('Footer is OK');

                this._events.on('click-on-header', function (data) {
                    console.log('[footer]clicked header: ' + data.a);
                    // use mod ref this module
                });
            }
        });
    })();
})
