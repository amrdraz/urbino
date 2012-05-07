/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Raphael*/

var Panel = new Class({
    Implements:[Options,Events],
    options:{
        width:"100%",
        height:"100%",
        poition:"relative",
        x:0,
        y:0
    },
    initialize: function(options){
        
        this.setOptions(options);
        
        this.panel = new Element("div",{styles:this.options});
        this.bound = {
            resize:this.resize.bind(this)
        };
        
        this.addEvents({
            "panel.resize": this.bound.resize
        });
    },
    
    resize: function(x,y){
        this.width = x = x || this.width;
        this.height = y = y || this.height;
        this.panel.setStyles({width:x,height:y});
        this.fireEvent("resize",[x,y]);
    },
    move: function(x,y){
        this.x = x = x || this.x;
        this.y = y = y || this.y;
        this.panel.setStyles({left:x,top:y});
        this.fireEvent("move",[x,y]);
    }
});
