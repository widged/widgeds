(function(){
    var parser = {
       init: function () {
          $(document).bind("parser.run", function(e, status){
             e.stopPropagation();
             console.log(status.parser)
             switch(status.parser)
             {
                case 'memoryGame':
                  parser.memoryGame(status.itemList, status.eventTarget);
                  break;
             }
          });
       },

       memoryGame: function (itemList, eventTarget) {

           var pairItem, list = [];
           for(var i = 0; i < itemList.length; i++)
           {
              pairItem = itemList[i];
              if(pairItem.match == undefined) { pairItem.match = pairItem.card }
              list.push({img: pairItem.card,  matchId: i});
              list.push({img: pairItem.match, matchId: i});
           }
           // if using parser.result, it triggers parser.run again.
           $(eventTarget).trigger('result',[{data: list}]);
       }
    };
   
   $.extend(true, widged, {parser: parser});
})();