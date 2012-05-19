/*!
 * Color Picker 0.1.0 - Cloud Design component
 *
 * Copyright (c) 2012 Amr Draz (http://cloud-design.me)
 * Based on Color Picker (http://raphaeljs.com/colorwheel) by Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

/**
 * this class defines the color picker
 * @author Amr Draz
 * @requirments Raphael, Mootools, Mootools Slider
 * 
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Raphael,Slider*/

var ColorPicker = (function(){
    
    var
    inputParse = function(input, color, o){
        var hsb = Raphael.rgb2hsb(color);
        input.set({
            value: color.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3"),
            styles:{
                "background-color":color==="none"?"#fff":color,
                color:hsb.b > 0.6 || color==="none"? "#111":"#fff"
            }
        });
    },
    vect = function(set,els,title){
        els = els || {};
        var d = new Element("div",set),
        raph = [d,"100%","100%"].combine(els);

            d.store("vec",Raphael(raph)[raph.length-1]);
        return d;
    },
    makeSlider = function(div,x,y,size,pos, step,func){
        var cont = new Element("div",{
                styles:{
                    position:"absolute",
                    width:10,
                    height:size,
                    left:x,
                    top:y
                }
            }).inject(div),
            handel = new Element("div",{
                "class":"handel",
                styles:{
                    position:"absolute",
                    width:10,
                    height:1
                }
            }).inject(cont),
            slider = new Slider(cont, handel,{
                    mode :"vertical",
                    wheel:true,
                    steps:step,
                    initialStep :step,
                    onChange:func
            });
            //draw the handel for the slider
            Raphael([handel,10,10,{type:"path",path:"M"+pos+" 0 5 5 "+pos+" 10z",fill:"#eee",stroke:"none"}]);
            handel.getFirst().setStyles({position:"absolute",top:-5});
            
            return slider;
    }
    ;
    
    return new Class({
        Implements:[Options,Events],
        options:{
    
        },
        noneFill:"135-#fff-#fff:45-#f00:45-#f00:55-#fff:45-#fff",
        notNoneFill:"135-#fff-#fff:45-#888:45-#888:55-#fff:45-#fff",
        initialize: function(options){
            
            var cont = $$(options.container)[0]||$$("body")[0],
            imgSrc = (options.imgSrc||"img")+"/",
            color = this.initColor = options.initColor||"#f00",
            width=this.width=240,height=this.height=240,x = this.x = 15,y=this.y=5,wh=this.wh =200,
            picker = cont.retrieve("cdPicker");
            
            //check if picker already initialized
            if(picker) {return cont.retrieve("picker");}
            
            
            picker = this.picker = new Element("div",{
                "class":"color-picker",
                styles:{
                 position:"absolute",
                 display:options.show?"block":"none",
                 width:width,
                 height:height,
                 "background-color":"#333",
                 "border":"#48e solid 1px",
                 "z-index":10,
                 color:"#eee"
                }
            }).inject(cont);
            
            this.H = 1;
            this.S = 1;
            this.B =1;
            
            this.transImg = imgSrc+"transparent-bg.gif";
            
            this.setOptions(options);
            
            this.bound = {};
            [   "setSB",
                "hsbDown",
                "hsbMove",
                "hsbUp",
                "setH",
                "setO",
                "color",
                "scrollH",
                "show",
                "cancel",
                "toggleNone",
                "inputChange",
                "set"
            ].each(function(name){
                this.bound[name] = this[name].bind(this);
            }, this);
            
            
            
            
            var
            hsb = this.doc = new Element("div",{
                styles:{
                    position:"absolute",
                    width:wh+30,
                    height:wh+30,
                    left:5,
                    top:y
                }
            }).inject(picker),
            input = this.colorInp = new Element("input",{
                "class":"color",
                outline: "none",
                styles:{
                    position:"absolute",
                    left:x+5,
                    top:y+wh+10,
                    width:50,
                    height:15,
                    border:"none",
                    "line-height": 1,
                    "font-size": 9
                },
                events:{keyup:this.bound.inputChange}
            }).inject(picker),
            initInp = this.initColorInp = new Element("input",{
                "class":"color",
                readonly:"readonly",
                styles:{
                    position:"absolute",
                    left:x+5+50,
                    top:y+wh+10,
                    width:50,
                    height:15,
                    border:"none",
                    "line-height": 1,
                    "font-size": 9
                }
            }).inject(picker),
            
            r = Raphael(hsb,"100%","100%"),
            
            inpBg = r.image(this.transImg,x,y+wh+5,100,16),
            
            //the color area
            h = r.rect(x+wh+4,y,4,wh).attr({
                stroke: "none",
                fill: "90-#f00-#ff0-#0f0-#0ff-#00f-#f0f-#f00"
            }),
            o = r.rect(x-9,y,4,wh).attr({
                stroke: "none",
                fill: "90-#fff-#fff",
                "fill-opacity":0
            }),
            bg = r.image(this.transImg,x,y,wh-1,wh),
            sb = this.hsb = r.rect(x,y,wh,wh).attr({
                stroke: "none",
                opacity: 1
            });
            
            sb.clone().attr({
                stroke: "none",
                fill: "0-#fff-#fff",
                opacity: 0
            });
            sb = r.rect(x - 1, y - 1, wh + 2, wh + 2).attr({
                r: 2,
                stroke: "#fff",
                "stroke-width": 1,
                fill: "90-#000-#000",
                opacity: 0,
                cursor: "crosshair"
            });
            
            this.noneScreen = r.rect(x, y, wh, wh).attr({
                r: 2,
                stroke: "none",
                fill: this.noneFill
            }).hide();
            
            //set svg canvas to absolute
            hsb.getFirst().setStyles({position:"absolute"});
            
            
            // the hue slider
            this.h = makeSlider(hsb, x+wh+4,y,wh,10,360,this.bound.setH);
            //opacity slidern
            this.o = makeSlider(hsb, x-14,y,wh,0,100,this.bound.setO);
            
            //cursor
            this.cursor = r.set();
            this.cursor.push(r.circle(x+wh, y, 3).attr({
                stroke: "#000",
                opacity: 0.5,
                "stroke-width": 2
            }));
            this.cursor.push(this.cursor[0].clone().attr({
                stroke: "#fff",
                opacity: 1,
                "stroke-width": 1
            }));
            this.cursor.attr("cursor","crosshair");
            
            //ok button
            var
            okBtn = r.set();
            okBtn.push(r.rect(x+wh-30,wh+10,30,15,3).attr({fill:"#444"}));
            okBtn.push(r.text(wh,110,"X").attr({fill:"#eee","font-size":10,"font-weight":900}));
            okBtn.attr({title:"Cancel",stroke:"none"});
            okBtn.mousedown(this.bound.cancel).hover(function(){
                okBtn[0].attr("fill","#888");okBtn[1].attr("fill","#222");
                },function(){
                okBtn[0].attr("fill","#444");okBtn[1].attr("fill","#eee");
            });
            
            //none button
            this.noneBtn = r.rect(x+wh-90,wh+10,15,15,1).attr({title:"toggle none",stroke:"none",fill:this.notNoneFill});
            this.noneBtn.mousedown(this.bound.toggleNone);
            
            //liniar gradien button
            this.linBtn = r.rect(x+wh-70,wh+10,15,15,1).attr({title:"not yet functional",stroke:"none",fill:"135-#000-#fff"});
            
            //none button
            this.radBtn = r.set();
            this.radBtn.push(r.rect(x+wh-50,wh+10,15,15,1).attr({fill:"#000"}));
            this.radBtn.push(r.circle(x+wh-42.5,wh+17.5,7.5).attr({fill:"r#fff-#000"}));
            this.radBtn.attr({title:"not yet functional",stroke:"none"});
            
            //set start color
            this.color(color);

            picker.addEvent("mousedown",function(e){e.stop();});
            sb.node.addEvent("mousedown",this.hsbDown.bind(this));
            sb.node.addEvent("mousewheel", this.bound.scrollH);
            this.addEvents({
                "panel.resize": this.bound.resize
            });
            cont.addEvents({
                "mousedown:relay(.cd-colorpicker)":this.bound.show
            });
            cont.store("cdPicker",this);
            
            $$("body").addEvent("mousedown",this.bound.set);
        },
        set:function(e){
            var t =$(e.target), vec = this.vec;
            if(/svg|circle|rect|path|ellipse|image|text/.test(t.nodeName)){
                !t.getParent("div.cd-colorpicker") && this.hide();
                return;
            }
            if(vec && vec.cpOn && !(t.hasClass("color-picker")||t.getParent(".color-picker"))){
                this.hide();
            }
        },
        setO:function(val){
            this.O = val/100;
            this.o && this.o.element.set("title","opacity: "+val+"%");
            this.hsb.attr({"fill-opacity": this.O});
            this.update();
        },
        scrollH : function(e) {
            e.stop();
            var step = this.h.step - e.wheel * 3;
            this.h.set(step);
        },
        setH:function(val){
            
            this.h && this.h.element.set("title","Hue: "+val+"°");
            val = (360-val)/360;
            this.hsb.attr({fill: "hsb(" + val+ ",1,1)"});

            this.H = val;
            this.update();
        },
        setSB : function (x, y) {
            var hx=this.x,hy=this.y,wh = this.wh;
            x = x.limit(hx,hx+wh);
            y = y.limit(hy,hy+wh);
                
            this.cursor.attr({cx: x, cy: y});
            this.B = 1 - (y - hy) / wh;
            this.S = (x - hx) / wh;
            this.update();
        
        },
        toggleNone:function(){
            this.setNone();
        },
        setNone: function(none, noUpdate){
            var vec = this.vec || {};
            if(typeOf(none)!=="null"){
                vec.isNone = this.isNone = none;
                //console.log(this.isNone);
                this.noneBtn.attr("fill",none?this.noneFill:this.notNoneFill);
                this.noneScreen[none?"show":"hide"]();
                this.cursor[none?"hide":"show"]();
                //console.log();
                !none && this.color()=="#ff" && this.color("#f00");
                !noUpdate && this.update();
            } else {
                //console.log(this.isNone,"to", !this.isNone);
                this.setNone(!this.isNone);
            }
        },
        hsbDown : function(e){
            var
            x = (e.page.x - this.doc.getPosition().x),
            y = (e.page.y - this.doc.getPosition().y);
            
            this.setSB(x,y);
            window.addEvents({
                "mousemove":this.bound.hsbMove,
                "mouseup":this.bound.hsbUp
            });
        },
        hsbMove : function (e) {
            var
            x = (e.page.x - this.doc.getPosition().x),
            y = (e.page.y - this.doc.getPosition().y);
            
            this.setSB(x,y);
            
        },
        hsbUp : function (e) {
            window.removeEvents({
                "mousemove":this.bound.hsbMove,
                "mouseup":this.bound.hsbUp
            });
        },
        show: function(e){
            
                e.stop();
            var t = this.target = e.target.getParent("div"),
            cor = t.getCoordinates(),
            vec = t.retrieve("vec"),
            color,
            p = this.picker
            ;
            //check if visible
            if(this.vec && this.vec.cpOn!==vec.cpOn){
                this.vec.cpOn = false;
            }
            this.vec = vec;
            if(vec.cpOn){
                this.hide();
                return;
            }
            vec.cpOn = true;
            
            
            color = vec.attr("fill");
            //check if none
            if(color==="none" || vec.isNone){
                color = "none";
                this.setNone(true);
            } else{
                this.setNone(false, true);
            }
            
            
            this.o.set(vec.attr("fill-opacity")*100);
            this.initColor = color;
            this.color(color);
            
            
            p.setStyles({
                left:this.width+cor.right<window.getSize().x?cor.right:cor.left-this.width,
                top:this.height+cor.bottom<window.getSize().y?cor.bottom:cor.top-this.height,
                "display":"block"
                });
            
           // console.log(color, this.vec);
        },
        hide : function () {
            //var color =  this.color();
            //console.log(color);
            var vec = this.vec;
            //console.log(this.vec);
            vec.cpOn = false;
            this.picker.setStyle("display","none");
        },
        cancel : function () {
            var color =  this.color();
            console.log(color, this.initColor);
            if(this.isNone && this.initColor!=="none"){
                this.setNone(false);
            } else if(this.initColor==="none"){
                this.setNone(true);
            }  else{
                this.setNone(false, true);
                this.color(this.initColor);
                this.update();
            }
            this.hide();
        },
        update: function(){
            var color = this.color(), o = this.O;
            inputParse(this.colorInp, color, o);
            this.fireEvent("change",[color, o,this.vec]);
        },
        color : function (color,o) {
            if (color) {
                
                color = Raphael.color(color);
                
                this.H = color.h;
                this.S = color.s.round(3);
                this.B = color.v.round(2);
                
                this.h.set((1-this.H)*360);
                //console.log(this.S, this.S * this.wh + this.x, this.S * this.wh);
                var x = this.S * this.wh + this.x,
                    y = (1-this.B) * this.wh + this.y;
                this.cursor.attr({cx: x, cy: y});
                if(o){
                    this.o.set(o*100);
                }
                inputParse(this.initColorInp, this.initColor);
                inputParse(this.colorInp, color.hex);
                  
                return this;
            } else {
                return this.isNone?"none":Raphael.hsb(this.H, this.S, this.B);
            }
        },
        setColor:function(vec, fill){
            if(fill==="none") {
                vec.isNone = true;
                fill = this.noneFill;
            } else {
                vec.isNone = false;
            }
            return vec.attr("fill",fill);
        },
        inputChange:function(e){
            var color = e.target.get("value");
            if(!Raphael.color(color).error){
                this.color(color);
            }
            if(color==="none"){
                this.setNone();
            }
        },
        initFill:function(name, options){
            var
            o = options || {},
            wh = o.wh || 20,
            swh = wh-5,
            path = ["M 1 1 ",wh-1,"1 ",wh-1," ",wh-1," 1 ",wh-1," z"].join(),
            div = new Element("div", { "class":o.clas||"",styles:{
                position:o.position||(o.y||o.x)?"absolute":"relative",
                top:o.y||0,
                left:o.x||0,
                width:wh,
                height:wh
                }}).set(o.container || {});
                
            if(o.label){
                div.setStyle("width",wh+o.width+5);
                (new Element("label",{
                    text:o.label+":",
                    "for":name,
                    styles:{
                        position:"absolute",
                        top:0,
                        right:wh+5,
                        "text-align":"right"
                    }
                })).inject(div);
            }
                
            var vec = (vect({"class":"cd-colorpicker", "for":name,
                styles:{
                    position:"absolute",
                    right:0,
                    top:0,
                    height:wh,
                    width:wh
                    }
                },
                [{
                    type:"rect",
                    x:0,
                    y:0,
                    height:wh,
                    width:wh,
                    r:"1"
                },{
                    type:"path",
                    path:(o.stroke) ? [path, "M 5 5 5 ",swh," ",swh," ",swh," ", swh,"5 z"].join():path,
                    stroke:"none",
                   "fill-opacity":this.O
                }
                ]
                )).inject(div);
                vec = vec.retrieve("vec");
                div.store("vec", vec);
                this.setColor(vec,o.initColor||(o.stroke?"#000":"none"));
                
                this.vec = vec;
                vec.cpOn = false;
                
            return div;
        }
    });
})();
