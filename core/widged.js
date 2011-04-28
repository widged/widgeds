/*
 Widged Library

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
(function(jQuery){
  var widged = {};
  if(!window.widged){window.widged=widged;}//We create a shortcut for our framework, we can call the methods by $$.method();
})();


/*
 Scoreboard for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

(function(){
    var scoreboard = {

       boardEl: null,

       init: function () {
          $(document).bind("score.update", function(e, status){
             scoreboard.updateFeedback(status);
          });
       },
       
       hello: function(status) {
          alert('status:' + status.answerQty)          
       },
       
       updateFeedback: function(params) {
          var boardEl = params.board;
          var msg = 'Answered: ' + params.answeredQty + "/" + params.answerQty;
          if(params.answeredQty == params.answerQty)
          {
             var s = Math.floor(params.timeElapsed / 1000);
       		// format time like hh:mm:ss
       		var h = parseInt(s / 3600), m = parseInt((s - h * 3600) / 60); s = s % 60;
       		var formatted = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
             msg += '&nbsp;&nbsp;&nbsp;Completion time: ' + formatted;
             
          }
          jQuery(boardEl).html(msg);
       }
    };
   
   $.extend(true, widged, {scoreboard: scoreboard});
})();

/*
 Parser functions for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
(function(){
    var parser = {
       init: function () {
          $(document).bind("parser.run", function(e, data){
             e.stopPropagation();
             parser.run(data.eventTarget, data);
          });
       },

       run: function(eventTarget, params) {
          var settings = params.parser;
          var parserId = params.parser.uid;
          var itemList, data, error;

          if(params.itemList) {
             itemList = params.itemList;
          } else {
             itemList = widged.parser.itemsInElement(eventTarget);
          }
          
          
          switch(parserId)
          {
               case 'memoryGame':
                  data = {list: parser.memoryGame(itemList)};
                  break;
               case 'parseItems':
                  data = {list: parser.parseItemList(itemList, settings)};
                  break;
               case 'parseItem':
                  data = parser.parseItem(params.text, 0, settings);
                  break;
               case 'dataSerie':
                  data = {list: parser.parseDataSerie(itemList, settings)};
                  break;
               default:
                  data = null;
                  error = {msg: 'parser not found: ' + parserId};
                  break;
          }
          if(error) {
             $(eventTarget).trigger('parseError',error);
          } else {
             $(eventTarget).trigger('parseResult',data);
          }          
       },
       
       itemsInElement: function(eventTarget) {
          var list = [];
          eventTarget.children('p').each(function(i) {
              list.push($(this).html());
         });
         return list;
       },

       memoryGame: function (itemList) {
           var pairItem, list = [];
           for(var i = 0; i < itemList.length; i++)
           {
              pairItem = itemList[i];
              if(pairItem.match == undefined) { pairItem.match = pairItem.card }
              list.push({img: pairItem.card,  matchId: i});
              list.push({img: pairItem.match, matchId: i});
           }
           return list;
       },

       parseDataSerie: function(itemList, parserSettings) {
          var list = [];
          var item, arr, itemHTML, options, optionList;
          for (var i = 0; i < itemList.length; i++) {
             item = itemList[i];
             arr = item.split("=");
             list.push([parseInt(arr[1],10), arr[0]]);
          };
          return list;
       },
       
       // ################
       // Items Parsers
       // ################
       
       parseItemList: function(itemList, parserSettings) {
          var settings = jQuery.extend({answerMarker: '=', optionMarker: "#"}, parserSettings);
          var str, item, list = [];
          var wg = this;
          var itemIdx = 0;
          for (var i = 0; i < itemList.length; i++) {
             str = itemList[i];
             list.push(wg.parseItem(str, itemIdx, settings));
             itemIdx++;
          };
          return list;
       },



       /**
        * Transform an item as specified by the user into an internal item object.
        *
        * @return {Object}
        * @param str String An item string that follows the following conventions - question = options   
        */
       parseItem: function(str, id, settings) {
          var item = {id: id, html: '', options: []};
          settings = jQuery.extend({answerMarker: "="}, settings);
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