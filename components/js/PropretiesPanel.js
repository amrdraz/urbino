
/**
 * PropretiesPanel
 * constructor of the editors propreties panel
 * @dependancy SlidingLabel
 * @author Amr Draz
 *  
 */
/*global Rapahel,$,$$,Class,Events,Options,Element,typeOf,SlidingLabel,window*/
var PropretiesPanel = (function(){
    
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
    propreties = {    /* documentation taken from Rapahel-src.html */
        x: {name:"x", type:"number"},                // (number)
        y: {name:"y", type:"number"},                   // (number)
        cx: {name:"cx", type:"number"},            // (number)
        cy: {name:"cy", type:"number"},           // (number)
        width: {name:"width", type:"number"},                // (number)
        height: {name:"height", type:"number"},                // (number)
        r: {name:"r", type:"number"},               // (number)
        rx: {name:"rx", type:"number"},                // (number)
        ry: {name:"ry", type:"number"},                // (number)
        text: {name:"text", type:"textarea"},               // (string) contents of the text element. Use '\n' for multiline text
        "text-anchor":{name:"text-anchor", type:"select", options:["start","middle","end"]},        // (string) ["start", "middle", "end"], default is "middle"
        "opacity":{name:"opacity", type:"percent"},            // (number)
        "fill":{name:"fill", type:"text"},                // (string) colour, gradient or image
        "fill-opacity":{name:"fill-opacity", type:"percent"},        // (number)
        "stroke":{name:"stroke", type:"text"},            // (string) stroke colour
        "stroke-dasharray":{name:"stroke-dasharray", type:"select", options:["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]},    // (string) [“”, "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
        "stroke-linecap":{name:"stroke-linecap", type:"select", options:["butt", "square", "round"]},    // (string) ["butt", "square", "round"]
        "stroke-linejoin":{name:"stroke-linejoin", type:"select", options:["bevel", "round", "miter"]},  // (string) ["bevel", "round", "miter"]
        //TODO "stroke-miterlimit",// (number)
        "stroke-opacity":{name:"stroke-opacity", type:"percent"},    // (number)
        "stroke-width":{name:"stroke-width", type:"number", min:"1"},       // (number) stroke width in pixels, default is '1'
        path:{name:"path", type:"text"},                // (string) SVG path string format
        src:{name:"src", type:"text"},                // (string) image URL, only works for @Element.image element
        font:{name:"font", type:"text"},                // (string)
        "font-family":{label:"font",name:"font-family", type:"select", options:fonts},        // (string)
        "font-size":{name:"font-size", type:"number", min:0},        // (number) font size in pixels
        "font-weight":{name:"font-weight", type:"number"},        // (string)
        "href":{name:"href", type:"text"},              // (string) URL, if specified element behaves as hyperlink
        "target":{name:"target", type:"text"},            // (string) used with href
        "title":{name:"title", type:"text"},            // (string) will create tooltip with a given text
        //TODO "transform" (string) see @Element.transform
        "arrow-end":{name:"arrow-end",  type:"select", options:['classic', 'block', 'open', 'oval', 'diamond', 'none'] },     // (string) arrowhead on the end of the path. The format for string is '<type>[-<width>[-<length>]]'. Possible types: 'classic', 'block', 'open', 'oval', 'diamond', 'none', width: 'wide', 'narrow', 'midium', length: 'long', 'short', 'midium'.
        //TODO "clip-rect",        // (string) comma or space separated values: x, y, width and height
        "cursor":{name:"cursor", type:"text"}           // (string) CSS type of the cursor
        }
    ;
    
    return new Class({
    
    Implements: [Events, Options],
    options:{
      extraProps:{}  
    },
    /**
     * temp value for global state of attribute
     * the global state is the state of the propreties pabnel's attributes when no element is selected
     */
    attrs:{},
    /**
     * predefine list of props for SVG elements
     */
    elementProps: {
        common:["title","opacity","cursor","fill","fill-opacity","stroke","stroke-dasharray","stroke-linecap","stroke-linejoin",/*"stroke-miterlimit",*/"stroke-opacity","stroke-width"],
        circle:["cx","cy","r"],
        rect:["x","y","height","width","r","rx","ry"],
        ellipse:["cx","cy","rx","ry"],
        text:["x","y","text","text-anchor","font","font-family","font-size","font-weight"],
        image:["x","y","width","height","src"],
        path:["path","arrow-end"],
        canvas:["width","height"],
        all:["x","y","cx","cy","width","height","rx","ry","r","src","text","text-anchor","font-family","font-size","font-weight","title","opacity","cursor","fill","fill-opacity","stroke","stroke-dasharray","stroke-linecap","stroke-linejoin",/*"stroke-miterlimit",*/"stroke-opacity","stroke-width"]
    },
    
    /**
     * creates a select element for a proprety of type text
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing select element with its options
     */
    textInput: function (p) {
        var div = new Element("div", {"class":p.name+" proprety "+p.type}),
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"}),
            input = new Element("input", {
                type:"text",
                name:p.name
                });
       return div.adopt(label, input);
    },
    /**
     * creates a select element for a proprety of type textarea
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing textarea element
     */
    textarea: function (p) {
        var div = new Element("div", {"class":p.name+" proprety "+p.type}),
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"})
                .setStyles({'position':'relative', 'clear':'right'}),
            textarea = new Element("textarea", {
                name:p.name
                }).setStyles({'float':'right',"max-width":"200px"});
       return div.adopt(label, textarea);
    },
    /**
     * creates a select element for a proprety of type select
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing select element with its options
     */
    selectInput: function (p) {
        var div = new Element("div", {"class":p.name+" proprety "+p.type}),
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"}),
            select = new Element("select", {"name":p.name }),
            option;
            if(typeOf(p.options)==="array"){
                p.options.each(function(option,i){
                    (new Element("option", {value:option, text:option})).inject(select);
                });
            } else {
                Object.each(p.options,function(val,text){
                    (new Element("option", {value:val, text:text})).inject(select);
                });
            }
       return div.adopt(label, select);
    },
    /**
     * creates an element for a proprety of type the specified type
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing either
     *              -input of type number with a sliding label
     *              -input of type number with a sliding label with min:0 max:1 and setp:0.01
     *              -element of type select with it's options
     *              -element of type textarea
     *              -input of type text
     */
    createInput: function  (p) {
        var div;
        switch(p.type){
            case "number":
                div = this.slidingLabel.initLabel(p.name,{
                        min:p.min, step:p.step, max:p.max,
                        container:{
                            "class":p.name+" proprety "+p.type
                        }
                    });
                break;
            case "percent":
                div = this.slidingLabel.initLabel(p.name,{
                    min:0, step:0.01, max:1,
                    container:{
                        "class":p.name+" proprety "+p.type
                        }
                    });
                break;
            case "select":
                div = this.selectInput(p);
                break;
            case "textarea":
                div = this.textarea(p);
                break;
            default:  div = this.textInput(p); break;
        }
        return div;
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
        options = options ||{};
        if(options.extraProps) {
            propreties.combine(options.extraProps);
        }
        var panel = this.panel = new Element("form", {"class":"prop-panel"}),
        props = options.props || this.elementProps.all;
        this.slidingLabel = new SlidingLabel({
                                    container:panel
                                });
        
        var obj = {};//loop generating propreties
        for (var i = 0, ii = props.length; i <ii;i+=1) {
            var p = propreties[props[i]];
            var div = this.createInput(p);
            obj[p.name] = div.getLast();
            props[i] = div;
        }
        
        $(panel).adopt(props);
        this.propreties = obj;
        $(panel).addEvents({
            "keyup:relay(input,textarea)": this.updateEvent.bind(this),
            "change:relay(input, select)": this.updateEvent.bind(this)
        });
        
        window.addEvent("element.select", this.elementSelect.bind(this));
        window.addEvent("element.deselect", this.elementDeselect.bind(this));
        window.addEvent("element.update", this.elementUpdate.bind(this));
        
   },
   /**
    * function that fires element.update event with the input'scurrent value on keyup or change
    * @param eve (obj) event object
    */
   updateEvent: function(eve) {
        var input = eve.target;
        var attr = {},
        val = input.get("value"),
        att = input.get("name");
        attr[att] = (val==="")?"none":val;
        
        if(this.selected){
            window.fireEvent("element.update", [attr]);
        } else {
            toolpanel.setAttr(attr);
        }
    },
    /**
     * if an element is selected updates the current selected element with the passed attribute
     * @param attr (obj) a Raphael attr object ie {attributName:attributeValue}
     * 
     */
    elementUpdate: function(attr){
        var el = this.selected;
        if(this.selected){el.attr(attr);}
    },
    /**
     * selects hides all propreties that don't apply to it,
     * and and update the propreties in the panel with its attributes' value
     * @param el (Raphael obj)
     */
    elementSelect: function (el) {
        this.selected = el;
        this.hideAll();
        this.showByType(el.type);
        this.setPropreties(el.attr());
    },
    /**
     * deselects an element and updates reset this propreties panel back to the global state
     * @param el (Raphael obj)
     */
    elementDeselect: function (el) {
        
        this.selected = null;
        this.setPropreties(this.attrs);
    },
    /**
     * sets the propreties panel's inputs to the passed attrs
     * @param attrs (obj) a Raphael attr object i.e. formate {attributName:attributeValue}
     */
    setPropreties: function(attrs){
        
        //this.clearPropreties();
        var props = this.propreties;
        
       //console.log(attrs);
       Object.map(props, function(prop, index){
           return prop.set("value", attrs[index]);
       }, this);
       //console.log(props);
       
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
     * hides all propreties in the propreties panel
     */
    hideAll: function() {
        this.panel.getChildren().removeClass("active");
    },
    /**
     * shows all propreties in the propreties panel
     */
    showAll: function(){
        this.panel.getChildern().addClass("active");
    },
    /**
     * shows only the propreties that corrispond to the passed element type
     * @param type (string) type of a Raphael element can be ["circle", "rect", "ellipse", "path", "text", "image"]
     */
    showByType: function(type) {
        var props = this.propreties,
            elP = this.elementProps;
        Object.each(props, function(item, key){
            if(~elP.common.indexOf(key) || ~elP[type].indexOf(key)){
                item.getParent().addClass("active");
            }
        }, this);
    }
    
});

})();
