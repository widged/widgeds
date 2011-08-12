Timeline._Band.prototype._onMouseMove=function(innerFrame,evt,target){
	if(this._dragging){

		var diffX=evt.clientX-this._dragX;
		var diffY=evt.clientY-this._dragY;

		var diffX = -diffX; //NOTE: This line reverses the direction the slider moves
		
		this._dragX=evt.clientX;
		this._dragY=evt.clientY;

		this._moveEther(this._timeline.isHorizontal()?diffX:diffY);
		this._positionHighlight();
	}
};
Timeline.DefaultEventSource.Event.prototype.fillInfoBubble = function(elmt,theme,labeller) {
	var doc=elmt.ownerDocument;

	var title=this.getText();
	var link=this.getLink();
	var image=this.getImage();

	if(image!=null){
		var img=doc.createElement("img");
		img.src=image;

		theme.event.bubble.imageStyler(img);
		elmt.appendChild(img);
	}

	var divTitle=doc.createElement("div");
	var titleLink = doc.createElement("a");
	var textTitle=doc.createTextNode(title);

	if(link!=null){
		var a=doc.createElement("a");
		a.href=link;
		a.appendChild(textTitle);
		divTitle.appendChild(a);
	} else {
		divTitle.appendChild(textTitle);
	}
	theme.event.bubble.titleStyler(divTitle);
	elmt.appendChild(divTitle);

	var divBody=doc.createElement("div");
	this.fillDescription(divBody);
	theme.event.bubble.bodyStyler(divBody);
	elmt.appendChild(divBody);

	var divTime=doc.createElement("div");
	this.fillTime(divTime,labeller);
	var splitTime = divTime.innerHTML.split( ' ' );
	divTime.innerHTML = splitTime.slice(0,4).join( ' ' ); 
	theme.event.bubble.timeStyler(divTime);
	elmt.appendChild(divTime);

	var divWiki=doc.createElement("div");
	this.fillWikiInfo(divWiki);
	theme.event.bubble.wikiStyler(divWiki);
	elmt.appendChild(divWiki);
	
	var footerlink=doc.createElement("a");
	footerlink.href=link;
	linkto=doc.createTextNode("Read More...");
	footerlink.appendChild(linkto);
	var divLinkThrough=doc.createElement("div");
	divLinkThrough.appendChild(footerlink);
	elmt.appendChild(divLinkThrough);
};