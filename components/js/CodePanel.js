/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools,CodeMirror
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Panel,Raphael,CodeMirror*/
/**
 * this class defines a panel
 * @author Amr Draz
 * @requirments Raphael, Mootools,CodeMirror
 */
/*global $,$$,console,Class,Events,Options,Element,typeOf,window,Panel,Raphael,CodeMirror*/

var CodePanel = new Class({
    Extends:Panel,
    options:{
    },
    initialize: function(R, mode, options){
        
        this.parent(options||{});
        this.mode = mode;
        var panel = this.panel.addClass("svg-panel").setStyle("background-color","#eee");
        this.paper = R;
        this.text = new Element("textarea").inject(panel);
        this.editor = CodeMirror.fromTextArea(this.text, {
            mode: 'xml',//(mode === 'svg')?'xml':mode,
            indentUnit: 4,
            readOnly:true,
            lineWrapping: true
            });
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
    parseMode:  function () {
        var s;
        switch (this.mode) {
        case 'svg':
            s = this.paper.toSVG();
            break;
        case 'javascript':
            s = this.paper.toJS();
            break;
        }
        return s;
    },
    setText:function(){
        var editor = this.editor;
        editor.setValue(this.parseMode());
        CodeMirror.commands.selectAll(editor);
        this.autoFormatSelection();
    }
});
