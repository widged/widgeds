/*
 Notifications for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

;(function($){
    var plugin = {
       run: function(selector, typeId, settings) {
          $(selector).bind("notify", plugin.showMessage);
          plugin.settings = $.extend(plugin.defaults, settings);
       },
       defaults: {
          css:{left: "0px", right: "0px", "min-height":"40px","border":"3px solid orange","margin":"6px 0px","text-align":"center"},
          message: '<span style="font-size: 0.8em">(Click To hide)</span><br/>',
          hideEvent:"click"
       },
       showMessage: function(e, data) {
         var sel = "#" + e.target.id + "-notification";
         var $box = $(sel);
         var $el = $("<div/>")
         $box.prepend($el);
         $el.hide();
         $el.append(plugin.settings["message"])
         $el.append(data.msg);
         $el.css(plugin.settings["css"]);

         switch(data.type)
         {
            case 1:
               $el.css({"background-color":"#EAF7DA","border-color":"#79BA25"}); // green
               break;
            case 2:
               $el.css({"background-color":"#FFD9DA","border-color":"#F05258"}); // red
               break;
            default:
               $el.css({"background-color":"#FFFFFF","border-color":"#7F7F7F"}); // gray
               break;
         }
         $el.bind(plugin.settings["hideEvent"],function(){
            $el.slideToggle();
         });
         $el.slideToggle();
            
       }
    };


    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {notification: plugin});
})(jQuery);

