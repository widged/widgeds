/** 
 * @fileoverview This package handles all aspects of activity creation. 
 * @author : Marielle Lange  marielle@widged.com 
 * @version 0.1 
 * @license NOT FOR DISTRIBUTION. No part of this script can be included within any application without 
 *          express written permission from the author.
 * @package activitycore
 */


/**
 * Construct a new Activity object
 * @class This is the basic Activity class
 * It can be considered an abstract class, even though no such thing
 * really existing in JavaScript
 * @constructor
 * @return A new Activity
 * @param {int} id					// Unique identifier for the activity
 * @param {string} comments				// Comments about the activity, what it is for, etc. Typically found in an activity chooser. 
 * @param {string} title				// Title that appears at the top of the activity
 * @param {string} instructions			// Instructions to show to the participant
 *
 *	--- Hints values ---
 * @param {string} hintRight			// feedback to present upon providing an answer to an item
 * @param {string} hintWrong			// feedback to present upon providing an answer to an item
 * @param {string} feedback				// feedback to present at the end of the activity
 *
 *	--- HTML Templates ---
 * @param {string} templateActivity     // Template for Activity
 * @param {string} templateInstructions	// Template for Instructions
 * @param {string} templateItems		// Template for a typical item. 
 * @param {string} templateOptns		// Template for each option. 
 * @param {string} templateScore		// Tempalte for Score
 * @param {string} templateToolbar		// Template for toolbar
 *
 *	--- Toolbar elements ---
 * @param {string} showInstrc			// Show the instructions or not
 * @param {string} showScore			// Show the score or not
 * @param {string} showCorrct			// Show the correct answers on request or not
 *
 *	--- Elements to show or hide ---
 * @param {string} refreshScore		// Refresh the score each time an item is attempted
 *
 *	--- Modified by controler ---
 * @param {string} nbItemsAnswered		// Number of Items that have been answered so far.  
 * @param {string} nbItemsTotal			// Total Number of Items to Answer.
 * @param {string} score				// Score object, keeps track of the score so far
 * @param {string} divs					// Divisions (or layers) that this activity is made of
 */

