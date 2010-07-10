/* --------------------------------
        Multiple Choice Question 
--------------------------------- */    

MCQ.prototype = new Activity();
function MCQ(params) {

    this.id             = 'mcq1';
    this.title          = "Multiple Choice Question Activity";
    this.instructions   = 'Click on the sentence that you believe to be the correct answer. The background colour of the sentence will then change to mark the selection. Answer as many questions as you can. When finished, click on on "Compute Score" to get your mark.';
    this.layoutItems    = 'inline';
    this.layoutOptns    = 'orderedlist';
    this.templateItems  = '<div class="item" id="::itmId::">::item:: <img src="etc/pix/comments.gif" onclick="oActivity.divs[0].showHintAsk(\'::itmNb::\')" />  ::optns:: </div>';
    this.templateOptns  = '<span class="response" id="::itmId::_::optId::" onclick="oActivity.divs[0].checkCorrect(this.id, \'::itmNb::\')">::optn::</span>';
    this.shuffleOptns   = false;

    for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }

}

function makeMCQ() {
    
    var dlg = new Array(); 
    dlg[0]  = ["Jose", "French Toast...  What a delicious recipe!  What do I do first?"];
    dlg[1]  = ["Viviane", "Start by making the batter. Beat the eggs, milk, vanilla and salt together."];
    dlg[2]  = ["Jose", "How many eggs?"];
    dlg[3]  = ["Viviane", "Just 2."];
    dlg[4]  = ["Jose", "OK. How much milk, vanilla and salt?"];
    dlg[5]  = ["Viviane", "About 110 ml of milk, a teaspoon of vanilla and a pinch of salt.  Mix until smooth."];
    dlg[6]  = ["Jose", "OK done."];
    dlg[7]  = ["Viviane", "Now cut the bread into 1 centimeter slices and dip into the batter.  If the slices are too thick, the toast gets soggy."];
    dlg[8]  = ["Jose", "How many slices?"];
    dlg[9]  = ["Viviane", "Just a few.  Enough for the two of us.  Is four enough?"];
    dlg[10] = ["Jose", "That's good.  We don't have much bread."];
    dlg[11] = ["Viviane", "Now melt some butter and oil in a frying pan and fry the bread on each side until golden-brown."];
    dlg[12] = ["Jose", "How much butter and oil?"];
    dlg[13] = ["Viviane", "Not a lot."];    

    // -- Activity -------
    var a = new MCQ();
    
    // -- Division -------
    d = a.divs[0] = new Division({id: "mcq", nb: 0, mimetypeItems: 'plain/text', behaviorItems: ''});
    d.CSSstyle = {
        right: "background: #0F0", 
        wrong: "background: #F66"
    };
    d.templateItems   = a.templateItems;
    d.templateOptns   = a.templateOptns;
    d.layoutOptns     = a.layoutOptns;
    d.shuffleItems    = true;
    d.nbItemsPerPage  = 4;


    // -- items -------
    it = 0;
    d.items[it++] = new Item({ id: "frenchtoast",
                        src: "What are Jose and Viviane making?", 
                        optns: [    {    id: 'be',         src: "Bacon and Eggs"}, 
                                    {    id: 'et',         src: "Eggs and toast"}, 
                                    {    id: 'ft',         src: "French Toast"}
                                ], 
                        responses: [{    id: "ft"   }],
                        hintAsk: dlg[0][1]
    });

    d.items[it++] = new Item({ id: "twopersons",
                        src: "How many people are going to eat the French toast?", 
                        optns: [     {   id: "1",          src: "one"},
                                     {   id: "2",          src: "two"}, 
                                     {   id: "3",          src: "three"}
                                ], 
                        responses: [ {   id: "2"   } ],
                        hintAsk: dlg[9][1]
    });

    d.items[it++] = new Item({ id: "slicesthin",
                        src: "Why should the bread slices be thin?", 
                        optns: [    {    id: "soggy",      src: "If they are thick, the Fench toast will be soggy."}, 
                                    {    id: "filling",    src: "Thick bread is too filling"}, 
                                    {    id: "limited",    src: "There isn't much bread."}
                                ], 
                        responses: [ {   id: "soggy"   } ],
                        hintAsk: dlg[7][1]
    });

    d.items[it++] = new Item({ id: "goldenbrown",
                        src: "How will Jose know when the French toast is done?", 
                        optns: [    {    id: "crisp",      src: "It will be crisp."}, 
                                    {    id: "golden",     src: "The colour will be golden-brown."}, 
                                    {    id: "batter",     src: "There will not be anymore batter."}
                                ], 
                        responses: [ {   id: "golden"   } ],
                        hintAsk: dlg[11][1]
    });
    d.items[it++] = new Item({ id: "littlesalt",
                        src: "How much salt should you put in French toast?", 
                        optns: [    {    id: "lot",        src: "A lot of salt."}, 
                                    {    id: "little",     src: "A little salt."}, 
                                    {    id: "no",         src: "No salt."}
                                ], 
                        responses: [ {   id: "little"   } ],
                        hintAsk: dlg[5][1]
    });

    d.items[it++] = new Item({ id: "milk110",
                        src: "Does the recipe require exactly 110 ml of milk?", 
                        optns: [    {    id: "y",          src: "Yes"}, 
                                    {    id: "n",          src: "No"}
                                ], 
                        responses: [ {   id: "n"   } ],
                        hintAsk: dlg[5][1]
    });

    d.items[it++] = new Item({ id: "mixsmooth",
                        src: "How long should Jose beat the eggs, milk, vanilla and salt?", 
                        optns: [    {    id: "5min",       src: "5 minutes."}, 
                                    {    id: "mix",        src: "Until they mix."},
                                    {    id: "smooth",     src: "Until the mix is smooth."}
                                ], 
                        responses: [ {   id: "smooth"  } ],
                        hintAsk: dlg[5][1]
    });

    d.items[it++] = new Item({ id: "twoslices",
                        src: "How many slices of French toast will Jose and Viviane each eat?", 
                        optns: [    {    id: "1",          src: "one"}, 
                                    {    id: "2",          src: "two"},
                                    {    id: "4",          src: "four"}
                                ], 
                        responses: [ {   id: "2"   } ],
                        hintAsk: dlg[9][1]
    });

    d.items[it++] = new Item({ id: "enoughbread",
                        src: "How much bread do Jose and Viviane have?", 
                        optns: [    {    id: "lot",         src: "A lot of bread."}, 
                                    {    id: "enough",      src: "Just enough bread."},
                                    {    id: "no",          src: "No bread."}
                                ], 
                        responses: [ {   id: "enough"  } ],
                        hintAsk: dlg[9][1]
    });

    d.items[it++] = new Item({ id: "whatdoing",
                        src: "What are Jose and Vivian doing?", 
                        optns: [    {    id: "shop",       src: "Shopping for ingredients."}, 
                                    {    id: "diner",      src: "Planning dinner."},
                                    {    id: "frtoast",    src: "Making Fench toast."}
                                ], 
                        responses: [ {   id: "frtoast"  } ],
                        hintAsk: dlg[0][1]
    });


    a.populateActivity();
}
