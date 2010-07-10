var TempReading = '';
var timer1 = new Timer(5,0);

function StartUp(){
	// Show questiona and hide reading stuff
	HideReadingStuff();
}

function HideReadingStuff() {
	//Hide the reading stuff
		TempReading = document.getElementById('ReadingDiv').innerHTML;
		document.getElementById('ReadingDiv').innerHTML = '';
		document.getElementById('ShowReadingButton').focus();
}

function ShowReading(){
	document.getElementById('ReadingDiv').innerHTML = TempReading;
	timer1.newValue(5,0);
}


function StartReading(){
	ShowReading();
	timer1.updateView();
	timer1.countDown();
}

function WriteToReading(Stuff) {
	document.getElementById('ReadingDiv').innerHTML = Stuff;
	document.getElementById('NextQButton').focus();
}



/**
 * Timer Object
 *
 * @author mlange
 **/


Timer.prototype.countDown = Timer_countDown;
Timer.prototype.updateView = Timer_updateView;
Timer.prototype.toString = Timer_toString;
Timer.prototype.timesUp = Timer_timesUp;
Timer.prototype.newValue = Timer_newValue;

function Timer(mm,ss) {
	this.min = mm;
	this.sec = ss;
}

function Timer_newValue(mm,ss) {
	this.min = mm;
	this.sec = ss;
}

function Timer_countDown() {
	var mm = this.min;
	var ss = this.sec;
	
	if (ss==0) {
		ss = 60;
		mm--;
	}
	ss--;

	this.min = mm;
	this.sec = ss;
	
	if (ss==0){
		this.timesUp();
	} else{
		this.updateView();
		setTimeout('timer1.countDown()',1000);
	}
}

function Timer_updateView() {
	if (document.TimerForm.face != null){
		document.TimerForm.face.value = this.toString();
	}
}
function Timer_toString() {
	var mm = this.min;
	var ss = this.sec;

	if (ss<10){
		ss="0" + ss;
	}
	return mm+":"+ss;
}

function Timer_timesUp() {
	Stuff='<button id="ShowReadingButton" class="FunctionButton" onclick="StartReading(); return false;">Show reading again</button>';
	document.getElementById('ShowReadingButton').innerHTML = Stuff;
	//	document.getElementById('TimerDiv').innerHTML = Stuff;
	WriteToReading('Your time is over!');
}

