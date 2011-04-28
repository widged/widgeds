(function(){
    var parser = {
       init: function () {
          console.log('[parser.init]');
          $(document).bind("parser.run", function(e, status){
             console.log('[parser.runEvent]');
             e.stopPropagation();
             parser.items(status);
          });
       },

       items: function (params) {
          console.log('[parser.item]');
          var parserType = params.parser;
          var itemList = params.itemList;
          var eventTarget = params.eventTarget;

           var pairItem, list = [];
           for(var i = 0; i < itemList.length; i++)
           {
              pairItem = itemList[i];
              if(pairItem.match == undefined) { pairItem.match = pairItem.card }
              list.push({img: pairItem.card,  matchId: i});
              list.push({img: pairItem.match, matchId: i});
           }
           console.log('[parser.trigger]');
           // if using parser.result, it triggers parser.run again.
           $(eventTarget).trigger('result',[{data: list}]);
       }
    };
   
   $.extend(true, widged, {parser: parser});
})();