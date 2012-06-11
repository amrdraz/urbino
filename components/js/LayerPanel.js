/**
 * this class is respnsible for the Editors Layer panel
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Element,typeOf,window,R*/

var LayerPanel = new Class({
    
    initialize: function (panel, canvas){
        
        var selected, panel = $(panel), els = {};
       
       
        
        var 
        printR = function (canvas){
            var el = canvas.top, ids = [];
             while(el!==null) {
                if(el.noparse){
                   
                } else {
                    
                    ids.push(el.id);
                }
                el = el.prev;
            }
            console.log(ids);
        },
        
        /*-----------------------handeling general events ----------------------*/
       
        hideToggle = function (e){
            e.stopPropagation();
            var eye = e.target,
            el = els[e.target.getParent(".row").get("id")];
            ;
            
            if(el){
                if(eye.hasClass("hidden")){
                    eye.set("src","../img/eye.gif");
                    eye.removeClass("hidden");
                    el.el.show();
                } else {
                    eye.set("src","../img/hidden-eye.gif");
                    eye.addClass("hidden");
                    el.el.hide();
                }
            }
        },
       expandToggle = function (e){
            e.stopPropagation();
            var el = e.target;
            if(el.hasClass("expanded")){
                el.set("src","../img/light-arrow.gif");
                el.removeClass("expanded");
                //TODO the rest
            } else {
                el.set("src","../img/light-arrow-down.gif");
                el.addClass("expanded");
                //TODO the rest
            }
        },
        /*----------------------- row operations ----------------------*/
       /**
         * creates a new row based on a Raphael Element and asigns it an id
         * @param el (Raphael Obj) the element for this row
         * @return (div) the div representing the row
         */
        rowCreate = function(el){
            var div = new Element("img",{"src":"img/eye.gif","class":"eye"});
            var node = new Element("div",{"class":"node"});
            var arrow = new Element("img",{"src":"img/light-arrow.gif","class":"arrow"});
            if(el.isgroup){
                arrow.hide();
            }
            el.id = (typeOf(el.id)==="number")?el.type+el.id:el.id;
            var label = new Element("label", {"text":el.id, "class":"name"});
            node.adopt(arrow, label);
            
            return new Element("div",{"class":"row", "id":el.id}).adopt(div, node);
        },
        /**
         * inserts a new row into the layer panel
         * @param el (Raphael Obj) the element for this row
         */
        rowInsert = function(el){
            var obj = {};
                obj.el = el;
                obj.row = rowCreate(el);
            els[el.id] = (obj);
            
            obj.row.inject(panel,"top");
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the row id in the layers panel
         */
        rowDeselect = function (id){
            if(id && els[id]){
                els[id].row.removeClass("selected");
            }
        },
        /**
         * selects the elemnets obj by it's id
         * @param id (string) the row id in the layers panel
         */
        rowSelect = function (id){
            if(id && els[id]){
                panel.getElements(".row").removeClass("selected");
                selected = els[id];
                selected.row.addClass("selected");
            }
        },
        /**
         * selects the elemnets obj by it's element
         * @param el (Raphael Obj) the element ithis row represents
         */
        selectByElement = function (el){
            if(el && typeOf(el)!=="null"){
                rowSelect(el.id);
            }
        },
        rowClick = function (e) {
            e.stopPropagation();
            var el = (e.target.hasClass("row"))?e.target:e.target.getParent(".row");
            rowSelect(el.get("id"));
            window.fireEvent("element.select", [els[el.get("id")].el]);
        },
        rowDelete = function (el){
            console.log(el);
                var id = el.id;
                if(els[id]){
                    els[id].row.destroy();
                    if(selected && selected!==null && id===selected.el.id ){selected=null;}
                    delete els[id];
                    if(el.ft) { el.ft.unplug();}
                    el.remove();
                }
        },
        /*-----------------------handeling what text filed should do ----------------------*/
        changName = function(e){
            var sel = e.target,
            size = sel.getSize(),
            pos = sel.getPosition(panel);
            
            textField.setStyles({
                    "top":pos.y-4,
                    "left":pos.x,
                    "width":70,
                    "height":size.y+4,
                    "display":"block"
                });
            this.noShortcut = true;
            rowSelect(sel.get("text"));
        },
        hideTextField = function (){
            var val = textField.get("value");
            if(selected && typeOf(selected)!=="null" && val!=="" && !els[val]) {
                selected.row.getElement(".name").set("text", val);
                
                var id = selected.el.id;
                selected.row.set("id", val);
                selected.el.id = val;
                els[val] = selected;
                delete els[id];
                console.log(els);
                rowSelect(val);
            }
            textField.set({"value":"", styles:{"display":"none"}});
            this.noShortcut=false;
        },
                
        /*----------------------- create panel ----------------------*/
       
        a = [], el = canvas.top;
        while(el!==null) {
            if(el.noparse){
               
            } else {
                var obj = {};
                obj.el = el;
                obj.row = rowCreate(el);
                els[el.id] = (obj);
                
                a.push(obj.row);
            }
            el = el.prev;
        }
        var controle = new Element("div",{"class":"controls"}),
        textField = new Element("input",{"type":"text", "id":"editText",
                styles:{
                    "position":"absolute",
                    "white-space":"nowrap",
                    "display":"none",
                    "border":"#000 dashed 1px"
                },
                events:{
                    "keydown": function (eve){
                        if (eve.key === "enter"){
                            hideTextField();
                        }},
                    "blur": hideTextField
                }});
        
        panel.addEvents({
            "click:relay(.row)":rowClick,
            "click:relay(.eye)": hideToggle,
            "click:relay(.arrow)": expandToggle,
            "dblclick:relay(.name)": changName
        }).adopt(a, controle, textField);
        
        window.addEvent("element.create", rowInsert);
        window.addEvent("element.delete", rowDelete);
        window.addEvent("element.select", selectByElement);
        
        /*-----------------------handeling what panel controls should do ----------------------*/
        
        var controlHoverIn = function (){
            this.attr("stroke","#48e");
        },
        controlHoverOut = function (){
            this.attr("stroke","none");
        };
        
        var cR = Raphael(controle), common = {"fill":"#eee", "stroke":"none", "cursor":"pointer"};
        
        //move up arrow
        cR.path("M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z")
        .attr(common).attr({"title":"move up"})
        .transform("t155,-6r-90")
        .hover(controlHoverIn, controlHoverOut)
        .click(function(){
            
            if(typeOf(selected)!=="null" && typeOf(selected.row.getPrevious())!=="null") {
                var row  = selected.row, el = selected.el, prev = row.getPrevious();
                row.inject(prev,"before");
                el.insertAfter(els[prev.get("id")].el);
                  printR(canvas);
            }
        });
        //move down arrow
        cR.path("M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z")
        .attr(common).attr({"title":"move down"})
        .transform("t180,-6r90")
        .hover(controlHoverIn, controlHoverOut)
        .click(function(){
            if(typeOf(selected)!=="null" && !selected.row.getNext().hasClass("controls")) {
                 var row  = selected.row, el = selected.el, next = row.getNext();
                row.inject(next,"after");
                el.insertBefore(els[next.get("id")].el);
                printR(canvas);
            }
        });
        //add
        cR.path("M5,5 10,5 10,0 15,0 15,5 20,5 20,10 15,10 15,15 10,15 10,10 5,10 5,5z")
        .attr(common).attr({"title":"new group"})
        .transform("t110,2")
        .hover(controlHoverIn, controlHoverOut)
        .click(function(){
            if(typeOf(selected)!=="null") {
                //TODO
            }
        });
        //remove
        cR.path("M5,5 20,5 20,10 5,10 5,5z")
        .attr(common).attr({"title":"remove group"})
        .transform("t135,2")
        .hover(controlHoverIn, controlHoverOut)
        .click(function(){
            if(typeOf(selected)!=="null") {
                window.fireEvent("element.delete", selected.el);
            }
        });
    }
});
