/*
 Matching game
 http://github.com/widged/widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the jQuery library
   http://jquery.com
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

    var version = '0.0.1';

    // Default configuration properties.
    var defaults = {
       parser: {uid: "itemList"},
         scoreBoard: false,
			answerMarker: '=',
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

    $wg.extend({
        /**
         * Gets/Sets the global default configuration properties.
         *
         * @return {Object}
         * @param d {Object} A set of key/value pairs to set as configuration properties.
         */
        defaults: function(d) {
            return $.extend(defaults, d || {});
        }
   
    });

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
            this.container.bind("parseResult", function(e, data){ wg.listResult(data.list); });
            $(document).trigger('parser.run',{eventTarget:this.container, parser: this.options.parser});
         },
         
         listResult: function(list) {
            this.gameData = {timeStart: null, answeredQty: 0, answerQty: list.length};
            this.draw(list);
         },
         
         draw: function(list) {

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
            var script = this;
            var questionBox  = $('<div id="cardSlots"> </div>');
            for ( var i=0; i< list.length; i++ ) {
               item = list[i];
                var dropEl = $('<div style="margin:6px 0px;padding:6px;background-color:' + this.options.questionBackgroundColor + ';border: 1px solid ' + this.options.questionBorderColor  +';">' + item.html + '</div>').data( 'number', item.id ).droppable( {
                   accept: '#cardPile div',
                   hoverClass: 'hovered',
                   drop: function(event, ui){
                     script.handleCardDrop(event, ui, this);
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
           },
         
           broadcastScore: function() {
              var msElapsed = (new Date).getTime() - this.gameData.timeStart;
              $(document).trigger('score.update',[{board: this.options.scoreBoard ,answerQty: this.gameData.answerQty, answeredQty: this.gameData.answeredQty, timeElapsed: msElapsed}]);
           }
    });



})(jQuery);