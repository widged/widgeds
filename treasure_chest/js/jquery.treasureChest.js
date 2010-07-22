/*
 jTreasurechest - Treasure Chest Learning Activity with jQuery
 http://github.com/widged/exercist-widgeds

 Created: Marielle Lange, 2010
 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

 Built on top of the jQuery library
   http://jquery.com

 Loosely adapted from a script written by Thomas Boutell
   http://vader.boutell.com/~boutell/geek.cgi
*/

(function($) {

    /**
     * Creates a treasure chest activity
     *
     * @example $(".treasure-chest").wgTreasureChest();
     * @before <div id="myTreasureChest" class="treasure-chest"></div>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgTreasureChest = function(o) {
         return this.each(function() {
            $(this).data('wgTreasureChest', new $wg(this, o));
         });
    };

    // Default configuration properties.
    var defaults = {
       room: {
          dimW: 8,
          dimH: 8,
          map: "" + 
           "*      *" + 
           " ****** " + 
           " *#-*** " + 
           " *| *|* " + 
           " *|* |* " + 
           " ***-#* " + 
           " ****** " + 
           "*      *"
       },
       warnings: {
          delay:           "To move, you must CLICK THE MOUSE on the place " + "you want to go.",
          longDelay:       "To move, you must CLICK THE MOUSE on the place " + "you want to go.",
          notInitialized:  "Please wait a moment for the game to begin.",
          dimWH:           "The parameters for the width and Height of the room must have positive values.",
          defRoom:         "The Room definition doesn't seem to be of the correct dimension.",
          congratulations: "Game Over\n\nCongratulations, you have picked all target words",
       },
       tiles: {
          gameOver: "<img src='pix/room/gameover.gif'>",
          blank: "<img src='pix/room/blank.gif'>",
          obstacle: {
            dirH: "<img src='pix/room/arctic-landscape.png'>",
            dirV: "<img src='pix/room/arctic-landscape.png'>",
            dirC: "<img src='pix/room/igloo.png'>"
          }
       },
       avatar:  {
         loc:  {x: 6, y: 5},
         up:   "<img src='pix/penguin.png' class='gridimg'>",
         down: "<img src='pix/penguin.png' class='gridimg'>",
         left: "<img src='pix/penguin.png' class='gridimg'>",
         right: "<img src='pix/penguin.png' class='gridimg'>",
       },
       items: {
          targetPoints: 100,
          distractorPoints: -100,
          targets: [
             "<img src='pix/tags/apple.gif'  width='80'>",
             "<img src='pix/tags/banana.gif' width='80'>",
             "<img src='pix/tags/steak.gif'  width='80'>",
             "<img src='pix/tags/fish.gif'   width='80'>"
           ], 
           distractors: [
              "<img src='pix/tags/sugar.gif'   width='80'>",
              "<img src='pix/tags/cereal.gif'  width='80'>",
              "<img src='pix/tags/milk.gif'    width='80'>",
              "<img src='pix/tags/butter.gif'  width='80'>",
              "<img src='pix/tags/water.gif'   width='80'>",
              "<img src='pix/tags/rice.gif'    width='80'>"
           ]
       }       
    };
    
    /**
     * The wgTreasureChest object.
     *
     * @constructor
     * @class wgTreasureChest
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/wgTreasureChest
     */
    $.wgTreasureChest = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});

        this.container  = $(e);
        
        this.feedback = $('<div class="treasure-chest-feedback">');
        this.feedback.css({'padding': '10px', 'background-color': '#FFFFD0', 'font-family': 'Verdana', 'font-size': '12pt', 'line-height': '2' });
        // score
        scoreDiv    = $('<div>Score:&nbsp;&nbsp;</div>');
        this.scoreBox   = $('<span class="treasure-chest-score"/>');
        scoreDiv.append(this.scoreBox);
        
        // pickQty
        pickQtyDiv = $('<div>Remaining to Pick:&nbsp;&nbsp;</div>');
        this.pickQtyBox = $('<span class="treasure-chest-to-pick"/>')
        pickQtyDiv.append(this.pickQtyBox);
        
        this.warningBox = $('<div class="treasure-chest-warning" />');
        this.feedback.append(scoreDiv);
        this.feedback.append(pickQtyDiv);
        this.feedback.append(this.warningBox);
        this.container.append(this.feedback);

        this.roomBox = $('<div class="treasure-chest-room">if you see this, there is a problem with javascript</div>');
        this.container.append(this.roomBox);


        /*          
          <!--
          <div id="picked_y">picked items appear here.</div>
          <div id="picked_n">picked items appear here.</div>
          -->
        </div>
        */
        
        this.setup();
        this.startActivity();
    };
    
    

    // Create shortcut for internal use
    var $wg = $.wgTreasureChest;

    $wg.fn = $wg.prototype = {
        wgTreasureChest: '0.0.1'
    };

    $wg.fn.extend = $wg.extend = $.extend;

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
        setup: function() {

           // game parameters
           this.avatar        = this.options.avatar;
           this.avatar['seek'] = {x: 0, y: 0};
           this.threshold      = 0;
           // status
           this.gameOverFlag   = false;
           this.playerHasMoved = false;
           this.initialized    = false;
           // tile types
           this.idAvoid        = 0;
           this.idObstacle     = 1;
           this.idBlank        = 2;
           this.idDoPick       = 3;
           this.idNoPick       = 4;
           this.idAvatar       = 5;
           this.idGameOver     = 6;
           
           this.roomW = this.options.room.dimW;
           this.roomH = this.options.room.dimH;
        },

        /**
         * Clears the list and resets the widged.
         *
         * @return undefined
         */
        reset: function() {
           console.log("[reset]");
        },

        /**
         * Clears the list and resets the widged.
         *
         * @return undefined
         */
        startActivity: function() {

            // status
            this.gameOverFlag   = false;
            this.initialized    = false;
            // score and feedback
            this.score          = 0;
            this.pickQty        = this.options.items.targets.length;

            // Checking and initialisation
            if (this.checkValues() > 1) { return; }
         
            this.updateFeedback();

            this.initRoom(this.roomW, this.roomH);
            this.drawRoom(this.roomBox, this.roomW, this.roomH);
            this.parseMap();
            this.positionAvatar(this.avatar);
            this.addItems(this.options.items);
            this.redraw();
            this.initialized = true;

            $(this).everyTime(100, function(i) {
              this.onTimerTick(i);
            }, 0);   
        },
        
        
        /**
         * Initialize the room and its different types of tiles
         *
         * @return undefined
         */
        initRoom: function(dimW, dimH) {
           
           // tile positions
           this.idTile = new Array(dimW);
           this.srcTile = new Array(dimW);
           for (x = 0; (x < dimW); x++) {
              this.idTile[x] = new Array(dimH);
              this.srcTile[x] = new Array(dimH);
           }
        },
        /**
         * Draws the table that holds the game
         *
         * @return undefined
         */
       drawRoom: function(e, dimW, dimH) {
           var html = $('<table class="treasure-chest-table"/>');
           html.css({'border': '5px solid #C3C3C3'});
           for (y = 0; (y < dimH); y++) {
              var row = $('<tr/>');
              html.append(row);
              for (x = 0; (x < dimW); x++) {
                 // We link the image to a silly URL,
                 // which is never actually reached because
                 // our onClick handler returns false.
                 var cell = $("<td id='grid" + x + "-" + y + "' valign='middle'>aaaaa</td>");
                 cell.css({
                  'min-width': '5px', 'min-height': '5px', 
                  'max-width': '80px', 'max-height': '60px', 
                  'width': '80px', 'height': '60px',
                  'padding': '0px', 'margin': '0px', 
                  'border-style': 'none', 
                  'text-align': 'center'
                 });
                 cell.bind( 
                   'click', // bind to multiple events 
                   { script: this, loc: {x: x, y: y} }, // pass in data
                   function(eventObject) {  eventObject.data.script.onUserClick(eventObject.data.loc); }
                 );                 
                 row.append(cell);
              }
           }
           $(e).html(html);
        },
        
         /**
          * Parse the string that defines the map
          *
          * @return undefined
          */
        parseMap: function() {
            var gx, gy;
            var idCell = 0;

            var tiles = this.options.tiles;
            var mapRoom = this.options.room.map;
            
            for (gy = 0; (gy < this.roomH); gy++) {
               for (gx = 0; (gx < this.roomW); gx++) {

                  switch(mapRoom.charAt(idCell)) {
                     case '#':
                        this.idTile[gx][gy] = this.idObstacle;
                        this.srcTile[gx][gy] = tiles.obstacle.dirC;
                        break;
                     case '|':   
                        this.idTile[gx][gy] = this.idObstacle;
                        this.srcTile[gx][gy] = tiles.obstacle.dirV;
                        break;
                     case '-':   
                        this.idTile[gx][gy] = this.idObstacle;
                        this.srcTile[gx][gy] = tiles.obstacle.dirH;
                        break;
                     case '*':
                        this.idTile[gx][gy] = this.idAvoid;
                        this.srcTile[gx][gy] = tiles.blank;
                        break;
                     default:    
                        this.idTile[gx][gy] = this.idBlank;
                        this.srcTile[gx][gy] = tiles.blank;
                        break;
                   }
                  idCell++;
               }
            }   
         },

      // ################
      // View
      // ################

       /**
        * Place the avatar in the room
        *
        * @return undefined
        */
         positionAvatar: function(avatar) {
            // Position idAvatarU
             var x = avatar.loc.x;
             var y = avatar.loc.y;
             this.idTile[x][y]  = this.idAvatar;
             this.srcTile[x][y] = avatar.up;

            // Position Target for next move
            avatar.seek.x = x;
            avatar.seek.y = y;
          },         
     
       /**
        * Throw in positives and then negatives items wherever there's empty space.
        *
        * @return undefined
        */
        addItems: function(items) {
            this.placeInRoom(this.idDoPick,items.targets);
            this.placeInRoom(this.idNoPick,items.distractors);
         },         
        placeInRoom: function(idItems, items) 
         {
            var nbItems = items.length;
            var nbLoops = 0;
            var htmlDoPick = '';
            var htmlNoPick = '';
            while (nbItems > 0 && nbLoops < 100) {
               x = Math.floor(Math.random() * this.roomW);
               y = Math.floor(Math.random() * this.roomH);
               if (this.idTile[x][y] == this.idBlank) {   
                  this.idTile[x][y] = idItems;
                  if(idItems == this.idDoPick) {
                     this.srcTile[x][y] = items[nbItems-1];
                     // htmlDoPick += '<span class="picked" id="doPick' + x + ',' + y + '">' + txtTile[idDoPick][nbItems-1] + '</span> '; 
                  } else {
                     this.srcTile[x][y] = items[nbItems-1];
                     // htmlNoPick += '<span class="picked" id="noPick' + x + ',' + y + '">' + txtTile[idNoPick][nbItems-1] + '</span> '; 
                  }
                  nbItems--;
               }
               nbLoops++;
            }   
            if(idItems == this.idDoPick) {
               // document.getElementById("picked_y").innerHTML = htmlDoPick;
            } else {
               // document.getElementById("picked_n").innerHTML = htmlNoPick;
            }
         },
           
         /**
          * Redraw the tiles of the room. That is update the src for every cell in the table 
          *
          * @return undefined
          */
         redraw: function() {
            var gx, gy;
            for (gy = 0; (gy < this.roomH); gy++) {
               for (gx = 0; (gx < this.roomW); gx++) {
                  $(this.roomBox).find("#grid" + gx + "-" + gy)[0].innerHTML = this.srcTile[gx][gy];
               }
            }
         },

         /**
          * Updates the score
          *
          * @return undefined
          */
         updateFeedback: function() {
            
            this.scoreBox.html(this.score);
            this.pickQtyBox.html(this.pickQty);
            this.warningBox.html('');
         },



         // ################
         // Interactivity
         // ################
         
         onTimerTick: function(tickCount) {
            if(this.pickQty < 1) {
               // 1-second wait before you can restart,
               // so people don't instantly restart by mistake
               setTimeout(this.onGameOver(), 1000);
               return;
            }
            if ((tickCount == 200) && (!this.playerHasMoved)) {
               this.showWarning(this.options.warnings.delay, 0);
               return;
            }
            if (tickCount == 400) {
               this.showWarning(this.options.warnings.longDelay, 0);
               return;
            }
            if (!this.moveAvatar()) {
               return;
            }
         },
         
         moveAvatar: function() {
            var loc = this.avatar.loc;
            var seek = this.avatar.seek;
            var oldLoc = {x: loc.x, y: loc.y};
            var moved = false;
            var idDirection = '';

            /*  -----------
                x location
            -------------- */
            if (seek.x > loc.x) {
               loc.x++;
               idDirection = 'right';
            } else if (seek.x < loc.x) {
               loc.x--;
               idDirection = 'left';
            }
            // Stay in bounds!
            if (loc.x < 0) {
               loc.x = 0;
            } else if (loc.x >= this.roomH) {
               loc.x = this.roomH - 1;
            }
            // Check for collision
            if (this.idTile[loc.x][loc.y] == this.idObstacle) {
               loc.x = oldLoc.x;
            }   
            /*  -----------
                 y location
             -------------- */
             if (seek.y > loc.y) {
                loc.y++;
                idDirection = 'up';
             } else if (seek.y < loc.y) {
                loc.y--;
                idDirection = 'down';
             }
             // Stay in bounds!
             if (loc.y < 0) {
                loc.y = 0;
             } else if (loc.y >= this.roomH) {
                loc.y = this.roomH - 1;
             }
             // Check for collision
             if (this.idTile[loc.x][loc.y] == this.idObstacle) {
                loc.y = oldLoc.y;
             }

             /*  -----------
                 If came across a good or bad pick, update the score
             -------------- */
             if (idDirection != '') {   
                this.playerHasMoved = true;
                // Replace tile we come from with blank
                this.set(oldLoc, this.idBlank,'');
    
                // Have we landed on something nifty?
                if (loc.x == seek.x && loc.y == seek.y) {
                   if (this.idTile[loc.x][loc.y] == this.idDoPick) {
                      // $(this.roomBox).find("doPick" + loc.x + "," + loc.y).style.visibility = "visible";
                      this.pickQty--;
                      this.score += this.options.items.targetPoints;
                      this.updateFeedback();
                   }
                   if (this.idTile[loc.x][loc.y] == this.idNoPick) {
                      // $(this.roomBox).find("noPick" + loc.x + "," + loc.y).style.visibility = "visible";
                      this.score += this.options.items.distractorPoints;
                      this.updateFeedback();
                   }
                }
                this.set(loc, this.idAvatar,idDirection)
             }
             
             this.avatar.loc = loc;
             return true;
         },
         set: function(loc, tileId, idDirection) {

            this.idTile[loc.x][loc.y] = tileId;
            if ((loc.y < 0) || (loc.y >= this.roomH)) {
               return;
            }
            if ((loc.x < 0) || (loc.x >= this.roomW)) {
               return;
            }
            var tile;
            switch(tileId)
            {
               case  this.idAvatar:
                tile = this.avatar[idDirection];
                break;
               default:
                tile = this.options.tiles.blank;
                break;
            }
            $(this.roomBox).find("#grid" + loc.x + "-" + loc.y)[0].innerHTML = tile;
         },
         
         
         onUserClick: function(loc) {
            if (!this.initialized) {
               // this.showWarning(this.options.warnings.notInitialized, 1);
               // return false;
            }
            if (this.gameOverFlag) {
               this.startActivity();
               return false;
            }
            this.options.avatar.seek = {x: loc.x, y: loc.y};
            this.playerHasMoved = true;
            return false;
         },

         onGameOver: function() {
           $(this).stopTime();   
           this.showWarning(this.options.warnings.congratulations, 1);
           this.gameOverFlag = true;
         },         



         // ################
         // Utilities
         // ################
        
        /**
         * Ensures that all parameters provided by the user conform to expectations
         *
         * @return undefined
         */
        checkValues: function() {
           // the width and height of the room are ill-defined
           if (this.roomW < 1 || this.roomH < 1) {
              this.showWarning(this.options.warnings.dimWH, 1);
              return 2;
           }

              // the array with the definition of the room is ill-defined
           if (this.options.room.map.length != (this.roomW * this.roomH)) {  
              this.showWarning(this.options.warnings.defRoom, 1); 
              return 3;
           }

           // no problem
           return 1;
        },

        showWarning: function(txt, idMode) {
           if (idMode == 1) {
              alert(txt);
           } else {
              this.warningBox.html(txt);
           }
        }

    });

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

})(jQuery);