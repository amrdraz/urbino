/**
 * this class is respnsible for the Editors Tools panel
 * @author Amr Draz
 * @requirments Raphael, pathManager, Moootools
 */
/*global $,$$,console,Class,Element,typeOf,window,R*/

var ToolPanel = new Class({

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
    if(typeOf(att)=="object"){
        for(val in att){
            if(att.hasOwnProperty(val)){
                this.setAttr(val,att[val]);
            }
        }
        return;
    }
    this.attrs[att] = (val=="")?"none":val;
},
/**
 * the default global state
 */
attrs : {"fill":"#48e", "stroke":"none"},
/**
 * function which intializes the Tool Panel
 * @param panel (string) id of the DIV element the panel is added too
 * @param R (obj) Rapahel paper element
 * @param options (obj) extra options when initializing the Panel
 */
initialize : function(panel, R, options){
    
    var 
    /**
     * the scurrently selected element
     */
    selected=null,
    /**
     * the currently selected path
     */
    pm=null,
    /**
     * the default text size
     */
    textAttr = {"font-size":"16px"},
    /**
     * the defualt image src
     */
    imgAttr = {src:"http://www.wowace.com/thumbman/avatars/6/707/300x300/600px-718smiley.svg.png.-m0.png"},
    /**
     * a boolean that is true when editing or drawing path
     */
    drawPath=false,
    /**
     * a variable that holds the current selected tool value
     */
    toolMode=null,// is a string signifying the mouse mode
    /**
     * a boolean to disable 
     */
    noShortcut = false,
    /**
     * sets c to the DIV/SVG R is applied too
     */
    c = R.canvas,
    /**
     * text area for writing text
     */
    textToolArea = new Element("textarea", { styles:{
        "position":"absolute",
        "white-space":"nowrap",
        "display":"none",
        "border":"#000 dashed 1px"
    }}),
    /**
     * creates the tool panel and adds the 
     */
    panelInit = function(panel){
        var p = $(panel);
        
        p.set("html",''+
            '<div toolType="select" title="select element" class="tool">select</div>'+
            '<div toolType="rect" title="draw a rectangle" class="tool">rect</div>'+
            '<div toolType="circle" title="draw a circle" class="tool">circle</div>'+
            '<div toolType="ellipse" title="draw an ellipse" class="tool">ellipse</div>'+
            '<div toolType="text" title="write text" class="tool">text</div>'+
            '<div toolType="image" title="add Image" class="tool">image</div>'+
            '<div toolType="path" title="draw path" class="tool">path</div>'
        );
        
        p.addEvent("click:relay(.tool)",function(e) {
            selectMode(e.target.get("toolType"));
        });
    }, 
    /**
     * hides the textarea used to write in a text element after applying the text
     */
    hideTextToolArea= function (){
        var el = selected;
        if(typeOf(el)!=="null" && el.type==="text") {
            el.attr("text", textToolArea.get("value"));
             if(el.ft){el.ft.unplug();}
            el.ft = R.freeTransform(el);
            el.ft.hideHandles();
            selected = null;
        }
        textToolArea.set({"value":"", styles:{"display":"none"}});
        noShortcut=false;
    },
    
    /**
     * function responsible for switching tool modes
     */
    selectMode = function (selectedTool){
        toolMode = selectedTool;
        console.log("selected "+ toolMode+" tool");
        window.fireEvent("element.deselect", [selected]);
        var tool = $$(".tool[toolType="+toolMode+"]")[0];
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
    keyCommand = function (eve){
        
        if(!noShortcut){ //ment to disable keycomands temporarely
            drawPath = false;
            switch(eve.key){
                case "v":
                    selectMode("select");
                    break;
                case "r":
                    selectMode("rect");
                    break;
                case "c":
                    selectMode("circle");
                    break;
                case "e":
                    selectMode("ellipse");
                    break;
                case "t":
                    selectMode("text");
                    break;
                case "i":
                    selectMode("image");
                    break;
                case "p":
                    selectMode("path");
                    break;
                default:break;
            }
            if(typeOf(selected)!=="null"){
                switch(eve.key){
                    case "delete":
                        eve.stop();
                        window.fireEvent("element.delete", [selected]);
                        break;
                    default: break;
                }
            }
        }
    },
    /**
     * handels needed arrangment for when an element is deleted
     */
    elementDelete =function (){
        if (selected) {
            console.log("deleted element");
            //selected.ft.unplug();
            //selected.remove();
            selected = null;
            pm=null;
        }
    },
    /**
     * this method toggles the raphaeltransform handels associated with the selected element(s)
     * @param el (obj) Rapahel element
     */
    elementSelect= function (el){
        if(el) {
            window.fireEvent("element.deselect", [selected]);
            selected = el;
            if(selected.ft && !drawPath) {selected.ft.showHandles();}
        }
    },
    /**
     * this function deselects an element
     * @param el (obj) Rapahel element
     */
    elementDeselect = function(el){
        if(el && typeOf(el)!=="null" && el.ft) {
            if(el.type=="path" && !/path|select/.test(toolMode)){
                if(drawPath){
                    drawPath = false;
                    pm.drawing = false;
                    pm.unplug();
                    if(pm.ft){pm.ft.unplug();}
                    pm.ft = R.freeTransform(pm);
                    pm.ft.hideHandles();
                    pm = null;
                }
            }
             el.ft.hideHandles();
        }
    },
    /**
     * This function creates a custom raphael element based on the element just drawn
     * An element is bound to fire an element.select event on click
     * This function fires an element.create event
     * @param el (obj) Raphael Obj
     * @param at (obj) attributes of bounding box while drawing
     */
    elementCreate = function(el, at){
        
        if(el.type!=="path") {
            var ft = R.freeTransform(el);
        
            el.ft = ft;
            ft.hideHandles();
        }
        
        el.click(function(){if(toolMode=="select"){window.fireEvent("element.select",[this]);}});
        
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
            noShortcut=true;
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
    mousedown = function (e) {
        var
            name = e.target.nodeName, el, els,
            x = (e.page.x - c.getParent().getPosition().x),
            y = (e.page.y - c.getParent().getPosition().y);
            
        switch (toolMode){
            case "text":
                hideTextToolArea(); //no break is intentional
            case "path": case "rect": case "image": case "circle": case "ellipse"://papeR.clear();
               // if(e.target.nodeName==="svg"||e.target.nodeName==="DIV"){}
              //  if(toolMode=="path" && drawPath){
                els = R.getElementsByPoint(x,y);
                el = (els.length>0)?els[els.length-1]:null;
                console.log(el);
                if(el && el.noparse){
                    if(el.control && /anchor|next|prev/.test(el.control)){
                        window.fireEvent("segment.mousedown",[e, el]);
                    }
                    return;
                }
              //      }
           // timer = (function(){
               window.fireEvent("element.deselect", [selected]);
                console.log("mousedown");
                window.fireEvent("draw.start", {"x":x,"y":y, "attrs":this.attrs});
           // }).delay(500);
                
                break;
            case "select":
            default:
                if(e.target.nodeName==="svg"||e.target.nodeName==="DIV"){
                    window.fireEvent("element.deselect", [selected]);
                } else {
                    //TODO select 
                    els = R.getElementsByPoint(x,y);
                    el = (els.length>0)?els[els.length-1]:null;
                }
                break;
        }
    },
    /**
     * handels what happens when a double click ocures in canvas
     * if draw path is true it closes the path and switches to the select tool
     * if a path is selected and a double click occurs it allows reediting the path
     * @param e (obj) event object used to get x and y position on canvas
     */
    dblclick=function  (e){
        //clearTimeout(timer);
        var x = (e.page.x - c.getParent().getPosition().x),
            y = (e.page.y - c.getParent().getPosition().y),
            el;
            
        if(drawPath){
            drawPath = false;
            pm.drawing = false;
            pm.unplug();
            if(pm.ft){pm.ft.unplug();}
            pm.ft = R.freeTransform(pm);
            pm.ft.hideHandles();
            selectMode("select");
            pm = null;
        } else {
            el = selected;
            if(el && el.type=="path"){
                drawPath = true;
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
    drawStart= function (o) { if(!toolMode.contains("custom")) {
        var el, select = false, bound =  R.rect(o.x, o.y, 0, 0).attr({
                stroke: "#000",
                opacity: 0.6
           });
        switch(toolMode) {
            case "rect": el = R.rect(o.x,o.y,0,0); break;
            case "ellipse": el= R.ellipse(o.x,o.x,0,0); break;
            case "circle": el=R.circle(o.x,o.y,0); break;
            case "text" : el=R.text(0,0,"").attr(textAttr); bound.attr("stroke-dasharray","--"); break;
            case "image": el = R.image(imgAttr.src, o.x,o.y, 0,0); break;
            case "path" :
            if(pm==null){
                pm = R.pathManager();
                elementCreate(pm);
                drawPath = true;
            }
            el = pm;
            pm.insertSegment(o.x,o.y);
            
            var last = pm.segments.last().attr("n");
            break;
            case "select": 
                select=true;
                break;
        }
        if(!select || toolMode==="path") {
            bound.attr("opacity",0);
            el.attr(o.attrs);
        }
        var drawFire = function (eve) {
            
            var nx = eve.page.x - c.getParent().getPosition().x,
                ny = eve.page.y - c.getParent().getPosition().y,
                space = (eve.key==="space"),
                fixed = (eve.shift || toolMode==="circle"),
                dx = (nx-o.x),
                dy = (ny-o.y),
                x = ((dx>=0)?o.x:nx),
                y = ((dy>=0)?o.y:ny),
                w = ((dx>=0)?dx:(o.x-nx)),
                h = (fixed)?w:((dy>=0)?dy:(o.y-ny)),
                cx = x+(w/2),
                cy = y+(h/2)
                ;
            if(toolMode=="path" && drawPath) {
                
                last.update(dx - (last.dx || 0), dy - (last.dy || 0));
                last.dx = dx;
                last.dy = dy;
            } 
            window.fireEvent("draw.drag", {
                "bound":bound,
                "el":(select)?R.set():el,
                "x":x,
                "y":y,"width":w,"height":h,
                "cx":cx,"cy":cy,
                "fixed": fixed,
                "space": space,
                "alt": (eve.alt)
            });
            
       },
       drawEnd = function (eve) {
            c.removeEvent("mousemove", drawFire);
            c.removeEvent("mouseup", drawEnd);
            document.onselectstart = function() {return true;};
            if(toolMode=="path" && drawPath) {last.dx = last.dy = 0;}
            window.fireEvent("draw.stop", {
                "canvas": c,
                "el": el,
                "bound":bound
            });
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
    drawDrag= function (o) {
        var el = o.el,
        attrs = {
            x: (o.alt)?(o.x-o.width/2):o.x,
            y: (o.alt)?(o.y-o.height/2):o.y,
            width: o.width,
            height: o.height
        };
        o.bound.attr(attrs);
        switch(toolMode) {
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
    drawStop = function (o){
        var el= o.el, at = o.bound.attr();
        
        o.bound.remove();
        if(toolMode!=="path"){
            if(at.width === 0 || at.height === 0) {
                el.remove();
                console.log("removed");
            } else {
                elementCreate(el, at);
            }
        }
        
    }
    ;
    
    textToolArea.addEvents({
        "keydown": function (eve){
            if (eve.key === "enter" && !eve.shift){
                hideTextToolArea();
            }},
        "blur": hideTextToolArea
    });
    
    panelInit(panel);
    textToolArea.inject(c.getParent());
    
    window.addEvent("keyup", keyCommand);
    
    c.addEvent("mousedown", mousedown.bind(this));
    c.addEvent("dblclick", dblclick);
    
    window.addEvent("draw.start", drawStart);
    window.addEvent("draw.drag", drawDrag);
    window.addEvent("draw.stop", drawStop);
    
    
    window.addEvent("element.delete", elementDelete);
    window.addEvent("element.select", elementSelect);
    window.addEvent("element.deselect", elementDeselect);
}


});