function Activity() {

	this.id 					= 'activity1';
	this.title 					= 'Activity';
	this.comments 				= '';
	this.instructions 			= '';
	this.showInstr 				= true;
	this.showCorrct 			= false;
	this.hintRight 				= 'Well done!';
	this.hintWrong 				= 'Try Again!';
	this.feedback 				= 'The End!';
	this.templateActivity		= '<h1>::actTitle::</h1>' + "\n" +
								  '::instructions::'+ "\n" +
								  '::toolbar::' + "\n" +
								  '::actSrc::';
	this.templateActivityF 		=	'<div class="::id::">' + 
										'<div class="top">' + 
											'::instructions::' + 
											'::toolbar::' + 
										'</div>' + 
										'::actSrc::' +
									'</div>';
	this.templateItems 			= '::item::';
	this.templateOptns 			= '::option::';
	this.templateTitle 			= '::title::';
	this.templateInstructions 	= '<div class="instructions"><strong>Instructions: </strong>::insSrc::</div>';
	this.templateToolbar		= '<div class="toolbar">::tlbSrc::</div>';
	this.templateScore 			= 'Score :  ::score::\n\n::itemsAttempted:: questions on ::itemsTotal:: have been attempted.';
	this.templateFeedback 		= '::feedback::';
	this.pnts 					= 1;

	// Modified by controler
	this.divs 					= [];	// Divisions (or layers) that this activity is made of
	this.itemSelected 			= null;	// The item in the selection 
	this.scoreValue 			= 0;	// Score object, keeps track of the score so far
	

	this.populateActivity = function() {
		oActivity = this;
	  	changeElementContent("etivity1", this.toHTML() );
		for (i in this.divs) {
			this.divs[i].showPage(0);
		}
	}

	this.toHTML = function() {
		var html = '';
		for (i in this.divs) {
			html += this.divs[i].toHTML();
		}
		
		instrs = '';
		if (this.instructions != '') { instrs = processTemplate({template: this.templateInstructions, insSrc: this.instructions}); } 

		toolb = this.generateToolbar();
		if (toolb != '') { toolb = processTemplate({template: this.templateToolbar, tlbSrc: this.generateToolbar() }); }
		
		html = processTemplate({template: this.templateActivity, actSrc: html, actTitle: this.title, instructions: instrs, toolbar: toolb}) ;
		
		return html;
	}

	this.getNbItemsAnswered = function() {
		var nb = 0;
		for (d in this.divs) {
			itms = this.divs[d].items;
			for (i in itms) {
				if (itms[i].responseStatus == "responded") { nb++ }
			}
		}
		return nb;
	}

	this.getNbItemsAttempted = function() {
		var nb = 0;
		for (d in this.divs) {
			itms = this.divs[d].items;
			for (i in itms) {
				if (itms[i].responseStatus == "attempted" || itms[i].responseStatus == "responded") { nb++ }
			}
		}
		return nb;
	}

	this.getNbItemsToAnswer = function() {
		var nb = 0;
		for (d in this.divs) {
			itms = this.divs[d].items;
			for (i in itms) {
				if (itms[i].responseStatus == "attempted" || itms[i].responseStatus == "responded" || itms[i].responseStatus == "pending") { nb++ }
			}
		}
		return nb;
	}

	/* ------------------------------------------------------------------------
	*
	*		Toolbar Options
	*
	* ------------------------------------------------------------------------
	*
	*
	* ------------------------------------------------------------------------ */

	this.generateToolbar = function() {
		return "toolbar stuff";
		var top_text = '';
		if (this.showScore) { top_text += '<span class="check_answers"><a href="#" onclick="computeScore()">Compute Score</a></span>'; }
		if (this.showScore && this.showCorrct) { top_text += '&nbsp;&nbsp;|&nbsp;&nbsp;'; }
		if (this.showCorrct) { top_text += '<span class="showCorrect"><a href="#" onclick="showCorrect()">Show Correct Answers</a></span>'; }
		return top_text;
	}


	this.showCorrect = function() {
	}




	/* ------------------------------------------------------------------------
	*
	*		After item checked correct
	*
	* ------------------------------------------------------------------------
	*
	*	computeScore()
	* ------------------------------------------------------------------------
	*	refreshScore()
	*	hideHint(item|optn)
	*	showHint(item|optn)
	*	saveState(actv)
	*	hideItem(item)
	*	showItem(item)
	*	hideDiv(div)
	*	showDiv(div)
	*
	* ------------------------------------------------------------------------ */


	this.updateScore = function(val) {
		// value checking
		if (val == undefined || !isFinite(val)) { val = 1 }
		this.scoreValue += Number(val); 
	}

	this.refreshScore = function() {
		thtml = processTemplate({
						template: this.templateScore, 
						score: this.scoreValue, 
						itemsAttempted: this.getNbItemsAttempted(), 
						itemsTotal: this.getNbItemsToAnswer() 
					})  
		changeElementContent("score", thtml);
		return true;
	}

	this.checkAllAnswered = function() {
		//
	}

	
	/* ------------------------------------------------------------------------
	*
	*		Upon Activity Completion
	*
	* ------------------------------------------------------------------------
	*
	*	showScore(actv)
	*	showFeedback(actv)
	*	saveResults(actv)
	*	
	*	TBD: add two feedback options for the students: 
	*	click on a star rating and rate the exercise (wonderful -> I hated it) 
	*		|-> basic level of feedbackk
	*	click on a star rating and rate how well you did (I did well -> I could have done better) 
	*		|-> allow SS to express some reflective observations on the nature of their learning within the exercise.
	*	
	* ------------------------------------------------------------------------ */

	this.endActivity = function() {
		this.computeScore();
		this.showFeedback();
		this.saveResults();
		this.showRatings();
	}


	return true;
}




