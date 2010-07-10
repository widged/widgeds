/*
Loosely adapted from a script written by Thomas Boutell
http://vader.boutell.com/~boutell/geek.cgi
*/

// My be alterred
var dimWroom = 8;
var dimHroom = 8;
var locXstart = 6;
var locYstart = 5;
var alertDelay = "To move, you must CLICK THE MOUSE on the place " + "you want to go.";
var alertLongDelay = "To move, you must CLICK THE MOUSE on the place " + "you want to go.";
var alertNotInitialized = "Please wait a moment for the game to begin.";
var alertDimWH = "The parameters for the width and Height of the room must have positive values."
var alertDefRoom = "The Room definition doesn't seem to be of the correct dimension.";
var alertCongratulations = "Game Over\n\nCongratulations, you have picked all target words";
var nb_DoPick = 4;
var nb_NoPick = 6;
var ptPickDo = 100;
var ptPickNo = -100;
var nbToPick;


var mapRoom = "" + 
"*      *" + 
" ****** " + 
" *#-*** " + 
" *| *|* " + 
" *|* |* " + 
" ***-#* " + 
" ****** " + 
"*      *"; 

var idTile = new Array(dimWroom);
for (x = 0; (x < dimWroom); x++) {
	idTile[x] = new Array(dimHroom);
}

var srcTile = new Array(dimWroom);
for (x = 0; (x < dimWroom); x++) {
	srcTile[x] = new Array(dimHroom);
}


var locXa;
var locYa;
var locXseek;
var locYseek;
var threshold;
var filled;
var nbTicks = 0;
var gameOverFlag;
var playerHasMoved = 0;
var initialized = 0;
var idDirection = 0;
var pixpath = "etc/pix/";
var roompath = "etc/pix/room/";
var tagpath = "etc/pix/tags/";

// Shouldn't be altered 
var idGameOver = 0;
var idBlank = 1;
var idAvoid = 2;
var idObstacle = 3;
var idDoPick = 4;
var idNoPick = 5;
var idAvatar = 6;

var obsH = 0;
var obsV = 1;
var obsC = 2;

var avtU = 0;
var avtD = 1;
var avtL = 2;
var avtR = 3;

// One-time initialization

var pixTile = new Array(7);
for (x = 0; (x < 7); x++) {
	pixTile[x] = new Array();
}

pixTile[idAvatar][avtU] = "<img src='" + pixpath + "avatar.gif' class='gridimg'>";
pixTile[idAvatar][avtD] = "<img src='" + pixpath + "avatar.gif' class='gridimg'>";
pixTile[idAvatar][avtL] = "<img src='" + pixpath + "avatar.gif' class='gridimg'>";
pixTile[idAvatar][avtR] = "<img src='" + pixpath + "avatar.gif' class='gridimg'>";
pixTile[idAvatar][avtR] = "<img src='" + pixpath + "avatar.gif' class='gridimg'>";
pixTile[idGameOver][0] = "<img src='" + pixpath + "gameover.gif' class='gridimg'>";
// --- room -------------
pixTile[idBlank][0] = "<img src='" + roompath + "blank.gif' class='gridimg'>";
pixTile[idAvoid][0] = "<img src='" + roompath + "blank.gif' class='gridimg'>";
pixTile[idObstacle][obsH] = "<img src='" + roompath + "obstacleh.gif' class='gridimg'>";
pixTile[idObstacle][obsV] = "<img src='" + roompath + "obstaclev.gif' class='gridimg'>";
pixTile[idObstacle][obsC] = "<img src='" + roompath + "roomplant.gif' class='gridimg'>";
// --- tags -------------
pixTile[idDoPick][0] = "<img src='" + tagpath + "apple.gif' class='gridimg'>";
pixTile[idDoPick][1] = "<img src='" + tagpath + "banana.gif' class='gridimg'>";
pixTile[idDoPick][2] = "<img src='" + tagpath + "steak.gif' class='gridimg'>";
pixTile[idDoPick][3] = "<img src='" + tagpath + "fish.gif' class='gridimg'>";
pixTile[idNoPick][0] = "<img src='" + tagpath + "sugar.gif' class='gridimg'>";
pixTile[idNoPick][1] = "<img src='" + tagpath + "cereal.gif' class='gridimg'>";
pixTile[idNoPick][2] = "<img src='" + tagpath + "milk.gif' class='gridimg'>";
pixTile[idNoPick][3] = "<img src='" + tagpath + "butter.gif' class='gridimg'>";
pixTile[idNoPick][4] = "<img src='" + tagpath + "water.gif' class='gridimg'>";
pixTile[idNoPick][5] = "<img src='" + tagpath + "rice.gif' class='gridimg'>";


var txtTile = new Array(7);
for (x = 0; (x < 7); x++) {
	txtTile[x] = new Array();
}
txtTile[idDoPick][0] = "apple";
txtTile[idDoPick][1] = "banana";
txtTile[idDoPick][2] = "steak";
txtTile[idDoPick][3] = "fish";
txtTile[idNoPick][0] = "sugar";
txtTile[idNoPick][1] = "cereal";
txtTile[idNoPick][2] = "milk";
txtTile[idNoPick][3] = "butter";
txtTile[idNoPick][4] = "water";
txtTile[idNoPick][5] = "rice";

