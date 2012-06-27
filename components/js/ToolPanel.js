/**
 * this class is respnsible for the Editors Tools panel
 * @author Amr Draz
 * @requirments Raphael, pathManager, Moootools
 */
/*global $,$$,console,Class,Element,typeOf,window,R,Panel,ColorPicker,PropertiesPanel*/

var ToolPanel = (function(){
    
    return new Class({
        
    Extends:PropertiesPanel,
    
    icon:{
        select:"M2,2L2,64L17,41L31,63L45,55L30,35L55,30L2,2"
    },
    /**
     * the currently selected path
     */
    pm:null,
    /**
     * a boolean that is true when editing or drawing path
     */
    drawPath:false,
    /**
     * a variable that holds the current selected tool value
     */
    toolMode:null,// is a string signifying the mouse mode
    /**
     * a boolean to disable 
     */
    noShortcut : false,

    /**
     * text area for writing text
     */
/**
 * function which intializes the Tool Panel
 * @param panel (string) id of the DIV element the panel is added too
 * @param R (obj) Rapahel paper element
 * @param options (obj) extra options when initializing the Panel
 */
initialize : function(options){
    this.parent(options || {});
    
    this.bind([
       "keyCommand",
        "drawStart",
        "drawDrag",
        "drawStop",
        "panelUpdate",
        "hotkeys",
        "setState"
    ]);
    /**
     * the default fill and stroke color
     */
    var fs = {
        "fill":"#48e",
        "stroke":"none"
        };
    this.setAttr(fs);
    /**
     * the defualt image src
     */
    this.imgAttr = {src:"http://www.wowace.com/thumbman/avatars/6/707/300x300/600px-718smiley.svg.png.-m0.png"};
    this.textAttr = {"font-size":"18px"};
    //console.log(this.getAttr(["fill", "stroke"]));
    //this.parent(options||{});
    //var p = this.panel.addClass("tool-panel"),
    var p = this.panel.addClass("tool-panel"),
    
    imgSrc = this.options.imgSrc = (this.options.imgSrc || "img")+"/",
    cp = this.colorPicker = new ColorPicker({
        imgSrc:imgSrc,
        onChange:function(color,o,v){
            if(v){
                var attr = {},
                    att = v.node.getParent("div").get("for");
                    attr[att]=color;
                    attr[att+"-opacity"]=o;
                window.fireEvent("element.update", [attr]);
            }
        }.bind(this)
    });
    
    /**
     * creates the tool panel and adds the 
     */
    p.set("html",''+
        '<div toolType="select" title="select element" class="tool">select</div>'+
        '<div toolType="rect" title="draw a rectangle" class="tool">rect</div>'+
        '<div toolType="circle" title="draw a circle" class="tool">circle</div>'+
        '<div toolType="ellipse" title="draw an ellipse" class="tool">ellipse</div>'+
        '<div toolType="text" title="write text" class="tool">text</div>'+
        '<div toolType="image" title="add Image" class="tool">image</div>'+
        '<div toolType="path" title="draw path" class="tool">path</div>'
    );
    
    var ps = this.properties = {},
        props = {
        "fill":{name:"fill", value:fs.fill,x:5,y:250,width:30,type:"color"},
        "stroke":{name:"stroke", value:fs.stroke,x:15,y:260,width:30,type:"color"} 
        },
        div;
        Object.each(props,function(p, key){
            div = this.createInput(p);
            ps[key]={};
            ps[key].name = p.name;
            ps[key].type = p.type;
            ps[key].prop = div;
        }, this);
        
    p.adopt(
        ps.stroke.prop,
        ps.fill.prop
    );
    
    
    p.addEvent("click:relay(.tool)",function(e) {
        window.fireEvent("tool.state", [e.target.get("toolType")]);
    });
   
   
    window.addEvents({
        "hotkeys.set":this.bound.hotkeys,
        "keyup": this.bound.keyCommand,
        "draw.start": this.bound.drawStart,
        "draw.drag": this.bound.drawDrag,
        "draw.stop": this.bound.drawStop,
        "panel.update":this.bound.panelUpdate,
        "tool.state":this.bound.setState
    });
    
    
    //this.selectMode("select");
},
    hotkeys: function(val){
        this.hotkeys = val;
    },
    setState: function(st){
       // console.log(st);
        if(st==="canvas"){
            //console.log("toolpanel setStat",this.getAttr(["fill", "stroke"]));
            this.prop(this.getAttr(["fill", "stroke"]));
        } else {
            this.toolMode = st;
            //console.log("selected "+ toolMode+" tool");
            //window.fireEvent("element.deselect");
            var tool = $$(".tool[toolType="+st+"]")[0];
            
            tool.getParent().getElements(".selected").removeClass("selected");
            tool.addClass("selected");
        }
    },
    panelUpdate: function(attr){
        //this.prop({fill:attr.fill, stroke:attr.stroke});
        //console.log(attr);
        this.prop(attr);
    },
    /**
     * these are keyboard trigered comands such as shortcuts for the tools panel characters include
     *  - 'v' for select tool
     *  - 'r' for rect tool
     *  - 'c'for cricle tool
     *  - 'e' for ellipse tool
     *  - 'i' for image tool
     *  - 't' for text tool
     *  - 'p' for path tool
     *  - 'delete' for deleting an element fires a element.delete event
     * 
     */
    keyCommand : function (eve){
        var mode;
        if(this.hotkeys){ //ment to disable keycomands temporarely
            this.drawPath = false;
            switch(eve.key){
                case "v":
                    mode = ("select");
                    break;
                case "r":
                    mode = ("rect");
                    break;
                case "c":
                    mode = ("circle");
                    break;
                case "e":
                    mode = ("ellipse");
                    break;
                case "t":
                    mode = ("text");
                    break;
                case "i":
                    mode = ("image");
                    break;
                case "p":
                    this.drawPath = false;
                    mode = ("path");
                    break;
                default:break;
            }
            if(mode){
               window.fireEvent("tool.state", [mode]);
            } else{
                if(eve.key==="delete"){
                    eve.stop();
                    window.fireEvent("element.delete");
                }
            }
            
        }
    },
    /**
     * event handler for draw.start
     * creates the bounding box and specified element based on selcted tool
     * it then registers a mouse move handler which fires a draw.move event
     * also rgisters a mouseup event which removes both handlers
     * and fires a draw.end event handler
     */
    drawStart: function (o) {
        var toolMode = this.toolMode, drawPath = this.drawPath;
        if(!this.toolMode.contains("custom")) {
            var R = o.paper,c = o.c,
            el, select = false, bound =  R.rect(o.x, o.y, 0, 0).attr({
                stroke: "#000",
                opacity: 0.6
           });
            switch(toolMode) {
            case "rect": el = R.rect(0,0,0,0,0); break;
            case "ellipse": el= R.ellipse(0,0,0,0); break;
            case "circle": el=R.circle(0,0,0); break;
            case "text" : el=R.text(0,0,"").attr(this.textAttr); bound.attr("stroke-dasharray","--"); break;
            case "image": el = R.image(this.imgAttr.src, 0,0, 0,0); break;
            case "path" :
                if(o.pm===true){
                    el =  R.pathManager();
                    this.elementCreate(el, "path");
                    drawPath = this.drawPath = true;
                    el.attr(this.getAttr(["fill","stroke"]));
                } else {
                   el = o.pm;
                }
                //console.log("draw Start",el);
                el.insertSegment(o.x,o.y);
                var last = el.segments.last().attr("n");
                break;
            case "select":
                select=true;
                break;
            }
        (toolMode==="path") && bound.attr("opacity",0);
        !(/select|image/.test(toolMode) || el.drawing) && el.attr(this.getAttr(["fill","stroke"]));
        var drawFire = function (e) {
            
            var nx = e.page.x - c.getParent().getPosition().x,
                ny = e.page.y - c.getParent().getPosition().y,
                space = (e.key==="space"),
                fixed = (e.shift || toolMode==="circle"),
                dx = (nx-o.x),
                dy = (ny-o.y),
                x = ((dx>=0)?o.x:nx),
                y = ((dy>=0)?o.y:ny),
                w = ((dx>=0)?dx:(o.x-nx)),
                h = (fixed)?w:((dy>=0)?dy:(o.y-ny)),
                cx = x+(w/2),
                cy = y+(h/2)
                ;
            
            window.fireEvent("draw.drag", [{
                "bound":bound,
                last:last,//path segment
                dx:dx,dy:dy,
                "el":(select)?R.set():el,
                "x":x,
                "y":y,"width":w,"height":h,
                "cx":cx,"cy":cy,
                "fixed": fixed,
                "space": space,
                "alt": (e.alt)
            },e]);
            
       },
       drawEnd = function (e) {
            c.removeEvent("mousemove", drawFire);
            c.removeEvent("mouseup", drawEnd);
            document.onselectstart = function() {return true;};
            window.fireEvent("draw.stop", [{
                last:last,
                "canvas": c,
                "el": el,
                "bound":bound
            },e]);
        };
        // needed to stop text drag in chrome from http://stackoverflow.com/questions/6388284/click-and-drag-cursor-in-chrome
        document.onselectstart = function() {return false;};
        c.addEvent("mousemove", drawFire);
        c.addEvent("mouseup", drawEnd);
        
    }},
    /**
     * event handler for draw.drag event
     * calculates how the element should look like based on mouse movement
     * @param o(obj) contains {
                "bound": the bounding box of the drawn element,
                "el":the element that is currently being drawn,
                "x":the x position of the element,
                "y":the y position of the element,
                "width":width of the element,
                "height":height of the element,
                "cx":center x point of the element,
                "cy":center y point of the element,
                "fixed": boolean if proportioas should be constrained,
                "space": boolean if element should be moved(still not implemented),
                "alt": boolean if alt key is pressed
            }
     */
    drawDrag: function (o) {
        var el = o.el,
        attrs = {
            x: (o.alt)?(o.x-o.width/2):o.x,
            y: (o.alt)?(o.y-o.height/2):o.y,
            width: o.width,
            height: o.height
        };
        o.bound.attr(attrs);
        switch(this.toolMode) {
        case "rect": case "image": el.attr(attrs); break;
        case "ellipse": el.attr({
                cx:(o.alt)?o.x:o.cx,
                cy:(o.alt)?o.y:o.cy,
                rx:(o.width/2),
                ry:(o.height/2)
            });
            break;
        case "circle":  el.attr({
                cx:(o.alt)?o.x:o.cx,
                cy:(o.alt)?o.y:o.cy,
                r:(o.height<o.width)?(o.height/2):(o.width/2)
            }); 
            break;
        case "path":
            o.last.update(o.dx - (o.last.dx || 0), o.dy - (o.last.dy || 0));
            o.last.dx = o.dx;
            o.last.dy = o.dy;
            break;
        }
        //console.log(o);
       
    },
    /**
     * event handler for draw.stop event
     * 
     */
    drawStop : function (o,e){
        var el= o.el, at = o.bound.attr();
        
        o.bound.remove();
        if(this.toolMode!=="path"){
            if(at.width === 0 || at.height === 0) {
                el.remove();
                window.fireEvent("tool.state", ["select"]);
                window.fireEvent("canvas.mousedown", e);
               // console.log("removed");
            } else {
                this.elementCreate(el, at);
            }
        } else {
            o.last.dx = o.last.dy = 0;
        }
        
    },/**
     * This function creates a custom raphael element based on the element just drawn
     * An element is bound to fire an element.select event on click
     * This function fires an element.create event
     * @param el (obj) Raphael Obj
     * @param at (obj) attributes of bounding box while drawing
     */
    elementCreate : function(el, at){
        window.fireEvent("element.create", [el, at]);
    }

});

})();
