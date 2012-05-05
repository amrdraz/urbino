/**
 * Main.js
 *
 * initialize canvase and all editor propreties
 * @author Amr Draz
 */

/*global $,$$,Raphael,console,Class,Events,Implements,Element,Options,LayerPanel,ToolPanel,editor*/



var Editor = new Class({
    Implements:[Events, Options],
    
    options: {
        extraProps: []
    },
    
    initialize: function(R, panels, options){
        this.setOptions(options);
        this.canvas = R.canvas;
        this.selected = this.canvas;
       
        this.layerPanel = new LayerPanel(panels.layer, R);
        this.tool = new ToolPanel(panels.tool, R);
        
        //this.addEvent("element.select", pp.setElement);
        //this.addEvent("element.update", pp.updateElement);
    }
    
});
console.log("Inisializing Editor");
