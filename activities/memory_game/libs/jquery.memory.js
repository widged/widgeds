/**
 * Memory game, a widged with jQuery
 * @version: 0.3 (2011/04/28)
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
(function($, undefined) {

    /**
     * Creates an activity
     *
     * @example $(".wg-qa").wgCardFlip();
     * @before <div class="wg-qa"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgMemory = function(o) { 
       return this.each(function() {
           $(this).data('wg', new $wg(this, o));
        });
    };

    var version = '0.3';

    // Default configuration properties.
    var defaults = {
         cardWidth: 100,
         cardHeight: 100,
         columnQty: 4,
         cardBack:     '<img src="assets/card_pattern.png"/>',
         cardMatch:    '<img src="assets/card_done.png"/>',
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
            this.container.bind("dataChange", function(e, data){ wg.onDataChange(data); });
            this.render();
         },
         
         onDataChange: function(data) {
            $.extend(this.options, data || {})
            this.render();
         },
         
         render: function(list) {
            if(!this.options.list) { return; }
            var list = this.options.list;
            var backHtml    = this.options.cardBack;
            var doneHtml   = this.options.cardMatch;
            var cardWidth  = this.options.cardWidth + 3;
            var cardHeight = this.options.cardHeight+ 3;
            var colQty     = this.options.columnQty;
            var maxX       = cardWidth * colQty;
            var maxY       = cardHeight * Math.ceil(list.length / colQty);
            var cardItem, posX = posY = 0;
            var gameBox    = $('<div style="position:relative;height:' + (maxY + 20) + 'px" />');
            var script = this;

            this.gameData = {listClicked: [], answeredQty: 0, answerQty: list.length};

             var pairItem, newList = [];
             var card, match;
             for(var i = 0; i < list.length; i++)
             {
                pairItem = list[i];
                card = pairItem.html;
                match = pairItem.options[0].html;
                if(match == undefined) { match = card }
                newList.push({html: card,  matchId: i});
                newList.push({html: match, matchId: i});
             }
             newList.sort(function(a,b){ return 0.5 - Math.random()});
             
             var list = newList;

            for(var i = 0; i < list.length; i++)
            {
               cardItem  = list[i];
               var slotHtml = '<div style="position:absolute;left:' + posX + 'px;top:' + posY + 'px"/>';
               var slotEl = $(slotHtml);
               slotEl.append('<div class="matched" style="position:absolute;">' + doneHtml + '</div>');
               slotEl.append('<div class="card" style="position:absolute;">' + cardItem.html + '</div>');
               slotEl.append('<div class="back" style="position:absolute;">' + backHtml + '</div>');
               slotEl.data = {id: i, matchId: cardItem.matchId};
               slotEl.bind("click", {el: slotEl }, function(event){
                  script.cardClicked(event.data.el, event.data.matchId);
               });
               
               gameBox.append(slotEl);
               posX += cardWidth;
               if(posX >= maxX) { posX = 0; posY += cardHeight; }
            }
            this.container.html('');
            this.container.append(gameBox);
            this.broadcastScore();
         },
         
         cardClicked: function(cardEl, matchId) {
            if(!this.gameData.timeStart) { this.gameData.timeStart = (new Date).getTime() ;}
            if(cardEl.data.matchId != -1) {
               cardEl.find('.back').css({'display':'none'});
            }
            
            if(!this.gameData.lastClicked) { this.gameData.lastClicked = cardEl; return; }
            
            var card1 = this.gameData.lastClicked;
            var card2 = cardEl;
            this.gameData.lastClicked = null;
            this.gameData.busy = true;

            if(card1.data.matchId == card2.data.matchId)
            {
               if(card1.data.id == card2.data.id) { return; }
               card1.data.matchId = -1;
               card1.unbind('click');
               card1.find('.card').animate({ visibility: 'toggle' }, 'slow');
               card1.find('.back').hide();
               card2.data.matchId = -1;
               card2.unbind('click');
               card2.find('.card').animate({ visibility: 'toggle' }, 'slow');
               card2.find('.back').hide();
               this.gameData.answeredQty++;
               this.broadcastScore();
               return;
            } 

            card1.find('.back').delay(250).animate({ visibility: 'show' }, 'slow');
            card2.find('.back').delay(250).animate({ visibility: 'show' }, 'slow');
         },
         
         // ##############################################
         // <<<  Events Broadcasting
         // ##############################################

         broadcastScore: function() {
            var msElapsed = (new Date).getTime() - this.gameData.timeStart;
            this.container.trigger('score.change',[{board: this.options.scoreBoard ,answerQty: this.gameData.answerQty, answeredQty: this.gameData.answeredQty, timeElapsed: msElapsed}]);
         }
 
         // ##############################################
         //    broadcasting >>>
         // ##############################################
    });


})(jQuery);

