/**
 * Quiz, a learning activity with jQuery
 * @version: 0.2 (2011/04/28)
 * @requires jQuery v1.4.2 or later 
 * @author Marielle Lange
 * Source: http://github.com/widged/widgeds
 *  
 * Built on top of the jQuery library
 *   http://jquery.com
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-Quiz").wgQuiz();
     * @before <div class="wg-Quiz"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgQuiz = function(o) {
         return this.each(function() {
            $(this).data('wg', new $wg(this, o));
         });
    };

    var version = '0.0.1';

    // Default configuration properties.
    var defaults = {
		itemRender: "block",
 		mode: 'gaps',
      feedbackCorrect: "Correct"
    };

    // ##############################################
    // <<<  Plugin logic, shared by all widgets
    //      (no modifications required, leave on top)
    // ##############################################
    /**
     * The widged object.
     *
     * @constructor
     * @class widged
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/widged
     */
    $wg = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});
        this.container   = $(e);
        this.setup();
    };
    
    $wg.fn = $wg.prototype = {
        version: this.version
    };

    $wg.fn.extend = $wg.extend = $.extend;


    // ##############################################
    //      End of plugin logic >>>
    // ##############################################

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
         setup: function() {
            this.itemList = [];
            this.score = {answered: [], correctIndices: [], incorrectIndices: []};

            var wg = this;
            this.container.bind("parseError", function(e, error){ alert(error.msg) });
            this.container.bind("parseResult", function(e, data){ wg.onDataChange(data.list); });
         },

         onDataChange: function(list) {
            this.gameData = {timeStart: null, answeredQty: 0, answerQty: list.length};
            this.itemList = list;
            this.render();
         },

         render: function() {
            // Build the html
            var list = this.itemList;
            var html = '';
            var el;
            this.container.html('');
            this.container.css({'line-height': 1.5});
            for(var i in list)
            {
               var item = list[i];
               // items
               switch (this.options.itemRender)
               {
                  case 'inline':
                     itemEl = $('<span>' + item.html + '</span>');
                     break;
                  default:
                     itemEl = $('<div class="item"/>');
                     itemEl.append('<span style="padding-right: 20px;">' + item.html + '</span>');
                     break;
               }
               switch(this.options.mode)
               {
                  case 'list':
                     el = this.optionsAsList(item.options);
                     break;
                  case 'options':
                     el = this.optionsAsMenu(item.options);
                     break;
                  default:
                  case 'shortAnswer':
                     el = this.optionsAsGaps(item.options);
                     break;
               }
               item.el = el;
               itemEl.append(el);
               this.container.append(itemEl);
            }
            
            var buttonText = 'Check';
            el = $('<div style="font-size:11px;margin-top:20px;"><input type="submit" value="' + buttonText + '"/></div>');
            el.bind( 
              'click', // bind to multiple events 
              { script: this }, // pass in data
              function(eventObject) {  eventObject.data.script.onCheckClick(); }
            );                 
            this.container.append(el);
         },
         
         parseSimpleList: function(str) {
            var str, item, list = [];
            var wg = this;
            this.container.children('p').each(function(i) {
               str = $(this).html();
               list.push(wg.parseSimpleListItem(str));
            });
            return list;
            
         },
         
         parseSimpleListItem: function(str) {
            var arr, itemHTML, options, optionList;
            arr = str.split("=");
            itemHTML = arr[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            options = arr[1];
            arr = options.split('|');
            optionList = [];
            for(var i = 0; i < arr.length; i++)
            {
               optionList.push({
                  html: arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
                  correct: (i == 0) ? true : false,
               });
            }
            optionList.sort(function(a,b){ return 0.5 - Math.random()});
            return {html: itemHTML, options: optionList};
         },
         
         parseInlineList: function() {
            var text = this.container.html();
            var arr = text.split("}}");
            var list = [], item = '';
            for(var i = 0; i < arr.length; i++)
            {
               item = arr[i];
               if(item == undefined) { continue; }
               list.push(this.parseInlineListItem(item, "i_" + i));
            }
            return list;
            
         },

         parseInlineListItem: function(str, id) {
            var list;
            var arr = str.split("{{");
            item = "" + arr[0];
            if(arr[1] != undefined)
            {
               list = [];
               str = "" + arr[1];
               arr = str.split("#");
               list = this.addOptions(list, "" + arr[0], true); // correct ones
               list = this.addOptions(list, "" + arr[1], false);  // distractors
               list.sort(function(a,b){ return 0.5 - Math.random()});
            }
            return {html: item, id: id, options: list};
         },
         
         addOptions: function(list, str, isCorrect) 
         {
            var arr = str.split("|");
            for(var i = 0; i < arr.length; i++)
            {
               list.push({html: arr[i], correct: isCorrect});
            }
            return list;
         },         
         // ################
         // Interactivity
         // ################
         onCheckClick: function() {
            var corrQty = 0;
            var totalQty = 0;
            for(var i in this.itemList)
            {
               var item = this.itemList[i];
               if(item.el == undefined) { continue; }
               if(item.el.isCorrect()) {
                  corrQty++;
               } 
               item.el.mark();
               item.el.change({item: item}, function (data) {
                   var el = $(data.data.item.el);
                   data.data.item.el.reset();
                 })                
               totalQty++;
            }
            var msg = 'correct: ' + corrQty + ', incorrect: ' + (totalQty - corrQty);
         },

        // ################
        // View
        // ################
        optionsAsList: function(list) {
           // options
           if(list == undefined) { return; }
           var selectHtml = '';
           var el = $('<div/>');
           el.registerCorrect = function(isCorrect) { console.log(isCorrect); }
           for (var o in list)
           {
              var opt = list[o];
              var optEl = $('<span style="margin-left: 21px;padding-left:6px;display: inline-block;">' + opt.html + '</span><br/>');
              optEl.bind( 
                'click', // bind to multiple events 
                { script: el, isCorrect: opt.correct, opt: optEl }, // pass in data
                function(eventObject) {  eventObject.data.script.onOptionClick(eventObject.data.isCorrect, eventObject.data.opt); }
              );                 
              
              el.append(optEl);
           }
           
           el.selectElement = el;
           el.answerCorrect = false;
           el.selectedAnswer = null;
           el.onOptionClick = function(isCorrect, optEl) {
              this.answerCorrect = isCorrect == true;
              if(this.selectedAnswer) { this.selectedAnswer.css({'margin-left': '21px', 'border-left': ''});  }
              this.selectedAnswer = optEl;
              el.reset();
             }

           el.isCorrect = function() { 
              return this.answerCorrect == true;
           }
           el.mark = function() { 
              var bgColor = this.isCorrect() ? '#0F9400' :  '#D50019';
              if(this.selectedAnswer) { 
                 this.reset();
                 this.selectedAnswer.css({'border-left': bgColor +  ' 6px solid', 'margin-left': '15px'});
               } else {
                  this.css({'background-color':''}); 
               }
            }
            el.reset = function() { 
               if(this.selectedAnswer) { 
                  this.css({'margin-left': '0px'}); 
                  this.selectedAnswer.css({'border-left': '#FFE180'+  ' 6px solid', 'margin-left': '15px'});
               } else {
                  this.css({'margin-left': '0px'}); 
               }
               
            }
            el.reset();
           return el;
        },

        optionsAsMenu: function(list) {
           // options
           if(list == undefined || list.length == 0) { return; }
           var selectHtml = '';
           for (var o in list)
           {
              var opt = list[o];
              selectHtml +=  '<option value="' + opt.correct + '">' + opt.html + '</option>';
           }
           var selectEl = $('<select>' + selectHtml + '</select>');
           var el = $('<span/>');
           el.selectElement = selectEl;
           el.isCorrect = function() { 
              return this.selectElement.val() == 'true';
           }
           el.mark = function() { 
              var bgColor = el.isCorrect() ? '#0F9400' :  '#D50019';
              this.css({'background-color': bgColor, 'padding': '3px 6px'}); 
            }
            el.reset = function() { 
               this.css({'background-color': '#FFF7C2', 'padding': '3px 6px'});
            }
            el.reset();
            el.append(selectEl);
           return el;
        },

        optionsAsGaps: function(list) {
           // options
           if(list == undefined) { return; }
           var selectEl = $('<input class="target" type="text" value="" />');
           var el = $('<span/>');
           el.selectElement = selectEl;
           el.isCorrect = function() { 
              var answer = this.selectElement.val();
              for (var i in list)
              {
                 var opt = list[i];
                 if(opt.html == answer && opt.correct == true)
                 {
                    return true;
                 }
              }
              return false;
           }
           el.mark = function() { 
              var bgColor = el.isCorrect() ? '#0F9400' :  '#D50019';
              this.css({'background-color': bgColor, 'padding': '3px 6px'}); 
            }
            el.reset = function() { 
               this.css({'background-color': '#FFF7C2', 'padding': '3px 6px'});
            }
            el.reset();
            el.append(selectEl);
           return el;
        }
    });


})(jQuery);