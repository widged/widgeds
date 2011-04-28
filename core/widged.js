(function(jQuery){
 
 var widged = {
    init: function () {
       if(widged.scoreboard) {
          widged.scoreboard.init();
       };
       if(widged.parser) {
          widged.parser.init();
       };
    },
    
    
 };
 
 if(!window.widged){window.widged=widged;}//We create a shortcut for our framework, we can call the methods by $$.method();
})();

