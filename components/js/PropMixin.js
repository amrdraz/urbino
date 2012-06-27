/**
 * This is a mixin class for the propreties panel and any class that need is methods
 * @author Draz
 * 
 * 
 */
/*global Class,Element,typeOf,Raphael*/

var PropMixin = new Class({
    
    icon :{
        "?": "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z",
        i: "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M14.757,8h2.42v2.574h-2.42V8z M18.762,23.622H16.1c-1.034,0-1.475-0.44-1.475-1.496v-6.865c0-0.33-0.176-0.484-0.484-0.484h-0.88V12.4h2.662c1.035,0,1.474,0.462,1.474,1.496v6.887c0,0.309,0.176,0.484,0.484,0.484h0.88V23.622z",
        pen: "M13.587,12.074c-0.049-0.074-0.11-0.147-0.188-0.202c-0.333-0.243-0.803-0.169-1.047,0.166c-0.244,0.336-0.167,0.805,0.167,1.048c0.303,0.22,0.708,0.167,0.966-0.091l-7.086,9.768l-2.203,7.997l6.917-4.577L26.865,4.468l-4.716-3.42l-1.52,2.096c-0.087-0.349-0.281-0.676-0.596-0.907c-0.73-0.529-1.751-0.369-2.28,0.363C14.721,6.782,16.402,7.896,13.587,12.074zM10.118,25.148L6.56,27.503l1.133-4.117L10.118,25.148zM14.309,11.861c2.183-3.225,1.975-4.099,3.843-6.962c0.309,0.212,0.664,0.287,1.012,0.269L14.309,11.861z",
        picture: "M2.5,4.833v22.334h27V4.833H2.5zM25.25,25.25H6.75V6.75h18.5V25.25zM11.25,14c1.426,0,2.583-1.157,2.583-2.583c0-1.427-1.157-2.583-2.583-2.583c-1.427,0-2.583,1.157-2.583,2.583C8.667,12.843,9.823,14,11.25,14zM24.251,16.25l-4.917-4.917l-6.917,6.917L10.5,16.333l-2.752,2.752v5.165h16.503V16.25z",
           
    },
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
        var div = this.div("",{}),
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"}),
            input = new Element("input", {
                type:"text",
                name:p.name,
                styles:{width:p.width||""}
                });
       return div.adopt(label, input);
    },
    /**
     * creates a select element for a proprety of type textarea
     * @param p (obj) a proprety object that follows the propreties object syntax
     * @return (DIV) containing textarea element
     */
    textarea: function (p) {
        var div = this.div(),
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
     * Creates 9 boxes representing the offset the element should take into account
     * when calculating its position 
     */
    offsetPicker: function(p){
        var d = this.div('offset-picker', {styles:{
                width:34,height:34,
                position:'absolute',
                top:p.y,
                left:p.x
            },
            }),
        input = new Element("input", {type:"hidden"}),
        color = "#48e",
        func = function(){
            this.parent.attr("fill-opacity", 0);
            this.attr("fill-opacity", 1);
            input.set("value", this.i);
        },
        set = function(i){
            this.attr("fill-opacity", 0);
            this[i].attr("fill-opacity", 1);
            input.set("value", this[i].i);
        },
        r = Raphael(d, "100%", "100%"),
        i,j, s = r.set();
        for(i=0;i<9;i+=3){
         for(j=0;j<3;j++){
            rec = r.rect(j*11,i/3*11,8,8).attr({"fill":color,"stroke":color,"fill-opacity":0});
            rec.i = i+j;
            rec.parent = s;
            rec.mousedown(func);
            s.push(rec);
         }   
        }
        s.transform("T 1 1").set = set;
        d.store("set", s);
        return d.grab(input);
    },
    iconButton: function(p){
        
        var div = this.div(),
            wh = p.wh|| 20,
            color = p.color || "#eee",
            label = new Element("label", {"for":p.name, "text":(p.label||p.name)+":"}),
            input = this.vec({
                "class":"icon",
                        styles:{
                        width:wh,
                        height:wh
                        }
                    }, [{
                        type:"path",
                        path:(p.icon?this.icon[p.icon]:p.path||this.icon["?"]),
                        fill:color,
                        transform:[["S",.5],["T",-5,-6]]
                    }]).addClass(p.name);
            div.store("vec", input.retrieve("vec"));
            div.setTitle = function(t){
                input.set("title", t);
            },
            div.getTitle = function(t){
                input.get("title");
            }
       return div.adopt(label, input);
      
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
                    value:p.value||100,factor:100,sufix:"%", min:typeOf(p.min)==="null"?"":p.min, step:1, max:typeOf(p.max)==="null"?"":p.max
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
                        lebelRight:p.lebelRight || '',
                        colorRight:p.colorRight,
                        x:p.x,
                        y:p.y,
                        width:p.width||50,
                        wh:p.wh
                    } );
                break;
            case "icon":
                div = this.iconButton(p);
                break;
            case "textarea":
                div = this.textarea(p);
                break;
            case 'app':
                switch (p.name){
                    case 'offset': div = this.offsetPicker(p); break;
                }
                break;
            default:  div = this.textInput(p); break;
        }
        if(free){return div;}
        return div.addClass((p["class"]||"")+" "+p.name+" proprety "+p.type);
    }
});
