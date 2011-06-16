/*
 Google Spreadsheet Writer for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

;(function($){
    var plugin = {
       hookMap: {},

       hook: function (adaptersel, activitySel) {
          plugin.hookMap[activitySel] = adaptersel;
          var $activity = $(activitySel);
          $activity.bind("complete", function(e, data){ plugin.spreadsheetWrite(activitySel, data); });
       },
       
       spreadsheetWrite: function(activitySel, data) {
          // when using this.hookMap, the object content is lost after the binding.
          // coreboard.hookMap maintains the value over binding (static variable);
          var $helper = $(plugin.hookMap[activitySel]);
          var $activity = $(activitySel);
          $form = $('<form action="/">');
          $form.prepend('Save data: ');
          $form.append('<input type="text" name="p" placeholder="player name..." /><input type="submit" value="Save" />');
          $form.submit(function(event) {
            /* stop form from submitting normally */
            event.preventDefault();
            /* get some values from elements on the page: */
                var $form = $( this ),
                    playerName = $form.find( 'input[name="p"]' ).val();

            /* Send the data using post and put the results in a div */
            var url = $(location).attr('href');
            $.extend(data,{url: url, user: playerName, id: $activity.attr('id'), title: $activity.attr('title') });
            $.post( "http://zend.widged.com/gdata/Zend/Spreadsheet_Leaderboard.php", data,   
               function( data ) { $form.append(' saved'); }
            );
          });
          
          $helper.html('');
          $helper.append($form);
       }

       
    };

    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
    $.extend(true, window.widged, {scoresheet_zend: plugin});
})(jQuery);



