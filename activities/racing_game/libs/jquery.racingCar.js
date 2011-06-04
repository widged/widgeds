/**
 * Racing Game, a learning activity with jQuery
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
     * @example $(".wg-racingCar").wgRacingCar();
     * @before <div class="wg-racingCar"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgRacingCar = function(o) {
         return this.each(function() {
            $(this).data('wg', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
 		// constants
      itemParser: "elementList",
 		minimumQuestionQty: 10,
 		sprites: [
 		  {image: 'assets/blue.png'},
 		  {image: 'assets/red.png'},
 		  {image: 'assets/green.png'},
 		  {image: 'assets/silver.png'}
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
            this.container.bind("dataChange", function(e, data){ wg.onDataChange(data); });
            this.render();
         },

         onDataChange: function(data) {
            $.extend(this.options, data || {})
            this.render();
         },


         render: function() {
            if(!this.options.list) { return; }
            // Build the html
            var list = this.options.list;

            this.controlBox;
            this.currentItem = 0;
            this.score = {answered: [], correctIndices: [], incorrectIndices: []};

            this.gameData = {timeStart: null, answeredQty: 0, answerQty: list.length};

            var gameScreen = $('<div style="border-color:#000000;border-style:solid;margin:0px;padding:0px;font-family:Geneva,Arial"/>')
            var w = this.container.width() - 20;
            gameScreen.width(w);
            
            this.controlBox = $('<div style="margin-top:10px;margin-bottom:40px;text-align:center;height:100px;width:100%;"/>'); // align center doesn't work as expected
            var spriteW = 90;
            var spriteH = 76;
            var racingBox = $('<div class="racingBox" style="position:relative;margin:10px;"/>');
            racingBox.css('margin-right', spriteW + 'px')
            var carList = this.options.sprites; 

            var sprite;
            spriteList = [];
            for(var i in carList)
            {
               var car = carList[i];
               var track =  $('<div style="position:relative;display:block;background-color:#F4F4F4;margin:3px;padding:0px;"/>');
               track.css('min-height', spriteH + 'px')
               sprite = $('<strong style="position:absolute;float:left;display:block;"><img src="' + car.image + '" height="66"/></strong><div>&nbsp;</div>');
               spriteList.push({left: 0, sprite: sprite});
               track.append(sprite);
               racingBox.append(track);
            }
            var stepQty = this.options.minimumQuestionQty;
            if(stepQty > list.length) { stepQty = list.length };
            var trackW = w - 3 - spriteW;
            this.distanceMax = (trackW);
            this.distanceStep = Math.round(this.distanceMax / stepQty);
            this.spriteColl = spriteList;
            
            gameScreen.append(this.controlBox);
            gameScreen.append(racingBox);
            this.container.html(gameScreen);
            
            this.updateActivity('init');
         },
         
         // ################
         // Interactivity
         // ################

         onStartClick: function() {
            this.updateActivity('start');
         },

         onOptionClick: function(item,option) {
            this.score.answered.push({item: item, option:option});
            var idx = this.score.answered.length;
            if(option['correct'])
            {
               this.score.correctIndices.push(idx);
               this.updateActivity('correct');
            }
            else
            {
               this.score.incorrectIndices.push(idx);
               this.updateActivity('incorrect');
            }
         },

        // ################
        // View
        // ################
        updateActivity: function(value) {

           var el;
           var timeElapsed;
           switch(value)
           {
              case 'init':
              case 'startAgain':
                  var buttonText, feedback;
                  if(value == 'startAgain') { 
                     buttonText = 'Start Again' ;
                     feedback = '<div>Finished!</div>';
                  } else { 
                     buttonText = 'Start';
                     feedback = '';
                  }
                  el = $('<div style="font-size:11px"><input type="submit" value="' + buttonText + '" style="border-color:#D3D3D3;border-width:1px;background-color:#E6E6E6;padding:8px;"/>' + feedback + '</div>');
                  el.bind( 
                    'click', // bind to multiple events 
                    { script: this }, // pass in data
                    function(eventObject) {  eventObject.data.script.onStartClick(); }
                  );                 
              break;

              case 'start':
                  // :TODO: add some screen with 'get ready' state, for instance counting down from 3 to 1
                  var list = this.options.list;
                  this.currentItem = 0;
                  this.score = {answered: [], correctIndices: [], incorrectIndices: []};
                  this.resetSprites(this.spriteColl);
                  this.refreshQuestion(list[this.currentItem],  Math.round(this.controlBox.width() / 2));
               break;

              case 'correct':
              case 'incorrect':
               var list = this.options.list;
                this.currentItem++;
                var isPreviousCorrect = value == 'correct';
                this.moveSprites(this.spriteColl, this.distanceStep, isPreviousCorrect);
                var item = list[this.currentItem];
                if(item != undefined && (this.spriteColl[0].left + 10) < this.distanceMax)
                {
                   this.refreshQuestion(item,  Math.round(this.controlBox.width() / 2));
                }
                else 
                {
                   this.updateActivity('startAgain');
                }
              break;
           }

           this.controlBox.html(el);
        },  
        
        /**
         * Move the sprites back to the starting positions.
         *
         * @result  (dom change)
         * @return undefined
         * @param defaultDist the default distance to move by (typically function of the number of questions in the quizz)
         * @param isAnswerCorrect whether the last answer was correct or not.
         */
        resetSprites: function(spriteList) {
           // position all sprites at start
           for(var i = 0; i < spriteList.length; i++)
           {
              sprite = spriteList[i];
              sprite.left  = 0;
              sprite.sprite.css("left", sprite.left + "px");
           }
        },
        
        /**
         * Move the sprites on the track
         *
         * @result  (dom change)
         * @return undefined
         * @param defaultDist the default distance to move by (typically function of the number of questions in the quizz)
         * @param isAnswerCorrect whether the last answer was correct or not.
         */
       moveSprites: function(spriteList, defaultDist, isAnswerCorrect) {
           var sprite;
           var progress;
           var halfDist = defaultDist / 2;
           for(var i = 0; i < spriteList.length; i++)
           {
              sprite = spriteList[i];
              if(i == 0)
              {
                 progress = (isAnswerCorrect == true) ? defaultDist : 0;
              }
              else
              {
                 progress = Math.round(halfDist + Math.random() * halfDist);
              }
              sprite.left  += progress;
              sprite.sprite.animate({"left": '+=' + progress}, 500);
           }
        },
        
        /**
         * Refresh the content of the question box
         *
         * @result  (dom change)
         * @return undefined
         * @param item the question item
         */
        refreshQuestion: function(item, screenCenter) {
           el = $('<div style="font-size:20px;width:300px;padding:5px;align:center;background-color:#E6E6E6;border-color:#555753;border-style:solid;border-width:5px;"/>');
           el.css('marginLeft', screenCenter - 150 + 'px');

           var itemBox = $('<div style="padding-top:10px;padding-bottom:10px;"/>');
           itemBox.html(item.html);
           var optionBox = $('<div style="display:block;padding-top:10px;padding-bottom:10px" />'); 
           var option; 
           var optionList = item.options;
           for(var i = 0; i < optionList.length; i++)
           {
              option = optionList[i];
              optionButton = $('<span style="border-color:#C3C3C3;border-style:solid;border-width:2px;background-color:#BCBDC6;padding:5px;padding-left:12px;padding-right:12px;margin-left:10px">' + option.html + '</span>');
              optionButton.bind( 
                'click', // bind to multiple events 
                { script: this, item: item, option: option }, // pass in data
                function(eventObject) {  eventObject.data.script.onOptionClick(eventObject.data.item, eventObject.data.option); }
              );                 
              optionBox.append(optionButton);
           }
           el.append(itemBox);
           el.append(optionBox);
           this.controlBox.html(el)
        }      
    });


})(jQuery);