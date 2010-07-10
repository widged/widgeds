var q_qst = new Array();
var q_asw = new Array();
var q_pts = new Array();
var q_sco = new Array();
var qcm1;

q_qst[0] = "Where is the Gestalt principle of good continuation used in object perception?";
q_asw[0] = ["segmenting an object into pieces", "using contextual constraints from the scene", "identifying the configuration of object features", "recognizing the geon identity of sub-objects"];
q_pts[0] = [1,0,0,0];

q_qst[1] = "Damage to the _____ lobe is likely to cause deficits in visual attention";
q_asw[1] = ["sensory-motor","parietal","temporal","frontal"];
q_pts[1] = [0,1,0,0];

q_qst[2] = "The goal of cognitive psychology is to";
q_asw[2] = ["discover the neuronal processes that give rise to mind.","understand the link between personality and behavior.","uncover the laws that govern adaptive behavior.","understand the nature of human intelligence."];
q_pts[2] = [0,0,0,1];

q_qst[3] = "Subjects are asked to read a series of statements such as: Customer pays bill; Customer orders food; Customer picks up menu; and Customer looks for table. When asked to recall these items later, most subjects probably would";
q_asw[3] = ["recall the items precisely in the order first presented.","put about half of the events back in the order of a stereotypical restaurant script.","put the items back in partially accurate script order, but only if asked explicitly to do so.","recall only the gist of the items without regard to order."];
q_pts[3] = [0,1,0,0];

q_qst[4] = "Which of the following is true about working memory?";
q_asw[4] = ["At any one time we can only have about seven elements active.","We have immediate access to the contents of working memory.","Unless it is maintained, information will be rapidly lost from working memory.","The contents of working memory are separate from the contents of long-term memory."];
q_pts[4] = [0,0,1,0];

q_qst[5] = " Knowledge about how to perform various cognitive activities is called:";
q_asw[5] = ["declarative knowledge.","procedural knowledge.","tacit knowledge.","process knowledge."];
q_pts[5] = [0,1,0,0];


/**
 * QCM Object
 *
 * @author mlange
 **/

QCM.prototype.toString = QCM_toString;
QCM.prototype.toHTML = QCM_toHTML;


function QCM(quests,answs,pnts) {
	this.questions = quests;
	this.answers = answs;
	this.points = pnts;
}

function QCM_toString() {
	var q_text = '';
	var q_qst = this.questions;
	var q_asw = this.answers;
	var q_nbr = 0;
	
	for (i in q_qst) {
		if (q_qst[i] != undefined) {
			q_nbr++;
			q_text += "" + q_nbr + ". " + q_qst[i] + "\n";
			for(j in q_asw) {
				if (q_asw[i][j] != undefined) {
					q_text += "\t*  " + q_asw[i][j] + "\n";
				}
			}
			q_text += ("\n\n");
		}
	}
	return "<pre>" + q_text + "</pre>";
}

function QCM_toHTML() {
	var all_text = '';
	var qst_text = '';
	var asw_text = '';
	var top_text = '';
	var q_qst = this.questions;
	var q_asw = this.answers;
	var q_nbq = 0;
	
	top_text += '<div class="instructions"><strong>Instructions:</strong> Click on the sentence that you believe to be the correct answer. The background colour of the sentence will then change to mark the selection. Answer as many questions as you can. When finished, click on on "Compute Score" to get your mark.</div>';
	top_text += '<span class="check_answers"><a href="#" onclick="compute_score()">Compute Score</a></span>';
	top_text += '&nbsp;&nbsp;|&nbsp;&nbsp;  ';
	top_text += '<span class="show_correct"><a href="#" onclick="show_correct()">Show Correct Answers</a></span>';


	for (i in q_qst) {
		qst_text = '';
		if (q_qst[i] != undefined) {
			q_nbq++;
			qst_text +=  "<p>" + q_nbq + ".  " + q_qst[i] + "</p>" + "\n";
			// Start : answers part
			asw_text = ''
			for(j in q_asw) {
				if (q_asw[i][j] != undefined) {
					asw_text += ('<li><span id="asw_' + i + ',' + j + '" onclick="answer_clicked(' + i + ',' + j + ')">' + q_asw[i][j] + '</span></li>');
				}
			}
			// End : answers part
		}

		all_text += '<div class="qst_item" id="qst_' + i + '">' + qst_text + '<ol>' + asw_text + '</ol>' + '</div>';
	}
	return ('<div class="qcm"><div class="top">' + top_text + '</div>' + '<div class="questions">'+ all_text + "</div></div>");
}


function StartQuestions(){
	// Show questiona and hide reading stuff
	qcm1 = new QCM(q_qst,q_asw,q_pts);
	qcm1.clr_asw_default = "#FFF";
	qcm1.clr_asw_clicked = "#FFCC66";
	qcm1.clr_asw_correct = "#00FF00";
	qcm1.bdr_asw_correct = "3px solid #00FF00";
	
	document.getElementById("qcm1").innerHTML = qcm1.toHTML();
}

function answer_clicked(q_id, a_id) {
	q_sco[q_id] = qcm1.points[q_id][a_id] + 0;
	for(i in qcm1.points[q_id]) {
		document.getElementById("asw_" + q_id + "," + i).style.background = qcm1.clr_asw_default;
	}
	document.getElementById("asw_" + q_id + "," + a_id).style.background = qcm1.clr_asw_clicked;
}

function compute_score() {
	var q_qst = qcm1.questions;
	var q_asw = qcm1.answers;
	var q_nbq = 0;
	var q_nba = 0;
	var score = 0;
	
	for (i in q_qst) {
		if (q_qst[i] != undefined) {
			q_nbq++;
			if(q_sco[i] != undefined)  { score += (q_sco[i] + 0); q_nba++ }
		}
	}
	alert("You have score of :  " + score + "\n\n" + q_nba + " questions on " + q_nbq + " were answered.");
}

function show_correct() {
	var q_qst = qcm1.questions;
	var q_asw = qcm1.answers;
	
	for (i in q_qst) {
		if (q_qst[i] != undefined) {
			for(j in q_asw) {
				if (q_asw[i][j] != undefined) {
					if(q_pts[i][j] != undefined && q_pts[i][j] > 0)  { 
						document.getElementById("asw_" + i + "," + j).style.borderBottom = qcm1.bdr_asw_correct;
					}
				}
			}
		}
	}
}