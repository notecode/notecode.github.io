// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2017-02-17 18:17:17
 
//
// 两难的一个纠结：若start中直接写click绑定的handler，则最终start会很长很长；
// 若只写绑定，将handler提出去作为function（不是Module的member），Module的this值传起来又有点不直白，如下:
//  this.el('foo').click(this, fooHandler);
//
//  function fooHandler(event) {
//      var mod = event.data;
//      mod._events.emit(...);
//      // this, is the clicked element
//  }
//

define(function () {
    (function() {
        T.Module.Header = T.createModule({
            start: function(resolve, reject) {
                var mod = this;
                console.log('Hello, module header is OK.');
                console.log('Use customed terrific this.find(): ' + this.find('p').text());

                this.el('btn-foo').click(mod, fooHandler);
                // ...绑定一系列事件
            },
        });

        function fooHandler(event) {
            var mod = event.data;
            console.log('[header]You clicked me');
            mod._events.emit('click-on-header', {a: 'xxx'});
        }
    })();
})
