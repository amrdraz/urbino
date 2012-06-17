
/**
 * PropretiesPanel
 * constructor of the editors propreties panel
 * @dependancy SlidingLabel
 * @author Amr Draz
 *  
 */
/*global Rapahel,$,$$,Class,Events,Options,Element,typeOf,PropMixin,SlidingLabel,ColorPicker,window*/
var PropertiesPanel = (function(){
    
    var
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
        x: {name:"x", "class":"left row-1",label:"x",type:"number", anim:true},                // (number)
        y: {name:"y", "class":"left row-2",label:"y",type:"number", anim:true},                   // (number)
        cx: {name:"cx","class":"left row-1", type:"number", anim:true},            // (number)
        cy: {name:"cy", "class":"left row-2",type:"number", anim:true},           // (number)
        width: {name:"width", "class":"right row-1", label:"width",type:"number", anim:true},                // (number)
        height: {name:"height", "class":"right row-2",label:"height",type:"number", anim:true},              // (number)
                      // r (number)
                cr: {name:"r", "class":"right row-1",label:"radius",type:"number", anim:true},               // (number) fpr circle radius
                r: {name:"r", "class":"left row-1",label:"radius",type:"number", anim:true},               // (number) for rect corner

        rx: {name:"rx", "class":"right row-1",type:"number", anim:true},                // (number)
        ry: {name:"ry", "class":"right row-2",type:"number", anim:true},                // (number)
        text: {name:"text", "class":"left row-4",type:"textarea"},               // (string) contents of the text element. Use '\n' for multiline text
        "text-anchor":{name:"text-anchor", "class":"left row-2",type:"select", options:["start","middle","end"]},        // (string) ["start", "middle", "end"], default is "middle"
        "opacity":{name:"opacity", "class":"right row-2",type:"percent", max:100, anim:true},            // (number)
        "fill":{name:"fill", label:"fill","class":"left row-1",type:"color", anim:true},                // (string) colour, gradient or image
        //"fill-opacity":{name:"fill-opacity", type:"percent"},        // (number)
        "stroke":{name:"stroke", label:"stroke","class":"left row-2",type:"color", anim:true},            // (string) stroke colour
        "stroke-dasharray":{name:"stroke-dasharray", label:"dasharray","class":"left row-4 all",type:"select", options:["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]},    // (string) [“”, "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
        "stroke-linecap":{name:"stroke-linecap", label:"linecap","class":"left row-5 all",type:"select", options:["butt", "square", "round"]},    // (string) ["butt", "square", "round"]
        "stroke-linejoin":{name:"stroke-linejoin", label:"linejoin","class":"left row-6 all",type:"select", options:["bevel", "round", "miter"]},  // (string) ["bevel", "round", "miter"]
        //TODO "stroke-miterlimit",// (number)
        //"stroke-opacity":{name:"stroke-opacity", type:"percent"},    // (number)
        "stroke-width":{name:"stroke-width", "class":"right row-3",type:"number", min:1},       // (number) stroke width in pixels, default is '1'
        path:{name:"path", "class":"left row-1",type:"text", anim:true},                // (string) SVG path string format
        src:{name:"src", "class":"left row-1",type:"text"},                // (string) image URL, only works for @Element.image element
        font:{name:"font", "class":"left row-1",type:"text"},                // (string)
        "font-family":{label:"font",name:"font-family", "class":"left row-1",type:"select", options:fonts},        // (string)
        "font-size":{name:"font-size", "class":"left row-3",type:"number", min:0, anim:true},        // (number) font size in pixels
        "font-weight":{name:"font-weight", "class":"right row-3", type:"number", min:100, max:900, step:100, sufix:""},        // (string)
        "href":{name:"href", "class":"left row-2", type:"text"},              // (string) URL, if specified element behaves as hyperlink
        "target":{name:"target", "class":"left row-1", type:"select",options:["_self","_blank","_top","_parent"]},            // (string) used with href
        "title":{name:"title", "class":"left row-3", type:"text"},            // (string) will create tooltip with a given text
        // "transform" (string) see @Element.transform
            "translate-x":{name:"translate-x", "class":"transform left row-1", label:"x",type:"number", anim:true},
            "translate-y":{name:"translate-y", "class":"transform right row-1", label:"y",type:"number", anim:true},
            "origin-x":{name:"origin-x", "class":"transform left row-1", label:"origin-x",type:"number", anim:true},
            "origin-y":{name:"origin-y", "class":"transform right row-1", label:"origin-y",type:"number", anim:true},
            "rotate":{name:"rotate", "class":"transform left row-2", label:"Rotate",type:"number", sufix:"°", anim:true},
            "scale-x":{name:"scale-x", "class":"transform right row-2", label:"Scale-x",type:"percent", anim:true},
            "scale-y":{name:"scale-y", "class":"transform right row-3", label:"Scale-y",type:"percent", anim:true},
       // "arrow-end":{name:"arrow-end"},     // (string) arrowhead on the end of the path. The format for string is '<type>[-<width>[-<length>]]'. Possible types: 'classic', 'block', 'open', 'oval', 'diamond', 'none', width: 'wide', 'narrow', 'midium', length: 'long', 'short', 'midium'.
            "arrow-type":{name:"arrow-type", "class":"left row-1", label:"type",type:"select", options:['none','classic', 'block', 'open', 'oval', 'diamond'] },
            "arrow-width":{name:"arrow-width", "class":"left row-2", label:"width",type:"select", options:['midium','wide', 'narrow'] },
            "arrow-length":{name:"arrow-length", "class":"left row-3", label:"length",type:"select", options:['midium','short', 'long'] },
        // "clip-rect",        // (string) comma or space separated values: x, y, width and height
            "clip-x":{name:"clip-x", "class":"left row-1", label:"Clip-x",type:"number"},
            "clip-y":{name:"clip-y", "class":"left row-2", label:"Clip-y",type:"number"},
            "clip-width":{name:"clip-width", "class":"right row-1", label:"Clip-w",type:"number"},
            "clip-height":{name:"clip-height", "class":"right row-2", label:"Clip-h",type:"number"},
        "cursor":{name:"cursor", "class":"left row-1", type:"text"}           // (string) CSS type of the cursor
    },
    groups={
        dimension:["x","y","translate-x","translate-y","cx","cy","height","width","cr","rx","ry"],
        corner:["r"],
        path:["path"],
        image:["src"],
        paper:[],
        "arrow-end":["arrow-type","arrow-width","arrow-length"],
        fillstroke:["opacity","fill","stroke","stroke-width","stroke-dasharray","stroke-linecap","stroke-linejoin"/*,"stroke-miterlimit"*/],
        text:["text-anchor","font-family","font-size","font-weight","text"],
        transform:["origin-x","origin-y","rotate","scale-x","scale-y"],
        clip:["clip-x","clip-y","clip-width","clip-height"],
        anchor:["title","href","target"],
        cursor:["cursor"]
    }
    ;
    
    return new Class({
    
   
    Extends: Panel,
    Implements: [PropMixin],
    options:{
      extraProps:{}  
    },
     /**
     * the scurrently selected element
     */
    selected: [],
    /**
     * function that returns the attributes of the global state
     * @return attrs (obj) Raphael attr object formate {attrName:attrValue,...}
     */
    getAttr:function(a){
        if(a){
            var obj = {};
            Array.from(a).each(function(v){
                obj[v] = this.attrs[v];
            });
            return obj;
        } else{
            return this.attrs;
        }
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
    /**
     * temp value for global state of attribute
     * the global state is the state of the propreties pabnel's attributes when no element is selected
     */
    attrs:{
        "translate":"T0 0R0S1 1",
        "x":0,"y":0,"cx":0,"cy":0,"width":0,"height":0,"rx":0,"ry":0,"cr":0,"r":0,
        "opacity":1,
        "src":"","fill":"none",
        "stroke":"#000",
        "stroke-width":1,
        "stroke-dasharray":"",
        "stroke-linecap":"butt",
        "stroke-linejoin":"bevel",
        "stroke-miterlimit":1,
        "text-anchor":"start",
        "font-family":'Arial, Helvetica, sans-serif',
        "font-size":18,"font-weight":400,"text":"",
        "href":"", "target":"", "title":"","cursor":"default",
        "arrow-end":"none-midium-midium"},
    /**
     * predefine list of props for SVG elements
     */
    elementProps: {
        common:["clip-x","clip-y","clip-width","clip-height","origin-x","origin-y","rotate","scale-x","scale-y","title","opacity","cursor","fill","fill-opacity","stroke","stroke-dasharray","stroke-linecap","stroke-linejoin",/*"stroke-miterlimit",*/"stroke-opacity","stroke-width"],
        circle:["cx","cy","cr","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        rect:["x","y","height","width","r","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        ellipse:["cx","cy","rx","ry","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        text:["x","y","text","text-anchor","font","font-family","font-size","font-weight","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        image:["x","y","width","height","src","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        path:["translate-x","translate-y","path","arrow-type","arrow-width","arrow-length","origin-x","origin-y","rotate","scale-x","scale-y","clip-x","clip-y","clip-width","clip-height", "href", "target", "title"],
        canvas:["x","y","width","height"],
        all:["clip-x","clip-y","clip-width","clip-height","translate-x","translate-y","origin-x","origin-y","rotate","scale-x","scale-y","x","y","cx","cy","width","height","rx","ry","cr","r","opacity","src","fill","stroke","stroke-width","stroke-dasharray","stroke-linecap","stroke-linejoin",/*"stroke-miterlimit",*/"text-anchor","font-family","font-size","font-weight","text", "href", "target", "title","cursor"]
    },
    states:{
        canvas:["dimension","paper"],
        circle:["dimension","fillstroke","transform","clip","anchor","cursor"],
        rect:["dimension","corner","fillstroke","transform","clip","anchor","cursor"],
        ellipse:["dimension","fillstroke","transform","clip","anchor","cursor"],
        text:["dimension","fillstroke","text","transform","clip","anchor","cursor"],
        image:["dimension","fillstroke","image","transform","clip","anchor","cursor"],
        path:["dimension","path","arrow-end","fillstroke","transform","clip","anchor","cursor"]
    },
    /**
     * intitialize Propreties Panel that contains given propreties
     * @param panel (string) the id of the DIV the panel is to be added in
     * @param props (array) and array of the values this panel contains ex: ["fill", "stroke", "stroke-width"]
     * @param options (obj) additional options for the panel aloud
     *                  -extraProps (obj) additional propreties that can be added by a third party,
     *                                    the option needs to follow the same synatax a proprety is defined in the propreties panels
     *                                     i.e nameOfProp:{name:"nameOfProp" type:"typeOfProp" [options:[], min,max,step]}
     */
    initialize: function (options) {
       
        if(options.extraProps) {
            properties.combine(options.extraProps);
        }
        
        this.parent(options ||{});
        
        if(options.empty){return this;}
        
        
        var 
        imgSrc = this.options.imgSrc = (this.options.imgSrc || "img")+"/",
        panel = this.panel.addClass("prop-panel");
        
        this.bind([
            "updateEvent",
            "elementSelect",
            "elementDeselect",
            "elementUpdate",
            "panelUpdate",
            "insertKeyframe"
        ]);
        
        this.slidingLabel = new SlidingLabel({
                                container:panel,
                                onChange:function(val, input){
                                        var attr = {}, name = input.get("name"),fact = input.retrieve("factor"), sel = this.selected;
                                        if(input.getParent().hasClass("transform")){
                                            //TODO handel free transform
                                            return;
                                        }
                                        if(input.getParent().hasClass("clip")){
                                            //TODO set clip
                                            return;
                                        }
                                    
                                        attr[input.get("name")] = val;
                                        //console.log(val);
                                        window.fireEvent("element.update", [attr]);
                                    }.bind(this)
                                });
       this.colorPicker = new ColorPicker({
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
        
        var ps = this.properties={}, gs=this.groups={};//loop generating propreties by groups
        Object.each(groups, function(props, group){
            gs[group] = {};
            var g = new Element("div", {"class":group+" group"});
            new Element("h4", {text:group}).inject(g);
            props.each(function(p){
                var
                prop = properties[p],
                div = this.createInput(prop).inject(g);
                prop.anim && this.div("key-frame").adopt(this.img(imgSrc+"keyframe.gif")).inject(div, "top");
                    
                ps[p]=prop;
                ps[p].prop = div;
            }, this);
            
            new Element("div",{"class":"clear"}).inject(g);
            gs[group].group = g;
            g.inject(panel);
            //console.log();
        }, this);
        
        this.setState("canvas");

       
        
        panel.addEvents({
            "keyup:relay(input,textarea)": this.bound.updateEvent,
            "change:relay(input, select)": this.bound.updateEvent,
            "mousedown:relay(.key-frame img)": this.bound.insertKeyframe
        });
        
        window.addEvents({
            "element.deselect": this.bound.elementDeselect,
            "element.delete": this.bound.elementDeselect,
            "element.select":this.bound.elementSelect,
            "element.update": this.bound.elementUpdate,
            "panel.update": this.bound.panelUpdate,
        });
   },
   /**
    * function that fires element.update event with the input'scurrent value on keyup or change
    * @param eve (obj) event object
    */
   updateEvent: function(eve) {
        var input = eve.target;
        var attr = {}, sel = this.selected,
        val = input.get("value"),
        att = input.get("name"),
        group = input.getParent(".group");
        
        if(group.hasClass("arrow-end")){
            var arr = group.getChildren(".proprety").map(function(c){return c.getLast().get("value");});
            attr["arrow-end"] = arr.join("-");
        } else {
            attr[att] = val;   
        }
        
        
        window.fireEvent("element.update", [attr]);
        
    },
    /**
     * updates the current selected element(s) with the passed attribute
     * @param attr (obj) a Raphael attr object ie {attributName:attributeValue}
     * 
     */
    elementUpdate: function(attr, elm){
        if(elm){
            elm.attr(attr);
        }else{
            this.selected.each(function(el){el.attr(attr);});
            //if(this.selected.length<1){
                window.fireEvent("panel.update", [attr]);
            //}
        }
    },
    panelUpdate: function(attr){
        this.prop(attr);
        if(this.selected.length===0){
            this.setAttr(attr);
        }
    },
    /**
     * selects hides all propreties that don't apply to it,
     * and and update the propreties in the panel with its attributes' value
     * @param el (Raphael obj)
     */
    elementSelect: function (el) {
        this.selected.push(el);
        this.setState(el.type);
        //console.log(el.attr());
        this.prop(el.attr());
    },
    /**
     * deselects an element and updates reset this propreties panel back to the global state
     * @param el (Raphael obj)
     */
    elementDeselect: function (el) {
        var sel = this.selected;
            this.setState("canvas");
        if(el){
            sel.splice(sel.indexOf(el),1);
        } else {
            sel.each(function(el){this.elementDeselect(el);},this);
        }
    },
    prop:function(prop,val){
        if(typeOf(prop)==="null"){ //return all propreties in name value object
           return this.prop(this.elementProps.all);
        } else if(typeOf(prop)==="array"){//return all propreties in the array in name value object
            var ps = {};
            prop.each(function(p){
                ps[p] = this.prop(p);
            },this);
            return ps;
        } else if(typeOf(prop)==="object"){//set proprety with corrisponding value
            Object.each(prop,function(v,p){
                this.prop(p,v);
            },this);
        } else if(typeOf(prop)==="string"){
            if(prop==="transform"){
                this.prop(groups[prop]);
            }
            //since so as circle r is not confused with rect r
            if(this.state==="circle"){prop = prop==="r"?"cr":prop;}
            
            var p = this.properties[prop];
            if(!p){ return;}
            
            
            //console.log(prop,p, val);
            p = p.prop;
            if(val){ //set prop to val
                if(p.hasClass("number")){
                    p.getLast().getPrevious().set("value", val);
                    return;
                }
                if(p.hasClass("color")){
                    this.colorPicker.setColor(p.getLast().retrieve("vec"), val);
                    return;
                }
                
                p.getLast().set("value", val);
            } else { //get prop value
                if(p.hasClass("number")){
                    return p.getLast().getPrevious().get("value");
                }
                if(p.hasClass("color")){
                    return p.getLast().retrieve("vec").attr("fill");
                }
                return p.getLast().get("value");
            }
        }
    },
    /**
     * clear the propreties pael's input and resets them to nothing
     */
    clearPropreties: function(){
        var props = this.propreties;
        for(var prop in props){
            if(props.hasOwnProperty(prop)) {
                props[prop].set("value", "");
            }
        }
    },
    /**
     * method that extracts property and inserts keyframe into timeline when keyframe image is clicked 
     */
    insertKeyframe:function (eve){
        var attr = eve.target.getParent().getNext("label").get("for");
        this.selected.each(function(el){
            window.fireEvent("keyframe.insert", {el:el, prop:attr, value:this.prop(attr), jump:eve.alt});
        },this);
    }
});

})();
