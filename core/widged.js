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
       hookMap: {},

       hook: function (boardSel, widgedSel) {
          var widgedEl = jQuery(widgedSel);
          if(!scoreboard.hookMap[widgedEl]) { scoreboard.hookMap[widgedEl] = [] }; 
          scoreboard.hookMap[widgedEl].push(boardSel); 

          widgedEl.bind("score.change", function(e, status){
             scoreboard.updateFeedback(e.target, status);
          });
       },
       
       updateFeedback: function(wgEl, params) {
          // when using this.hookMap, the object content is lost after the binding. 
          // coreboard.hookMap maintains the value over binding (static variable);
          var wgEl = jQuery(wgEl);
          var boardList = scoreboard.hookMap[wgEl];
          for(var i = 0; i < boardList.length; i++) {
             var boardEl = jQuery(boardList[i]);
             
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
          };
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
       
       run: function(eventTarget, parserId, settings) {
          var itemList, itemText, data, error;
          var eventTarget = jQuery(eventTarget);


          switch(parserId)
          {
                case 'singleItem':
                   itemText = this.getItemText(eventTarget, settings);
                   data = parser.parseItem(itemText, 0, settings);
                   break;
               case 'memoryGame':
                  itemList = this.getItemList(eventTarget, settings);
                  data = {list: parser.memoryGame(itemList)};
                  break;
               case 'itemList':
                  itemList = this.getItemList(eventTarget, settings);
                  data = {list: parser.parseItemList(itemList, settings)};
                  break;
               case 'inlineList':
                  itemText = this.getItemText(eventTarget, settings);
                  data = {list: parser.parseInlineList(itemText, settings)};
                  break;
               case 'dataSeries':
                  itemList = this.getItemList(eventTarget, settings);
                  data = {list: parser.parseDataSerie(itemList, settings)};
                  break;
               case 'words':
                  itemText = this.getItemText(eventTarget, settings);
                  data = {list: parser.parseWords(itemText, settings)};
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
       
       getItemList: function(eventTarget, settings) {
          if(settings && settings.itemList) {
             return settings.itemList;
          }

          var list = [];
          eventTarget.children('p').each(function(i) {
              list.push($(this).html());
         });
         return list;
       },

       getItemText: function(eventTarget, settings) {
          if(settings && settings.text) {
             return settings.text;
          }

         return eventTarget.html();
       },

       // ################
       // ### Parsers
       // ################

       // ### memory Game

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

       // ### data series

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
       
       // ### in-line List
       parseInlineList: function(text, settings) {
          var arr = text.split("}}");
          var list = [], item = '';
          for(var i = 0; i < arr.length; i++)
          {
             item = arr[i];
             if(item == undefined) { continue; }
             if(!settings) { settings = {}; }
             settings.answerMarker = "{{";
             list.push(widged.parser.parseItem(item, "i_" + i, settings));
          }
          return list;
       },

       // ### Words
       parseWords: function(text) {
          var arr = text.split(/[ \t\n]+/);
          var list = [], item = '';
          for(var i = 0; i < arr.length; i++)
          {
             item = arr[i];
             if(item == undefined || !item.length) { continue; }
             list.push({html: item});
          }
          return list;
       },
       

       // ### element list
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
          item.options.sort(function(a,b){ return 0.5 - Math.random()});
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
       
       
       
       // ################
       // ### Utilities
       // ################
       trim: function(str) {
          return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
       }  
       
    };
   
   $.extend(true, widged, {parser: parser});
})();