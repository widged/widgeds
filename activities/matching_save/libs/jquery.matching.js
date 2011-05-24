/**
 * Matching widged, a learning activity with jQuery
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
     * @example $(".wg-qa").wgCardFlip();
     * @before <div class="wg-qa"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgDragDrop = function(o) { 
       return this.each(function() {
           $(this).data('wg', new $wg(this, o));
        });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
			questionBackgroundColor: '#E6FFB3',
			questionBorderColor: '#C4E67F',
			answerBackgroundColor: '#F4CFE8',
			answerBorderColor: '#F492D4'
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
            var list = this.itemList;

            this.container.html('');
            list.sort( function() { return Math.random() - .5 } );
            var item;
            var answerBox = $('<div id="cardPile" style="background-color:#FFFFFF;border: 1px dashed #999;width:300px"></div>');
            var answerList = [];
            for ( var i=0; i< list.length; i++ ) {
               item = list[i];
               for ( var o=0; o< item.options.length; o++ ) {
                  answerList.push({html: item.options[o].html, itemId: item.id})
               }
            }
            var answer;
            answerList.sort( function() { return Math.random() - .5 } );
            for ( var i=0; i< answerList.length; i++ ) {
               answer = answerList[i];
               $('<div style="float:left;margin: 3px 6px;padding: 3px 6px;background-color:' + this.options.answerBackgroundColor +';border:1px solid ' + this.options.answerBorderColor + ';">' + answer.html + '</div>').data( 'number', answer.itemId ).attr( 'id', 'card'+answer.itemId ).appendTo( answerBox ).draggable( {
                 containment: this.container,
                 stack: '#cardPile div',
                 cursor: 'move',
                 revert: true
               } );
               
            }
            
            answerBox.append('<div style="clear:both"/>');
            this.gameData.answerQty = answerList.length;
            list.sort( function() { return Math.random() - .5 } );
            var that = this;
            var questionBox  = $('<div id="cardSlots"> </div>');
            for ( var i=0; i< list.length; i++ ) {
               item = list[i];
                var dropEl = $('<div style="margin:6px 0px;padding:6px;background-color:' + this.options.questionBackgroundColor + ';border: 1px solid ' + this.options.questionBorderColor  +';">' + item.html + '</div>').data( 'number', item.id ).droppable( {
                   accept: '#cardPile div',
                   hoverClass: 'hovered',
                   drop: function(event, ui){
                     that.handleCardDrop(event, ui, this);
                   }
                 } );                
                 dropEl.appendTo( questionBox);
              }     
              
              this.container.append(questionBox);
              this.container.append(answerBox);
              this.broadcastScore();
         },

         handleCardDrop: function( event, ui, el) {
             if(!this.gameData.timeStart) { this.gameData.timeStart = (new Date).getTime() ;}
              var slotNumber = $(el).data( 'number' );
              var cardNumber = ui.draggable.data( 'number' );

              // If the card was dropped to the correct slot,
              // change the card colour, position it directly
              // on top of the slot, and prevent it being dragged
              // again

              if ( slotNumber == cardNumber ) {
                this.gameData.answeredQty++;
//                ui.draggable.addClass( 'correct' );
                ui.draggable.draggable( 'disable' );
                ui.draggable.position( { of: $(el), my: 'right top', at: 'right top' } );
                ui.draggable.draggable( 'option', 'revert', false );
                ui.draggable.delay(250).animate({ opacity: 0}, 'slow');
                this.broadcastScore();
              } 
              
              if(this.gameData.answeredQty == this.gameData.answerQty)
              {
                 this.container.trigger('complete',[
                   {tried: this.gameData.answeredQty, correct: this.gameData.answerQty, progress: 100, time: this.gameData.timeElapsed, errorList: ""}]
                );
/*
{ user: playerName, 
  url: "http://xxx.com",
  id: "a-0", title: "sortItems", 
   tried: 10, correct:  Math.round(Math.random() * 10), progress: 100,
         time: "00:00:04",
         errorList: "x=4"
      }
);

*/                  
              }
           },
         
           // ##############################################
           // <<<  Events Broadcasting
           // ##############################################
           broadcastScore: function() {
              var msElapsed = (new Date).getTime() - this.gameData.timeStart;
              this.gameData.timeElapsed = msElapsed;
              this.container.trigger('score.change',[{answerQty: this.gameData.answerQty, answeredQty: this.gameData.answeredQty, timeElapsed: this.gameData.timeElapsed}]);
           }
           // ##############################################
           //    broadcasting >>>
           // ##############################################

    });



})(jQuery);