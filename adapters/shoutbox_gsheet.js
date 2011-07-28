/*
 Shoutbox adapter for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
;(function($){
   
   
   var plugin = {
      run: function(selector, config) {
      	plugin.options = $.extend({}, plugin.defaults, config);
      	plugin.render(selector);
      },
      
      defaults: {
	   	form: {
		   	"formkey": "dFNyT2pGaG84QUdCcF9rVE56LUYxWGc6MQ",
		    "sheetkey": "0AowayyeQN842dFNyT2pGaG84QUdCcF9rVE56LUYxWGc",
	   		"fields": {"alias": "entry.2.single", "text" : "entry.0.single"}
	   	},
	   	css: {'font-family': 'Verdana', 'font-size': '9px'}
	   },

  
	render: function(selector) {
		var $el = $(selector);
		$el.css(plugin.options.css);
		$el.append('name: <input type="text" id="alias" size="16" /> ');
		$el.append('text: <input type="text" id="text" size="40" /> ');
		$el.append($('<button id="send">send</button> ').click(function () {
			var text = $("#text").val(); $("#text").val("");
			var alias = $("#alias").val(); 
			plugin.postData(alias, text);
			plugin.reloadChatlog();
		}));
		
		$el.append($('<button id="reload">reload</button>').click(plugin.reloadChatlog));
		$chatLog = $('<ul id="chatlog"></ul>');
		$el.append($chatLog);
		plugin.reloadChatlog();
	},
	
	postData: function(alias, text) {
	    var param =   {
	    		"formkey": plugin.options.form.formkey,
	    		"pageNumber": 0,
	    		"backupCache": ""
	    };
	    param[plugin.options.form.fields["alias"]] = alias;	
	    param[plugin.options.form.fields["text"]] = text;
	    console.log(text, param);	
	
		var jqxhr = $.get("https://spreadsheets.google.com/formResponse" + "?" + $.param(param), function() {
			alert("success");
		})
		.complete(function(data) { plugin.reloadChatlog(); });
	
	},
	
	reloadChatlog: function () {
	  var param = {
	    key: plugin.options.form.sheetkey,
	    pub: 1,
	    gid: 0,
	    tq: "SELECT A, B, D ORDER BY A DESC LIMIT 32",
	    tqx: "responseHandler:widged.shoutbox.renderChatlog;reqId:" + (new Date()).getTime().toString()
	  };

	    $.ajax({
	       'url': "http://spreadsheets.google.com/tq?" + $.param(param),
	       'data': null,
	       'dataType': 'script',
	       'type': 'GET',
	       'scriptCharset': "utf-8"
	    });

	},
	
	date2str: function(date) {
	    return (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + " " + date.getHours().toString() + ":" + (((date.getMinutes() < 10) ? "0": "")+ date.getMinutes().toString());
	 },
	 
	renderChatlog: function (data) {
	  $chatLog.empty();
	  var table = data.table.rows;
	  for (var i = 0, num = table.length; i < num; ++i) {
	    var time = table[i].c[0].v;
	    var txt = table[i].c[1].v;
	    var alias = table[i].c[2].v;
	    $('<li style="background-color: #D2D2D2;color: #7F7F7F;list-style-type: none;padding: 3px 9px;margin: 9px 0 0 -20px;"/>').html(alias + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + plugin.date2str(time)).appendTo("#chatlog");
	    $('<li style="list-style-type: none;"/>').text(txt).appendTo("#chatlog");
	   }
	  }
	 
   };


   if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {shoutbox: plugin});
})(jQuery);

	
