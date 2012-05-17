/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Raphael*/

var Panel = new Class({
    Implements:[Options,Events],
    options:{
    },
    initialize: function(options){
        
        //this.setOptions(options);
        
        this.panel = new Element("div",{
            "class":options["class"]||"",
            styles:{
                position:options.position||(options.y||options.x)?"absolute":"relative",
                top:options.y||0,
                left:options.x||0,
                "float":options["float"]||"none",
                width:options.width||"100%",
                height:options.height||"100%"
            }
        });
        
        this.bound = {
            resize:this.resize.bind(this)
        };
        
        this.addEvents({
            "panel.resize": this.bound.resize
        });
    },
    
    setScroll:function(set){
        var panel = this.panel, scroller = this.scroller;
        if(typeOf(set)!=="null"){
            scroller[(set?"add":"remove")+"Class"]("hide");
            this.resize(this.width+(set?-1:1)*scroller.getSize().x);
        } else {
        }
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
