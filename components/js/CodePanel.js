
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
    initialize: function(options){
        
        this.parent(options||{});
        this.paper = options.r;
        this.bind(["unfocus", "setText"])
       
        var
        mode = this.mode = options.mode,
        panel = this.panel.addClass("svg-panel").setStyle("background-color","#eee");
        this.text = new Element("textarea").inject(panel);
        this.editor = CodeMirror.fromTextArea(this.text, {
            mode: (mode === 'svg')?'xml':mode,
            indentUnit: 4,
            readOnly:true,
            lineWrapping: true
            });
        this.addEvent("focus",this.bound.setText);
        window.addEvents({
            "paper.unfocus":this.bound.unfocus,
            "paper.focus":this.bound.unfocus
        });
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
        //console.log(this.paper);
        switch (this.mode) {
        case 'svg':
            s = this.paper.toSVG();
            break;
        case 'javascript':
            s = js_beautify(this.paper.toJS());
            break;
        }
        console.log(s);
       this.paper.print();
        return s;
    },
    paperUpdate: function(){
        window.fireEvent("canvas.unfocus",[0]);
        console.log('hello');
    },
    unfocus: function(p){
        //this.paper = p;
    },
    setText:function(){
        //this.paperUpdate();
        var editor = this.editor;
        editor.setValue(this.parseMode());
        CodeMirror.commands.selectAll(editor);
        this.autoFormatSelection();
        editor.setCursor(1);
    }
});
