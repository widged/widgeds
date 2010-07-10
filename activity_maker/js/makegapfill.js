/* ---------------------
        Gapfill 
--------------------- */    

Gapfill.prototype = new Activity();
function Gapfill(params) {

    this.id             = 'gapfill1';
    this.title          = "Gapfill Activity";
    this.instructions   = '';
    this.templateItems    = '::item::  ::optns:: ';
    this.layoutItems    = 'inline';
    this.layoutOptns    = 'dropdown';
    this.shuffleOptns   = false;

    for (i in params) { if (params[i] != undefined) { this[i] = params[i]; } }

}

function makeGapfill() {
    // -- Activity -------
    var a = new Gapfill();

    // -- Division -------
    d = a.divs[0] = new Division({id: "gapfill", nb: 0, mimetypeItems: 'plain/text', behaviorItems: ''});
    d.templateItems = a.templateItems;
    d.layoutOptns = a.layoutOptns;
    // -- items -------
    itemdata = [  
    	{
    		id:         "live", 
    		src:			"We earn our", 
    		optns: [
    			{  id:  'o1',         src: "living"}, 
    			{  id:  'c',          src: "livelihood"}, 
    			{  id:  'o3',         src: "life"}, 
    			{  id:  'o4',         src: "lived"}
    		], 
    		responses: [  { id: "c" }]
    	},
    	{	 id:         "compete", 
    		src:        "in America today in peaceful", 
    		optns: [
    			{  id:  'c',         src: "competition"}, 
    			{  id:  'o1',         src: "competing"}, 
    			{  id:  'o2',         src: "competed"}, 
    			{  id:  'o3',         src: "competes"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{
    		id:         "power", 
    		src:        "with people all across the Earth. Profound and", 
    		optns: [
    			{  id:  'o1',         src: "powerless"}, 
    			{  id:  'o2',         src: "empowering"}, 
    			{  id:  'o3',         src: "powerful"}, 
    			{  id:  'o4',         src: "powered"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{
    		id:         "make", 
    		src:        "forces are shaking and", 
    		optns: [
    			{  id:  'o1',         src: "made"}, 
    			{  id:  'o2',         src: "making"}, 
    			{  id:  'o3',         src: "unmaking"}, 
    			{  id:  'o4',         src: "unmade"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{
    		id:         "rich", 
    		src:        "our world, and the urgent question of our time is whether we can make change our " +
    			         "friend and not our enemy. This new world has already",
    		optns: [
    			{  id:  'o1',         src: "richen"}, 
    			{  id:  'o2',         src: "enriched"}, 
    			{  id:  'o3',         src: "riches"}, 
    			{  id:  'o4',         src: "enriching"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{
    		id:         "compete", 
    		src:        "the lives of millions of Americans who are able to", 
    		optns: [
    			{  id:  'o1',         src: "competed"}, 
    			{  id:  'o2',         src: "compete"}, 
    			{  id:  'o3',         src: "competition"}, 
    			{  id:  'o4',         src: "competing"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{
    		id:         "bank", 
    		src:        "and win in it. But when most people are working harder for less, when others cannot " +
    			         "work at all, when the cost of health care devastates families and threatens to", 
    		optns: [
    			{  id:  'o1',         src: "embank"}, 
    			{  id:  'o2',         src: "bankrupt"}, 
    			{  id:  'o3',         src: "banked"}, 
    			{  id:  'o4',         src: "banking"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{	id:         "free", 
    		src:        "our enterprises, great and small, when the fear of crime robs law abiding citizens of their ",
    		optns: [
    			{  id:  'o1',         src: "freedom"}, 
    			{  id:  'o2',         src: "freeing"}, 
    			{  id:  'o3',         src: "freed"}, 
    			{  id:  'o4',         src: "free"}
    		], 
    		responses: [  { id: "c"   }]
    	},
    	{	id:         "millions", 
    		src:        "and when millions of poor children cannot even imagine the lives we are calling them to lead, we have not made change our friend.", 
    		responsesStatus: "noresponse"
    	}
    ]
    
    var it = 0;
    for (var id in itemdata) {
      d.items[it++] = new Item(itemdata[id]);
    }


    a.populateActivity();
}
