/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Panel,Raphael*/

var CanvasPanel = new Class({
    Extends:Panel,
    options:{
    },
    noScroll:true,
    initialize: function(options){
        
        this.parent(options||{});
        this.bind([
            "newLevel",
            "unfocus",
            "levelSelect",
            "elementDelete",
            "elementSelect",
            "elementDeselect",
            "elementCreate",
            "elementUpdate",
            "mousedown",
            "dblclick",
            "setState",
            "hideTextArea"
            ]);
            
        var panel = this.panel.addClass("canvas-panel"),
        paperArea = this.paperArea = new Element("div",{"class":"paper-area"}),
        fb =this.focusBar = new Element("div", {"class":"focus-bar", styles:{top:-25}}),
        ta = this.textArea = new Element("textarea", { "class":"text-area hide"});
        this.screen = new Element("span",{"class":"screen hide"});
        
        this.elfocus = false;
        this.selected = [];
        this.levels = [];
        this.R = this.newLevel("base").paper;
        panel.adopt(paperArea, this.focusBar, ta);
        
        /*------------------- add Events----------------------------*/
        
        ta.addEvents({
            "keydown": function (eve){
                    if (eve.key === "enter" && !eve.shift){
                        this.hideTextArea();
                    }
                }.bind(this),
            "blur": this.bound.hideTextArea
        });
        fb.addEvents({
            "mousedown:relay(.level:not(selected))":this.bound.levelSelect
        });
        paperArea.addEvents({
            "mousedown:relay(svg,div)": this.bound.mousedown,
            "dblclick:relay(svg,div)":this.bound.dblclick
        });
        window.addEvents({
           "tool.state": this.bound.setState,
           "canvas.focus": this.bound.newLevel,
           "canvas.unfocus":this.bound.unfocus,
           "canvas.mousedown":this.bound.mousedown,
           "canvas.dblclick":this.bound.dblclick,
           "element.delete":this.bound.elementDelete,
           "element.select":this.bound.elementSelect,
           "element.deselect": this.bound.elementDeselect,
            "element.update": this.bound.elementUpdate,
           "element.create":this.bound.elementCreate
        });
        
    },
    /**
     * hides the textarea used to write in a text element after applying the text
     */
    hideTextArea: function (){
        //TODO fix text
        var el = this.selected[0], bb, ats, ta = this.textArea;
        if(typeOf(el)!=="null" && el.type==="text") {
            el.attr({text:ta.get("value")});
            bb = el.getBBox();
            el.attr({x:0,y:0});
            ats = el.ft.attrs;
            ats.size.x = bb.width;
            ats.size.y = bb.height;
            ats.translate.x = bb.x;
            ats.translate.y = bb.y;
            el.ft.apply();
            //el.ft.hideHandles();
            this.selected = [];
        }
        ta.set({"value":""}).addClass("hide");
        window.fireEvent("hotkeys.set", [true]);
    },
    setState: function(s){
        this.state = s;
    },
    newLevel: function(el){
        if(!el) return;
        if(el==="base"||el==="path"){el=false;}
        if(el && this.isInSet(el)){
            el=el.parent;
        }
        var levels = this.levels,
        level = this.level = {
                i:levels.length,
                div:new Element("div",{"class":"level selected",html:"<span>"+(el?el.id:"paper")+"</span>"}),
                el:el,
                paper: Raphael(0,0,"100%","100%")
                }
        if(levels.length!==0){
            if(levels.length===1){
                this.focusBar.set('tween',{duration:'short'});
                this.focusBar.tween("top",-25, 0);
            }
            level.back = new Element("span", {"class":"next "+(el.type==="set"?"":"last"),text:"<"}); //TODO not add last when group
            level.div.grab(level.back,"top");
            level.back.store("level",level);
            this.screen.removeClass("hide");
            levels[level.i-1].div.removeClass("selected");
            el && this.load(el);
        } else {
            level.paper.groups = {};
        }
        level.div.store("level",level);
        this.focusBar.grab(level.div);
        this.paperArea.adopt(this.screen, level.paper.canvas);
        levels.push(this.level);
        window.fireEvent("paper.focus", [level.paper]);
       // console.log(level);
        return level;
    },
    levelSelect: function(e) {
        var l = e.target.retrieve("level");
        window.fireEvent("canvas.unfocus",[l.i]);
    },
    load: function(el, ft) {
        var p = this.level.paper, elm, path, that = this;
        //el.toParse;
        if(el.type!=="set"){
            this.elFocus = true;
            if(!ft){
                if(el.type==="path"){
                   // el.unplug();
                    path = Raphael.transformPath(el.attr("path"),el.transform());
                    elm = p.pathManager(path);
                    elm = elm.attr(el.attr()).attr("path", path);
                    elm.drawing = true;
                } else {
                    elm = p[el.type]();
                    elm = elm.attr(el.attr());
                }
                
                this.level.el = elm;
                this.elementCreate(elm);
                !(el.type==="path") && elm.setFt(el.ft);
            } else {
                elm = p[el.type]();
                elm = elm.attr(el.attr());
                this.elementCreate(elm);
                //TODO
                elm.setFt(ft, ft.items[el.fti]);
            }
            
            elm.el = el;
            elm.color = el.color;
            el.elm = elm;
            elm.anims = el.anims;
            elm.anim = el.anim;
            elm.parent = el.parent;
            elm.setId(el.id);
            el.hide();
            el.hidden = true;
            
            //console.log(elm);
        } else {
            el.forEach(function(e){
                that.load(e, el.ft);
                //TODO group drop down
            });
            
                this.level.el = el;
            this.elFocus = false;
        }
        
         // console.log([this.level.el]);
    },
    unfocus: function(i){
        window.fireEvent("element.deselect");
        //console.log(el);                
        var levels = this.levels, ii = levels.length-1, last;
        i = (i || ii-1).max(0);
        console.log("unfocus",[this.level.el]);
        
        while (ii !== i) {
            console.log("unfocusing ",ii);
            ii--;
            last =  this.levels.pop();
            delete this.level;
            console.log("unfocus",[last.el]);
            this.level = this.levels[ii];
            this.unload(levels[ii],last);
            last.div.destroy();
            last.paper.remove();
            delete last.i;
            delete last.el;
        };
        this.elFocus = false;
        this.level.div.addClass("selected");
        this.screen.inject(this.level.paper.canvas, 'after');
        window.fireEvent("paper.unfocus", [this.level.paper]);
        if(ii===0){
            this.screen.addClass("hide");
            this.focusBar.set('tween',{duration:'short'});
            this.focusBar.tween("top",0,-25);
        } 
    },
    unload: function(past, present){
        var p1 = past.paper, p2 = present.paper, that = this, s = p2.set();
       p2.forEach(function(el){
            
            e = p1[el.type]().attr(el.attr());
            if(el.drawing){
                el.unplug();
                e.node.set("fill-rule","evenodd");
            }
            that.elementCreate(e);
            e.setId(el.id);
            e.color = el.color;
            e.anims = el.anims;
            e.anim = el.anim;
            e.parent = (present.el==="set" && el.parent.id === present.el.id)?s:el.parent;
            
            //console.log(el.parent.id, el, e.ft);
            s.push(e);
            if(el.el){
                e.setFt(el.ft);
                e.insertBefore(el.el);
                el.el.remove();
            } else {
                
            }
        });
        if(present.el.type==="set"){
            //present.el.ft.unplug();
            that.elementCreate(s);
            if(past.el){
                past.el.groups[present.el.id] = s;
            } else {
                past.paper.groups[present.el.id] = s;
            }
            s.id = present.el.id;
            //console.log("unload ",[s.id], s.ft.items, [present.el.id], present.el.ft.items);
            
        }
    },
    /**
     * event handeler for mousedown event on canvas
     * this function fires and element.eselect event then draw.start event when proper tools selected
     * in case a non parsable element (element with a noparse set to true) is mousedowned no event is fired
     * if a mousedown occurse on a path controle point a segment.mousedown event is fired
     * @param e (obj) event Object used to get the x y position of the mouse
     */
    mousedown : function (e) {
        //console.log(e);
        var l = this.level
            R = l.paper,
            c = R.canvas,
            state = this.state,
            el,
            els = null,
            x = e.x || (e.page.x - c.getParent().getPosition().x),
            y = e.y || (e.page.y - c.getParent().getPosition().y);
            
        
        //console.log(l.paper.canvas);
        //console.log("mousedown el fouse ",this.elfocus);
        if(/text|path|rect|image|circle|ellipse/.test(state)){
                //els = R.getElementsByPoint(x,y);
                el = R.getElementByPoint(e.page.x,e.page.y);
                //console.log(el);
                if(el && el.noparse){
                    if(el.control && /anchor|next|prev/.test(el.control)){
                        window.fireEvent("segment.mousedown",[e, el]);
                    }
                    return;
                }
                
                if(this.state==="path"){
                    if(this.elFocus){
                        el = this.level.el || this.selected[0];
                        //console.log(el);
                    } else {
                        this.selected.length>0 && window.fireEvent("element.deselect");
                        el = true; // reuse of el as a vriable
                        this.elFocus = true;
                        R = this.newLevel("path").paper;
                        c = R.canvas;
                    }
                } else {
                    if(this.focus){ //exit foucs if trying to draw
                        window.fireEvent("canvas.unfocus");
                        R = this.level.paper;
                        c = R.canvas;
                    } else {
                        this.selected.length>0 && window.fireEvent("element.deselect");
                    }
                }
                window.fireEvent("tool.state", [state]);
                
                window.fireEvent("draw.start", [{"x":x,"y":y, c:c, paper:R, pm:el},e]);
       } else {
           if(e.page) {
               //console.log("mouse", y,c.getParent().getPosition().y, e.page.y);
               x = e.page.x;
               y = e.page.y;
           } else {
               el = c.getParent().getPosition();
               x = e.x + el.x;
               y = e.y + el.y;
           }
           this.select(x,y);
        }
    },
    isInSet: function(el){
        return this.level.i===0?(el.type!=="set"  && el.parent)?true:false:
                (el.type!=="set"  &&
                !this.elFocus &&
                el.parent &&
                (this.level.el.id !== el.parent.id));
    },
    select:function(x,y){
        //console.log(x,y);
        var R = this.level.paper,
        el = R.getElementByPoint(x,y);
        //console.log(x,y,el.id, el.raphaelid, R.getElementByPoint(x,y)); return;
        //console.log(el && el.getBBox().y);
        if(el){
            el.noparse = el.noparse || false;
            if(this.isInSet(el)){
                el = el.parent;
            }
            //heck if eement already selected
            if(!el.noparse && this.selected.indexOf(el)===-1){
                //console.log(el);
                window.fireEvent("element.deselect");
                window.fireEvent("tool.state", ["select"]);
                window.fireEvent("element.select", [el]);
            }
        } else {
            !this.elFocus && window.fireEvent("element.deselect");
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
        var  R = this.level.paper, c = R.canvas,
        pm = c.getParent().getPosition(),
        x = e.x?e.x+pm.x:(e.page.x),
        y = e.y?e.y+pm.y:(e.page.y),
        el = R.getElementByPoint(x,y);;
        
        if(!el){
             //console.log("hello", [this.level.el]);
             this.level.i && window.fireEvent("canvas.unfocus",[0]);
             return;
        }
        
        console.log(this.elFocus);
        if(!this.elFocus){
            window.fireEvent("element.deselect");
            window.fireEvent("canvas.focus",[el]);
            //this.elFocus=true;
        } else {
            window.fireEvent("canvas.unfocus");
        }
    },
    /**
     * handels needed arrangment for when an element is deleted
     */
    elementDelete : function (el){
        var sel = this.selected;
        if(el){
            if(typeOf(el)==="array"){
                el.each(function(elm){
                    this.elementDelete(elm);
                }, this);
            } else {
                this.elementDeselect(el);
                //TODO move this part elsewhere
                if(el.ft) { el.ft.unplug();}
                el.remove();
            }
        } else {
            Object.each(sel, function(elm,key){
                this.elementDelete(elm);
            }, this);
        }
    },
    /**
     * updates the current selected element(s) with the passed attribute
     * @param attr (obj) a Raphael attr object ie {attributName:attributeValue}
     * 
     */
    elementUpdate: function(attr, elm){
        if(elm){
            //console.log("el update",el.matrix.split());
            elm.trans(attr);
        }else{
            this.selected.each(function(el){
                this.elementUpdate(attr, el);
            }, this);
            //if(this.selected.length<1){
            //console.log("pp el update", attr);
            window.fireEvent("panel.update", [attr]);
            //}
        }
    },
    /**
     * this method toggles the raphaeltransform handels associated with the selected element(s)
     * @param el (obj) Rapahel element
     */
    elementSelect: function (el){
        var sel = this.selected, bb;
        if(el) {
            //console.log(this.level.i, el, el.parent);
            if(this.isInSet(el)){
                el = el.parent;
            }
            //console.log([el]);
            if(el.ft){
                !(el.drawing) && el.ft.showHandles();
            }
            this.selected.push(el);
            window.fireEvent("panel.update", [el.trans()]);
            //console.log(el.attr("path") && el.attr("path").join(" "));
        }
    },
    /**
     * this function deselects an element
     * @param el (obj) Rapahel element
     */
    elementDeselect : function(el){
        var sel = this.selected;
        if(el){
            //console.log("deselect",[el]);
            
            sel.splice(sel.indexOf(el),1);
            if(el.ft) {
                el.ft.hideHandles();
            }
        } else {
            sel.each(function(el){this.elementDeselect(el);},this);           
            window.fireEvent("tool.state",["canvas"]);
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
        var R = this.level.paper, gs, ft, ta = this.textArea;
        //console.log("canvas element create",el.segments);
        
        el.offX = el.offX || 0.5;
        el.offY = el.offY || 0.5;
        el.ox = el.ox || 0.5;
        el.oy = el.oy || 0.5;
        el.transform("R0 0 0 S1 1 0 0T0 0 ");
        el.setId((typeOf(el.id)==="number")?el.type+el.id:el.id)
        
        if(at==="path"){
            this.level.el = el;
            this.level.div.set({text:el.id}).grab(new Element("div", {"class":"next "+"last",text:">"}), "top");
            return;
        }
        //el.attr({x:0,y:0});
        ft = R.freeTransform(el, {
            attrs:{fill:"#111",stroke:"none"},
            draw:['bbox','circle'],
            rotate:['axisY'],
            scale:['bboxCorners', 'bboxSides'],
            snap:{rotate:45},
            snapDist:{rotate:2},
            distance:1.6,
            size:4
            },
            function(ft, events){
                var at = ft.attrs;
                /*console.log(ft);
                    console.log([
                'R', at.rotate, at.center.x, at.center.y,
                'S', at.scale.x, at.scale.y, at.center.x, at.center.y,
                'T', at.translate.x, at.translate.y
                ] + ft.items[0].transformString);*/
                var tr = ft.subject.trans(['tx','ty','sx','sy','rotate', 'bwidth', 'bheight']);
                //console.log(ft.subject.trans('trs'));
                window.fireEvent("panel.update", [tr]);
                //window.fireEvent("panel.element.update", [tr, ft.subject]);
            }.bind(this));
            
        el.ft = ft;
        ft.hideHandles();
        
        if(el.type==="set" && at==="set"){
            
            console.log([el]);
            el.id = "set"+Number.random(10e2, 10e3);
            el.groups = {};
            el.forEach(function(elm){
                elm.parent = el;
                elm.setId((typeOf(elm.id)==="number")?elm.type+elm.id:elm.id);
            });
            gs = this.level[this.level.i===0?"paper":"el"].groups
            gs[el.id] = gs[el.id] || el;
        }
        
        if(at && el.type === "text" ){
            ta.setStyles({
                    "top":at.y,
                    "left":at.x,
                    "width":at.width,
                    "height":at.height})
                .removeClass("hide");
            ta.focus();
            el.attr({x:at.x,y:at.y, "font-size":30});
            this.selected.push(el);
            window.fireEvent("hotkeys.set", [false]);
        }
    }
});
