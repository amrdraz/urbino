/**
 * This is a mixin class for the propreties panel and any class that need is methods
 * @author Draz
 * 
 * 
 */
/*global Class,Element,typeOf,Raphael*/

var PropMixin = new Class({
    div : function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    },
    img : function(src,c,s){
        s = s || {};
        return new Element("img",{src:src,"class":c}).set(s);
    },
    vec : function(set,els){
        els = els || {};
        var d = new Element("div",set),
        raph = [d,"100%","100%"].combine(els);

        d.store("vec",Raphael(raph)[raph.length-1]);
        return d;
    },
    /**
     * creates a select element for a proprety of type text
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing select element with its options
     */
    textInput: function (p) {
        var div = new Element("div"),
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
        var div = new Element("div"),
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"})
                .setStyles({'position':'relative', 'clear':'right'}),
            textarea = new Element("textarea", {
                name:p.name
                }).setStyles({'float':'right',"max-width":"200px","max-height":"95px"});
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
    createInput: function  (p, free) {
        var div;
        switch(p.type){
            case "number":
                div = this.slidingLabel.initLabel(p.name,{label:p.label,
                        value:p.value,min:p.min, step:p.step, max:p.max,sufix:p.sufix||"px"
                    });
                break;
            case "percent":
                div = this.slidingLabel.initLabel(p.name,{label:p.label,
                    value:100,factor:100,sufix:"%", min:0, step:1, max:p.max||""
                    });
                break;
            case "select":
                div = this.selectInput(p);
                break;
            case "color":
                div = this.colorPicker.initFill(p.name,{
                        stroke:(p.name==="stroke"),
                        initColor:p.value,
                        label:p.label,
                        x:p.x,
                        y:p.y,
                        width:p.width||50
                    } );
                break;
            case "textarea":
                div = this.textarea(p);
                break;
            default:  div = this.textInput(p); break;
        }
        if(free){return div;}
        return div.addClass(p["class"]+" "+p.name+" proprety "+p.type);
    },
   setState:function(s){
        var props = this.properties,
            elP = this.elementProps,
            states = this.states,
            gs = this.groups;
      // console.log(s,states[s],gs);
       Object.each(gs, function(g){
           g.group.addClass("hide");
       });
       Object.each(states[s], function(g){
           //console.log(gs, g, gs[g]);
           gs[g].group.removeClass("hide");
       });
       
       Object.each(props, function(p){
           p.prop.addClass("hide");
       });
       
       Object.each(props, function(p, key){
           if(~elP.common.indexOf(key) || ~elP[s].indexOf(key)){
               p.prop.removeClass("hide");
           }
       });
       this.state = s;
   }
});
