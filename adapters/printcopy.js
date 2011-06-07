/*
 Print Copy for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
;(function(){
   
   var plugin = {
      run: function(selector, typeId, data) {
         this.printout = [];
         this.printout[selector] = data;
         $(selector).bind('click',function() { plugin.onClick(typeId, data) });
      },
   
      onClick: function(typeId, data) {
         var error = null;
         switch(typeId)
         {
              case 'itemList':
                 data = plugin.printedItemList(data);
                 break;
              default:
                 data = null;
                 error = {msg: 'content type unknown: ' + typeId};
                 break;
         }
         /*
         var $element = $(selector);
         if(error) {
            $element.trigger('printError',error);
         } else {
            $element.trigger('printResult',data);
         } 
         */         
         
      },
      
      // ################
      // ### Parsers
      // ################

      // ### element list
      printedItemList: function(itemList, parserSettings) {
         var list = itemList;
         if(list == undefined) { return; }
         var selectHtml = '';
         var el = $('<div/>');
         el.registerCorrect = function(isCorrect) {  }
         for (var i in list) {
            var item = list[i];
            var itemEl = $('<div style="margin-left: 21px;padding-left:0px;">' + item.html + '<br/></div>');
            
            var optionList = item.options;
            var optionHtml = "";
            for (var o in optionList) {
               var opt = optionList[o];
               optionHtml += '<li>' + opt.html + '</li>';
            }
            itemEl.append("<ul>" + optionHtml + "</ul>");
            el.append(itemEl);
         }
         
        var thePopup = window.open( '', "Activity Printout", "menubar=0,location=0,height=700,width=700" );
        var $page = $('<div style=""/>').appendTo(thePopup.document.body);
        $page.append(el);
//        thePopup.print();
         return el;     
      }

      
   };

   if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {printcopy: plugin});
})();