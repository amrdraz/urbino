/**
 * this class is respnsible for the Editors Tools panel
 * @author Amr Draz
 * @requirments Raphael, pathManager, Moootools
 */
/*global $,$$,console,Class,Element,typeOf,window,R,Panel,ColorPicker*/

var ToolPanel = new Class({
    Extends:Panel,
    //Implements:[Events],
    /**
     * function that returns the attributes of the global state
     * @return attrs (obj) Raphael attr object formate {attrName:attrValue,...}
     */
    getAttr:function(){
        return this.attrs;
    },
    /**
     * function that sets the attributes of the global state
     */
    setAttr:function(att, val){
        //console.log(this);
        if(typeOf(att)=="object"){
            Object.each(att, function(val, key){
                this.setAttr(key,val);
            }, this);
            return;
        }
        this.attrs[att] = (val==="")?"none":val;
    },
    icon:{
        select:"M2,2L2,64L17,41L31,63L45,55L30,35L55,30L2,2"
    },
    /**
     * the scurrently selected element
     */
    selected: [],
    /**
     * the currently selected path
     */
    pm:null,
    /**
     * the defualt image src
     */
    imgAttr : {src:"http://www.wowace.com/thumbman/avatars/6/707/300x300/600px-718smiley.svg.png.-m0.png"},
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
initialize : function(R, options){
    options = options || {};
    this.paper = R;
    this.bound = {};
            [   "keyCommand",
                "drawStart",
                "drawDrag",
                "drawStop",
                "elementDelete",
                "elementSelect",
                "elementDeselect",
                "mousedown",
                "dblclick",
                "hideTextToolArea",
                "setAttr"
            ].each(function(name){
                this.bound[name] = this[name].bind(this);
            }, this);
    
    /**
     * the default global attributes
     */
    this.attrs = {"fill":"#48e", "stroke":"none",r:0, "font-size":"18px"};
    
    //this.parent(options||{});
    //var p = this.panel.addClass("tool-panel"),
    var p = this.panel = new Element("div",{"class":"tool-panel"}),
        /**
     * sets c to the DIV/SVG R is applied too
     */
    c = this.c = $(R.canvas),
    imgSrc = (options.imgSrc || "img")+"/",
    ta = this.textToolArea = new Element("textarea", { styles:{
        "position":"absolute",
        "white-space":"nowrap",
        "display":"none",
        "border":"#000 dashed 1px"
    }}),
    cp = this.colorPicker = new ColorPicker({
        imgSrc:imgSrc,
        onChange:function(color,o,v){
            var sel = this.slected;
            if(v){
                var attr = {},
                    att = v.node.getParent("div").get("for");
                    attr[att]=color;
                    attr[att+"-opacity"]=o;
                v.attr({"fill":color==="none"?"135-#fff-#fff:45-#f00:45-#f00:55-#fff:45-#fff":color,"fill-opacity":o});
                if(sel.length!==0){
                    window.fireEvent("element.update", [attr]);
                } else {
                    window.fireEvent("panel.update",[attr]);
                }
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
    var stroke = cp.initFill("stroke",{initColor:this.attrs.stroke,x:15,y:260,width:30,stroke:"stroke"}),
        fill = cp.initFill("fill",{initColor:this.attrs.fill,x:5,y:250,width:30});
        
        this.fill = fill.retrieve("vec");
        this.stroke = stroke.retrieve("vec");
        
    p.adopt(
        stroke,
        fill
    );
    ta.inject(c.getParent());
    
    
    
    p.addEvent("click:relay(.tool)",function(e) {
        this.selectMode(e.target.get("toolType"));
    }.bind(this));
   
    ta.addEvents({
        "keydown": function (eve){
                if (eve.key === "enter" && !eve.shift){
                    this.bound.hideTextToolArea();
                }
            }.bind(this),
        "blur": this.bound.hideTextToolArea
    });
    
    c.addEvents({
        "mousedown": this.bound.mousedown,
        "dblclick":this.bound.dblclick
    });
    window.addEvents({
        "keyup": this.bound.keyCommand,
        "draw.start": this.bound.drawStart,
        "draw.drag": this.bound.drawDrag,
        "draw.stop": this.bound.drawStop,
        "element.delete":this.bound.elementDelete,
        "element.select":this.bound.elementSelect,
        "element.deselect": this.bound.elementDeselect,
        "panel.update":this.bound.setAttr
    });
    
},
    setState: function(st){
        if(st==="canvas"){
            this.colorPicker.setColor(this.fill,this.getAttr.fill);
            this.colorPicker.setColor(this.stroke,this.getAttr.stroke);
        }
    },

    /**
     * hides the textarea used to write in a text element after applying the text
     */
    hideTextToolArea: function (){
        //TODO fix text
        var selected = this.selected, el = selected, ta = this.textToolArea;
        if(typeOf(el)!=="null" && el.type==="text") {
            el.attr("text", ta.get("value"));
             if(el.ft){el.ft.unplug();}
            el.ft = R.freeTransform(el);
            el.ft.hideHandles();
            selected = {};
        }
        ta.set({"value":"", styles:{"display":"none"}});
        this.noShortcut=false;
    },
    
    /**
     * function responsible for switching tool modes
     */
    selectMode : function (selectedTool){
        this.toolMode = selectedTool;
        //console.log("selected "+ toolMode+" tool");
        window.fireEvent("element.deselect");
        var tool = $$(".tool[toolType="+selectedTool+"]")[0];
        
        tool.getParent().getElements(".selected").removeClass("selected");
        tool.addClass("selected");
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
        if(!this.noShortcut){ //ment to disable keycomands temporarely
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
                this.selectMode(mode);
            } else{
                if(eve.key==="delete"){
                    eve.stop();
                    window.fireEvent("element.delete");
                }
            }
            
        }
    },
    /**
     * handels needed arrangment for when an element is deleted
     */
    elementDelete :function (){
        var sel = this.selected;
        if (sel.length!==0) {
            console.log("deleted element");
            //selected.ft.unplug();
            //selected.remove();
            sel = [];
            this.pm=null;
        }
    },
    /**
     * this method toggles the raphaeltransform handels associated with the selected element(s)
     * @param el (obj) Rapahel element
     */
    elementSelect: function (el){
        var sel = this.selected;
        if(el) {
            sel.push(el);
            if(el.ft && !this.drawPath) {el.ft.showHandles();}
        }
    },
    /**
     * this function deselects an element
     * @param el (obj) Rapahel element
     */
    elementDeselect : function(el){
        var sel = this.selected,drawPath = this.drawPath,pm = this.pm, toolMode=this.toolMode;
        
            console.log("bla");
        if(el){
            sel.splice(sel.indexOf(el),1);
            if(el.ft) {
                if(el.type=="path" && !/path|select/.test(toolMode)){
                    if(drawPath){
                        this.drawPath = false;
                        pm.drawing = false;
                        pm.unplug();
                        if(pm.ft){pm.ft.unplug();}
                        pm.ft = R.freeTransform(pm);
                        pm = null;
                    }
                }
                el.ft.hideHandles();
            }
            this.setState("canvas");
        } else {
            console.log("bla");
            sel.each(function(el){this.elementDeselect(el);},this);
            console.log("bla");
        }
    },
    /**
     * This function creates a custom raphael element based on the element just drawn
     * An element is bound to fire an element.select event on click
     * This function fires an element.create event
     * @param el (obj) Raphael Obj
     * @param at (obj) attributes of bounding box while drawing
     */
    elementCreate : function(el, at){
        var R = this.paper, toolMode = this.toolMode, textToolArea = this.textToolArea, ft;
        
        if(el.type!=="path") {
            ft = R.freeTransform(el);
            el.ft = ft;
            ft.hideHandles();
        }
        
        if(el.type === "text" ){
            textToolArea.setStyles({
                    "top":at.y,
                    "left":at.x,
                    "width":at.width,
                    "height":at.height,
                    "display":"block"
                });
                textToolArea.focus();
            ft.attrs.translate.x = at.x;
            ft.attrs.translate.y = at.y;
            el.translate(at.x,at.y);
            this.noShortcut=true;
        }
        window.fireEvent("element.create", [el]);
    },
    /**
     * event handeler for mousedown event on canvas
     * this function fires and element.eselect event then draw.start event when proper tools selected
     * in case a non parsable element (element with a noparse set to true) is mousedowned no event is fired
     * if a mousedown occurse on a path controle point a segment.mousedown event is fired
     * @param e (obj) event Object used to get the x y position of the mouse
     */
    mousedown : function (e) {
        var c = this.c,
            R = this.paper,
            name = e.target.nodeName, el, els,
            x = (e.page.x - c.getParent().getPosition().x),
            y = (e.page.y - c.getParent().getPosition().y);
            
                //this.colorPicker.hide();
        switch (this.toolMode){
            case "text":
                this.hideTextToolArea(); //no break is intentional
            case "path": case "rect": case "image": case "circle": case "ellipse"://papeR.clear();
               
                els = R.getElementsByPoint(x,y);
                el = els[els.length-1];
                console.log(el);
                if(el && el.noparse){
                    if(el.control && /anchor|next|prev/.test(el.control)){
                        window.fireEvent("segment.mousedown",[e, el]);
                    }
                    return;
                }
                window.fireEvent("element.deselect");
                window.fireEvent("draw.start", {"x":x,"y":y, "attrs":this.attrs});
                break;
            case "select":
            if(e.target.nodeName==="svg"||e.target.nodeName==="DIV"){
                window.fireEvent("element.deselect");
            } else {
                this.select(e.page.x,e.page.y);
            }
                break;
        }
    },
    select:function(x,y){
        
        var R = this.paper,
        el = R.getElementByPoint(x,y);
        //console.log(x,y,el.id, el.raphaelid, R.getElementByPoint(x,y)); return;
        
        if(el){
            el.noparse = el.noparse || false;
            //console.log(this.selected,this.selected.indexOf(el));
            if(!el.noparse && this.selected.indexOf(el)===-1){
                window.fireEvent("element.deselect");
                window.fireEvent("element.select", [el]);
            }
        }
    },
    /**
     * handels what happens when a double click ocures in canvas
     * if draw path is true it closes the path and switches to the select tool
     * if a path is selected and a double click occurs it allows reediting the path
     * @param e (obj) event object used to get x and y position on canvas
     */
    dblclick:function  (e){
        //clearTimeout(timer);
        var c = this.c, R = this.paper,
        drawPath = this.drawPath,
        pm = this.pm,
              x = (e.page.x - c.getParent().getPosition().x),
            y = (e.page.y - c.getParent().getPosition().y),
            el;
            
        if(drawPath){
            console.log("he");
            this.drawPath = false;
            pm.unplug();
            if(pm.ft){pm.ft.unplug();}
            pm.ft = R.freeTransform(pm);
            pm.ft.hideHandles();
            this.selectMode("select");
            pm = null;
        } else {
            el = this.selected[0];
            if(el && el.type=="path"){
                this.drawPath = true;
                pm = el;
                pm.plug();
                if(pm.ft){(pm.ft.unplug());}
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
        var toolMode = this.toolMode, drawPath = this.drawPath,pm = this.pm;
        if(!this.toolMode.contains("custom")) {
            var R = this.paper,c = this.c,
            el, select = false, bound =  R.rect(o.x, o.y, 0, 0).attr({
                stroke: "#000",
                opacity: 0.6
           });
            switch(toolMode) {
                case "rect": el = R.rect(o.x,o.y,0,0); break;
                case "ellipse": el= R.ellipse(o.x,o.x,0,0); break;
                case "circle": el=R.circle(o.x,o.y,0); break;
                case "text" : el=R.text(0,0,""); bound.attr("stroke-dasharray","--"); break;
                case "image": el = R.image(this.imgAttr.src, o.x,o.y, 0,0); break;
                case "path" :
                    if(pm===null){
                        pm = this.pm = R.pathManager();
                        this.elementCreate(pm);
                        drawPath = this.drawPath = true;
                        
                       }
                    el = pm;
                    pm.insertSegment(o.x,o.y);
                    var last = pm.segments.last().attr("n");
                    break;
                case "select": 
                    select=true;
                    break;
            }
        (toolMode==="path") && bound.attr("opacity",0);
        (toolMode!=="select") && el.attr(o.attrs);
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
            if(toolMode==="path" && drawPath) {
                
                last.update(dx - (last.dx || 0), dy - (last.dy || 0));
                last.dx = dx;
                last.dy = dy;
            } 
            window.fireEvent("draw.drag", [{
                "bound":bound,
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
            if(this.toolMode=="path" && this.drawPath) {last.dx = last.dy = 0;}
            window.fireEvent("draw.stop", [{
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
            }); break;
            case "circle":  el.attr({
                cx:(o.alt)?o.x:o.cx,
                cy:(o.alt)?o.y:o.cy,
                r:(o.height<o.width)?(o.height/2):(o.width/2)
            }); break;
            case "text":
                //el.attr({x:attrs.x, y:attrs.y});
                break;
            case "path":
                
                break;
            case "select":
                //TODO selectmultiple
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
                this.selectMode("select");
                this.select(e.page.x,e.page.y);
               // console.log("removed");
            } else {
                this.elementCreate(el, at);
            }
        }
        
    }

});