/* #############################################################################
*
*		LAYER / DIVISION
*
*  #############################################################################
*
*	An activity is made of one or more layers (here Divisions) of items.
*
* There are 5 possible positions for any layer: North, East, South, West, Center. Not all of them need to be filled. C + E  is ok, as is N + C.
* 
* 		        N 
* 		---------------
* 		    |       | 
* 		 W  |   C   |  E
* 		    |       | 
* 		----------------
* 		        S 
*
*     @param   id				Unique identifier
*     @param   nb				division number
*     @param   zindex			Layer zindex
*     @param   nb				Whether items within that layer are shuffled. {seq|random}
*     @param   CSSstyle;
*     @param   behaviorItems;  	What is the typical behaviour of each item in this layer. For instance, 
*						   in a matching exercise, a click of the mouse on a mobile item will mark the item as selected 
*						   but a click of the mouse on a target item will check whether the response is correct or not.	
*     @param   mimetypeItems	Format of the items in that division. Images, text, audio need to be presented in different ways. 
*	  @param   templateDivision     // Template for Activity
*     @param   nbItemsPresented		How Many Items to Display		
*     @param   shuffleOptns; 	Whether items within that layer are shuffled. {seq|random}
*     @param   layoutOptns; 	How information is layed out within the layer. {radio|dropdown|input}

* 
############################################################################# */	

