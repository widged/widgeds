/* ---------------------
        Matching
--------------------- */    

Matching.prototype = new Activity();
function Matching(params) {    

    this.id                  = 'matching1';
    this.title               = "Matching Activity";
    this.instructions        = 'Click on one of the elements to match, a change in background color ' +
                               'indicates that the element was correctly selected. Then click on the target that matches the element.';
    this.layoutItems         = 'table';

    this.templateTarget      =    '<div class="target"  id="::itmId::" onclick="oActivity.divs[0].checkCorrect(this.id, \'::itmNb::\')">' + 
                                      '<div class="target_area">' + 
                                          '::item::' + 
                                      '</div>' +
                                      '<div class="drop_area"  id="drp_::itmId::">&nbsp;</div>' +
                                  '</div>' + "\n\n";
    this.templateMobile      =   '<div class="mobile"  id="::itmId::" onclick="oActivity.divs[1].makeSelection(this.id)">' + 
                                     '::item::' + 
                                 '</div>' + "\n\n";

    for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }

}

function makeMatching() {

    // -- Activity -------

    var a = new Matching();
    
    // -- Division: Target Items -------

    d1 = a.divs[0] = new Division({id: "targets", nb: 0, mimetypeItems: 'image/gif', behaviorItems:  {onclick: ''}});
    d1.CSSstyle     = {
        right: "border: 3px solid green; background: #D9D9D9", 
        wrong: "border: 3px solid red", 
        neutral: "border: 3px solid transparent"
    };
    
    d1.templateItems = a.templateTarget;
    it = 0;
    
    d1.items[it++] = new Item({ id:        "earthT",    
                                src:       "earth.gif",     
                                responses: [{id: "earth"    }]    
                            });
    d1.items[it++] = new Item({ id:        "marsT",     
                                src:       "mars.gif",     
                                responseStatus: "noresponse",
                                responses: [{id: "x"    }]    
                            });
    d1.items[it++] = new Item({ id:        "venusT",    
                                src:       "venus.gif",     
                                responses: [{id: "venus"    }]    
                            });
    d1.items[it++] = new Item({ id:        "saturnT",    
                                src:       "saturn.gif", 
                                responseStatus: "noresponse",
                                responses: [{id: "x"    }]    
                            });

    // -- Division : Mobile Items -------
    d2 = a.divs[1] = new Division({id: "mobiles", nb: 1, mimetypeItems: 'text/plain', behaviorItems:  {onclick: ''}});
    d2.CSSstyle     = {
        selected: "background: orange", 
        deselected: "background: transparent"
    };
    d2.templateItems = a.templateMobile;
    it = 0;
    d2.items[it++] = new Item({ id:        "earth",    
                                src:       "Earth",
                                responseStatus: "noresponse"
                            });
    d2.items[it++] = new Item({ id:        "venus",    
                                src:       "Venus",
                                responseStatus: "noresponse"
                            });

    // -- Load Activity Content -------
    a.populateActivity();
}

