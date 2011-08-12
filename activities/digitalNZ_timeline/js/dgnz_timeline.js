var tl;
function plotSearch(searchText) {
    var eventSource = new Timeline.DefaultEventSource();
    var bandInfos = [
        Timeline.createBandInfo({
            eventSource:    eventSource,
            date:           "Jun 28 2006 00:00:00 GMT",
            width:          "85%", 
            intervalUnit:   Timeline.DateTime.YEAR, 
            intervalPixels: 100,
            trackHeight:    3.5
        }),
        Timeline.createBandInfo({
            showEventText:  false,
            trackHeight:    0.5,
            trackGap:       0.2,
            eventSource:    eventSource,
            date:           "Jun 28 2006 00:00:00 GMT",
            width:          "15%", 
            intervalUnit:   Timeline.DateTime.DECADE, 
            intervalPixels: 200
        })
    ];
    bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;

    tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
    // Timeline.loadXML("/timeline/search?search_text=<%= @search_text -%>", function(xml, url) { eventSource.loadXML(xml, url); });
    
    tl.loadJSON("http://widged.com/widgeds/v3/activities/digitalNZ_timeline/on_server/relay-dropbox.php?search_text="+ searchText , function(json, url) {
        for (var i = 0; i < json.length; i++) {
          if (json[i].events.length > 0) {
            eventSource.loadJSON(json[i], url);
          }
        }
    });
 }

var resizeTimerID = null;
function onResize() {
  if (resizeTimerID == null) {
      resizeTimerID = window.setTimeout(function() {
          resizeTimerID = null;
          tl.layout();
      }, 500);
  }
}
