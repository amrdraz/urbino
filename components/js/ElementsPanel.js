/**
 * this class is respnsible for the Editors Elements view
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Panel,Options,Element,typeOf,window,Raphael*/

var ElementsPanel = (function() {
    
    var
    div = function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    },
    img = function(src,c,s){
        s = s || {};
        return new Element("img",{src:src,"class":c}).set(s);
    },
    printR = function (paper){
            var el = paper.top, ids = [];
             while(el && el!==null) {
                if(!el.noparse){
                    ids.push(el.id);
                }
                el = el.prev;
            }
            console.log(ids);
    }
    ;
        
        
    return new Class({
    
    Extends:Panel,
    //icons used by this class
    icon : {
            trash:"M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z",
            arrow:"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z"
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
         var d = div("vect "+c, {"title":title||""}), r = Raphael(d,"100%","100%"),
            vec = r.path(icon)
                    .attr(this.options.buttonAttr)
                    .transform(trans||"")
                    .hover(function (){
                        this.attr("stroke","#48e");
                    }, function (){
                        this.attr("stroke","none");
                    });
            d.addEvents(evens||{});
            d.store(vec);
        return d;
    },
    options : {
        imgSrc: "img/",
        buttonAttr: {"fill":"#eee", "stroke":"none", "cursor":"pointer"}
    },
    initialize: function (paper, options){

        this.parent(options || {});
        var
        imgSrc= this.options.imgSrc = (this.options.imgSrc || "img")+"/",
        selected = this.selected={}, els=  this.els={}, icon = this.icon;
        
        this.bind([
            "moveup",
            "movedown",
            "hideToggle",
            "expandToggle",
            "elementCreate",
            "elementInsert",
            "elementDeselect",
            "elementSelect",
            "elSelect",
            "elementClick",
            "elementDelete",
            "notElement",
            "hideTextField",
            "changeName"
        ]);
        
        var 
        /*----------------------- initialize panel html ----------------------*/
        panel = this.panel.addClass("elements-panel"),
        
        elementsAreaHeader = div("area-header").adopt(
            this.vect("moveup",icon.arrow,"T-5 -5,S0.8,R-90",{mousedown:this.bound.moveup},"move up"),
            this.vect("movedown",icon.arrow,"T-5 -5,S0.8,R90",{mousedown:this.bound.movedown},"move down"),
            this.vect("delete",icon.trash,"T-5 -5,S0.6",{
                mousedown:function(){
                        window.fireEvent("element.delete");
                }},"delete element")
        ).inject(panel),
        elements = this.elements = div("area-content").inject(panel)
        ;
        /*----------------------- parse elements ----------------------*/
        
        elements.adopt(this.parse(paper));
        
        /* text field */
        this.textField = new Element("input",{"type":"text", "id":"editText",
            styles:{
                "position":"absolute",
                "white-space":"nowrap",
                "display":"none",
                "border":"#48e solid 1px"
            },
            events: {
                "keydown": function (eve){
                    if (eve.key === "enter"){
                        this.hideTextField();
                    }}.bind(this),
                "blur": this.bound.hideTextField
            }
        }).inject(panel)
        
        /*----------------------- add Events ----------------------*/
                
        panel.addEvents({
            "click": this.notElement,
            "mousedown:relay(.eye)": this.bound.hideToggle,
            "mousedown:relay(.arrow)": this.bound.expandToggle,
            "click:relay(.element)": this.bound.elementClick,
            "dblclick:relay(.name)": this.bound.changeName
        });
        
        window.addEvents({
            "element.create": this.bound.elementInsert,
            "element.deselect": this.bound.elementDeselect,
            "element.delete": this.bound.elementDelete,
            "element.select": this.bound.elSelect
        });
    },
    /**
     *parses the apaper object into the elements panel 
     */
    parse : function(paper){
        var a = [];
        paper.forEach(function(el) {
            var obj;
            el.noparse = el.noparse || false;
            if(!el.noparse){
                obj = elementCreate(el);
                this.els[el.id] = obj;
                a.splice(0,0,obj.element);
            }
        });
      return a;  
    },
    /**
     *clears selection which meight occure when double clicking 
     */
    clearSelection : function () {
        if(document.selection && document.selection.empty) {
            document.selection.empty();
        } else if(window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    },
    /**
     * This method moves the selected elements one step on top of other elements 
     */
    moveup : function(){
        Object.each(this.selected,function(elm){
            if(elm.element.getPrevious()) {
                var row  = elm.element, el = elm.el, prev = row.getPrevious();
                row.inject(prev,"before");
                el.insertAfter(this.els[prev.get("for")].el);
            }
        }, this);
    },
    /**
     * This method moves the selected elements one step below of other elements 
     */
    movedown : function(){
        Object.each(this.selected,function(elm){
            if(elm.element.getNext()) {
                var row  = elm.element, el = elm.el, next = row.getNext();
                row.inject(next,"after");
                el.insertBefore(this.els[next.get("for")].el);
            }
        }, this);
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
        el.setId((typeOf(el.id)==="number")?el.type+el.id:el.id);
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

}());
