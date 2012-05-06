/**
 * This Class definesthe a panel
 * @author Amr Draz
 * @dependency Raphael, MooTools, SlidingLabel, ColorPicker
 */
/*global Class,Raphael,Events,Options,$,$$,Element,console,window,typeOf,Slider,SlidingLabel */

var TabPanel = (function(){
    var
    div = function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    }
    ;
    
    return new Class({
        Implements:[Options,Events],
        options:{},
        
        /**
         * Panel
         */
        initialize: function(container, options){
            
            //this.setOptions(options);

            this.tabs = {};
            var panel = this.panel = $(container),
            tabs = options.tabs || {};

            panel.set("class","tab-panel")
            .setStyles({
                position:options.position||(options.y||options.x)?"absolute":"relative",
                top:options.y||0,
                left:options.x||0,
                "float":options["float"]||"none",
                width:options.width||"100%",
                height:options.height||"100%"
            });

            var
            headerArea = this.header = div("header-area",{styles:{
                width:"100%",
                height:20
            }}),
            contentArea = this.content = div("content-area",{styles:{
                width:"100%",
                height:options.height-20||"100%"
            }}),
            contain = div("container",{styles:{
                width:options.width||"100%",
                height:"100%"
            }}).adopt(headerArea,contentArea)
            ;
            
            panel.adopt(contain);
            
            Object.each(tabs,function(panel,title){
                this.tabs[title]= {};
                this.tabs[title].header = (new Element("h3", {"for":title, text:title, styles:{
                    "float":"left"
                }})).inject(headerArea);
                this.tabs[title].panel = panel;
                this.tabs[title].content = div("tab-content",{"name":title}).inject(contentArea).adopt(panel.panel);
                this.select(title);
            }, this);
            
            this.bound = {
                tabSelect:this.tabSelect.bind(this)
            };
            
            panel.addEvents({
                "mousedown:relay(.header-area h3)":this.bound.tabSelect
            });
        },
        select:function(tab){
            var sel = this.selected = this.get(tab);
            this.header.getChildren().removeClass("selected");
            this.content.getChildren().removeClass("selected");
            sel.header.addClass("selected");
            sel.content.addClass("selected");
        },
        tabSelect : function(e){
            var t = e.target;
            this.select(t.get("text"));
        },
        get : function(tab){
            return this.tabs[tab];
        }
    });
})();
