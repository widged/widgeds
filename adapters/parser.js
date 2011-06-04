/*
 Parser functions for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
;(function($){
   
    var plugin = {
       run: function(eventTarget, parserId, settings) {
          var itemList, itemText, data, error;
          var eventTarget = $(eventTarget);

          switch(parserId)
          {
                case 'questionAnswer':
                  itemText = this.getItemText(eventTarget, settings);
                  var item = plugin.parseItem(itemText, 0, settings);
                  data = {question: item.html, answer: item.options[0].html}
                  break;
                case 'singleItem':
                   itemText = this.getItemText(eventTarget, settings);
                   data = {item: plugin.parseItem(itemText, 0, settings)};
                   break;
               case 'itemList':
                  itemList = this.getItemList(eventTarget, settings);
                  data = {list: plugin.parseItemList(itemList, settings)};
                  break;
               case 'inlineList':
                  itemText = this.getItemText(eventTarget, settings);
                  data = {list: plugin.parseInlineList(itemText, settings)};
                  break;
               case 'dataSeries':
                  itemList = this.getItemList(eventTarget, settings);
                  data = {list: plugin.parseDataSerie(itemList, settings)};
                  break;
               case 'words':
                  itemText = this.getItemText(eventTarget, settings);
                  data = {list: plugin.parseWords(itemText, settings)};
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
          var settings = $.extend({answerMarker: '=', optionMarker: "#"}, parserSettings);
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
          settings = $.extend({answerMarker: "="}, settings);
          var arr = str.split(settings.answerMarker);
          if(arr[0]) { item.html = arr[0]; }
          if(settings.trim) { item.html = this.trim(item.html); }
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
          var list = [], html;
          for(var i = 0; i < arr.length; i++)
          {
             html = (settings.trim) ? this.trim(arr[i]) : arr[i];
             list.push({html: html, correct: isCorrect});
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
   
   if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {parser: plugin});
})(jQuery);