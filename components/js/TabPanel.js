/**
 * This Class definesthe a panel
 * @author Amr Draz
 * @dependency MooTools Core, Slider
 */
/*global Class,Raphael,Events,Options,$,$$,Element,console,window,typeOf,ScrollBar,SlidingLabel */

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
            w = this.width=options.width||"100%",
            h = this.height=options.height||"100%",
            tabs = options.tabs || {};
            
            

            panel.set("class","tab-panel")
            .setStyles({
                position:options.position||(options.y||options.x)?"absolute":"relative",
                top:options.y||0,
                left:options.x||0,
                "float":options["float"]||"none",
                width:w,
                height:h
            });

            var
            headerArea = this.header = div("header-area",{styles:{
                width:"100%",
                height:20
            }}),
            contentArea = this.content = div("content-area",{styles:{
                width:"100%",
                height:options.height-20||"100%"
            }})
            ;
            panel.adopt(headerArea,contentArea);
            
            var lastInsert;
            
            Object.each(tabs,function(panel,title){
//                console.log("tab name",title);
                this.tabs[title]= {};
                this.tabs[title].header = (new Element("h3", {"for":title, text:title, styles:{
                    "float":"left"
                }})).inject(headerArea);
                this.tabs[title].panel = panel;
                this.tabs[title].content = panel.panel.addClass("tab-content").setStyle("width",w).inject(contentArea);
                lastInsert = title;
            }, this);
            
            this.yScroller = new ScrollBar(this.get(lastInsert).content, false, 10,contentArea.getSize().y);
            this.yScroller.scrollBar.inject(contentArea);
            
            if(lastInsert){this.select(options.initSelect|| lastInsert);}
            
            this.bound = {};
            [   "tabSelect",
                "refreshTab" 
            ].each(function(name){
                this.bound[name] = this[name].bind(this);
            }, this);
            
            panel.addEvents({
                "mousedown:relay(.header-area h3)":this.bound.tabSelect
            });
            window.addEvents({
                "element.select":this.bound.refreshTab,
                "element.deselect":this.bound.refreshTab
            });
        },
        select:function(tab){
            var sel = this.selected = this.get(tab), scroll = this.yScroller;
            this.header.getChildren().removeClass("selected");
            this.content.getChildren(".tab-content").addClass("hide");
            sel.header.addClass("selected");
            sel.content.removeClass("hide");
            scroll.setContent(sel.content);
            //console.log(sel,sel.content, scroll.isOff);
            if(scroll.isOff || sel.panel.noScroll){
                scroll.hide();
                sel.content.setStyle("width",this.width);
            } else {
                scroll.show();
                sel.content.setStyle("width",this.width-scroll.width);
            }
            //console.log(tab);
            sel.panel.fireEvent("focus");
        },
        refreshTab:function(el){
            this.select(this.selected.header.get("text"));
        },
        tabSelect : function(e){
            var t = e.target;
            this.select(t.get("text"));
        },
        get : function(tab){
            return this.tabs[tab];
        },
        insert: function(panel){
            //TODO insert a panel last
        },
        remove:function(tab){
            //TODO remove a tab
        }
    });
})();
