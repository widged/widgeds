/*
 Memory Game - Memory Game
 http://github.com/widged/widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the jQuery library
   http://jquery.com
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

    var version = '0.0.2';

    // Default configuration properties.
    var defaults = {
         parser: false,
         scoreBoard: false,
         cardWidth: 100,
         cardHeight: 100,
         columnQty: 4,
         cardBackImage:     'assets/card_pattern.jpg',
         cardMatchImage:    'assets/card_done.jpg',
         cards: [
            {card: 'assets/apple_img.png',   match: 'assets/apple_txt.png'},
            {card: 'assets/banana_img.png',  match: 'assets/banana_txt.png'},
            {card: 'assets/burger_img.png',  match: 'assets/burger_txt.png'},
            {card: 'assets/carrots_img.png', match: 'assets/carrots_txt.png'},
            {card: 'assets/chicken_img.png', match: 'assets/chicken_txt.png'},
            {card: 'assets/fish_img.png',    match: 'assets/fish_txt.png'},
            {card: 'assets/grapes_img.png',  match: 'assets/grapes_txt.png'},
            {card: 'assets/milk_img.png',    match: 'assets/milk_txt.png'}
         ]
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
            var pairs = this.options.cards;
            this.container.bind("parseError", function(e, error){ alert(error.msg) });
            this.container.bind("parseResult", function(e, data){ wg.listResult(data.list); });
            $(document).trigger('parser.run',[{eventTarget:this.container, parser: this.options.parser, itemList: pairs}]);
         },
         
         listResult: function(list) {
            list.sort(function(a,b){ return 0.5 - Math.random()});
            this.gameData = {listClicked: [], answeredQty: 0, answerQty: (list.length / 2)};
            this.draw(list);
         },
         
         draw: function(list) {
            var backImg    = this.options.cardBackImage;
            var matchImg   = this.options.cardMatchImage;
            var cardWidth  = this.options.cardWidth + 3;
            var cardHeight = this.options.cardHeight+ 3;
            var colQty     = this.options.columnQty;
            var maxX       = cardWidth * colQty;
            var maxY       = cardHeight * Math.ceil(list.length / colQty);
            var cardItem, posX = posY = 0;
            var gameBox    = $('<div style="position:relative;height:' + (maxY + 20) + 'px" />');
            var script = this;

            for(var i = 0; i < list.length; i++)
            {
               cardItem  = list[i];
               var slotHtml = '<div style="position:absolute;left:' + posX + 'px;top:' + posY + 'px"/>';
               var slotEl = $(slotHtml);
               slotEl.append('<img class="matched" style="position:absolute;" src="' + matchImg + '"/>');
               slotEl.append('<img class="card"    style="position:absolute;" src="' + cardItem.img + '"/>');
               slotEl.append('<img class="back"    style="position:absolute;" src="' + backImg + '"/>');
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
            $(document).trigger('score.update',[{board: this.options.scoreBoard ,answerQty: this.gameData.answerQty, answeredQty: this.gameData.answeredQty, timeElapsed: msElapsed}]);
         }
 
         // ##############################################
         //    broadcasting >>>
         // ##############################################
    });


})(jQuery);

