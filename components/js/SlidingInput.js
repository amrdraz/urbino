/**
 * a label that you can drag/slide the mous over to change the numeric value it represents
 * @author Amr Draz
 */
/*globale window,console,$,$$,Options,Events,Class,Element,typeOf,Browser,instanceOf*/

var SlidingInput = (function (){
    
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
        
        var cont = this.cont = $$(this.options.container||"body")[0];
        
        var input = cont.retrieve("slidingInput");
        
        if(input){return input;}
        
        input = this.input = new Element("input",{
            "class":"sliding-input is-sliding",
                outline: "none",
                styles:{
                    position:"absolute",
                    width:40,
                    height:15,
                    border:"#48e",
                    "line-height": 1,
                    "font-size": 9,
                    display:"none"
                },
                events:{
                    keyup:inRange,
                    keydown:isNumber,
                    change:isEmpty
                }
        }).inject(cont);
        
        this.sufix = {};
         
        cont.addEvents({
            "mousedown:relay(label.sliding-label)": this.startSlide.bind(this)
        });
    },
    /**
     * mothos for constructing label and it's associated input
     * @param name      (string) label name
     * @param options   (object) configuration for the label input
     * @return div      (Element)
     */
    initInput:function(name, options){
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