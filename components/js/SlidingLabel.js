/**
 * a label that you can drag/slide the mous over to change the associated input value
 * @author Amr Draz
 */
/*globale window,console,$,$$,Options,Events,Class,Element,typeOf,Browser,instanceOf*/

var SlidingLabel = (function (){
    
    var
    cursor="url(slider-cursor.svg),url(slider-cursor.gif),w-resize",
    
    /**
     * prevents anything other then number
     * adapted from http://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
     * @param e (event)
     */
    isNumber= function(e){
        if ((!(/backspace|delete|up|left|right|down|[0-9]|.|½/).test(e.key) || (e.key==='a' && e.control))){
            e.stop();
        } 
    },
    /**
     * chackes that input does not exceed max or min
     */
    inRange= function (e) {
        var 
        input = e.target,
        val = input.get("value");
        if (val === "") {return;}
        
        val = val.toInt();
        input.set("value", "").set("value",val);
        var max = ( input.get("max")!==null )? input.get("max").toInt() : Number.MAX_VALUE,
            min = ( input.get("min")!==null )? input.get("min").toInt() : (1 - Number.MAX_VALUE);
        
        if(val > max) { input.set("value" , max);}
        if(val < min) { input.set("value" , min);}
    }
    ;
    
    return new Class({
    
    Implements:[Options,Events],
    
    options:{
        //onChange:$empty,
    },
    
    /**
     * initializes label
     * @param container    (string) container id
     * @param label     (array) of either string or object represetning labels
     */
    initialize : function(options) {
        options = options || {};
        this.setOptions(options);
        var cont = this.container = $$(options.container||"body")[0];
        
        //plug into already present labels
        cont.getElements("input.sliding-input").each(function(input){
            if(input.get("value")===""){
                input.set("value",0);
            }
            input.set({"type": "number", readonly:"readonly"});
            input.addClass("sliding-label is-sliding");
        });
        //create one label
        if(this.options.label){
            var label  = this.options.label;
            this.initlabel(label.name,label.options).injec(this.container);
        }
        //create multiple
        if (this.options.labels) {
            var div,array, labels = this.options.labels;
            Array.from(labels).each(function (label) {
                var div;
                if(instanceOf(label, String)) {
                    div = this.initLabel(label);
                } else {
                    div = this.initLabel(label.label, label);
                }
                div.inject(this.container);
            }, this);
        }
        
        
        //bind events
        this.bound = {};
            [   "startSlide",
                "startWrite",
                "endWrite"
            ].each(function(name){
                this.bound[name] = this[name].bind(this);
            }, this);
         
        this.container.addEvents({
            "mousedown:relay(label.sliding-label)": this.bound.startSlide,
            "mousedown:relay(input.sliding-label)": this.bound.startSlide,
            "dblclick:relay(input.sliding-input)":this.bound.startWrite,
            "keydown:relay(input.sliding-input)": this.bound.endWrite,
            "keydown:relay(input.sliding-input)": isNumber,
            "keyup:relay(input.sliding-input)": inRange,
            "blur:relay(input.sliding-input)": this.bound.endWrite,
            "change:relay(input.sliding-input)": this.bound.endWrit
        });
    },
    startWrite:function(e){
        e.stop();
        var input = e.target;
        //console.log(input);

        input.erase("readonly");
        input.removeClass("sliding-label");
        input.removeClass("is-sliding");
    },
    endWrite:function(e){
        e.stop();
        var input = e.target,
        val = input.get("value");
        
        if (input.hasClass("sliding-label")){ return;}
        if (val === "") {input.set("value",input.get("min")||0);}
        this.fireEvent("finish", [val/input.retrieve('factor'),input,e]);
        input.set("readonly","readonly");
        input.addClass("sliding-label");
        input.addClass("is-sliding");
    },
    /**
     * mothod for constructing label and it's associated input
     * @param name      (string) label name
     * @param options   (object) configuration for the label input
     * @return div      (Element)
     */
    initLabel:function(name, options){

        //console.log("init sliding label");
        var
        o = options || {};
        
        var
        div = new Element("div", o.container).addClass("sliding-label"),
        label = new Element("label",{
            "class":"sliding-label is-sliding",
            text:(o.label||name)+":",
            "for":name
            }).inject(div),
        input = new Element("input",{
            "class":"sliding-input sliding-label is-sliding",
            "type":Browser.ie?"text":"number",
            "value": typeOf(o.value)!=="null"?o.value:typeOf(o.min)!=="null"?o.min:o.max||0,
            "name":name,
            "step":o.step || "",
            "max":o.max || "",
            "min":typeOf(o.min)==="null"?"":o.min,
            readonly:"readonly"
            }).set(o.input).store("sufix",o.sufix||"").store("factor",o.factor||1).inject(div);
        
        if(o.sufix){
            new Element("span",{
                "class":"sufix",
                "text":o.sufix
            }).inject(div);
        }
        //console.log(o,o.min,o.min===0,$(input));

        return div;
    },
    /**
     * method that starts the slide action
     * @param eve (Event) for passing the start position
     */
    startSlide: function (e) {
        var
        slidingLabel = this,
        tag = e.target.nodeName.toLowerCase(),
        startPoint = e.page.x,
        input = tag==="label"?e.target.getNext("input[name="+e.target.get("for")+"]"):e.target,
        val = input.get("value"),
        factor = input.retrieve("factor")||1,
        startValue = +val,
        step = input.get("step") || 1,
        max = ( input.get("max")!==null )?input.get("max").toInt():Number.MAX_VALUE,
        min = ( input.get("min")!==null )?input.get("min").toInt():(1-Number.MAX_VALUE),
        /**
         * updates the input value
         * @param eve (Event) for passing the mouse x position
         */
        slide= function (e) {
            val = startValue + step*(e.page.x - startPoint);
            if (val>max) { val = max; }
            if (val<min) { val = min; }
            input.set("value", val);
            slidingLabel.fireEvent("change", [val/factor,input,e]);
         },
        /**
         * method that stops the slide action
         */
        stopSlide= function (e) {
            // Returns the cursor to the default pointer
            document.body.style.cursor = "default";
            // needed to stop text selection in chrome from http://stackoverflow.com/questions/6388284/click-and-drag-cursor-in-chrome
            document.onselectstart = function() {return true;};
    
            window.removeEvent("mousemove", slide);
            window.removeEvent("mouseup", stopSlide);
            $$("label:not(.sliding-label),input:not(.sliding-label),form,button,textarea,select").removeClass("is-sliding");
            
            this.fireEvent("finish", [val/factor,input,e]);
        }.bind(this);
        this.fireEvent("start",[startValue/factor,input,e]);
        //body set class so that the cursor doesn't change
        document.body.style.cursor = this.cursor;
        // needed to stop text selection in chrome from http://stackoverflow.com/questions/6388284/click-and-drag-cursor-in-chrome
        document.onselectstart = function() {return false;};
        
        $$("input,form,button,textarea,select").addClass("is-sliding");
        
        window.addEvent("mousemove", slide);
        window.addEvent("mouseup", stopSlide);

    }
    
});
})();