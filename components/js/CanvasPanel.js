/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Raphael*/

var CanvasPanel = new Class({
    Extends:Panel,
    options:{
    },
    initialize: function(options){
        
        this.parent(options||{});
        
        var panel = this.panel.addClass("canvas-panel");
        
        this.R = Raphael(panel,"100%","100%");
        
    },
    noScroll:true
});
