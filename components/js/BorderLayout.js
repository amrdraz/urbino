/**
 * This Class definesthe a panel
 * @author Amr Draz
 * @dependency MooTools Core
 */
/*global Class,Raphael,Events,Options,$,$$,Element,console,window,typeOf,Slider,SlidingLabel */

var BorderLayout = (function(){
    
    return new Class({
        
        Implements:[Events,Options],
        options:{},
        
        initialize: function(options){
            
            this.setOptions(options);
            
        }
    });
})();
