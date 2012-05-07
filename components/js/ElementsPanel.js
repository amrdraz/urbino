/**
 * this class is respnsible for the Editors Elements view
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Panel,Options,Element,typeOf,window,Raphael*/

var ElementsPanel = new Class({
    
    Implements:[Options,Events],
    
    initialize: function (paper, options){

        options = options || {};
        var
        imgSrc= (options.imgSrc || "img")+"/",
        buttonAttr = options.buttonAttr || {"fill":"#eee", "stroke":"none", "cursor":"pointer"},
        icon = {
            trash:"M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z",
            arrow:"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z"
        },
        selected={}, els={};
        
        var 
        printR = function (paper){
            var el = paper.top, ids = [];
             while(el && el!==null) {
                if(!el.noparse){
                    ids.push(el.id);
                }
                el = el.prev;
            }
            console.log(ids);
        },
        controlHoverIn = function (){
            this.attr("stroke","#48e");
        },
        controlHoverOut = function (){
            this.attr("stroke","none");
        },
        moveup = function(){
            Object.each(selected,function(elm){
                if(elm.element.getPrevious()) {
                    var row  = elm.element, el = elm.el, prev = row.getPrevious();
                    row.inject(prev,"before");
                    el.insertAfter(els[prev.get("for")].el);
                }
            });
        },
        movedown = function(){
            Object.each(selected,function(elm){
                if(elm.element.getNext()) {
                    var row  = elm.element, el = elm.el, next = row.getNext();
                    row.inject(next,"after");
                    el.insertBefore(els[next.get("for")].el);
                }
            });
        },
        div = function(c,s){
            s = s || {};
            return new Element("div",{"class":c}).set(s);
        },
        img = function(src,c,s){
            s = s || {};
            return new Element("img",{src:src,"class":c}).set(s);
        },
        vect = function(c,icon,trans,evens,title){
             //move up arrow
             var d = div("vect "+c), r = Raphael(d,"100%","100%"),
                vec = r.path(icon)
                        .attr(buttonAttr).attr({"title":title||""})
                        .transform(trans||"")
                        .hover(controlHoverIn, controlHoverOut);
                d.addEvents(evens||{});
                d.store(vec);
            return d;
        },
        /*----------------------- initialize panel html ----------------------*/
        panel = this.panel = div("elements-panel"),
            elementsAreaHeader = div("area-header").adopt(
                vect("moveup",icon.arrow,"T-5 -5,S0.8,R-90",{click:moveup},"move up"),
                vect("movedown",icon.arrow,"T-5 -5,S0.8,R90",{click:movedown},"move down"),
                vect("delete",icon.trash,"T-5 -5,S0.6",{
                    click:function(){
                        if(Object.getLength(selected)!==0) {
                            window.fireEvent("element.delete");
                        }
                    }},"delete element")
            ).inject(panel),
            elements = div("area-content").inject(panel),
            textField = new Element("input",{"type":"text", "id":"editText",
                styles:{
                    "position":"absolute",
                    "white-space":"nowrap",
                    "display":"none",
                    "border":"#48e solid 1px"
                }
            }).inject(panel),
        /*-----------------------handeling general events ----------------------*/
       
        hideToggle = function (e){
            e.stop();

            var el = els[e.target.getParent(".element").get("for")];
            delete selected[el.el.id];
            if(el.element.hasClass("hidden")){
                el.element.removeClass("hidden");
                el.el.show();
                Object.each(selected, function(elm,key){
                    elm.element.removeClass("hidden");
                    elm.el.show();
                });
            } else {
                el.element.addClass("hidden");
                el.el.hide();
                Object.each(selected, function(elm,key){
                    elm.element.addClass("hidden");
                    elm.el.hide();
                });
            }
            selected[el.id] = el;
        },
       expandToggle = function (e){
            e.stop();
            var target = e.target,
            elm = els[target.getParent(".element").get("for")];
            if(elm.element.hasClass("expanded")){
                elm.element.removeClass("expanded");
            } else {
                elm.element.addClass("expanded");
            }
        },
        /*----------------------- row operations ----------------------*/
       /**
         * creates a new row based on a Raphael Element and asigns it an id
         * @param el (Raphael Obj) the element for this row
         * @return (div) the div representing the row
         */
         elementCreate = function(el){
            el.id = (typeOf(el.id)==="number")?el.type+el.id:el.id;
            
            var color = el.color|| "#888",
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
        elementInsert = function(el){
            var obj = els[el.id] = elementCreate(el);
            obj.element.inject(panel,"top");
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the row id in the elements panel
         */
        elementDeselect = function (id){
            if(id) {
                if(typeOf(id)=="string" && selected[id]) {
                    selected[id].element.removeClass("selected");
                    delete selected[id];
                }
            } else {
                Object.each(selected, function(elm,key){
                    elementDeselect(key);
                });
            }
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the element id in the elements panel
         */
        elementSelect = function (id){
            if(id && els[id] && !selected[id]){
                selected[id] = els[id];
                selected[id].element.addClass("selected");
            }
        },
        /**
         * selects the elemnets obj by it's element
         * @param el (Raphael Obj) the element to select
         */
        elSelect = function (el){
            if(el && typeOf(el)!=="null"){
                elementSelect(el.id);
            }
        },
        /**
         * deselect the elemnets obj by it's element
         * @param el (Raphael Obj) the element to deselect
         */
        elDeselect = function (el){
            if(el && typeOf(el)!=="null"){
                elementDeselect(el.id);
            } else {
                elementDeselect();
            }
        },
        /**
         * event handler for element selection allows for multiple selection if ctrl is pressed
         * @param e (event)
         */
        elementClick = function (e) {
            e.stopPropagation();
            
            var el = els[((e.target.hasClass("element"))?e.target:e.target.getParent(".element")).get("for")].el;
            if(e.control){
                if(selected[el.id]){
                    window.fireEvent("element.deselect", [el]);
                } else {
                    window.fireEvent("element.select", [el]);
                }
            } else {
                window.fireEvent("element.deselect");
                window.fireEvent("element.select", [el]);
            }
        },
        /**
         * event handler deletes the element from the elements panel
         * @param el (Raphael Obj) the element to delete
         */
        elementDelete = function (el){
            
            if(el){
                if(typeOf(el)==="array"){
                    el.each(function(id){
                        elementDelete(els[id].el);
                    });
                } else {
                    var id = el && el.id;
                    if(selected[el.id]){
                       window.fireEvent("element.deselect", el);
                    }
                    els[id].element.destroy();
                    delete els[id];
                    //TODO move this part elsewhere
                    if(el.ft) { el.ft.unplug();}
                    el.remove();
                }
            } else {
                Object.each(selected, function(elm,key){
                    elementDelete(elm.el);
                });
            }
        },
        /**
         * checks if user clicked on an element
         */
        notElement = function (e) {
            var el = e.target;
            if(el.getParent(".element")===null && !el.hasClass("element")) {
                window.fireEvent("element.deselect");
            }
        },
        /*-----------------------handeling what text filed should do ----------------------*/
        clearSelection = function () {
            if(document.selection && document.selection.empty) {
                document.selection.empty();
            } else if(window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        },
        changName = function(e){
            e.preventDefault();
            
            var sel = e.target,
            size = sel.getSize(),
            pos = sel.getPosition(panel);
            
            clearSelection();
            
            textField.setStyles({
                    "top":pos.y,
                    "left":pos.x,
                    "width":100,
                    "height":size.y,
                    "display":"block"
                });
            textField.id = sel.get("text");
            textField.set({"value":textField.id});
            textField.focus();
            this.noShortcut = true;
        },
        hideTextField = function (){
           var id = textField.id, val = textField.get("value");
            if(val!=="" && !els[val]) {
                els[id].element.getElement(".name").set("text", val);
                els[id].element.set("for", val);
                els[id].el.id = val;
                els[val] = els[id];
                delete els[id];
                //rowDeselect(id);
                elementSelect(val);
            }
            textField.set({"value":"", styles:{"display":"none"}});
            this.noShortcut=false;
        },
        parse = function(paper){
            var a = [];
            paper.forEach(function(el) {
                var obj;
                el.noparse = el.noparse || false;
                if(!el.noparse){
                    obj = elementCreate(el);
                    els[el.id] = obj;
                    a.push(obj.element);
                }
            });
          return a;  
        }
        ;       
        /*----------------------- add Events ----------------------*/
        
        textField.addEvents({
            "keydown": function (eve){
                if (eve.key === "enter"){
                    hideTextField();
                }},
            "blur": hideTextField
        });
        
        panel.addEvents({
            "click":notElement,
            "mousedown:relay(.eye)": hideToggle,
            "mousedown:relay(.arrow)": expandToggle,
            "click:relay(.element)":elementClick,
            "dblclick:relay(.name)": changName
        });
        
        window.addEvents({
            "element.create": elementInsert,
            "element.deselect": elementDeselect,
            "element.delete": elementDelete,
            "element.select": elSelect
        });
        
        /*----------------------- parse elements ----------------------*/
        
        elements.adopt(parse(paper));
    }
    
});
