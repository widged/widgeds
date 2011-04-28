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
                 parser.parseItemList(data.eventTarget, data.parser);
                 break;
              case 'dataSerie':
                parser.parseDataSerie(data.eventTarget, data.parser);
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

       parseDataSerie: function(eventTarget, parserSettings) {
          var list = [];
          var item, arr, itemHTML, options, optionList;
          eventTarget.children('p').each(function(i) {
             item = $(this).html();
             arr = item.split("=");
             list.push([parseInt(arr[1],10), arr[0]]);
          });
          $(eventTarget).trigger('result',{list: list});
       },
       
       // ################
       // Items Parsers
       // ################
       
       parseItemList: function(eventTarget, parserSettings) {
          var settings = jQuery.extend({answerMarker: '=', optionMarker: "#"}, parserSettings);
          console.log("[parser.parseItemList]", settings);
          var str, item, list = [];
          var wg = this;
          var itemIdx = 0;
          eventTarget.children('p').each(function(i) {
             str = $(this).html();
             list.push(wg.parseItem(str, itemIdx, settings));
             itemIdx++;
          });
          console.log("--", list);
          $(eventTarget).trigger('result',{list: list});
       },



       /**
        * Transform an item as specified by the user into an internal item object.
        *
        * @return {Object}
        * @param str String An item string that follows the following conventions - question = options   
        */
       parseItem: function(str, id, settings) {
          var item = {id: id, html: '', options: []};
          var arr = str.split(settings.answerMarker);
          if(arr[0]) { item.html = this.trim(arr[0]); }
          if(!arr[0] || !arr[1]) { return item }
          arr = String(arr[1]).split("#");
          if(arr[0]) { item.options = item.options.concat(this.parseItemOptions(arr[0], true, settings)) };
          if(arr[1]) { item.options = item.options.concat(this.parseItemOptions(arr[1], false, settings)) };
          return item;
       },
       
       /**
        * Transform the options part of an item as specified by the user into an internal item object.
        *
        * @return {Object}
        * @param str String An item string that follows the following conventions - correct1 | correct2 | correct3 # distractor1 | distractor2 | distractor3   
        */
       parseItemOptions: function(str, isCorrect, settings) 
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