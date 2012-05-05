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
     * sets the input value to 0 if empty
     */
    isEmpty= function (e) {
        var
        input = e.target,
        val = input.get("value");
        if (val === "") {input.set("value",0);}  
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
        this.container = $(this.options.container);
        
        this.container.getElements("label.sliding-label").addClass("is-sliding");
        this.container.getElements("input.sliding-input").set("type", "number");
    
        $$("input.sliding-input").each(function(input){
            if(input.get("value")===""){
                input.set("value",0);
            }
        });
         
        this.container.addEvents({
            "mousedown:relay(label.sliding-label)": this.startSlide.bind(this),
            "keydown:relay(input.sliding-input)": isNumber,
            "keyup:relay(input.sliding-input)": inRange,
            "change:relay(input.sliding-input)": isEmpty
        });
        
        if(this.options.label){
            var label  = this.options.label;
            this.initlabel(label.name,label.options).injec(this.container);
        }
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
        
        
    },
    setOnChange:function (func){
        this.options.onChange = func;
    },
    /**
     * mothos for constructing label and it's associated input
     * @param name      (string) label name
     * @param options   (object) configuration for the label input
     * @return div      (Element)
     */
    initLabel:function(name, options){
        var
        o = options || {},
        div = new Element("div", o.container),
        input = new Element("input",{
            "type":"number",
            "value": o.value || o.min || o.max || 0,
            "name":name,
            "step":o.step || "",
            "max":o.max || "",
            "min":o.min || ""
            }).set(o.input)
            .addClass("sliding-input"),
        label = new Element("label",{
            text:name+":",
            "for":name
            }).set(o.label)
            .addClass("sliding-label is-sliding");
        return div.adopt(label,input);
    },
    /**
     * method that starts the slide action
     * @param eve (Event) for passing the start position
     */
    startSlide: function (e) {
        
        var
        slidingLabel = this,
        label = e.target,
        startPoint = e.page.x,
        input = label.getNext("input[name="+label.get("for")+"]"),
        val = input.get("value").toInt(),
        startValue = val,
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
            slidingLabel.fireEvent("onChange", [val,label,e]);
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
            $$("input,form,button,textarea,select").removeClass("is-sliding");
            this.fireEvent("onEnd", [val,label,e]);
        };
        
        this.fireEvent("onStart",[startValue,label,e]);
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