// creating tiles from text
for (x = 0; (x < nb_DoPick); x++) {
	pixTile[idDoPick][x] = "<span class='gridtxt'>" + txtTile[idDoPick][x] + "</span>";	
}
for (x = 0; (x < nb_NoPick); x++) {
	pixTile[idNoPick][x] = "<span class='gridtxt'>" + txtTile[idNoPick][x] + "</span>";	
}

startGame();


/*
	start
*/

function startGame()
{
    // Checking and initialisation
	if (checkValues() > 1) { return; }
	drawroom();
	readroom();

    // --------------------
	var scoreEl = document.getElementById("score");
	replaceText(scoreEl, "0");
    // --------------------
	nbToPick = nb_DoPick;
	var nbpickEl = document.getElementById("nbtopick");
	replaceText(nbpickEl, nbToPick);
    // --------------------
	gameOverFlag = 0;


	startLevel();
	redraw();

	
	initialized = 1;
	var pbEl = document.getElementById("javascript");
	pbEl.innerHTML = "";
	setTimeout("ticker()", 100);
}


/* ------------------------------------------------------
	checkValues
	Make sure all parameters provided by the user conform to expectations
------------------------------------------------------ */
function checkValues() {
	// the width and height of the room are ill-defined
	if (dimWroom < 1 || dimHroom < 1) {
		showWarning(alertDimWH, 1);
		return 2;
	}

		// the array with the definition of the room is ill-defined
	if (mapRoom.length != (dimWroom * dimHroom)) {  
		showWarning(alertDefRoom, 1); 
		return 3;
	}
	
	// no problem
	return 1;
}

function drawroom() {
	var room = '';
	for (y = 0; (y < dimHroom); y++) {
		room += "<tr>";
		for (x = 0; (x < dimWroom); x++) {
			// We link the image to a silly URL,
			// which is never actually reached because
			// our onClick handler returns false.
			room += "<td class='tile' onClick=\"return userClick(" + x + "," + y + ")\" id=grid" + x + "," + y + " valign='middle'>aaaaa</td>";
		}
		room += "</tr>";
	}
	document.getElementById("room").innerHTML = room;
}


/* ------------------------------------------------------
	readRoom
	transform the array defined above into a map
------------------------------------------------------ */
function readroom() 
{
	var gx, gy;
	var idCell = 0;
	
	for (gy = 0; (gy < dimHroom); gy++) {
		for (gx = 0; (gx < dimWroom); gx++) {
			
			switch(mapRoom.charAt(idCell)) {
		      case '*':
				idTile[gx][gy] = idAvoid;
				srcTile[gx][gy] = pixTile[idAvoid][0]
				break;
		      case '#':
				idTile[gx][gy] = idObstacle;
				srcTile[gx][gy] = pixTile[idObstacle][obsC];
				break;
		      case '|':   
				idTile[gx][gy] = idObstacle;
				srcTile[gx][gy] = pixTile[idObstacle][obsV];
				break;
		      case '-':   
				idTile[gx][gy] = idObstacle;
				srcTile[gx][gy] = pixTile[idObstacle][obsH];
				break;
		      default:    
				idTile[gx][gy] = idBlank;
				srcTile[gx][gy] = pixTile[idBlank][0];
				break;
		 	}
			idCell++;
		}
	}	
}

// checked
function redraw()
{
	// Update the src for every img in the table 
	var gx, gy;
	for (gy = 0; (gy < dimHroom); gy++) {
		for (gx = 0; (gx < dimWroom); gx++) {
			document.getElementById("grid" + gx + "," + gy).innerHTML = srcTile[gx][gy];
		}
	}
}


// checked
function startLevel()
{
   // Position idAvatarU
	locXa = locXstart;
	locYa = locYstart;
	idTile[locXa][locYa] = avtU;
	srcTile[locXa][locYa] = pixTile[idAvatar][avtU];

   // Position Target for next move
	locXseek = locXa;
	locYseek = locYa;

	/* ---------------------
		Fill the map 
	-------------------------- */

	filled = 0;

	// Throw positives and then negatives in wherever there's empty space.
	placeInRoom(nb_DoPick, idDoPick) 
	placeInRoom(nb_NoPick, idNoPick) 

}

// checked
function placeInRoom(nbItems, idItems) 
{
	var nbLoops = 0;
	var htmlDoPick = '';
	var htmlNoPick = '';
	while (nbItems > 0 && nbLoops < 100) {
		x = Math.floor(Math.random() * dimWroom);
		y = Math.floor(Math.random() * dimHroom);
		if (idTile[x][y] == idBlank) {	
			idTile[x][y] = idItems;
			if(idItems == idDoPick) {
				srcTile[x][y] = pixTile[idDoPick][nbItems-1];
				htmlDoPick += '<span class="picked" id="doPick' + x + ',' + y + '">' + txtTile[idDoPick][nbItems-1] + '</span> '; 
			} else {
				srcTile[x][y] = pixTile[idNoPick][nbItems-1];
				htmlNoPick += '<span class="picked" id="noPick' + x + ',' + y + '">' + txtTile[idNoPick][nbItems-1] + '</span> '; 
			}
			nbItems--;
		}
		nbLoops++;
	}	
	if(idItems == idDoPick) {
		document.getElementById("picked_y").innerHTML = htmlDoPick;
	} else {
		document.getElementById("picked_n").innerHTML = htmlNoPick;
	}
}