function Division(params) {
	/* defined within params */

	this.id 				= 'div';
	this.nb 				= 0;
	this.zindex 			= -1;
	this.behaviorItems 	= '';
	this.mimetypeItems 		= 'text/plain';
	this.templateDivision	= '::divisionSrc::'
	this.layoutItems 		= 'block';
	this.layoutOptns 		= 'radio';
	this.shuffleItems 		= false;
	this.shuffleOptns 		= false;
	this.items 				= [];		// List of items in that division
	this.shuffledItems	    = [];
	this.pages 				= [];		// List of pages in that division
	this.nbItemsPresented 	= 99;
	this.nbItemsPerPage 	= 99;

	for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }


	this.toHTML = function() {
		var htmlPage = '';
		var htmlDiv = '';
		var htmlNavg = '';
		var nextPage = true;
		var prevPage = true;
		var np = '';
		
		this.populatePages();
		for (i in this.pages) { 
			pgeId = 'page_' + this.nb + "_" + i;

			htmlPage = '';
			if (this.pages.length > 1) { htmlPage += '<h2>Page: ' + (1+Number(i)) + ' of ' + this.pages.length +'</h2>'  }
			htmlPage += this.pages[i] 
	
			// -- start page navigation
			prevPage = true; nextPage = true;
			if (i == 0) { prevPage = false }
			if (i == (this.pages.length - 1)) { nextPage = false }
			htmlNavg = '';
			if(prevPage) { htmlNavg +=  	'<a href="javascript:oActivity.divs[' + this.nb + '].prevPage(' + i + ')">previous page</a>'; }
			if(prevPage && nextPage) { htmlNavg +=  	' | '; }
			if(nextPage) { htmlNavg +=  	'<a href="javascript:oActivity.divs[' + this.nb + '].nextPage(' + i + ')">next page</a>'; }		
			// -- end page navigation
			if (htmlNavg.length > 2) { htmlPage += '<div class="pagenavig">' + htmlNavg + '</div>'}

			htmlDiv += '<div class="page" id="' + pgeId + '">' + htmlPage + '</div>';
		}
		html = processTemplate({template: this.templateDivision, divisionSrc: htmlDiv})  // divisionSrc: html
		return '<div class="division" id="' + this.id + '">' + html + '</div>' + '<div class="clearer">&nbsp;</div>';
	}

	this.populatePages = function() {

		// --- variable declaration ---
		var itms = [];
		var count = 0;
		var idx = 0;
		var itmHTML = '';
		var html = '';
		var pagenb = 0;
		
		// --- Initialisation ---
		itms = this.items;

		// --- Processing : Shuffling Items and Options ---
		this.shuffledItems = this.shuffle(itms, this.shuffleItems);
		for (i in itms) {
			if(itms[i] != undefined) {
				itm = itms[i];
				itm.shuffledOptions = this.shuffle(itm.optns, this.shuffleOptns)
			}
		}
		
		// --- Processing : Generating the HTML  ---
		count = 0;
		html  = '';
		for (var i = 0; i < this.nbItemsPresented; i++) {
			if(itms[i] != undefined) {
				count++
				idx = this.shuffledItems[i]
				itm = itms[idx];
				// -- initialisation job ----
				itm.nb = idx;

				itmHTML = itm.toHTML(this.mimetypeItems);
				opts = generateHTMLview({objct: itm.optns, layout: this.layoutOptns, itmId: itm.id, itmNb: itm.nb, template: this.templateOptns})
				itmHTML = processTemplate({template: this.templateItems, itmId: itm.id, itmNb: itm.nb, item: itmHTML, optns: opts})
				html += itmHTML;
			}
			if (count % this.nbItemsPerPage == 0) {
				this.pages[pagenb] = html;
				html = '';
				pagenb++;
			}
			if (i >= (itms.length - 1) || i >= (this.nbItemsPresented - 1)) { 
				if(html != '') { this.pages[pagenb] = html; }
				break;
			 }
		}
		
		return true;
	}

	this.shuffle = function(obj, tf) {	// obj, doShuffle
		var reshuffled = [];
		var shuffled = [];
		var count = 0;
		
		shuffled = []
		count = 0; for (i in obj) { shuffled[count] = count; count++ }

		for(var no=0;no<count;no++){
			var randomIndex = Math.floor(Math.random() * shuffled.length);
			tf ? reshuffled[no] = shuffled.splice(randomIndex, 1) : reshuffled[no] = no;
		}
		return reshuffled;
	}

	this.showPage = function(pnb) {
		var pgeId
		
		pgeId = "page_" + this.nb + "_" + pnb;
		changeElementDisplay(pgeId, "inline")
	}

	this.nextPage = function(pnb) {

		pgeId = "page_" + this.nb + "_" + pnb;
		changeElementDisplay(pgeId, false)

		pgeId = "page_" + this.nb + "_" + (Number(pnb) + 1);
		changeElementDisplay(pgeId, true)
	}
	this.prevPage = function(pnb) {

		pgeId = "page_" + this.nb + "_" + pnb;
		changeElementDisplay(pgeId, false)

		pgeId = "page_" + this.nb + "_" + (Number(pnb) - 1);
		changeElementDisplay(pgeId, true)
	}


	/* ------------------------------------------------------------------------
	*
	*		Interaction with Items
	*
	* ------------------------------------------------------------------------
	*
	*			makeSelection()
	*			checkCorrect()
	*
	* ------------------------------------------------------------------------ */


	this.makeSelection = function(elmId) {
		// -- value checking --
		if(elmId == undefined) { errorMsg("variable not defined: id in makeSelection") } 

		// -- initialisation --
		var css = this.CSSstyle;

		// -- processing -------
		changeElementAppearance(elmId, css['selected'])
		if (oActivity.itemSelected != undefined && oActivity.itemSelected != elmId) { 
			changeElementAppearance(oActivity.itemSelected, css['deselected'])
		}
		oActivity.itemSelected = elmId;
	}


	this.checkCorrect = function(elmId, itmNb) {

		// -- variable declaration --
		var isResponse = false;
		var im;
		var css = [];
		var itmId = '';
		var tmp = '';
		
		// -- value checking --
		if(itmNb == undefined) { errorMsg("itmNb undefined in div.checkCorrect") } 
		if(elmId == undefined) { errorMsg("elmId undefined in div.checkCorrect") } 

		// -- initialisation --
		css 	= this.CSSstyle; if (css == undefined) { css = []; }
		im 		= this.items[itmNb];
		itmId   = im.id;

		// -- processing -------
		if (oActivity.itemSelected == undefined || oActivity.itemSelected == null) {
			// -- mcq -------
			tmp = elmId.split("_");
			itmId = tmp[0];
			response = tmp[1];
		} else {
			// -- matching -------
			response = oActivity.itemSelected;
			elmId = itmId;
		}

		isResponse = false
		for (i in im.responses) {
			if (im.responses[i].id == response) { 
				if (im.responses[i].pnts == undefined) { pnts = 1 } else { pnts = im.responses[i].pnts; }
				isResponse = true;
			}
		}
		im.nbAttempted++;
		if (im.responseStatus == "pending") {
			im.responseStatus = "attempted";
			im.pnts = pnts; 
			if (isResponse) { 
				im.responseStatus = "responded"; 
				oActivity.updateScore(pnts)
			}
		}

		
		if (isResponse) { 
			changeElementAppearance(elmId, css['right']); 
			// TBD use gettext and settext
			var ed = document.getElementById("drp_" + elmId);
			var el = document.getElementById(oActivity.itemSelected);
			if (ed != undefined && el != undefined) { ed.innerHTML = el.innerHTML; }
		} else  {
			changeElementAppearance(elmId, css['wrong']); 
			window.setTimeout("changeElementAppearance('" + elmId + "','" +  css["neutral"] + "')",1000);  // 
		}

		oActivity.refreshScore();

		/*
		this.nextpage();
		
		if(q_pts[q_id][a_id] != undefined && q_pts[q_id][a_id] > 0 )  {
			window.setTimeout('QCM_nextquestion('+ (q_id + 1) + ')', 3000);
		}
		*/

		return true;
	}

	this.showHintAsk = function(itmNb) {

		// -- variabledeclaration--
		var im;
		
		// -- value checking --
		if(itmNb == undefined) { errorMsg("variable not defined: id in makeSelection") } 
		if (this.items[itmNb] == undefined) { return false; };

		// -- initialisation --
		im = this.items[itmNb];

		// -- Processing --
		changeElementContent("hint", im.hintAsk);
		return true
	}


	return true;
}



