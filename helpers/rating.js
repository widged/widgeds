/*
 Rating for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

(function(){
   var plugin = {};

    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {rating: plugin});
})();

