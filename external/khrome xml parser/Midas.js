MidasXMLParser = new Class({
    initialize: function(){
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


/*DatalusXMLParser = new Class({
    extends: MidasXMLParser,
    open: function(tagName, attributes){
        switch(tagName){
        
        }
    },
    content: function(text){
    },
    close: function(tagName){
    }
});

var Datalus = {
    make: function(objectName) {
    },
    registerObject: function(xml) {
        
    },
    loadFile: function(name, value) {
        
    },
    transmit: function(payload, url) { // http post only currently supported transfer method
        
    }
};

DatalusNode = new Class({
    getAttribute: function(name) {
    },
    setAttribute: function(name, value) {
        
    },
    isAtomic: function() {
        return true;
    },
    makeKey: function(expression) {
        
    },
    getValue: function() {
        
    },
    addNotifier: function(node) {
        
    },
    setValue: function(value) {
        
    },
    addChild: function(name, value) {
        
    },
    getChild: function(name, value) {
        
    },
    removeChild: function(name, value) {
        
    },
    summaryArray: function(name, value) {
        
    },
    abbreviatedArray: function(name, value) {
        
    },
    typeArray: function(name, value) {
        
    },
    attributeArray: function(name, value) {
        
    },
    thumbprint: function(name, value) {
        
    },
    klone: function(name, value) {
        
    },
    XML: function(name, value) {
        
    },
    voodoo: function(name, value) {
        
    },
    JSON: function(name, value) {
        
    }
});*/