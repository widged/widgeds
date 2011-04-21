/* ---------------------
    Open Question 
--------------------- */    

OpenQ.prototype = new Activity();
function OpenQ(params) {

    this.id                = 'open1';
    this.title             = "Open Question Activity";
    this.instructions      = '';
    this.layoutItems       = 'inline';
    this.layoutOptns       = 'inputtext20';
    this.shuffleOptns      = false;

    for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }

}

function makeOpen() {

    // -- Activity -------
    var a = new OpenQ();

    // -- Division -------
    d = a.divs[0] = new Division({id: "openq", nb: 0, mimetypeItems: 'plain/text', behaviorItems: ''});
    d.templateItems = a.templateItems;
    d.layoutOptns = a.layoutOptns;
    // -- items -------
    it = 0;
    d.items[it++] = new Item({     
                             id:         "live", 
                             src:        "We earn our ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "living"}], 
                             responses:  [{     id: "living"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "compete", 
                             src:        "in America today in peaceful ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "competition"} ], 
                             responses:  [{     id: "competition"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "power", 
                             src:        "with people all across the Earth. Profound and ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "make", 
                             src:        "forces are shaking and ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "rich", 
                             src:        "our world, and the urgent question of our time is whether we can make change our " + 
                                         "friend and not our enemy. This new world has already ::optns:: ",
                             optns: [    {     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "compete", 
                             src:        "the lives of millions of Americans who are able to ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "bank", 
                             src:        "and win in it. But when most people are working harder for less, when others cannot work " + 
                                         "at all, when the cost of health care devastates families and threatens to ::optns:: ", 
                             optns:      [{     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });

    d.items[it++] = new Item({     
                             id:         "free", 
                             src:        "our enterprises, great and small, when the fear of crime robs law abiding citizens of " + 
                                         "their ::optns:: and when millions of poor children cannot even imagine the lives we are calling them to lead, we have not made change our friend.", 
                             optns:      [{     id: 'i1',         src: "x"} ], 
                             responses:  [{     id: "x"   }]
                    });


   a.populateActivity();
}