// checked
function userClick(x, y)
{

	if (!initialized) {
		showWarning(alertNotInitialized, 1);
		return false;
	}
	if (gameOverFlag) {
		startGame();
		return false;
	}
	locXseek = x;
	locYseek = y;
	playerHasMoved = 1;
	return false;
}


// checked
function ticker()
{
	nbTicks++;
	if ((nbTicks == 200) && (!playerHasMoved)) {
		showWarning(alertDelay, 0);
	}
	if (nbTicks == 400) {
		showWarning(alertLongDelay, 0);
	}
	if (!moveAvatar()) {
		// 1-second wait before you can restart,
		// so people don't instantly restart by mistake
		setTimeout("gameOverHandler();", 1000);
		return;
	}
	if (nbToPick < 1) { 
		setTimeout("gameOverHandler();", 1000);
		return;
	} else {
		// Set next timeout
		setTimeout("ticker()", 100);
	}
}



function moveAvatar()
{

	var locXold, locYold;
	locXold = locXa;
	locYold = locYa;
	var moved;
	
	
	/*  -----------
	    x location
	-------------- */
	if (locXseek > locXa) {
		locXa++;
		idDirection = 2;
		moved = 1;
	} else if (locXseek < locXa) {
		locXa--;
		idDirection = 3;
		moved = 1;
	}
	// Stay in bounds!
	if (locXa < 0) {
		locXa = 0;
	} else if (locXa >= dimWroom) {
		locXa = dimWroom - 1;
	}
	// Check for collision
	if (idTile[locXa][locYa] == idObstacle) {
		locXa = locXold;
	}	
	
	/*  -----------
	    y location
	-------------- */
	if (locYseek > locYa) {
		locYa++;
		 idDirection = 1;
		moved = 1;
	} else if (locYseek < locYa) {
		locYa--;
		 idDirection = 0;
		moved = 1;
	}
	// Stay in bounds!
	if (locYa < 0) {
		locYa = 0;
	} else if (locYa >= dimHroom) {
		locYa = dimHroom - 1;
	}
	// Check for collision
	if (idTile[locXa][locYa] == idObstacle) {
		locYa = locYold;
	}
	/*  -----------
	    If came across a good or bad pick, update the score
	-------------- */
	if (moved) {	
		// Replace tile we come from with blank
		set(locXold, locYold, idBlank, 0);
		
		// Have we landed on something nifty?
		if (locXa == locXseek && locYa == locYseek) {
			if (idTile[locXa][locYa] == idDoPick) {
				nbToPick--;
				document.getElementById("doPick" + locXa + "," + locYa).style.visibility = "visible";
				addScore(ptPickDo);
			}
			if (idTile[locXa][locYa] == idNoPick) {
				document.getElementById("noPick" + locXa + "," + locYa).style.visibility = "visible";
				addScore(ptPickNo);
			}
		}
		set(locXa, locYa, idAvatar, idDirection);
	}
	return 1;
}



function set(x, y, idSpace, idDirection)
{
	idTile[x][y] = idSpace;
	if ((y < 0) || (y >= dimHroom)) {
		return;
	}
	if ((x < 0) || (x >= dimWroom)) {
		return;
	}
	document.getElementById("grid" + x + "," + y).innerHTML = pixTile[idSpace][idDirection];
	
}




// Updates the score
function addScore(points)
{
	var scoreEl = document.getElementById("score");
	replaceText(scoreEl, (Number(getText(scoreEl))+points));
	// ----------------
	var nbpickEl = document.getElementById("nbtopick");
	replaceText(nbpickEl, nbToPick);
}	


function gameOverHandler()
{
	showWarning(alertCongratulations, 1);
	gameOverFlag = 1;
	
}

/* Utility Functions */

function replaceText(el, text) {
  if (el != null) {
    clearText(el);
    var newNode = document.createTextNode(text);
    el.appendChild(newNode);
  }
}

function clearText(el) {
  if (el != null) {
    if (el.childNodes) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var childNode = el.childNodes[i];
        el.removeChild(childNode);
      }
    }
  }
}

function getText(el) {
  var text = "";
  if (el != null) {
    if (el.childNodes) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var childNode = el.childNodes[i];
        if (childNode.nodeValue != null) {
          text = text + childNode.nodeValue;
        }
      }
    }
  }
  return text;
}

function showWarning(txt, idMode) {
	if (idMode == 1) {
		alert(txt);
	} else {
	   var el = document.getElementById("warning");
		el.innerHTML = txt;
	}
}

