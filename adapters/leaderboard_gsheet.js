/*
 Leaderboard GSheet adapter for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/
;(function($){
   
   
   var plugin = {
      configMap: {},
      setup: function (selector, config) {
        var options = $.extend({}, plugin.defaults, config);
        if(options.form.fields == undefined) { options.form.fields = plugin.defaults.form.fields; }
        console.log("[options]", options);
        plugin.configMap[selector] = options;
        plugin.render(selector);
      },

      defaults: {
	   	form: {
		   	"formkey": "dG5NNmVpejdWMnpVdnB6VGF5MDFYZEE6MQ",
		      "sheetkey": "0AowayyeQN842dG5NNmVpejdWMnpVdnB6VGF5MDFYZEE",
	   		"fields": {
               "userUid":         "entry.0.single",
               "activityUrl":     "entry.1.single",
               "activityUid":     "entry.2.single",
               "attemptedQty":    "entry.3.single",
               "correctQty":      "entry.4.single",
               "progressPercent": "entry.5.single",
               "completionTime":  "entry.6.single",
               "errorList":       "entry.7.single"
	   		},
	   		uid: undefined
	   	}
	   },

	render: function(selector) {
		var options = plugin.configMap[selector];
         var $helper = $(selector);
         $helper.empty();
         options.$saveBox = $('<div id="saveBox" style="display: none;"/>');
   		 options.$board   = $('<ul id="leaderBoard"></ul>');
   		 $helper.append(options.$saveBox);
   		 $helper.append(options.$board);
         plugin.reloadBoard(selector);
	},

     update: function(selector, data) {
		var options = plugin.configMap[selector];
      	 var $el = options.$saveBox;
      	 $el.empty();
         $el.append('Name: <input type="text" id="playerName" placeholder="player name..." /> ');
         $el.append($('<button>Save Score</button> ').click(function () {
           var playerName = $("#playerName").val(); 
           var url = $(location).attr('href');
           $.extend(data,{url: url, user: playerName, uid: options.uid });
           plugin.postData(selector, data);
           plugin.reloadBoard(selector);
         }));
   		$el.append($('<button id="reload">reload board</button>').click(function() {plugin.reloadBoard(selector)}));
        $el.show();
	},
	
	postData: function(selector, data) {
		var options = plugin.configMap[selector];
	    var param =   {
	    		"formkey": options.form.formkey,
	    		"pageNumber": 0,
	    		"backupCache": ""
	    	};

		param[options.form.fields["userUid"]]         = data.user;
		param[options.form.fields["activityUrl"]]     = data.url;
		param[options.form.fields["activityUid"]]     = data.uid;
		param[options.form.fields["attemptedQty"]]    = data.tried;
		param[options.form.fields["correctQty"]]      = data.correct;
		param[options.form.fields["progressPercent"]] = data.progress;
		param[options.form.fields["completionTime"]]  = data.time;
		param[options.form.fields["errorList"]]       = data.errorList;
	
		var jqxhr = $.get("https://spreadsheets.google.com/formResponse" + "?" + $.param(param), function() {
			// alert("success");
		})
		.complete(function(data) { plugin.reloadBoard(selector); });
	
	},
	
	reloadBoard: function (selector) {
	  var options = plugin.configMap[selector];
	  plugin.options = options;
	  var param = {
	    key: options.form.sheetkey,
	    pub: 1,
	    gid: 0,
	    tq: "SELECT B, H ORDER BY A DESC LIMIT 32",
	    tqx: "responseHandler:widged.leaderboard_gsheet.renderBoard;reqId:" + selector + "--" + (new Date()).getTime().toString()
	  };

	    $.ajax({
	       'url': "http://spreadsheets.google.com/tq?" + $.param(param),
	       'data': null,
	       'dataType': 'script',
	       'type': 'GET',
	       'scriptCharset': "utf-8"
	    });

	},
	
	renderBoard: function (data) {
	  var arr = data.reqId.split('--');
      var selector = arr[0];
	  var options = plugin.configMap[selector];
	  options.$board.empty();
	  options.$board.append($('<li style="background-color: #D2D2D2;color: #7F7F7F;list-style-type: none;padding: 3px 9px;margin: 9px 0 0 -20px;"/>').text('Leaderboard'));

	  var table = data.table.rows;
	  for (var i = 0, num = table.length; i < num; ++i) {
	    var alias = table[i].c[0].v;
	    var completion = table[i].c[1].v;
	    options.$board.append($('<li style="list-style-type: none;"/>').html(alias + "&nbsp;&nbsp;&nbsp;" + completion));
	   }
	  }
	 
   };


   if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {leaderboard_gsheet: plugin});
})(jQuery);