/* #############################################################################
*
*		Page
*
*  #############################################################################
*
*	A page can hold one item or a number of items. This device is added to allow for 
*   presentations one item at a time
*
*     @param   nb				page number
*     @param   isDisplayed		whether the page is visible or not
*     @param   lstItems			List of Items in that page
* 
############################################################################# */	

function Page(params) {
	/* defined within params */

	this.nb 				= 1;
	this.isDisplayed 			= 'block';
	this.lstItems 			= -1;

	for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }


	this.toHTML = function() {
		var html = '';
		var itms = this.items;
		for (i in itms) {
			if(itms[i] != undefined) {
				itm = itms[i];
				// -- initialisation job ----
				itm.nb = i;

				itmHTML = itm.toHTML(this.mimetypeItems);
				opts = generateHTMLview({objct: itm.optns, layout: this.layoutOptns, itmId: itm.id, itmNb: itm.nb, template: this.templateOptns})
				itmHTML = processTemplate({template: this.templateItems, itmId: itm.id, itmNb: itm.nb, item: itmHTML, optns: opts})
				html += itmHTML;	
			}
		}

		html = processTemplate({template: this.templateDivision, divisionSrc: html})  // divisionSrc: html
		return '<div id="' + this.id + '">' + html + '</div>' + '<div class="clearer">&nbsp;</div>';
	}


	return true;
}						


/* #############################################################################
*
*		ITEM
*
* #############################################################################
*
*   The IMS guidelines, differentiates two types of Items: 
*       -- Material : is displayed on the page, with no element of interaction
*       -- Response : Receives the user input, somehow.
*	Here we define a single type, which can be given a behaviour or not.
*
*	@param id				// Unique identifier
*	@param src				// Source for this item (image, plain text, url, etc.)
*	@param responses		// List of acceptable answers. By default, the correct ones, 
							// but it is possible to provide both right and wrong answers. 
							// The wrong answers will then be associated with a negative pnts value
*	@param optns			// List of options to present for that item
*	@param templateItems	Template for a typical item. 
*	@param layoutItems; 	How information is layed out within the layer. {inline|bloc|table|list}
*	@param points			// Number or Points earned when the item is correctly answered. 
*	@param responseStatus	// Status of the response. {pending|incorrect|correct} 
*	@param responseValue	// Value of the response. 
*	@param attemptnb		// Number of times that item has been attempted
*	@param hintRight		// Hint to present when the answer is right
*	@param hintWrong		// Hint to present when the answer is wrong
*	@param hintAsk			// Hint to present when the user requests a hint
*	@param behavior
*
* ############################################################################# */	

function Item(params) {

	this.id 				= 'item1';
	this.src 				= '';
	this.responses 			= [];
	this.optns 				= [];
	this.points 			= [];
	this.hintAsk 			= '';
	this.hintRight 			= '';
	this.hintWrong 			= '';
	this.behavior 			= '';

	// Modified by controler
	this.responseStatus 	= 'pending';
	this.nbAttempted 		= 0;

	for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }

}

Item.prototype.toHTML = function (mimetype) {
	src = this.src;
	iHTML = mimetypeToHTML(src, mimetype);
	return iHTML;
}

