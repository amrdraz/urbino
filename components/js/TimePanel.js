/**
 * This Class definesthe editor's timeline and it's controls
 * @author Amr Draz
 * @dependency Raphael, MooTools, SlidingLabel, ColorPicker
 */
/*global Class,Raphael,Events,Options,$,$$,Element,console,window,typeOf,Slider,SlidingLabel,ScrollBar,PropMixin,ColorPicker */
var TimePanel = (function(){
    var
    printR = function (paper){
            var el = paper.top, ids = [];
             while(el && el!==null) {
                if(!el.noparse){
                    ids.push(el.id);
                }
                el = el.prev;
            }
            console.log(ids);
        },

    has = "hasOwnProperty",
     /**
     * list of web safe fonts mapped to their font-family
     */
    fonts={
        "Times New Roman":'"Times New Roman", Times, serif',
        "Trebuchet MS":'"Trebuchet MS", Helvetica, sans-serif',
        Georgia:'Georgia, serif',
        "Palatino Linotype":'"Palatino Linotype","Book Antiqua", Palatino, serif',
        Arial:'Arial, Helvetica, sans-serif',
        "Arial Black":'Arial Black, Gadget, sans-serif',
        "Comic Sans MS":'"Comic Sans MS", cursive, sans-serif',
        Impact:'Impact, Charcoal, sans-serif',
        "Lucida Sans Unicode":'"Lucida Sans Unicode", "Lucida Grande", sans-serif',
        Tahoma:'Tahoma, Geneva, sans-serif',
        Verdana:'Verdana, Geneva, sans-serif',
        "Courier New":'"Courier New", Courier, monospace',
        "Lucida Console":'"Lucida Console", Monaco, monospace'},
        /**
     * object containing the discription of all Raphael element attributes
     * following the proprotiess syntax
     * nameOfProp:{name:"nameOfProp" type:"typeOfProp" [options:[], min,max,step]}
     *      -name corresponds to the element's proprety name
     *      -type (string) can be ["number", "precent", "text", "textarea", "select"]
     *      -options (array) options for select element in case type is select
     *      -min, max, setp (number) in case type is percent or number
     * 
     */
    properties = {    /* documentation taken from Rapahel-src.html */
        x: {name:"x", "class":"prop-label",label:"x",type:"number", anim:true},                // (number)
        y: {name:"y", "class":"prop-label",label:"y",type:"number", anim:true},                   // (number)
        cx: {name:"cx","class":"prop-label", type:"number", anim:true},            // (number)
        cy: {name:"cy", "class":"prop-label",type:"number", anim:true},           // (number)
        width: {name:"width", "class":"prop-label", label:"width",type:"number", anim:true},                // (number)
        height: {name:"height", "class":"prop-label",label:"height",type:"number", anim:true},              // (number)
                      // r (number)
                cr: {name:"r", "class":"prop-label",label:"radius",type:"number", anim:true},               // (number) fpr circle radius
                r: {name:"r", "class":"prop-label",label:"radius",type:"number", anim:true},               // (number) for rect corner

        rx: {name:"rx", "class":"prop-label",type:"number", anim:true},                // (number)
        ry: {name:"ry", "class":"prop-label",type:"number", anim:true},                // (number)
        text: {name:"text", "class":"prop-label",type:"textarea"},               // (string) contents of the text element. Use '\n' for multiline text
        "text-anchor":{name:"text-anchor", "class":"prop-label",type:"select", options:["start","middle","end"]},        // (string) ["start", "middle", "end"], default is "middle"
        "opacity":{name:"opacity", "class":"prop-label",type:"percent", max:100, anim:true},            // (number)
        "fill":{name:"fill", label:"fill","class":"prop-label",width:100,wh: 10, colorRight:20, lebelRight:50,type:"color", anim:true},                // (string) colour, gradient or image
        //"fill-opacity":{name:"fill-opacity", type:"percent"},        // (number)
        "stroke":{name:"stroke", label:"stroke","class":"prop-label", width:100,wh: 10, colorRight:20,lebelRight:50, type:"color", anim:true},            // (string) stroke colour
        "stroke-dasharray":{name:"stroke-dasharray", label:"dasharray","class":"",type:"select", options:["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]},    // (string) [“”, "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
        "stroke-linecap":{name:"stroke-linecap", label:"linecap","class":"",type:"select", options:["butt", "square", "round"]},    // (string) ["butt", "square", "round"]
        "stroke-linejoin":{name:"stroke-linejoin", label:"linejoin","class":"",type:"select", options:["bevel", "round", "miter"]},  // (string) ["bevel", "round", "miter"]
        //TODO "stroke-miterlimit",// (number)
        //"stroke-opacity":{name:"stroke-opacity", type:"percent"},    // (number)
        "stroke-width":{name:"stroke-width", "class":"prop-label",type:"number", min:1},       // (number) stroke width in pixels, default is '1'
        path:{name:"path", "class":"prop-label",type:"text", anim:true},                // (string) SVG path string format
        src:{name:"src", "class":"",type:"text"},                // (string) image URL, only works for @Element.image element
        font:{name:"font", "class":"",type:"text"},                // (string)
        "font-family":{label:"font",name:"font-family", "class":"",type:"select", options:fonts},        // (string)
        "font-size":{name:"font-size", "class":"prop-label",type:"number", min:0, anim:true},        // (number) font size in pixels
        "font-weight":{name:"font-weight", "class":"", type:"number", min:100, max:900, step:100, sufix:""},        // (string)
        "href":{name:"href", "class":"", type:"text"},              // (string) URL, if specified element behaves as hyperlink
        "target":{name:"target", "class":"", type:"select",options:["_self","_blank","_top","_parent"]},            // (string) used with href
        "title":{name:"title", "class":"", type:"text"},            // (string) will create tooltip with a given text
        // "transform" (string) see @Element.transform
            "translate-x":{name:"translate-x", "class":"transform prop-label", label:"x",type:"number", anim:true},
            "translate-y":{name:"translate-y", "class":"transform prop-label", label:"y",type:"number", anim:true},
            "origin-x":{name:"origin-x", "class":"transform prop-label", label:"origin-x",type:"number", anim:true},
            "origin-y":{name:"origin-y", "class":"transform prop-label", label:"origin-y",type:"number", anim:true},
            "rotate":{name:"rotate", "class":"transform prop-label", label:"Rotate",type:"number", sufix:"°", anim:true},
            "scale-x":{name:"scale-x", "class":"transform prop-label", label:"Scale-x",type:"percent", anim:true},
            "scale-y":{name:"scale-y", "class":"transform prop-label", label:"Scale-y",type:"percent", anim:true},
       // "arrow-end":{name:"arrow-end"},     // (string) arrowhead on the end of the path. The format for string is '<type>[-<width>[-<length>]]'. Possible types: 'classic', 'block', 'open', 'oval', 'diamond', 'none', width: 'wide', 'narrow', 'midium', length: 'long', 'short', 'midium'.
            "arrow-type":{name:"arrow-type", "class":"", label:"type",type:"select", options:['none','classic', 'block', 'open', 'oval', 'diamond'] },
            "arrow-width":{name:"arrow-width", "class":"", label:"width",type:"select", options:['midium','wide', 'narrow'] },
            "arrow-length":{name:"arrow-length", "class":"", label:"length",type:"select", options:['midium','short', 'long'] },
        // "clip-rect",        // (string) comma or space separated values: x, y, width and height
            "clip-x":{name:"clip-x", "class":"", label:"Clip-x",type:"number"},
            "clip-y":{name:"clip-y", "class":"", label:"Clip-y",type:"number"},
            "clip-width":{name:"clip-width", "class":"", label:"Clip-w",type:"number"},
            "clip-height":{name:"clip-height", "class":"", label:"Clip-h",type:"number"},
        "cursor":{name:"cursor", "class":"", type:"text"}           // (string) CSS type of the cursor
    }
    ;
    
    return new Class({
    
    Extends: Panel,
    Implements: [PropMixin, ElementsMixin],
    icon : {
        stop: "M5.5,5.5h20v20h-20z",
        end: "M21.167,5.5,21.167,13.681,6.684,5.318,6.684,25.682,21.167,17.318,21.167,25.5,25.5,25.5,25.5,5.5z",
        start: "M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z",
        ff: "M25.5,15.5,15.2,9.552,15.2,15.153,5.5,9.552,5.5,21.447,15.2,15.847,15.2,21.447z",
        rw: "M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z",
        play: "M6.684,25.682L24.316,15.5L6.684,5.318V25.682z",
        arrowright: "M6.684,25.682L24.316,15.5L6.684,5.318V25.682z",
        arrowleft: "M24.316,5.318L6.684,15.5l17.632,10.182V5.318L24.316,5.318z",
        arrowup: "M25.682,24.316L15.5,6.684L5.318,24.316H25.682z",
        arrowdown: "M5.318,6.684L15.5,24.316L25.682,6.684H5.318z",
        plus: "M5,5 10,5 10,0 15,0 15,5 20,5 20,10 15,10 15,15 10,15 10,10 5,10 5,5zz",
        minus: "M5,5 20,5 20,10 5,10 5,5z",
        tracker: "M0,0 5,0 5,5 2.5,10 0,5z",
        trash:"M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z",
        fit: "M1.999,2.332v26.499H28.5V2.332H1.999zM26.499,26.832H4V12.5h8.167V4.332h14.332V26.832zM15.631,17.649l5.468,5.469l-1.208,1.206l5.482,1.469l-1.47-5.481l-1.195,1.195l-5.467-5.466l1.209-1.208l-5.482-1.469l1.468,5.48L15.631,17.649z"
    },
    options : {
        imgSrc: "img",
        buttonAttr: {"fill":"#ddd", "stroke":"none", "cursor":"pointer"}
    },
    
    /**
     * predefine list of props for SVG elements
     */
    elementProps: {
        circle:["cx","cy","cr","fill","stroke","rotate","scale-x","scale-y"],
        rect:["x","y","height","width","r","fill","stroke","rotate","scale-x","scale-y"],
        ellipse:["cx","cy","rx","ry","fill","stroke","rotate","scale-x","scale-y"],
        text:["x","y","font-size","fill","stroke","rotate","scale-x","scale-y"],
        image:["x","y","width","height","fill","stroke","rotate","scale-x","scale-y"],
        path:["translate-x","translate-y","fill","stroke","path","rotate","scale-x","scale-y"],
        group:["translate-x","translate-y","fill","stroke","rotate","scale-x","scale-y"],
    },
    noScroll : true,
    
    makeZoomSlider : function(size){
        var 
        div = this.div, icon = this.icon,
        cont = div("container", {styles:{left:20,height:20,width:size-40}}),
        handel = div("handel",{styles:{width:10}}),
        d = div("",{id:"timeZoomSlider",styles:{height:20,width:size}}).adopt(
            this.vect("slide-arrow",icon.minus,"T -4 0 S 0.8",{"mousedown": this.bound.zoomOut},"zoom out"),
            cont.adopt(handel),
            this.vect("slide-arrow",icon.plus,"T -4 0 S 0.8",{"mousedown": this.bound.zoomIn},"zoom in")
        ),
        slider = new Slider(cont, handel,{
            steps:100,
            wheel:true,
            onChange:function(val){
                //console.log(this,val);
                this.fireEvent("timeline.zoom", [val]);
            }.bind(this)
        });
        slider.stepWidth = size-40;
        //slider.autosize();
        d.store("slider",slider);
        return d;
    },
    initialize: function (paper, options){        
        this.parent(options|| {});
        this.bind([
            "seperatorMousedown",
            "hideToggle",
            "expandToggle",
            "elementCreate",
            "elementUpdate",
            "elementUpdateEnd",
            "elementInsert",
            "elementDeselect",
            "elementSelect",
            "elSelect",
            "elementClick",
            "elementDelete",
            "notElement",
            "hideTextField",
            "changeName",
            "zoomIn",
            "zoomOut",
            "setZoomLevel",
            "drawTimeLane",
            "togglePlay",
            "setLastMs",
            "setToStart",
            "playEvent",
            "moveToEnd",
            "timeLaneSeek",
            "keyframeAdd",
            "keyframeInsert",
            "animAction",
            "animDelete"
            
        ]);
        var
        vect = this.vect.bind(this), img = this.img, div = this.div,
        timePanel = this,
        width = this.width = this.options.width||1020,
        height = this.height = this.options.height||200,
        lwidth = this.lwidth = 235,
        rwidth = this.rwidth = width-lwidth-24,
        panel = this.panel.addClass("time-panel"),
        zwidth = 150,
        els = this.els = {},
        requestAnimation = window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                           function (callback) {
                               this.timer = setTimeout(callback, step);
                           }.bind(this),
        imgSrc= this.imgSrc = (this.options.imgSrc)+"/",
        icon = this.icon;
        this.selected={};
        this.selectedAnim = [];
        this.context = "onload";
        this.zoomLevel=1;
        this.tColor = "#eee";
        this.msPerpx = 1;
        this.trackerMs = 0;
        this.lastMs = 0;
        this.play=false;
        this.baseArr = [250,500,1000,5000,15000,30000,60000,120000,300000,600000,1200000];
        this.divsArr = [  2,  5,   4,   3,    4,    4,    4,     4,     5,     4,     4];
        this.multArr = [  2,  2,1.16,1.44,    2,    2,    2,   1.6,     2,     2,     2];
        
        
        
        /*----------------------- create panel ----------------------*/
        var
        elementsArea = this.elementsArea = div("elements-area",{styles:{width:lwidth}}).inject(panel),
            elementsAreaHeader = div("area-header").adopt(
                vect("start-button",icon.start,"T -7 -7 S 0.8 0.6",{click:this.bound.setToStart},"to start"),
                vect("play-button",icon.play,"T -7 -7 S 0.8",{click:this.bound.playEvent},"Play animation"),
                vect("end-button",icon.end,"T -7 -7 S 0.8 0.6",{click:this.bound.moveToEnd},"to end"),
                div("header-footer")
            ).inject(elementsArea),
            elements = this.elements = div("area-content").inject(elementsArea),
            elementsAreaFooter = div("area-footer").inject(elementsArea),
            textField = this.textField = new Element("input",{"type":"text", "id":"editText",
                styles:{
                    "position":"absolute",
                    "white-space":"nowrap",
                    "display":"none",
                    "border":"#48e solid 1px"
                }
            }).inject(elementsArea),
        
        seperator = this.seperator = div("seperator",{styles:{left:lwidth}}).inject(panel),
        
        timelineArea = this.timelineArea = div("timeline-area",{styles:{left:lwidth+5,width:rwidth}}).inject(seperator,"before"),
            scrollArea = this.scrollArea = div("scroll-area").inject(timelineArea),
            slideTracker = this.slideTracker= vect("timeline-slider",icon.tracker,"T 2 0 S 1.5",{}),
            timeLane = div("",{id:"timeLane"}),
            timelineHeader = this.timelineHeader = div("area-header").adopt(
                timeLane,
                div("",{id:"labelLane"}),
                div("header-footer",{id:"triggerLane"}),
                div("",{id:"tracker"}).adopt(
                    slideTracker,
                    div("",{id:"trackerLine"}),
                    div("",{id:"trackerTime"})
                ),
                div("",{id:"pin"})
            ).inject(scrollArea),
            timelanes = this.timelanes = div("area-content").inject(scrollArea),
            xScroller = this.xScroller =  new ScrollBar([scrollArea],true, rwidth-170,19).setOptions({onChange:function(step){
                                    this.fireEvent("timeline.redraw");
                                }.bind(this)}),
            timelineFooter = this.timelineFooter = div("area-footer").adopt(
                this.makeZoomSlider(zwidth),
                vect("fit-button",icon.fit,"T -7 -7 S 0.6",{},"fit to timeline"),
                xScroller.scrollBar
            ).inject(timelineArea),
        yScroller= this.yScroller = new ScrollBar([elements,timelanes],false, 19,height-50,30),
        scrollBar = div("scroll-bar").adopt(
            yScroller.scrollBar
        ).inject(panel),
        
        slidingLabel = this.slidingLabel = new SlidingLabel({
            container:elements,
            onStart:function(val,input){
                //TODO is auto-keyfram is set then add a new keyframe
            },
            onChange:function(val,input){
                var attr = {},prop = input.get("name");
                attr[prop] = val;
                //if(this.selected){
                    //TODO add keyfram or edit keyframe
                    //for now I'm editing the element
                    this.els[input.getParent().get("for")].el.attr(attr);
                    window.fireEvent("element.update", [attr]);
                    //els[label.getParent().get("for")].el.attr(attr);
                //}
            }.bind(this),
            onEnd:function(val,input){
               // window.fireEvent("element.update.end", [val, input.get("name"), this.els[input.getParent.get("for")].el]);
            }
        }),
        colorPicker = this.colorPicker = new ColorPicker({
            imgSrc:imgSrc,
            onChange:function(color,o,v){
                if(v){
                    var attr = {}, sel = this.selected,
                        att = v.node.getParent("div").get("for");
                        attr[att]=color;
                        attr[att+"-opacity"]=o;
                    v.attr({"fill":color==="none"?"135-#fff-#fff:45-#f00:45-#f00:55-#fff:45-#fff":color,"fill-opacity":o});
                    window.fireEvent("element.update", [attr]);
                }
            }.bind(this)
        });
        
       
        /*-----------------------handeling general events ----------------------*/

        this.timeLane = Raphael(timeLane,"100%",10);
        this.labelLane = Raphael(timelineArea.getElement("#labelLane"),"100%",10);
        this.triggerLane = Raphael(timelineArea.getElement("#triggerLane"),"100%",10);
        zoomSlider = this.zoomSlider = timelineFooter.getElement("#timeZoomSlider").retrieve("slider");
        this.playButton = elementsAreaHeader.getElement(".play-button").retrieve("vec");
        
        
    ;

        
        /*----------------------- register Events ----------------------*/
        
        this.addEvents({
            "timeline.zoomin": this.bound.zoomIn,
            "timeline.zoomout": this.bound.zoomOut,
            "timeline.zoom": this.bound.setZoomLevel,
            "timeline.redraw": this.bound.drawTimeLane,
            "timeline.play.toggle": this.bound.togglePlay,
            "timeline.lastMs": this.bound.setLastMs,
            "panel.scroll.update":yScroller.update.bind(yScroller)
        });
        elements.addEvents({
            "click": this.notElement,
            "mousedown:relay(.eye)": this.bound.hideToggle,
            "mousedown:relay(.arrow)": this.bound.expandToggle,
            "click:relay(.element)": this.bound.elementClick,
            "dblclick:relay(.name)": this.bound.changeName,
            "mousedown:relay(.key-frame img)": this.bound.keyframeAdd
        });
        timelanes.addEvents({
            "mousedown:relay(.anim)": this.bound.animAction
        });
        seperator.addEvent("mousedown",this.bound.seperatorMousedown);
        
        textField.addEvents({
            "keydown": function (eve){
                    if (eve.key === "enter"){
                        this.bound.hideTextField();
                    }
                },
            "blur": this.bound.hideTextField
        });
        timeLane.addEvent("mousedown", this.bound.timeLaneSeek);
        timelineArea.getElement(".fit-button").addEvent("mousedown", function(e){e.stop();this.fitTo(this.lastMs);}.bind(this));
        
        //use rapahel bult in drag function to the the drag even on the tracker
        slideTracker.retrieve("vec").drag(
            function (dx,dy,x){
                var pos = (x-this.x).max(0);
                //console.log(pos, scrollArea.getSize().x, scrollArea.getScroll().x, scrollArea.getScrollSize().x);
                if(pos<scrollArea.getSize().x+scrollArea.getScroll().x-100 && pos>scrollArea.getScroll().x){
                    timePanel.setTracker(pos);
                } else {
                    if(pos>scrollArea.getScrollSize().x-100){
                        timePanel.setTrackerAndResize(pos);
                    }
                    timePanel.slideTo(pos);
                }
                
            },function(){
                if(timePanel.play){timePanel.timelineStop();}
                this.x=timePanel.timelineHeader.getPosition().x;
                this.offset = scrollArea.getScroll().x;
            });
                    
        window.addEvents({
            "element.create": this.bound.elementInsert,
            "element.delete": this.bound.elementDelete,
            "element.deselect": this.bound.elementDeselect,
            "element.select": this.bound.elSelect,
            "element.update.end": this.bound.elementUpdateEnd,
            "panel.element.update": this.bound.elementUpdate,
            "keydown":this.bound.animDelete,
            "keyframe.insert":this.bound.keyframeInsert
        });
        
        
       
        
        var a = [], b=[];
        paper.forEach(function(el) {
            el.noparse = el.noparse || false;
            if(!el.noparse){
                var obj = {};
                obj = timePanel.elementCreate(el);
                els[el.id] = (obj);
                
                a.push(obj.element);
                b.push(obj.timeline);
            }
        });
        elements.adopt(a);
        timelanes.adopt(b);
       
        
        
        
        //workaround until I make zoom slider seperate
        (function(){
            this.tracker = document.id("tracker");
            zoomSlider.autosize();
            //initialize timeline at 4000
            this.fitTo(4000);
            xScroller.update();
            yScroller.update();
        }).bind(this).delay(0);
        //console.log(panel);
    },
    parse: function() {
        //TODO
         Object.each(anims,function(p,key,anims){
            //add proprety label at element area
            //s = "element[for="+el.id+"]",
            //props = this.elements.getChild(s),
            //timeLanes = this.timelanes.getChild(s);
            div("prop").adopt(
                this.createInput(properties[key]).set({"for":id,"prop":key}),
                div("key-frame").adopt(img(imgSrc+"keyframe.gif"))
            ).inject(props);
            //console.log(key,p);
            //add element at the timeline area
            a=[];
            p.each(function(anim){
                a.push(this.keyframeCreate(anim));
            }, this);
            last = p[p.length-1];
            div("prop",{"prop":key}).adopt(
                a,
                div("anim last",{styles:{
                    width:0,
                    left:last.ms/msPerpx
                  }}).store("anim",last).adopt(
                    img(imgSrc+"keyframe.gif","left start keyframe")
                  )
            ).store("type",key).inject(timeLanes);
            
            this.lastMs = this.lastMs.max(last.ms);
        }, this);
    },
    /**
     * function that handels sliding the seperator between the elements area and the timeline area 
     */
    seperatorMousedown : function(e){
        var
        x = e.page.x.toInt(),
        mousemove = function(e){
            var
            dx = e.page.x - x,
            width = this.elementsArea.getSize().x + dx;
            x = e.page.x;
            
            //other things that need to resize accordingly
            if(width<=305 && width >= 235) {
                this.elementsArea.setStyle("width", width);
                this.seperator.setStyle("left", this.seperator.getStyle("left").toInt() + dx);
                this.timelineArea.setStyles({
                    "left": this.timelineArea.getStyle("left").toInt() + dx,
                    "width": this.timelineArea.getSize().x - dx
                });
                
                this.timelineHeader.setStyle("width", this.timelineHeader.getSize().x - dx);
                this.scrollArea.setStyle("width", this.scrollArea.getSize().x - dx);
                this.timelanes.setStyle("width", this.timelanes.getSize().x - dx);
                this.xScroller.resize(this.xScroller.size() - dx);
            }
            
        }.bind(this),
        mouseup = function(){
            window.removeEvent("mousemove",mousemove);
            window.removeEvent("mouseup",mouseup);
            $$("input,form,button,textarea,select").removeClass("is-sliding");
            document.body.style.cursor = "default";
            document.onselectstart = function() {return true;};
        }.bind(this)
        ;
        $$("input,form,button,textarea,select").addClass("is-sliding");
        document.body.style.cursor = "w-resize";
        document.onselectstart = function() {return false;};

        window.addEvent("mousemove",mousemove);
        window.addEvent("mouseup",mouseup);
     },
    /*----------------------------------------------------------*/
   /**
    * Expands the element showing the propperties animating or contracts hiding the properties
    *  
    */
    expandToggle : function (e){
        e.stopPropagation();
        var target = e.target,
        elm = this.els[target.getParent(".element").get("for")];
        if(elm.element.hasClass("expanded")){
            elm.element.removeClass("expanded");
            elm.timeline.removeClass("expanded");
        } else {
            elm.element.addClass("expanded");
            elm.timeline.addClass("expanded");
        }
//        console.log(yScroller.contents);
        this.fireEvent("panel.scroll.update");
    },
    /**
     * creates a new row based on a Raphael Element and asigns it an id
     * The element is added to the editors els where it is kpt track of
     * @param el (Raphael Obj) the element for this row
     * @return (div) the div representing the row
     */
    //TODO modify this
    elementCreate : function(el){
        var div = this.div, img = this.img, imgSrc = this.imgSrc, msPerpx = this.msPerpx,
        color = el.color = Raphael.getColor(0.9),
        type = el.type,
        id = el.id = (typeOf(el.id)==="number")?type+el.id:el.id,
        anims = el.anims || {},a=[],b=[],first,last,
        props = div("props"),
        element = div("element expanded empty", {"for":id}).adopt(
            div("color", {styles:{
                    position:"absolute",
                    "background-color":color,
                    width:"10px",
                    height:"100%"
                }
            }),
            div("header").adopt(
                img(imgSrc+"eye.gif","eye"),
                img(imgSrc+"light-arrow.gif","arrow"),
                new Element("label", {"text":id, "class":"name"})
            ),
            props
        ),
        timeLanes = div("props"),
        timeLane = div("element expanded empty", {"for":id}).adopt(
            div("header"),
            timeLanes
        ),
        ps={}, ts={},pr,pp;
        
       this.elementProps[type].each(function(p){
            //add proprety label at element area
            //s = "element[for="+el.id+"]",
            //props = this.elements.getChild(s),
            //timeLanes = this.timelanes.getChild(s);
            pp = properties[p];
            if(pp.type === 'color'){
                pp.value = el.attr(p);
            }  
            pr = this.createInput(pp).set({"for":id,"prop":p}).store("for",id).store("prop",p);
            ps[p] = (pr);
            div("prop empty").adopt(
                    pr,
                    div("key-frame").adopt(img(imgSrc+"keyframe.gif").store("for",id).store("prop",p))
                ).inject(props);
            //console.log(key,p);
            //add element at the timeline area
            ts[p] = (div("prop empty",{"prop":p}).store("for",id).store("prop",p).inject(timeLanes));
        }, this);
              
        return {color:color,el:el, element:element, eProps:ps, timeline:timeLane,  tProps:ts, maxMs:a.ms};
    },
    /**
     * inserts a new element into the elements panel
     * @param el (Raphael Obj) the element for this row
     */
    elementInsert : function(el){
        var obj = this.elementCreate(el);
        this.els[el.id] = obj;
        obj.element.inject(this.elements,"top");
        obj.timeline.inject(this.timelanes, "top")
        //console.log(this.els);
    },
    /**
     * updates the properties in the elements area according to the passed element's property
     * then send a updte to the other panels if the element is selected
     */
    elementUpdate: function(el){
        var id = el.id;
        //console.log(this.els[id].element);
        Object.each(this.els[id].eProps, function(p, prop){
            if(!el.attr(prop)) return;
            
            if(p.hasClass("color")){
                this.colorPicker.setColor(p.getLast().retrieve("vec"), el.attr(prop));
                return;
            }
            if(p.hasClass("transform")){
                return;
            }
            //console.log(p, prop, el.attr(prop));
            p.getLast('input').set("value", el.attr(prop).toInt());
            
        }, this);
        if(this.selected[id]){
            window.fireEvent("panel.update", el.attr());
        }
    },
    /**
     * updates the keyframe of the elent with the elements's attribute new value 
     */
    elementUpdateEnd : function(val, prop, el) {
        console.log("hey");
        var p = el.anims[prop], ms = this.trackerMs;
        if(ms<p[0].del) {
            p[0].anim[100][prop] = val;
            return;
        }
        if(p[p.length-1].ms<ms){
            p[p.length-1].anim[100][prop] = val;
            return;
        }
        p.some(function(a,i){
            if(a.del<ms && a.ms>ms){
               p[i-1].anim[100][prop] = val;
               return true;
            }
            return false;
        });  
    },
    /*-----------------------------------TimeLane------------------------------------------*/
   /**
    *Converts number in ms to its sting representation in the following format mm:ss.msmsms 
    * ex: 1.250 corisponds to 1 second and 250 ms
    * @param ms (number) milliseconds to convert
    * @return (String) string representing ms
    */
    msToString : function(ms){
        var min,sec;
        min = (ms/(60000)).toInt();
        ms %= 60000;
        sec = ("0" + (ms/1000).toInt()).slice(-2);
        ms %= 1000;
        return min+":"+sec+((ms)?"."+("00"+ms).slice(-3):"");
    },
    /**
     * Method for rendering the timelane ruler according to the zoomlevel and offset(via scroll bar),
     * each big line represents a base division and each small line represents a subdivision
     * only the visible portion of the timelane is rendered to the viewer with an account of 3 cycles of the next base level
     * ie. if zoomed at base 250ms the the ruler renders up to 1500ms since 500ms is the next base level
     */
    drawTimeLane : function(){
        timeLane = this.timeLane
        timeLane.clear();
        var baseArr = this.baseArr, pathArr=[],z = (1-this.zoomLevel).round(2).min(0.99),
        division,midstep,offset=0,ms=0,endMS=0,
        i = (z*10).toInt().min(9);
        
        base = baseArr[i];
        division = this.divsArr[i];
        step = 250-((z*100)%10)*25/this.multArr[i];
        msPerpx = this.msPerpx = base/step;
        midstep = base/division;
        
        offset = (this.scrollArea.getScroll().x)*msPerpx;
        //move ms to start rendering after the offset
        while(ms<offset){ms+=base;}
        
        endMS = ms+baseArr[i+1]*3;
        //console.log("offset",offset,"render from",ms,"to",endMS,"base",base,"zoomLevel",zoomLevel);
        while(ms<endMS){
            
            pathArr.push(["M",ms/msPerpx,0],["V", 10]);
            for(i=division-1;i>0;i--) {
                pathArr.push(["M",(ms-i*midstep)/msPerpx,0],["V", 5]);
            }
            timeLane.text(ms/msPerpx+3,5,this.msToString(ms)).attr({stroke:"none", fill:this.tColor, "font-size":8,"text-anchor":"start"});
            
            ms+=base;
        }
        timeLane.path(pathArr).attr({stroke:"#222", "stroke-width":0.5});
    },
    /**
     * This method sets the width of both timeline header and content-area (the one with the animation objects)
     *  with a minmum value of the, parent element, scrollArea's width
     * that way when the content can expand but never become smaller thent the timeline
     * @param width (number) the width to set
     * 
     */
    setTimeLanesWidth : function(width){
        width = width.max(this.scrollArea.getSize().x);
        this.scrollArea.getChildren().setStyle("width",width);
        this.xScroller.update();
    },
    /**
     * updates an element's attributes that are animating to match the trackers position in the timeline
     * then fires an update event for the panels
     * @param el (obj) Raphael object
     * @param ms (number) milliseconds 
     */
    seekTo : function (el, ms){
        var a;
        Object.each(el.anims,function(p,k){
            if(p.length===0){
                return;
            }
            a = p[0];
            if(ms<=a.del) {//before first frame
                el.attr(k,a.anim[100][k]);
                return;
            }
            a=p[p.length-1];
            if(a.ms<=ms){//after last frame (optimization)
                el.attr(k,a.anim[100][k]);
                return;
            }
            if(a.del<ms && a.ms>ms){//last frame (optimization)
                el.attr(k,p[p.length-2].anim[100][k]);
                el.status(a,(ms-a.del)/(a.ms-a.del));
                return;
            }
            p.some(function(a,i){
                
                if(a.jump && p[i+1] && p[i+1].jump){
                   el.attr(k,p[a.del>ms?i-1:i].anim[100][k]);
                   return true;
                }
                if(a.del<ms && a.ms>ms){
                    el.attr(k,p[i-1].anim[100][k]);
                    el.status(a,(ms-a.del)/(a.ms-a.del));
                    return true;
                }
                var n = p[i+1];
                if(a.ms<ms && (!n || n && ms<n.del )){
                    el.attr(k,p[i].anim[100][k]);
                    return true;
                }
                return false;
            });
            //}).delay(0);
        });
        window.fireEvent("panel.element.update",[el]);
    },
    /**
     * set tracker to location in pxels
     * @param pos (number) position of the tracker in pixels
     */
    setTracker : function(pos){
        var tracker = this.tracker;
        
        tracker.setStyle("left", pos);
        var trackerMs = this.trackerMs= ((pos)*this.msPerpx).round();
        
        //console.log("pos*ms/px ",pos,msPerpx," = ", trackerMs);
        
        this.tracker.getLast().set("text", this.msToString(trackerMs));
        
        Object.each(this.els,function(elm){
            //(function(){
                this.seekTo(elm.el,trackerMs);
            //}).delay(0);
        }, this);
    },
    /**
     * set tracker to location while resizing the timeline area(scrollArea)
     * @param pos (number) position of the tracker in pixels
     */
    setTrackerAndResize : function(pos){
      this.setTimeLanesWidth(pos.max(this.lastMs/this.msPerpx)+100);
      this.setTracker(pos);
    },
    /**
     * set tracker to location in milliseconds
     * @param pos (number) position of the tracker in milli seconds
     */
    setTrackerMs : function(ms){
        this.setTracker(ms/this.msPerpx);
    },
    /**
     * sets last MS to the latest (as in last in tmie) anims end time 
     */
    setLastMs : function(){
        var ms = 0
        Object.each(this.els,function(elm){
            
            Object.each(elm.el.anims,function(p){
                ms = ms.max(p[p.length-1].ms);
            });
        });
        this.lastMs = ms;
    },
    /*----------------------- timeline zoom ----------------------*/
   /**
    * sets ms/px ration based on zoom level
    * @param zoomLeve (number) zoom level to calculate the ration based on
    */
    setMsPerpx: function(zoomLevel){
        var z = (1-zoomLevel).round(2),
        i = (z*10).toInt().min(9);
        
        base = this.baseArr[i];
        step = 250-((z*100)%10)*25/this.multArr[i];
        this.msPerpx = base/step;
    },
    /**
     * slides teh timeline scroller or xScroller to show the time tracker 
     */
    slideTo : function(pos){
        var slider = this.xScroller.slider;
        //aleternative ((pos*this.xScroller.size())/this.scrollArea.getScrollSize().x).round().limit(0, slider.max)
        slider.set(slider.max*(pos/this.scrollArea.getScrollSize().x));
        //console.log("slideTo slider", slider, "zoomSlider", this.zoomSlider);
    },
    /**
     * This function set the zoom level of the timeline then calculates the ms/px ratio
     * it then sets the tracker resizes the xScroller and redraws the TimeLane numbers
     * it then repositions the xScroller to acount for the trackers position
     * @param lvl (numeber) a number from 0-100 indicating the zoom level
     */
    setZoomLevel : function(lvl) {
        zoomLevel =  this.zoomLevel = ((lvl/100).round(2)).limit(0,1);
        var oldMsPerPx = this.msPerpx;
        this.setMsPerpx(zoomLevel);
        var pos = this.trackerMs/this.msPerpx;
        this.setTrackerAndResize(pos);
       // this.fireEvent("timeline.redraw");
        this.resizeAnims();
        this.slideTo(pos);
        //console.log(zoomLevel, zoomSlider);
    },
    /**
     *resize the div tags in the timeline aocring to the msPerpx ratio 
     */
    resizeAnims: function () {
      var msPerpx = this.msPerpx;
        $$(".anim").each(function(el){
            var obj = el.retrieve('anim'),del = obj.del,dur = obj.ms-del;
            if(el.hasClass("first")){
                el.setStyle("left",el.retrieve('anim').del/msPerpx);
                return;
            }
            if(el.hasClass("last")){
                el.setStyle("left",obj.ms/msPerpx);
                return;
            }
            el.setStyles({left:del/msPerpx,width:dur/msPerpx});
        });  
    },
    /**
     * incrimetn set zoomlevel by 10% enaugh to switch it to a new base
     */
    zoomIn : function(){
        this.zoomSlider.set((this.zoomLevel+0.1)*100);
    },
    /**
     * decrement set zoomlevel by 10% enaugh to switch it to a new base
     */
    zoomOut : function(){
        this.zoomSlider.set((this.zoomLevel-0.1)*100);
    },
    /**
     * fit timeline zoom level to include all animations up + 100px
     * is also used to set an initial view internatlly
     */
    fitTo : function (ms) {
        var 
        zoomLevel = this.zoomLevel,
        width = this.timelineArea.getSize().x,
        px = (ms/this.msPerpx).round();
        while ((px+100)<=width && zoomLevel<1) {
          this.setMsPerpx(zoomLevel+=0.01);
          px = (ms/this.msPerpx).round();
        }
        while ((px+100)>width && zoomLevel>0.1) {
          this.setMsPerpx(zoomLevel-=0.01);
          px = (ms/this.msPerpx).round();
        }
        this.zoomSlider.set(zoomLevel.round(2)*100);
        this.slideTo(0);
        this.fireEvent("timeline.redraw");
    },
     /*-------------------------------------------------------------*/
    /**
     * stops the tracker from moving 
     */
     timelineStop : function(){        
        this.play=false;
        clearTimeout(this.timer);
        this.playButton.attr("path",this.icon.play);
        Object.each(this.els, function(elm){
            window.fireEvent("panel.element.update",[elm.el]);
        }, this)
    },
     /**
     * preview the timeline by moving  the tracker
     */
    timelinePlay : function(){
        var
        lastMs = this.lastMs,
        ms=(this.trackerMs>=lastMs)?0:this.trackerMs,
        duration=lastMs-ms, pow = ((""+duration).length-2).max(1),
        step = (duration/(10).pow(pow)),
        setT = function(){
            setTrackerMs(ms);
            if(play&& ms<lastMs){
                ms+=step;
                requestAnimation(setT);
            }
        };
        //console.log("play", duration,pow,step);
        this.playButton.attr("path",this.icon.stop);
        this.play=true;
        this.timer = (function(){
            if(ms>=lastMs){
                this.timelineStop();
                this.setTrackerMs(lastMs);
            } else {
                this.setTrackerMs(ms);
                ms+=step;
            }
        }.bind(this)).periodical(step);
        //setT();
    },
    /**
     *function that toggles play and stop
     */
    togglePlay : function(){
        if(this.play) {
            this.timelineStop();
        } else {
            this.timelinePlay();
        }
    },
    playEvent : function(){this.fireEvent("timeline.play.toggle");},
    setToStart : function(){
                    this.setTrackerMs(0);
                    this.slideTo(0);
            },
    moveToEnd : function(){ this.setTrackerMs(this.lastMs); this.slideTo(this.lastMs/this.msPerpx);},
    /**
     * When a user clicks on a part of the timelane the tracker will seek to that position
     */
    timeLaneSeek : function (e){
        if(this.play){this.timelineStop();}
        var t = e.target.id=="timeLane"?e.target:e.target.getParent('#timeLane');
        this.setTracker((e.page.x-t.getPosition().x).max(0));
    },
    /*-------------------------------- anim and keyframe manipulation -----------------*/
   /**
    *method for selecting an anime object 
    */
    animSelect :  function(el,id){
        el.getChildren().addClass("selected");
    },
    /**
     *mothod for deselecting an anim
     * @param a (html) anim html element to deselect its div and keyframes
     */
    animDeselect :  function(a,id){
        a.getChildren().removeClass("selected");
    },
    /** deselcts all anims
     * 
     */
    animDeselctAll : function(){
        $$(".anim").each(function(el){
                this.animDeselect(el);
            }, this);
    },
    /**
     * create on eanimation object 
     * @param prop (string) attribute to aniamte
     * @param val (mix) value of the attribute
     * @param from (number) when aniamtio should start
     * @param from (number) when aniamtio should end
     * @param r (number) number of times to repleat
     * @return anim (obj) animation object
     */
    animCreate : function(o){
        var attr = {}, a;
        attr[o.prop] = o.val;
        if (o.jump){
            o.del = o.ms
        }
        a = Raphael.animation(attr, o.ms).delay(o.del).repeat(o.r || 1);
        a.jump = o.jump;
        return a;
    },
    
    /**
     * Creates a div element with half keyframs for its start and end points representing one anim object
     * @param anime (obj) the raphael animation object
     * @param color (string) hex representation of the elements color
     * @return div (html) the div element representing the animaiton object
     */
    keyframeCreate : function(anim,color){
        var
        div = this.div, img = this.img,  imgSrc = this.imgSrc, msPerpx = this.msPerpx,
        d = div("anim",{styles:{
               width:anim.ms/msPerpx-anim.del/msPerpx,
               left:anim.del/msPerpx
        }}).store("anim",anim);
              
        if(anim.jump){
            d.addClass("jump").adopt(
                img(imgSrc+"keyframe.gif","right full keyframe")
           );
        } else {
           d.adopt(
               img(imgSrc+"keyframe.gif","left keyframe"),
               div("body").setStyle("background-color",color),
               img(imgSrc+"keyframe.gif","right keyframe")
           );
        }
        anim.div =  d;
        return d;
    },
    /**
     * inserts a new keyframe to the timeline
     * @param el (obj)  Raphael element to add anim to
     * @param prop (string) attribute to aniamte
     * @param val (mix)[optional] value to input
     * @param ms (number)[optional] where to add new keyframe
     * @return the element the keyframe was added to
     */
    keyframeInsert : function(obj){
        if(!obj.el || !obj.prop){throw new Error("missing arguments");}
        var
        el = obj.el, prop = obj.prop, val = obj.value || el.attr(prop),
        ms = obj.ms || this.trackerMs, jump = obj.jump, del = obj.del || ms,
        els = this.els, elm = els[el.id], animCreate = this.animCreate.bind(this), keyframeCreate = this.keyframeCreate.bind(this),
        anims = el.anims = el.anims||{}, p = anims[prop] = anims[prop] || [], color = el.color,
        i,a,b,temp
        ;
        //first time insert
        if(p.length===0){
            a = anims[prop][0] = animCreate({prop:prop,val:val, ms:ms, jump:true});
            elm.tProps[prop].removeClass("empty").grab(keyframeCreate(a, color));
            $$(
            elm.eProps[prop].getParent(),
            elm.element,
            elm.timeline
            ).removeClass("empty");
            
            this.lastMs = this.lastMs.max(a.ms);
            return el;

        }
        //index not specified
        i=p.length;
        //find out the position the keyframe will be instered in p
        if(p[i-1].ms>ms){//<-- if true insert last
            //while ms is after keyframe
            while(i!==0 && p[--i].ms>=ms);
            if(p[i].ms==ms){//<-- in case ms is exactly on top of a keyframe we are done
                return el;
            }
            !(i===0 && p[i].del>ms) && i++; //++ except if insert first
        }
        
        
        b = p[i];
        temp = p[i-1];
        //console.log(i, p, temp, b);
        if(jump){ //t---x---b.....
            a = animCreate({prop:prop,val:val, ms:ms, jump:true});
            k = keyframeCreate(a, color);
            if(b){ //t---a---b.....
                if(b.jump){ //case t....|...x
                    b.div.grab(k, 'before');
                } else { //t--|---].....
                    if(temp.ms!==b.del  && ms<b.del){// case [--t---] | [---b---]
                        temp.div.addClass('end').grab(k, 'after'); //insert
                        p.splice(i++,0,a);
                        a = animCreate({prop:prop,val:temp.anim[100][prop], ms:b.del, jump:true});
                        b.div.grab(keyframeCreate(a,color).addClass('start'), 'before');
                    } else { // case  x--|---]... or ...][--|-b---] or ..]  [--|-b---]
                        a.div.addClass('start');
                        if(temp.jump){
                           temp.div.removeClass('start');
                        } else {
                            temp.div.addClass('end')
                        }
                        b.del = ms;
                        b.div.setStyles({
                            "left":ms/msPerpx,
                            "width":(b.ms-ms)/msPerpx
                        }).grab(k, 'before');
                    }
                }
            } else {// case ...t |
                temp.div.grab(k, 'after');
                this.lastMs = this.lastMs.max(a.ms);
            }
        } else { // t--]---b.....
            if(b){
                if(temp){
                    if(b.jump){  //t--]...x.....
                        a = animCreate({prop:prop,val:val,ms:ms,del:temp.ms});
                        if(temp.jump){ //x-----].....x
                            temp.div.addClass('start');
                        } else { //[-----].....x
                            temp.div.removeClass('end');
                        }
                        temp.div.grab(keyframeCreate(a,color).addClass('end'), 'after');
                    } else { //t--]---].....
                        if(temp.ms!==b.del && ms<b.del){// case [--t---] | [---b---]
                                a = animCreate({prop:prop,val:val,ms:ms,del:temp.ms});
                                temp.div.grab(keyframeCreate(a,color), 'after');
                                p.splice(i++,0,a);
                                a = animCreate({prop:prop,val:temp.anim[100][prop],ms:b.del,del:ms});
                                b.div.grab(keyframeCreate(a,color), 'before');                            
                        } else { // case x-----]-----] or ...][--|-b---] or ...]  [--|-b---]
                            a = animCreate({prop:prop,val:val,ms:ms,del:temp.ms});
                            b.del = ms;
                            b.div.setStyles({
                                "left":ms/msPerpx,
                                "width":(b.ms-ms)/msPerpx
                            }).grab(keyframeCreate(a,color), 'before');
                        }
                    }
                } else { //  case | b------]..... inserting a transition before a jump first
                    console.log(b);
                    a = animCreate({prop:prop,val:b.anim[100][prop],ms:b.ms,del:ms}); //a transition with the jumps positon and value
                    b.del = b.ms = ms;b.anim[100][prop] = val; // have the jump take the new position and value so that it remains first
                    b.div.addClass('start').setStyle("left", ms/msPerpx) //shift the jump keyframe to the new position
                    // case this is the second insert add class end
                    .grab(keyframeCreate(a,color).addClass((p.length===1)?'end':''), 'after'); //add the transition
                    i++;
                }
            } else{// case ...t |
                a = animCreate({prop:prop,val:val,ms:ms,del:temp.ms});
                if(temp.jump){ //x-----].....
                    temp.div.addClass('start');
                } else { //[-----].....
                    temp.div.removeClass('end');
                }
                temp.div.grab(keyframeCreate(a,color).addClass('end'), 'after');
                this.lastMs = this.lastMs.max(a.ms);
            }
            
        } 
        p.splice(i,0,a); 
        return el;

    },
    /**
     *ths function is fired when the add keyframe icon is pressed 
     */
    keyframeAdd : function(e){
        var t = e.target;
        window.fireEvent("keyframe.insert", {el:this.els[t.retrieve("for")].el, prop:t.retrieve("prop"), jump:e.alt});
    },
    keyframeDelete :  function(anim){
        var
        el = anim.div, msPerpx = this.msPerpx,
        prop = el.getParent().retrieve('prop'),
        elm = this.els[el.getParent().retrieve('for')],
        anims = elm.el.anims[prop],
        i = anims.indexOf(anim),
        prev = anims[i-1],
        next = anims[i+1]
        ;
        
        if(anim.jump){
            if(anim.div.hasClass('start')){  // ( x )-------]
                anim.del = anime.ms = next.ms;
                anim.anim[100][prop] = next.anim[100][prop];
                anim.div.setStyle('left', next.del);
                i++;
                el = next.div;
                el.hasClass('end') && anim.removeClass('start');
            }
        } else {
            if (el.hasClass('end')){
                if(prev.div.hasClass('start')){
                    prev.div.removeClass('start');
                } else {
                    prev.div.addClass('end');
                }
            } else {
                if(anim.ms === next.del){
                    if(prev.div.hasClass('start')){
                        prev.ms = prev.del = next.del;
                        prev.div.setStyle('left', next.del);
                    } else {
                        next.del = prev.ms;
                        next.div.setStyles({
                           width:(next.ms-next.del)/msPerpx,
                           left:next.del/msPerpx 
                        });
                    }
                } else {
                    (prev.div.hasClass('start')) && prev.div.removeClass('start')
                }
            }
            
        }
        anims.splice(i,1);
        el.destroy();
        if(anims.length===0){
            $$(elm.tProps[prop],elm.eProps[prop].getParent()).addClass('empty');
            if(Object.every(elm.tProps,function(p){return p.hasClass('empty');})){
                $$(elm.element,elm.timeline).addClass("empty");
            }
        }
    },
    animDelete : function(e){
        return; //not working
        if(!e || (e && e.key==="delete")){

        $$(".selected !> .anim").each(function(el){
            console.log("yo");
            var
            els = this.els,
            prop = el.getParent().retrieve("prop"),
            next = el.getNext(),
            isLast = next && next.hasClass("end"),
            prev = el.getPrevious(),
            isFirst = prev && prev.hasClass("start"),
            elm = els[el.getParent().retrieve("for")],
            anim = el.retrieve("anim"),
            anims = elm.el.anims[prop],
            i = anims.indexOf(anim)
            ;
            
            if(~i){
                anims.splice(i,1);
                el.eliminate("anim");
                el.destroy();
                
                if(anims.length===0){
                    elm.tProps[prop].addClass('empty');
                    elm.eProps[prop].addClass('empty');
                }
            }
            this.animDeselctAll();
            /*
            anims.some(function(a,i){
                if(a.ms===anim.ms )
                return false;
            });
            */
        }, this);
        }
    },
    /**
     *moethod that moves anims and keyframes 
     * @param {Object} e mousedown event
     */
    animAction : function(e){
        //if(!e.control){
            this.animDeselctAll();
        //}
        
        var
        els = this.els, msPerpx = this.msPerpx, trackerMs = this.trackerMs,
        x = e.page.x.toInt(),
        target = e.target,                              //the part of te keyframe that was pressed on
        isKey = target.hasClass("keyframe"),            //if it was on an anim body, this is false
        el = target.getParent(),                        //the container of the keyframe
        id = el.getParent().retrieve("for"),            //get the id
        prop = el.getParent().retrieve("prop"),         //the property
        elm = els[id].el,
        anim = el.retrieve("anim"),                     //get the anim object represented by this el
        dur = (anim.ms-anim.del),                       //find out duration
        prev = el.getPrevious(),                        //get prevous anime div
        prevAnim = prev && prev.retrieve("anim"),       //get previous anim
        prevVal = (prev?prevAnim:anim).anim[100][prop], //get its value
        next = el.getNext(),                            //same for next
        nextAnim = next && el.getNext().retrieve("anim"),
        isFirst = prev && prev.hasClass("start"),       //this anim is the start of a series of transitions
        isLast = el.hasClass("end"),                    //this anim is the end of a series of transitions
        min = isFirst?0:(prev?prevAnim.ms:0),           //get min and mx distance 
        max = next?(nextAnim.del-dur):Number.MAX_VALUE, //get max ms the anim can shift
        isLeft = target.hasClass("left"),
        isNext,
        mousemove = function(e){
            var
            
            dms = (e.page.x - x)*msPerpx,
            del = (anim.del + dms).limit(min,max);
            x = e.page.x;
            
            if(!isKey){ //hit the anim body
                el.setStyle("left",del/msPerpx);
                if(isFirst){
                    prev.setStyle("left",(del)/msPerpx);
                    prevAnim.ms = prevAnim.del = del.round();
                }
                
                anim.del = del = del.round();
                anim.ms = del+dur;
            } else {
                if(isLeft){                     // ....( [ )---------]
                    //hit the right side of the keyframe(start of anim segment)
                    dur=anim.ms-del;
                    el.setStyles({
                        "left":del/msPerpx,
                        "width":dur/msPerpx
                    });
                    anim.del = del.round();
                    
                    if(isNext){
                        prevAnim.ms = anim.del;
                        if(isFirst){                    // ...x( [ )---------]
                            prev.setStyle("left",(del)/msPerpx);
                            prevAnim.del = prevAnim.ms;
                        } else {                        // ...]( [ )---------]
                            prev.setStyle("width",(del-prevAnim.del)/msPerpx);
                        }
                    }
                    
                } else {                     // ....[---------( ] ) or .. (x)...
                    //hit the left side of the keyframe(end of anim segment) or a jump
                    if(anim.jump){              // ...(x)..........
                        anim.del = anim.ms = del.round();
                        el.setStyle("left",del/msPerpx);
                    } else{                     // ....[---------( ] )
                        del = (anim.ms+dms).limit(min,max);//for next anim
                        dur = (del-anim.del);
                        el.setStyle("width",dur/msPerpx);
                        anim.ms = del.round()
                    }
                    if(isNext){         // ....[-----( ] )[---]... or ....x( [ )----]...
                        nextAnim.del = anim.ms;
                        next.setStyles({
                            "left":del/msPerpx,
                            "width":(nextAnim.ms-del)/msPerpx
                        });
                    }
                
                    
                }
            }
            
            if(trackerMs>=min && trackerMs<=max){
                elm.attr(prop,prevVal);
                elm.status(anim,(trackerMs-del)/(anim.ms-del));
                window.fireEvent("panel.element.update",[elm]);
            }
            (!next) && this.fireEvent("timeline.lastMs");
        }.bind(this),
        mouseup = function(){
            
            window.removeEvent("mousemove",mousemove);
            window.removeEvent("mouseup",mouseup);
            //$$("input,form,button,textarea,select").removeClass("is-sliding");
            if(isKey){document.body.style.cursor = "default";}
            document.onselectstart = function() {return true;};
        }.bind(this),
        pPrev = prev &&  prev.getPrevious(),
        pPrevMs = pPrev &&  pPrev.retrieve('anim').ms
        ;
        //delete
        if(e.shift){
            if(!isKey){      // ...(---------)]
                this.keyframeDelete(anim);
            } else {         // ---(][)--- or --(]) or ..x]  or   ...(x)... 
                if(isLeft){ // ---]( [ )--- or ---]  ( [ )---
                    this.keyframeDelete((prevAnim.ms === anim.del)?prevAnim:anim, true);
                } else { // ---(])[--- or --(]) or ..x]  or   ...(x)... 
                    if(next && (nextAnim.del === anim.ms)){   //  ---(])[--- or x---]
                        this.keyframeDelete(anim, (nextAnim.del === anim.ms));    
                    } else { //---] [---]  or   ...(x)... ot -----(])...
                        this.keyframeDelete(anim);
                    }
                }
            }
            return;
        }
            
        if(!isKey){
            this.animSelect(el,isLast);
            if(isFirst){                                        // ...(x---------])
                this.animSelect(prev); //if the start of a transition select the jump key
                min = pPrev?pPrevMs:0;
            }
            //isLast && this.animSelect(next);
        } else{
            target.addClass("selected");
            if(isLeft){                                             // ...]( [ )---------]
                isNext = prevAnim.ms === anim.del;
                isNext &&  prev.getLast().addClass("selected");
                min = isFirst?(pPrev?pPrevMs:0):(isNext?prevAnim.del:min);
                max = anim.ms;
            } else {                                                // ....[---------( ] ) or .. (x)...
                //hit the left side of the keyframe(end of anim segment)
                if(next){
                    isNext = nextAnim.del === anim.ms ;
                    if(isNext){       // ...(x)[-----] or ....[----( ] )..[
                        next.getFirst().addClass("selected");
                        max = nextAnim.ms;
                    }else {
                        max = nextAnim.del;                             // ....[----( ] )..[]
                    }
                } 
                if(!anim.jump){
                    min = anim.del;
                }
            }
        }
        console.log(min,max);
        
        $$("input,form,button,textarea,select").addClass("is-sliding");
        if(isKey){document.body.style.cursor = "w-resize";}
        document.onselectstart = function() {return false;};
        window.addEvent("mousemove",mousemove);
        window.addEvent("mouseup",mouseup);
    }
});


}());
