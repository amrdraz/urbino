MidasXMLParser = new Class({
    initialize: function(){
        this.buildXMLcomponents();
    },
    buildXMLcomponents: function(){
        this.handler = new MidasSAXEventHandler();
        this.parser = new SAXDriver();
    },
    open: function(tagName, attributes){
        var node = document.id('widget_panel');
        //var pro = profile(attributes);
        var pro = attributes["d"];
        node.innerHTML = node.innerHTML + pro +"<br/><br/>";
    },
    content: function(text){
    },
    close: function(tagName){
    },
    parse: function(xml){
        this.handler.startTag = this.open;
        this.handler.endTag = this.close;
        this.handler.charData = this.content;
        this.parser.setDocumentHandler(this.handler);
        this.parser.setLexicalHandler(this.handler);
        this.parser.setErrorHandler(this.handler);
        this.parser.parse(xml);
    }
});