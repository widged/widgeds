var dialog1;

var avatar = new Array(); 
avatar[0] = ["MORGANA", 2, "avatar2.gif"];
avatar[1] = ["ARTHUR", 1, "avatar1.gif"];

var dlg = new Array(); 
dlg[0] = ["MORGANA","You must stop Owain from fighting."];
dlg[1] = ["ARTHUR","(annoyed - a sense that he also feels some guilt)<br/>It's his damn fault. He shouldn't have picked up the gauntlet!"];
dlg[2] = ["MORGANA","So put an end to it."]
dlg[3] = ["ARTHUR","The challenge has been taken up. The fight cannot be stopped."];
dlg[4] = ["MORGANA","So fight in his place. Much as it pains me to say it, you're the man for this job, not him."];
dlg[5] = ["ARTHUR","I can't!"];
dlg[6] = ["MORGANA","Why not?"];
dlg[7] = ["ARTHUR","Owain picked up the gauntlet, Owain is the one who must fight. That is the Knight's code. He knew that."];
dlg[8] = ["MORGANA","But he's just a boy."];
dlg[9] = ["ARTHUR","(a heavy sigh)<br/>I know."]

/**
 * Dialog
 *
 * @package widgeds
 * @author mlange
 **/

Dialog.prototype.toHTML= Dialog_toHTML;

function Dialog(dlg_array) {
	this.txt = dlg_array;
}


function Dialog_toHTML() {
	var aDlg = this.txt;
	var dlg_html = ''; 
	var nbr = 0;
	
	for (i in dlg) {
		if (dlg[i] != undefined) {
			idAvatar = 1;
			for (a in avatar) {
				if (dlg[i][0] == avatar[a][0]) {  idAvatar = avatar[a][1]; }
			}
			dlg_html += '<div class="callout_outer' +  idAvatar + '">\n\t<div class="callout_inner">\n\t\t' + dlg[i][1] + '\n\t</div>\n</div>\n\n';
		}
	}
	return dlg_html;
}

function Dialog_Start() {
	dialog1 = new Dialog(dlg);
	d_html = dialog1.toHTML();
	if (d_html != undefined) { document.getElementById("dialog").innerHTML = d_html; }
}
