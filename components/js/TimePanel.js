/**
 * This Class definesthe editor's timeline and it's controls
 * @author Amr Draz
 * @dependency Raphael, MooTools, SlidingLabel, ColorPicker
 */
/*global Class,Raphael,Events,Options,$,$$,Element,console,window,typeOf,Slider,SlidingLabel,ScrollBar,PropMixin,ColorPicker */
var TimePanel = (function(){
    var
    buttonAttr = {"fill":"#ddd", "stroke":"none", "cursor":"pointer"},
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
    div = function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    },
    img = function(src,c,s){
        s = s || {};
        return new Element("img",{src:src,"class":c}).set(s);
    },
    vect = function(c,icon,trans,evens,title){
        
         var d = div("vect "+c), r = Raphael(0,0,"100%","100%"),
            vec = r.path(icon)
                    .attr(buttonAttr).attr({"title":title||""})
                    .transform(trans||"")
                    .hover(function (){
                        this.attr("stroke","#48e");
                    }, function (){
                        this.attr("stroke","none");
                    });
            r.canvas.inject(d);
            d.addEvents(evens||{});
            d.store("vec",vec);
        return d;
    },
    has = "hasOwnProperty"
    ;
    
    return new Class({
    
    Implements: [PropMixin],
    Extends:ElementsPanel,
    noScroll : true,
    initialize: function (paper, options){        
        options = options || {};
        
        
        var
        timePanel = this,
        width = this.width = options.width||1020,
        height = this.height = options.height||200,
        lwidth = this.lwidth = 235,
        rwidth = this.rwidth = width-lwidth-24,
        panel = this.panel = div("time-panel", {width:width,height:height}),
        zwidth = 150,
        imgSrc= (options.imgSrc || "img")+"/",
        icon = {
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
        selected={}, els={}, selectedAnim = [], context= "onload", zoomLevel=1,
        tColor = "#eee",step = 250,base = 250,msPerpx = 1,trackerMs=0,lastMs=0,
        play=false,timer,timelineWidth,timelineHeight,
        baseArr = [250,500,1000,5000,15000,30000,60000,120000,300000,600000,1200000],
        divsArr = [  2,  5,   4,   3,    4,    4,    4,     4,     5,     4,     4],
        multArr = [  2,  2,1.16,1.44,    2,    2,    2,   1.6,     2,     2,     2],
        requestAnimation = window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                           function (callback) {
                               timer = setTimeout(callback, step);
                           },
        
        playEvent = function(){timePanel.fireEvent("timeline.play.toggle");},
        setToStart = function(){
                        setTrackerMs(0);
                        slideTo(0);
                },
        moveToEnd = function(){ setTrackerMs(lastMs); slideTo(lastMs/msPerpx);},
        makeZoomSlider = function(size){
            var 
            cont = div("container", {styles:{left:20,height:20,width:size-40}}),
            handel = div("handel",{styles:{width:10}}),
            d = div("",{id:"timeZoomSlider",styles:{height:20,width:size}}).adopt(
                vect("slide-arrow",icon.minus,"T -4 0 S 0.8",{"mousedown": function(e){timePanel.fireEvent("timeline.zoomout");}},"zoom out"),
                cont.adopt(handel),
                vect("slide-arrow",icon.plus,"T -4 0 S 0.8",{"mousedown": function(e){timePanel.fireEvent("timeline.zoomin");}},"zoom in")
            ),
            slider = new Slider(cont, handel,{
                steps:100,
                wheel:true,
                onChange:function(val){
                    //console.log(this,val);
                    timePanel.fireEvent("timeline.zoom", [val]);
                }
            });
            slider.stepWidth = size-40;
            //slider.autosize();
            d.store("slider",slider);
            return d;
        },
        /*----------------------- create panel ----------------------*/
        
        elementsArea = div("elements-area",{styles:{width:lwidth}}).inject(panel),
            elementsAreaHeader = div("area-header").adopt(
                vect("start-button",icon.start,"T -7 -7 S 0.8 0.6",{click:setToStart},"to start"),
                vect("play-button",icon.play,"T -7 -7 S 0.8",{click:playEvent},"Play animation"),
                vect("end-button",icon.end,"T -7 -7 S 0.8 0.6",{click:moveToEnd},"to end"),
                div("header-footer")
            ).inject(elementsArea),
            elements = div("area-content").inject(elementsArea),
            elementsAreaFooter = div("area-footer").inject(elementsArea),
            textField = new Element("input",{"type":"text", "id":"editText",
                styles:{
                    "position":"absolute",
                    "white-space":"nowrap",
                    "display":"none",
                    "border":"#48e solid 1px"
                }
            }).inject(elementsArea),
        
        seperator = div("seperator",{styles:{left:lwidth}}).inject(panel),
        
        timelineArea = div("timeline-area",{styles:{left:lwidth+5,width:rwidth}}).inject(seperator,"before"),
            scrollArea = div("scroll-area").inject(timelineArea),
            slideTracker = vect("timeline-slider",icon.tracker,"T 2 0 S 1.5",{}),
            timelineHeader = div("area-header").adopt(
                div("",{id:"timeLane"}),
                div("",{id:"labelLane"}),
                div("header-footer",{id:"triggerLane"}),
                div("",{id:"tracker"}).adopt(
                    slideTracker,
                    div("",{id:"trackerLine"}),
                    div("",{id:"trackerTime"})
                ),
                div("",{id:"pin"})
            ).inject(scrollArea),
            timelanes = div("area-content").inject(scrollArea),
            xScroller = new ScrollBar([scrollArea],true, rwidth-170,19).setOptions({onChange:function(){
                                    timePanel.fireEvent("timeline.redraw");
                                }}),
            timelineFooter = div("area-footer").adopt(
                makeZoomSlider(zwidth),
                vect("fit-button",icon.fit,"T -7 -7 S 0.6",{},"fit to timeline"),
                xScroller.scrollBar
            ).inject(timelineArea),
        yScroller= new ScrollBar([elements,timelanes],false, 19,height-50,30),
        scrollBar = div("scroll-bar").adopt(
            yScroller.scrollBar
        ).inject(panel),
        slidingLabel = this.slidingLabel = new SlidingLabel({
            container:elements,
            onStart:function(val,label){
                //TODO is auto-keyfram is set then add a new keyframe
            },
            onChange:function(val,label){
                var attr = {},prop = label.get("for");
                attr[prop] = val;
                if(selected){
                    //TODO add keyfram or edit keyframe
                    //for now I'm editing the element
                    els[label.getParent().get("for")].el.attr(attr);
                    window.fireEvent("element.update", [attr]);
                    //els[label.getParent().get("for")].el.attr(attr);
                }
            },
            onEnd:function(val,label){
                //TODO if there's a keyframe update it
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
        var
        
        hideToggle = function (e){
            e.stop();

            var el = els[e.target.getParent(".element").get("for")];
            delete selected[el.el.id];
            if(el.element.hasClass("hidden")){
                el.element.removeClass("hidden");
                el.el.show();
                Object.each(selected, function(elm,key){
                    elm.element.removeClass("hidden");
                    elm.el.show();
                });
            } else {
                el.element.addClass("hidden");
                el.el.hide();
                Object.each(selected, function(elm,key){
                    elm.element.addClass("hidden");
                    elm.el.hide();
                });
            }
            selected[el.id] = el;
        },
       expandToggle = function (e){
            e.stopPropagation();
            var target = e.target,
            elm = els[target.getParent(".element").get("for")];
            if(elm.element.hasClass("expanded")){
                elm.element.removeClass("expanded");
                elm.timeline.removeClass("expanded");
            } else {
                elm.element.addClass("expanded");
                elm.timeline.addClass("expanded");
            }
            console.log(yScroller.contents);
            timePanel.fireEvent("panel.scroll.update");
        },
        
        /*-----------------------  operations ----------------------*/
       keyframeCreate = function(anim,color){
           var d = div("anim",{styles:{
                       width:anim.ms/msPerpx-anim.del/msPerpx,
                       left:anim.del/msPerpx
                  }}).store("anim",anim);
                  
                  if(anim.ms!==0){
                       d.adopt(
                           img(imgSrc+"keyframe.gif","left keyframe"),
                           div("body").setStyle("background-color",color),
                           img(imgSrc+"keyframe.gif","right keyframe")
                       );
                  } else {
                       d.addClass("first").adopt(
                           img(imgSrc+"keyframe.gif","right keyframe")
                       );
                  }
            return d;
       },
       /**
         * creates a new row based on a Raphael Element and asigns it an id
         * @param el (Raphael Obj) the element for this row
         * @return (div) the div representing the row
         */
        elementCreate = function(el){
            el.id = (typeOf(el.id)==="number")?el.type+el.id:el.id;
            var i,ii,c,p,color = Raphael.getColor(0.9),
            anims = el.anims || {},a=[],b=[],first,last,
            props = div("props"),
            element = div("element expanded", {"for":el.id}).adopt(
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
                    new Element("label", {"text":el.id, "class":"name"})
                ),
                props
            ),
            timeLanes = div("props"),
            timeLane = div("element expanded", {"for":el.id}).adopt(
                div("header"),
                timeLanes
            );
            
            Object.each(anims,function(p,key,anims){
                //add proprety label at element area
                div("prop").adopt(
                    slidingLabel.initLabel(key,{value:el.attr(key),container:{"class":"prop-label","for":el.id,"prop":key}}),
                    div("key-frame").adopt(img(imgSrc+"keyframe.gif"))
                ).inject(props);
                //console.log(key,p);
                //add element at the timeline area
                a=[];
                p.each(function(anim){
                    a.push(keyframeCreate(anim,color));
                });
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
                
                lastMs = lastMs.max(last.ms);
            });
                  
            return {color:color,el:el, element:element,timeline:timeLane, anims:anims, maxMs:a.ms};
        },
        /**
         * inserts a new element into the elements panel
         * @param el (Raphael Obj) the element for this row
         */
        elementInsert = function(el){
            var obj = els[el.id] = elementCreate(el);
            obj.element.inject(panel,"top");
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the row id in the elements panel
         */
        elementDeselect = function (id){
            if(id) {
                if(typeOf(id)=="string" && selected[id]) {
                    selected[id].element.removeClass("selected");
                    delete selected[id];
                }
            } else {
                Object.each(selected, function(elm,key){
                    elementDeselect(key);
                });
            }
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the element id in the elements panel
         */
        elementSelect = function (id){
            if(id && els[id] && !selected[id]){
                selected[id] = els[id];
                selected[id].element.addClass("selected");
            }
        },
        /**
         * selects the elemnets obj by it's element
         * @param el (Raphael Obj) the element to select
         */
        elSelect = function (el){
            if(el && typeOf(el)!=="null"){
                elementSelect(el.id);
            }
        },
        /**
         * deselect the elemnets obj by it's element
         * @param el (Raphael Obj) the element to deselect
         */
        elDeselect = function (el){
            if(el && typeOf(el)!=="null"){
                elementDeselect(el.id);
            } else {
                elementDeselect();
            }
        },
        /**
         * event handler for element selection allows for multiple selection if ctrl is pressed
         * @param e (event)
         */
        elementClick = function (e) {
            e.stopPropagation();
            
            var el = els[((e.target.hasClass("element"))?e.target:e.target.getParent(".element")).get("for")].el;
            if(e.control){
                if(selected[el.id]){
                    window.fireEvent("element.deselect", [el]);
                } else {
                    window.fireEvent("element.select", [el]);
                }
            } else {
                window.fireEvent("element.deselect");
                window.fireEvent("element.select", [el]);
            }
        },
        /**
         * event handler deletes the element from the elements panel
         * @param el (Raphael Obj) the element to delete
         */
        elementDelete = function (el){
            
            if(el){
                if(typeOf(el)==="array"){
                    el.each(function(id){
                        elementDelete(els[id].el);
                    });
                } else {
                    var id = el && el.id;
                    if(selected[el.id]){
                       window.fireEvent("element.deselect", el);
                    }
                    els[id].element.destroy();
                    delete els[id];
                    //TODO move this part elsewhere
                    if(el.ft) { el.ft.unplug();}
                    el.remove();
                }
            } else {
                Object.each(selected, function(elm,key){
                    elementDelete(elm.el);
                });
            }
        },
        elementUpdate = function(el) {
            var inputs, id = el.id;
            
            if(els[id]){
                inputs = els[id].element.getElements("input");
                
                inputs.each(function(i){
                    i.set("value",(el.attr(i.get("name")).round()));
                });
            }
        },
        /**
         * checks if user clicked on an element
         */
        notElement = function (e) {
            var el = e.target;
            if(el.getParent(".element")===null && !el.hasClass("element")) {
                window.fireEvent("element.deselect");
            }
        };
        
        var
        timeLane = Raphael(timelineArea.getElement("#timeLane"),"100%",10),
        labelLane = Raphael(timelineArea.getElement("#labelLane"),"100%",10),
        triggerLane = Raphael(timelineArea.getElement("#triggerLane"),"100%",10),        
        
        seperatorMousedown = function(e){
            var
            x = e.page.x.toInt(),
            mousemove = function(e){
                var
                dx = e.page.x - x,
                width = elementsArea.getStyle("width").toInt() + dx;
                x = e.page.x;
                
                if(width<=305 && width >= 235) {
                    elementsArea.setStyle("width", width);
                    seperator.setStyle("left", seperator.getStyle("left").toInt() + dx);
                    timelineArea.setStyles({
                        "left": timelineArea.getStyle("left").toInt() + dx,
                        "width": timelineArea.getSize().x - dx
                    });
                    
                    timelineHeader.setStyle("width", timelineHeader.getSize().x - dx);
                    scrollArea.setStyle("width", scrollArea.getSize().x - dx);
                    timelanes.setStyle("width", timelanes.getSize().x - dx);
                    xScroller.resize(xScroller.size() - dx);
                    
                }
                
            },
            mouseup = function(){
                window.removeEvent("mousemove",mousemove);
                window.removeEvent("mouseup",mouseup);
                $$("input,form,button,textarea,select").removeClass("is-sliding");
                document.body.style.cursor = "default";
                document.onselectstart = function() {return true;};
            }
            ;
            $$("input,form,button,textarea,select").addClass("is-sliding");
            document.body.style.cursor = "w-resize";
            document.onselectstart = function() {return false;};

            window.addEvent("mousemove",mousemove);
            window.addEvent("mouseup",mouseup);
     },
        parse = function(paper){
            var a = [];
            paper.forEach(function(el) {
                var obj;
                el.noparse = el.noparse || false;
                if(!el.noparse){
                    obj = elementCreate(el);
                    els[el.id] = obj;
                    a.push(obj.element);
                }
            });
          return a;  
        },
    /*-----------------------handeling what text filed should do ----------------------*/
        clearSelection = function () {
            if(document.selection && document.selection.empty) {
                document.selection.empty();
            } else if(window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        },
        changName = function(e){
            e.preventDefault();
            
            var sel = e.target,
            size = sel.getSize(),
            pos = sel.getPosition(panel);
            
            clearSelection();
            
            textField.setStyles({
                    "top":pos.y,
                    "left":pos.x,
                    "width":100,
                    "height":size.y,
                    "display":"block"
                });
            textField.id = sel.get("text");
            textField.set({"value":textField.id});
            textField.focus();
            this.noShortcut = true;
        },
        hideTextField = function (){
           var id = textField.id, val = textField.get("value");
            if(val!=="" && !els[val]) {
                els[id].element.getElement(".name").set("text", val);
                els[id].element.set("for", val);
                els[id].el.id = val;
                els[val] = els[id];
                delete els[id];
                //rowDeselect(id);
                elementSelect(val);
            }
            textField.set({"value":"", styles:{"display":"none"}});
            this.noShortcut=false;
        },
        /*-----------------------------------TimeLane------------------------------------------*/
        msToString = function(ms){
            var min,sec;
            min = (ms/(60000)).toInt();
            ms %= 60000;
            sec = ("0" + (ms/1000).toInt()).slice(-2);
            ms %= 1000;
            return min+":"+sec+((ms)?"."+("00"+ms).slice(-3):"");
        },
        drawTimeLane = function(){
            timeLane.clear();
            var pathArr=[],z = (1-zoomLevel).round(2).min(0.99),
            division,midstep,offset=0,ms=0,endMS=0,
            i = (z*10).toInt().min(9);
            
            base = baseArr[i];
            division = divsArr[i];
            step = 250-((z*100)%10)*25/multArr[i];
            msPerpx = base/step;
            midstep = base/division;
            
            //-100 to account for scroll sometimes not reseting to 0 exactly *(timelineXSlider.step/(timelineXSlider.max).max(1)
            offset = (scrollArea.getScroll().x)*msPerpx;
            //move ms to start rendering after the offset
            while(ms<offset){ms+=base;}
            
            endMS = ms+baseArr[i+1]*3;
            //console.log("offset",offset,"render from",ms,"to",endMS,"base",base,"zoomLevel",zoomLevel);
            while(ms<endMS){
                
                pathArr.push(["M",ms/msPerpx,0],["V", 10]);
                for(i=division-1;i>0;i--) {
                    pathArr.push(["M",(ms-i*midstep)/msPerpx,0],["V", 5]);
                }
                timeLane.text(ms/msPerpx+3,5,msToString(ms)).attr({stroke:"none", fill:tColor, "font-size":8,"text-anchor":"start"});
                
                ms+=base;
            }
            timeLane.path(pathArr).attr({stroke:"#222", "stroke-width":0.5});
        },
        setTimeLanesWidth = function(width){
            width = width.max(scrollArea.getSize().x);
            scrollArea.getChildren().setStyle("width",width);
            xScroller.update();
        },
        seekTo =function (el, ms){
            el.anims = el.anims||{};
            Object.each(el.anims,function(p,k){
                //(function(){
                p.some(function(a,i){
                    //console.log(a.del,a.ms,ms,a.del<ms, a.ms>ms,(a.ms>ms));
                    if(a.del<ms && a.ms>ms){
                        el.attr(k,p[i-1].anim[100][k]);
                        
                        el.status(a,(ms-a.del)/(a.ms-a.del));
                        //console.log(a,ms,((ms-a.del)/(a.ms-a.del)),k,"from",p[i-1].anim[100][k],"to",el.attr(k));
                        return true;
                    }
                    var n = p[i+1];
                    if(a.ms<ms && (!n || n&&ms<n.del )){
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
         * set tracker to location
         * @param pos (number) position of the tracker in pixels
         */
        setTracker = function(pos){
            var tracker = timelineHeader.getElement("#tracker");
            
            tracker.setStyle("left", pos);
            trackerMs = ((pos)*msPerpx).round();
            
            //console.log("pos*ms/px ",pos,msPerpx," = ", trackerMs);
            
            tracker.getLast().set("text", msToString(trackerMs));
            
            Object.each(els,function(el){
                //(function(){
                    seekTo(el.el,trackerMs);
                //}).delay(0);
            });
        },
        /**
         * set tracker to location while resizing the timeline area(scrollArea)
         * @param pos (number) position of the tracker in pixels
         */
        setTrackerAndResize = function(pos){
          setTimeLanesWidth(pos.max(lastMs/msPerpx)+100);
          setTracker(pos);
        },
        /**
         * set tracker to location
         * @param pos (number) position of the tracker in milli seconds
         */
        setTrackerMs = function(ms){
            setTracker(ms/msPerpx);
        },
        setLastMs = function(){
            lastMs=0;
            Object.each(els,function(el){
                //(function(){
                Object.each(el.anims,function(p){
                    lastMs = lastMs.max(p[p.length-1].ms);
                });
                //}).delay(0);
            });
        },
        /*----------------------- timeline zoom ----------------------*/
        setMsPerpx= function(zoomLevel){
            var z = (1-zoomLevel).round(2),
            i = (z*10).toInt().min(9);
            
            base = baseArr[i];
            step = 250-((z*100)%10)*25/multArr[i];
            msPerpx = base/step;
        },
        
        zoomSlider = timelineFooter.getElement("#timeZoomSlider").retrieve("slider"),
        slideTo = function(pos){
            var slider = xScroller.slider;
            slider.set(slider.max*(pos/xScroller.size()).round());
            
        },
        /**
         * This function set the zoom level of the timeline then calculates the ms/px ratio
         * it then sets the tracker resizes the xSlider and redraws the TimeLane numbers
         * it then repositions the xSlider to acount for the trackers position
         * @param lvl (numeber) a number from 0-100 indicating the zoom level
         */
        setZoomLevel = function(lvl) {
            zoomLevel = ((lvl/100).round(2)).limit(0,1);
            var oldMsPerPx = msPerpx;
            setMsPerpx(zoomLevel);
            var pos = trackerMs/msPerpx;
            setTrackerAndResize(pos);
            timePanel.fireEvent("timeline.redraw");
            $$(".anim").each(function(el){
                var obj = el.retrieve('anim'),del = obj.del,dur = obj.ms-del;
                if(el.hasClass("first")){
                    el.setStyle("left",el.getNext().retrieve('anim').del/msPerpx);
                    return;
                }
                if(el.hasClass("last")){
                    el.setStyle("left",obj.ms/msPerpx);
                    return;
                }
                el.setStyles({left:del/msPerpx,width:dur/msPerpx});
            });
            slideTo(pos);
            //console.log(zoomLevel, zoomSlider);
        },
        zoomIn = function(){
            zoomSlider.set((zoomLevel+0.1)*100);
        },
        zoomOut = function(){
            zoomSlider.set((zoomLevel-0.1)*100);
        },
        fitTo = function (ms) {
            var 
            width = timelineArea.getSize().x,
            px = (ms/msPerpx).round();
            //console.log(lastMs, trackerMs);
            while ((px+100)<=width && zoomLevel<1) {
              zoomLevel+=0.01;
              setMsPerpx(zoomLevel);
              px = (ms/msPerpx).round();
            }
            
            while ((px+100)>width && zoomLevel>0.1) {
              zoomLevel-=0.01;
              setMsPerpx(zoomLevel);
              px = (ms/msPerpx).round();
            }
            zoomSlider.set(zoomLevel.round(2)*100);
            
            slideTo(0);
            timePanel.fireEvent("timeline.redraw");
            
        },
        playButton = elementsAreaHeader.getElement(".play-button").retrieve("vec"),
        timelineStop = function(){
            console.log("stop");
            
            play=false;
            clearTimeout(timer);
            playButton.attr("path",icon.play);
        },
        timelinePlay = function(){
            var 
            ms=(trackerMs>=lastMs)?0:trackerMs,
            duration=lastMs-ms, pow = ((""+duration).length-2).max(1),
            step = (duration/(10).pow(pow)),
            setT = function(){
                setTrackerMs(ms);
                if(play&& ms<lastMs){
                    ms+=step;
                    requestAnimation(setT);
                }
            };
            console.log("play", duration,pow,step);
            playButton.attr("path",icon.stop);
            play=true;
            timer = (function(){
                if(ms>=lastMs){
                    timelineStop();
                    setTrackerMs(lastMs);
                } else {
                    setTrackerMs(ms);
                    ms+=step;
                }
            }).periodical(step);
            //setT();
        },
        togglePlay = function(){
            if(play) {
                timelineStop();
            } else {
                timelinePlay();
            }
        },
        
        trackerSeek = function (e){
            if(play){timelineStop();}
            var pos = (e.page.x-this.getPosition().x).max(0);
            setTracker(pos);
        },
        trackermove = function (dx,dy,x){
            var pos = (x-this.x).max(0);
            //console.log(pos, scrollArea.getSize().x, scrollArea.getScroll().x, scrollArea.getScrollSize().x);
            
            if(pos<scrollArea.getSize().x+scrollArea.getScroll().x-100 && pos>scrollArea.getScroll().x){
                setTracker(pos);
            } else {
                if(pos>scrollArea.getScrollSize().x-100){
                    setTrackerAndResize(pos);
                }
                slideTo(pos);
            }
            
        },
        /*-------------------------------- anim and keyframe manipulation -----------------*/
        animSelect =  function(el,id){
            el.getChildren().addClass("selected");
        },
        animDeselect =  function(el,id){
            el.getChildren().removeClass("selected");
        },
        animDeselctAll = function(){
            $$(".anim").each(function(el){
                    animDeselect(el);
                });
        },
        animCreate = function(prop,val,from,to,r){
            var attr = {};
            r = r || 1;
            attr[prop] = val;
            return Raphael.animation(attr, to).delay(from).repeat(r);
        },
        animInsert = function(el,prop, val, ms){
            if(!el || !prop){throw new Error("missing arguments");}
            el.anims = el.anims||{};
            var i,ii,del,a,b,temp,p =el.anims[prop] = el.anims[prop] || [],
            color,
            lane,anims,first,firstMs,last, lastMS;
            val = val || el.attr(prop);
            ms = ms || trackerMs;
            //first time insert
            if(p.length===0){
                console.log(p);
                a = el.anims[prop][0] = animCreate(prop,el.attr(prop),0,0);
                if(Object.getLength(el.anims)==1){
                    console.log(el);
                    els[el.id] = elementCreate(el);
                } else {
                    lane.adopt(
                        keyframeCreate(a, els[el.id].color)
                            .setStyle("left",ms/msPerpx),
                        div("anim last",{styles:{
                            width:0,
                            left:ms/msPerpx
                        }}).store("anim",a).adopt(
                            img(imgSrc+"keyframe.gif","left start keyframe")
                        )
                    );
                    
                }
                return el;

            }
            console.log(el);
            color = els[el.id].color;
            lane = els[el.id].timeline.getElement(".prop[prop="+prop+"]");
            anims = lane.getChildren();
            //index not specified
            if(!i){
                i=0;
                ii=p.length;
                do{
                    i++;
                }while(i<ii && p[i-1].ms<=ms);
            }
            //console.log(i);
            if(p[i-1].ms>=ms){
                i--;
            }
            a = p[i-1];
            b=p[i];
            if(a.ms===ms ||( b && b.del===ms)){
                return el;
            }
            if(i==1){
                if(anims.length===2){// case |[------].....
                    first = anims[0];
                    firstMs = (first.getPosition(scrollArea).x*msPerpx).round();
                    last = anims[i];
                    lastMS = (last.getPosition(scrollArea).x*msPerpx).round();
                    if(firstMs >trackerMs){
                        a = animCreate(prop,val,ms,firstMs);
                        first.setStyle("left",ms/msPerpx);
                        last.setStyle("left",firstMs/msPerpx);
                        keyframeCreate(a,color).inject(first,"after");
                    } else{// case []  |
                        a = animCreate(prop,val,lastMS,ms);
                        first.setStyle("left",lastMS/msPerpx);
                        last.setStyle("left",ms/msPerpx);
                        keyframeCreate(a,color).inject(last,"before");
                    }
                } else { //[--a--|-].....
                    a = animCreate(prop,val,b.del,ms);
                    b.del = ms;
                    last=anims[i];
                    last.setStyles({
                        "left":ms/msPerpx,
                        "width":(b.ms-ms)/msPerpx
                    });
                    keyframeCreate(a,color).inject(last,"before");
                }
                p.splice(i,0,a);
                return el;

            }
            if(b){
                if(a.ms!==b.del){// case [--a---] | [---b---]
                    temp = animCreate(prop,val,a.ms,ms);
                    keyframeCreate(temp,color).inject(anims[i-1],"after");
                    p.splice(i,0,temp);
                    temp = animCreate(prop,a.anim[100][prop],ms,b.del);
                    keyframeCreate(temp,color).inject(anims[i],"before");
                    p.splice(i+1,0,temp);
                } else { // case [--a---][--|-b---]or [--a---]  [--|-b---] 
                    console.log(a,b);
                    temp = animCreate(prop,val,b.del,ms);
                    b.del = ms;
                    last = anims[i];
                    last.setStyles({
                        "left":ms/msPerpx,
                        "width":(b.ms-ms)/msPerpx
                    });
                    keyframeCreate(temp,color).inject(last,"before");
                    p.splice(i,0,temp);
                }
            } else {// case ...[--b--] |
                b = animCreate(prop,val,a.ms,ms);
                last = anims[i];
                last.setStyle("left",ms/msPerpx);
                keyframeCreate(b,color).inject(last,"before");
                console.log(b);
                p.splice(i,0,b);
                lastMs = lastMs.max(b.ms);
            }
            return el;
        },
        keyframeInsert = function(e){
            var target = e.target,
            el = els[target.getParent(".element").get("for")].el,
            prop = target.getParent().getPrevious().get("prop");
            window.fireEvent("keyframe.insert", [el, prop]);
        },
        animDelete = function(e){
            if(!e || (e && e.key==="delete")){

            $$(".selected !> .anim:not(.last,.first)").each(function(el){
                var 
                type = el.getParent().retrieve("type"),
                next = el.getNext(),
                isLast = next.hasClass("last"),
                prev = el.getPrevious(),
                isFirst = prev.hasClass("first"),
                elm = els[el.getParent(".element").get("for")],
                anim = el.retrieve("anim"),
                anims = elm.el.anims[type],
                i = anims.indexOf(anim)
                ;
                
                if(~i){
                    if(isFirst){
                        prev.setStyle("left",next.getStyle("left"));
                    }
                    if(isLast){
                        next.setStyle("left",prev.getCoordinates(scrollArea).right);
                        next.retrieve("anim",prev.retrieve("anim"));
                    }
                    anims.splice(i,1);
                    el.eliminate("anim");
                    el.destroy();
                    
                    if(anims.length===1){
                        delete elm.el.anims[type];
                        
                        prev.getParent().eliminate("type");
                        prev.getParent().destroy();
                        elm.element.getElement(".prop-label[prop="+type+"]").getParent().destroy();
                        
                        if(!Object.getLength(elm.anims)){
                            elm.element.destroy();
                            elm.timeline.destroy();
                            delete els[elm.el.id];
                        }
                    }
                }
                animDeselctAll();
                /*
                anims.some(function(a,i){
                    if(a.ms===anim.ms )
                    return false;
                });
                */
            });
            }
        },
        animAction = function(e){
            //if(!e.control){
                animDeselctAll();
            //}
            
            var
            x = e.page.x.toInt(),
            target = e.target,
            isKey = target.hasClass("keyframe"),
            el = target.getParent(),
            id = el.getParent(".element").get("for"),
            type = el.getParent().retrieve("type"),
            elm = els[id].el,
            anim = el.retrieve("anim"),
            dur = (anim.ms-anim.del),
            prev = el.getPrevious(),
            prevAnim = prev && prev.retrieve("anim"),
            prevVal = prevAnim.anim[100][type],
            next = el.getNext(),
            nextAnim = next && el.getNext().retrieve("anim"),
            isFirst = prev.hasClass("first"),
            min = prevAnim && prevAnim.ms,
            isLast = next.hasClass("last"),
            max = isLast?Number.MAX_VALUE:(nextAnim && nextAnim.del-dur),
            isNext, isLeft,
            mousemove = function(e){
                var
                dms = (e.page.x - x)*msPerpx,
                del = (anim.del + dms).limit(min,max);
                x = e.page.x;
                
                if(!isKey){
                    el.setStyle("left",del/msPerpx);
                    
                    if(isLast){next.setStyle("left",(del+dur)/msPerpx);}
                    if(isFirst){prev.setStyle("left",(del)/msPerpx);}
                    
                    
                    anim.del = del = del.round();
                    anim.ms = del+dur;
                } else {
                    if(isLeft){
                        //hit the right side of the keyframe(start of anim segment)
                        dur=anim.ms-del;
                        el.setStyles({
                            "left":del/msPerpx,
                            "width":dur/msPerpx
                        });
                        anim.del = del.round();
                        
                        if(isFirst){
                           prev.setStyle("left",del/msPerpx);
                        }else if(isNext){
                           prev.setStyle("width",(del-prevAnim.del)/msPerpx);
                           prevAnim.ms = del.round();
                        }
                        
                    } else {
                        //hit the left side of the keyframe(end of anim segment)
                        dur = (dur+dms).limit(min,max-anim.del);
                        //console.log(dur);
                        del = (anim.del+dur);
                        if(del>=min && del<=max){
                            el.setStyle("width",dur/msPerpx);
                            anim.ms = del.round();
                            
                            if(isLast){
                                next.setStyle("left",del/msPerpx);
                            } else if(isNext){
                                nextAnim.del = anim.ms;
                                
                                next.setStyles({
                                    "left":del/msPerpx,
                                    "width":(nextAnim.ms-del)/msPerpx
                                });
                            }
                        }
                    }
                }
                
                if(trackerMs>=min && trackerMs<=max){
                    elm.attr(type,prevVal);
                    elm.status(anim,(trackerMs-del)/(anim.ms-del));
                    window.fireEvent("panel.element.update",[elm]);
                }
                
                timePanel.fireEvent("timeline.lastMs");
            },
            mouseup = function(){
                
                window.removeEvent("mousemove",mousemove);
                window.removeEvent("mouseup",mouseup);
                $$("input,form,button,textarea,select").removeClass("is-sliding");
                if(isKey){document.body.style.cursor = "default";}
                document.onselectstart = function() {return true;};
            }
            ;
            
            if(!isKey){
                animSelect(el,isLast);
                isFirst && animSelect(prev);
                isLast && animSelect(next);
            } else{
                isLeft = target.hasClass("left");
                target.addClass("selected");
                if(isLeft){
                    isNext = prevAnim.ms === anim.del;
                    if(isNext){
                        prev.getLast().addClass("selected");
                        min = (!isFirst &&  prev)? prevAnim.del:0;
                    } else {
                        min = (!isFirst &&  prev)? prevAnim.ms:0;
                    }
                    max = anim.ms;
                } else {
                    //hit the left side of the keyframe(end of anim segment)
                    isNext = nextAnim.del === anim.ms ;
                    if(isNext){
                        next.getFirst().addClass("selected");
                        max = (!isLast &&  next)?nextAnim.ms:Number.MAX_VALUE;
                    } else {
                        max = (!isLast &&  next)?nextAnim.del:Number.MAX_VALUE;
                    }
                }
            }
            //console.log(min,max);
            
            $$("input,form,button,textarea,select").addClass("is-sliding");
            if(isKey){document.body.style.cursor = "w-resize";}
            document.onselectstart = function() {return false;};
            window.addEvent("mousemove",mousemove);
            window.addEvent("mouseup",mouseup);
    }
    ;
        
                    
        /*----------------------- public stuff ----------------------*/
                    
        this.tracker = $("tracker");
        this.seekTo = function(ms){
            setTrackerMs(ms);
        };
        
        /*----------------------- register Events ----------------------*/
        
        timePanel.addEvents({
            "timeline.zoomin": zoomIn,
            "timeline.zoomout": zoomOut,
            "timeline.zoom": setZoomLevel,
            "timeline.redraw": drawTimeLane,
            "timeline.play.toggle": togglePlay,
            "timeline.lastMs":setLastMs,
            "panel.scroll.update":yScroller.update
        });
        elements.addEvents({
            "click":notElement,
            "click:relay(.row)":elementClick,
            "mousedown:relay(.eye)": hideToggle,
            "mousedown:relay(.arrow)": expandToggle,
            "dblclick:relay(.name)": changName,
            "mousedown:relay(.key-frame img)": keyframeInsert
        });
        timelanes.addEvents({
            "mousedown:relay(.anim)":animAction
        });
        seperator.addEvent("mousedown",seperatorMousedown);
        
        textField.addEvents({
            "keydown": function (eve){
                    if (eve.key === "enter"){
                        hideTextField();
                    }
                },
            "blur": hideTextField
        });
        timelineArea.getElement("#timeLane").addEvent("mousedown", trackerSeek);
        timelineArea.getElement(".fit-button").addEvent("mousedown", function(e){e.stop();fitTo(lastMs);});
        slideTracker.retrieve("vec").drag(trackermove,function(){
                        if(play){timelineStop();}
                        this.x=timelineHeader.getPosition().x;
                        this.offset = scrollArea.getScroll().x;
                    });
                    
        window.addEvents({
            "element.create": elementCreate,
            "element.delete": elementDelete,
            "element.deselect": elementDeselect,
            "element.select": elSelect,
            "panel.element.update":elementUpdate,
            "keydown":animDelete,
            "keyframe.insert":animInsert
        });
        
        
       
        
        var a = [], b=[];
        paper.forEach(function(el) {
            el.noparse = el.noparse || false;
            if(!el.noparse){
                var obj = {};
                obj = elementCreate(el);
                els[el.id] = (obj);
                
                a.push(obj.element);
                b.push(obj.timeline);
            }
        });
        elements.adopt(a);
        timelanes.adopt(b);
       
        
        yScroller.update();
        
        //workaround until I make zoom slider seperate
        (function(){
            zoomSlider.autosize();
            //initialize timeline at 4000
            fitTo(4000);
            xScroller.update();
        }).delay(0);
        //console.log(panel);
    }
});


})();
