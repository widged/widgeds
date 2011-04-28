(function(){
    var parser = {
       init: function () {
          $(document).bind("parser.run", function(e, data){
             e.stopPropagation();
             switch(data.parser.uid)
             {
                case 'memoryGame':
                  parser.memoryGame(data.itemList, data.eventTarget);
                  break;
               case 'parseItems':
                 parser.parseItemList(data.eventTarget, data.parser.answerMarker);
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
       },
       
       // ################
       // Items Parsers
       // ################
       parseItemList: function(eventTarget, answerMarker) {
          var str, item, list = [];
          var wg = this;
          var itemIdx = 0;
          eventTarget.children('p').each(function(i) {
             str = $(this).html();
             list.push(wg.parseItem(str, itemIdx, answerMarker));
             itemIdx++;
          });
          $(eventTarget).trigger('result',{list: list});
       },

       /**
        * Transform an item as specified by the user into an internal item object.
        *
        * @return {Object}
        * @param str String An item string that follows the following conventions - question = options   
        */
       parseItem: function(str, id, answerMarker) {
          var item = {id: id, html: '', options: []};
          var arr = str.split(answerMarker);
          if(arr[0]) { item.html = this.trim(arr[0]); }
          if(!arr[0] || !arr[1]) { return item }
          arr = String(arr[1]).split("#");
          if(arr[0]) { item.options = item.options.concat(this.parseItemOptions(arr[0], true)) };
          if(arr[1]) { item.options = item.options.concat(this.parseItemOptions(arr[1], false)) };
          return item;
       },
       
       /**
        * Transform the options part of an item as specified by the user into an internal item object.
        *
        * @return {Object}
        * @param str String An item string that follows the following conventions - correct1 | correct2 | correct3 # distractor1 | distractor2 | distractor3   
        */
       parseItemOptions: function(str, isCorrect) 
       {
          var arr = str.split("|");
          var list = [];
          for(var i = 0; i < arr.length; i++)
          {
             list.push({html: arr[i], correct: isCorrect});
          }
          return list;
       },         
       
       trim: function(str) {
          return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
       }  
       
    };
   
   $.extend(true, widged, {parser: parser});
})();