/*
 Parser functions for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
(function($){
   
   var $ = jQuery;
   var eventTarget;
    var plugin = {
       init: function (eventTarget) {
          plugin.eventTarget = eventTarget;
          $(document).bind("spreadsheet_read", function(e, data){
             e.stopPropagation();
             plugin.eventTarget = eventTarget;
          });
       },
         
         getName: function(sheetKey, studentName, column)
         {
            var url;
            url = "http://spreadsheets.google.com/tq?key=" + sheetKey + "&tqx=version:0.6;responseHandler:widged.dataread.onSearchResult;reqId:0;out:json&tq=select%20" + column + "%20where%20A%20=%20'Lisa+Shipe'";
            $.ajax({
               'url': url,
               'data': null,
               'dataType': 'script',
               'type': 'GET',
               'scriptCharset': "utf-8"
            });
            return false;
         },

         onSearchResult: function(res)
         {
            var error;

            var colNames = res.table.cols;
            
            var cols = res.table.rows[0].c;
            var data = {}, item = {};
            var links = [];
            for(i = 0; i < cols.length; i++ )
            {
               item = cols[i]
               data[colNames[i].label] = item.v;
            }
            if(error) {
               jQuery(plugin.eventTarget).trigger('readError',error);
            } else {
               jQuery(plugin.eventTarget).trigger('readResult',data);
            }          
         }
    };
   
   if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {dataread: plugin});
})();
/*

// url = "http://spreadsheets.google.com/tq?key=0ArNMycobpXr3ckJybUNHVDZ0cEU0SjZvb0prVDhGS2c&tqx=version:0.6;responseHandler:widged.dataread.onSearchResult;reqId:0;out:json&tq=select%20*%20where%20B%20like%20'test%25"
// url = "http://spreadsheets.google.com/a/learning-digital.com/tq?key=0AowayyeQN842dHJpUzlCZy1pV2N3Q1kwb1hsdzlxNWc&tqx=;responseHandler:widged.dataread.onSearchResult;reqId:0out:json&tq=select+*+where+A+%3D+'Lisa+Shipe'";
// http://spreadsheets.google.com/tq?key=0ArNMycobpXr3ckJybUNHVDZ0cEU0SjZvb0prVDhGS2c&tqx=version:0.6;responseHandler:sscallback_sRxZW1u2IxUZsY3hPlKU;reqId:0;out:json&tq=select%20*%20where%20B%20like%20'test%25               
get: function(sheet)
{
   $.ajax({
      'url': 'http://spreadsheets.google.com/feeds/list/0AowayyeQN842dHJpUzlCZy1pV2N3Q1kwb1hsdzlxNWc/od6/public/values?alt=json',
      'data': { count: 5 },
      'success': plugin.onSearchResult,
      'dataType': 'jsonp'
   });
   return false;
},
getName: function(sheet, name)
{
   
   $.ajax({
      'url': 'https://spreadsheets.google.com/a/learning-digital.com/ccc?key=0AowayyeQN842dHJpUzlCZy1pV2N3Q1kwb1hsdzlxNWc&output=csv',
      'data': null,
      'success': plugin.onSearchResult,
      'dataType': 'text/plain'
   });
   return false;

},

*/