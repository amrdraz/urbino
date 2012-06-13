/**
 * This is a mixin class for the propreties panel and any class that need is methods
 * @author Draz
 * 
 * 
 */
/*global Class,Element,typeOf,Raphael*/

var ElementsMixin = new Class({

    div : function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    },
    img : function(src,c,s){
        s = s || {};
        return new Element("img",{src:src,"class":c}).set(s);
    },
    /**
     * this method constructs an svg vector based on wrapped in a div tag
     * @param c (sting) class of div
     * @param icon (mix) string or array for path
     * @param trans (string) transformation string to be applied to the path
     * @param evens (obj) object containing event and function to fire on event ex: {mousedown: function () {}}
     * @param title (string) title atribute for the div element shows on hover
     * 
     * @return div (html element) div element containing icon
     */
    vect : function(c,icon,trans,evens,title){
         //move up arrow
         var d = this.div("vect "+c, {"title":title||""}), r = Raphael(d,"100%","100%"),
            vec = r.path(icon)
                    .attr(this.options.buttonAttr)
                    .transform(trans||"")
                    .hover(function (){
                        this.attr("stroke","#48e");
                    }, function (){
                        this.attr("stroke","none");
                    });
            d.addEvents(evens||{});
            d.store("vec",vec);
        return d;
    },
    /**
     * This method handels the hide event, which occurs when a mousedown is on the element or group's eye icon
     * @param {Object} e mousdown event object, e.target is the eye img of the element
     */
    hideToggle : function (e){
        e.stop();

       var el = this.els[e.target.getParent(".element").get("for")], hide = el.element.hasClass("hidden");
       el.element.toggleClass("hidden");
       el.el[hide?"show":"hide"]();
       
    },
    /**
     * This method handels the expanding a group, which occurs when a mousedown is on the group's arrow icon
     * @param {Object} e mousdown event object, e.target is the arrow img of the element
     */
   expandToggle : function (e){
        e.stop();
        var target = e.target,
        elm = this.els[target.getParent(".element").get("for")];
        if(elm.element.hasClass("expanded")){
            elm.element.removeClass("expanded");
        } else {
            elm.element.addClass("expanded");
        }
    },
    /*-----------------------handeling what text filed should do ----------------------*/
    /**
     * This method is triggered when an element id is double clicked,
     * it enables changing the elements name by showing the text filed and prepairing the values
     * @param {object} e event object
     */
    changeName : function(e){
        e.preventDefault();
        
        var sel = e.target,
        size = sel.getSize(),
        pos = sel.getPosition(this.panel),
        textField = this.textField;
        
        //this.clearSelection();
        
        textField.setStyles({
                "top":pos.y-1,
                "left":pos.x,
                "width":100,
                "height":size.y-2,
                "display":"block"
            });
        textField.id = sel.get("text");
        textField.set({"value":textField.id});
        textField.focus();
        window.fireEvent("hotkeys.set", [false]);
    },
    /*
     * this method is called when the user presses enter or clicks outside of the text field editing the element's id
     * it sets the element to the new id and updates the editor
     */
    hideTextField : function (){
       var textField = this.textField,id = textField.id, val = textField.get("value"), els = this.els;
       
        if(val!=="" && !els[val]) {
            els[id].element.getElement(".name").set("text", val);
            els[id].element.set("for", val);
            els[id].el.setId(val);
            els[val] = els[id];
            delete els[id];
            //rowDeselect(id);
            this.elementSelect(val);
        }
        textField.set({"value":"", styles:{"display":"none"}});
        window.fireEvent("hotkeys.set", [true]);
    },
     /*----------------------- row operations ----------------------*/
   /**
     * creates a new row based on a Raphael Element and asigns it an id
     * @param el (Raphael Obj) the element for this row
     * @return (div) the div representing the row
     */
     elementCreate : function(el){
        el.setId((typeOf(el.id)==="number")?el.type+el.id:el.id), div = this.div, img = this.img;
        var color = el.color|| "#888", imgSrc = this.options.imgSrc,
        element = div("element", {"for":el.id}).adopt(
            div("color", {styles:{
                    position:"absolute",
                    "background-color": color,
                    width:"10px",
                    height:"100%"
                }
            }),
            div("header").adopt(
                img(imgSrc+"eye.gif","eye"),
                img(imgSrc+"light-arrow.gif","arrow"),
                new Element("label", {"text":el.id, "class":"name"})
            )
        )
        ;
              
        return {color:color,el:el, element:element};
    },
    /**
     * inserts a new element into the elements panel
     * @param el (Raphael Obj) the element for this row
     */
    elementInsert : function(el){
        var obj = this.elementCreate(el);
        this.els[el.id] = obj;
        obj.element.inject(this.elements,"top");
    },
    /**
     * selects the elemnets obj by it's id
     * @param id (string) the row id in the elements panel
     */
    elementDeselect : function (id){
        var sel = this.selected;
        if(id) {
            if(typeOf(id)=="string" && sel[id]) {
                sel[id].element.removeClass("selected");
                delete sel[id];
            }
        } else {
            Object.each(sel, function(elm,key){
                this.elementDeselect(key);
            }, this);
        }
    },
    /**
     * selects the elemnets obj by it's id
     * @param id (string) the element id in the elements panel
     */
    elementSelect : function (id){
        var els = this.els, sel = this.selected;
        if(id && els[id] && !sel[id]){
            sel[id] = els[id];
            sel[id].element.addClass("selected");
        }
    },
    /**
     * selects the elemnets obj by it's element
     * @param el (Raphael Obj) the element to select
     */
    elSelect : function (el){
        if(el && typeOf(el)!=="null"){
            this.elementSelect(el.id);
        }
    },
    /**
     * deselect the elemnets obj by it's element
     * @param el (Raphael Obj) the element to deselect
     */
    elDeselect : function (el){
        if(el && typeOf(el)!=="null"){
            this.elementDeselect(el.id);
        } else {
            this.elementDeselect();
        }
    },
    /**
     * event handler for element selection allows for multiple selection if ctrl is pressed
     * @param e (event)
     */
    elementClick : function (e) {
        e.stopPropagation();
        //don't select if eye is clicked
        if(e.target.hasClass("eye")){return;}
        
        var t = e.target, el = this.els[((t.hasClass("element"))?t:t.getParent(".element")).get("for")].el;
        /*
        if(e.control){
            if(selected[el.id]){
                window.fireEvent("element.deselect", [el]);
            } else {
                window.fireEvent("element.select", [el]);
            }
        } else { */
            window.fireEvent("element.deselect");
            window.fireEvent("element.select", [el]);
        //}
        //console.log(selected);
    },
    /**
     * event handler deletes the element(s) from the elements panel
     * @param el (Raphael Obj) the element to delete
     */
    elementDelete : function (el){
        var els = this.els, sel = this.selected;
        if(el){
            if(typeOf(el)==="array"){ //array of elements
                el.each(function(elm){
                    this.elementDelete(elm);
                }, this);
            } else {
                var id = el.id;
                if(sel[id]){
                   this.elDeselect(el);
                }
                els[id].element.destroy();
                delete els[id];
            }
        } else {
            Object.each(sel, function(elm,key){
                this.elementDelete(elm.el);
            }, this);
        }
    },
    /**
     * checks if user clicked on an element
     */
    notElement : function (e) {
        var el = e.target;
        if(!el.getParent(".vect")===null &&  el.getParent(".element")===null && !el.hasClass("element")) {
            window.fireEvent("element.deselect");
        }
    },
});
