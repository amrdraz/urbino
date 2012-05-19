/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools,CodeMirror
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Panel,Raphael,CodeMirror*/

var SVGPanel = new Class({
    Extends:Panel,
    options:{
    },
    initialize: function(R, options){
        
        this.parent(options||{});
        
        var panel = this.panel.addClass("svg-panel").setStyle("background-color","#eee");
        this.paper = R;
        this.text = new Element("textarea").inject(panel);
        this.editor = CodeMirror.fromTextArea(this.text,{
            mode:"xml",
            indentUnit: 4,
            readOnly:true,
            lineWrapping: true
            });
        console.log(this.editor);
        this.addEvent("focus",this.setText.bind(this));
    },

    getSelectedRange: function () {
        var editor = this.editor;
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
      },
      
    autoFormatSelection:  function () {
        var range = this.getSelectedRange();
        this.editor.autoFormatRange(range.from, range.to);
      },
    
    setText:function(){
        var editor = this.editor;
        editor.setValue(this.paper.toSVG());
        CodeMirror.commands.selectAll(editor);
        this.autoFormatSelection();
    }
});