/*
	
 TBD add a text input object
	list
	feedback
	points
	catches			When fruit is expected  [{list : "frute, froot", fb: "Did you mean fruit", score: "-50%"}, 
					{list : "fude", fb: "Did you mean food", score: "-50%"}]  -> for input box. 
*/



/* #############################################################################
*
*		HTML manipulation
*
* #############################################################################
*
*	mimetypeToHTML(src, mimetype)	string
*	processTemplate(params)
*	generateHTMLview(params)
*
* ############################################################################# */	

mimetypeToHTML = function(src, mimetype) {
	switch (mimetype) {
		case "image/jpg":
		case "image/gif":
		case "image/png":
			return '<img src="etc/pix/' + src + '">';
		break;
		case "video":
		case "audio":
			return 'xxx';
	}
	return src;
}

processTemplate = function(params) {

	var tpl =  params.template;
	var pattern = /::([^:]+)::/
	// infinite loop
	count = 0
	while ( (m = tpl.match(pattern)) != undefined) { 
		count++;
		if (count > 10) { break; }
		value = '';  if (params[m[1]] != undefined) { value = params[m[1]]; }
		tpl = tpl.replace(m[0], value);
	}
	return tpl;

}



generateHTMLview = function(params)  {
	var html = '';
	var count = 0;
	var o = params.objct;
	var id = params.itmId;
	var v = params.layout;

	count = 0; for (i in o) { count++ }
	if (!(count > 0)) { return }
	
	switch (v) {
		case "none":
			return;
		break;
		case "inputtext20":
			for (i in o) {
				html += '<input type="text" name="' + o[i].id + '" id="' + id + '" size="18" maxlength="20" />';
			}
			return html;
		break;
		case "inputtext80":
			for (i in o) {
				html += '<input type="text" name="' + o[i].id + '" id="' + id + '" size="50" maxlength="80" />';
			}
			return html;
		break;
		case "dropdown":
			for (i in o) {
				html += '<option value="'+ o[i].id + '" />' + o[i].src;
			}
			return '<select name="' + id + '">' + html + '</select>';
		break;
		case "radio":
			for (i in o) {
				html += '<input type="radio" name="' + id + '" value="' + o[i].id + '"> ' + o[i].src + '<br />';
			}
			return '<br /><br />' + html;
		break;
		case "orderedlist":
			for (i in o) {
				params.optn = o[i].src;
				params.optId = o[i].id;
				params.optHint = o[i].hint;
				html += '<li> ' + processTemplate(params);
			}
			return '<ol>' + html + '</ol>';
		break;
		case "list":
			for (i in o) {
				html += '<li> ' + o[i];
			}
			return '<ul>' + html + '</ul>';
		break;
	}

	return o;
}

/* #############################################################################
*
*		DOM manipulation
*
* #############################################################################
*
*	changeElementAppearance()
*	changeElementContent()
*	changeElementDisplay()
*	addElement()
*
* ############################################################################# */	


changeElementDisplay = function(id, show) {
	var e = document.getElementById(id);
	if (e != undefined) { 
		show ? e.style.display = "block" : e.style.display = "none"
	}
}

changeElementAppearance = function(elID, css) {
	// value checking
	if (elID == undefined) { errorMsg("itmID undefined in changeElementAppearance"); return; }
	if (css == undefined) { errorMsg("css undefined in changeElementAppearance"); return; }
	
	// function
	var e = document.getElementById(elID);
	if (e != undefined) { 
		result = css.match(/\s?border:\s*([^;]+)/);
		if (result != null) { e.style.border = result[1]; }
		result = css.match(/\s?background:\s*([^;]+)/);
		if (result != null) { e.style.background = result[1]; }	
	}
}

changeElementContent = function(id, src) {
	var e = document.getElementById(id);
	if (e == undefined) { alert(src); return false; }
	document.getElementById(id).innerHTML = src;
	return true;
}

function addElement(id, text) {
	//  TBD
	
}


/* #############################################################################
*
*        Utility functions
*
* #############################################################################
*
*    delay(d)
*
* ############################################################################# */    


function delay(d) {
	var c;
	for (var i = 1; i <= d; i++) {
		c++;
	}
}
function errorMsg(msg) {
	alert(msg)
}


var oActivity;

