// SAX constructor
MidasSAXEventHandler = function() {
    this.characterData = "";
}

// My Non-exposed hooks (all existing hooks require fucking with char data
// internally, so we call cleanly out to here to make truly pluggable functions)

MidasSAXEventHandler.prototype.startTag = function(name, attrs){
}

MidasSAXEventHandler.prototype.charData = function(chars){
}

MidasSAXEventHandler.prototype.endTag = function(name){
}

//MidasSAXEventHandler Object SAX INTERFACES
MidasSAXEventHandler.prototype.characters = function(data, start, length) {
    this.characterData += data.substr(start, length);
}

MidasSAXEventHandler.prototype.endDocument = function() {
    this._handleCharacterData();
    //place endDocument event handling code below this line
}

MidasSAXEventHandler.prototype.endElement = function(name) {
    this._handleCharacterData();
    //place endElement event handling code below this line
    this.endTag(name);
}

MidasSAXEventHandler.prototype.processingInstruction = function(target, data) {
    this._handleCharacterData();
    //place processingInstruction event handling code below this line
}

MidasSAXEventHandler.prototype.setDocumentLocator = function(locator) {
    this._handleCharacterData();
    //place setDocumentLocator event handling code below this line
}

MidasSAXEventHandler.prototype.startElement = function(name, atts) {
    this._handleCharacterData();
    var attrs = {};
    //place startElement event handling code below this line
    for(var lcv =0; lcv < atts.getLength(); lcv++){
        attrs[atts.getName(lcv)] = atts.getValue(lcv);
    }
    this.startTag(name, attrs);
}

MidasSAXEventHandler.prototype.startDocument = function() {
    this._handleCharacterData();
    //place startDocument event handling code below this line
}

//MidasSAXEventHandler Object Lexical Handlers
MidasSAXEventHandler.prototype.comment = function(data, start, length) {
    this._handleCharacterData();
    //place comment event handling code below this line
}

MidasSAXEventHandler.prototype.endCDATA = function() {
    this._handleCharacterData();
    //place endCDATA event handling code below this line
}

MidasSAXEventHandler.prototype.startCDATA = function() {
    this._handleCharacterData();
    //place startCDATA event handling code below this line
}

// MidasSAXEventHandler Object Error Interface
MidasSAXEventHandler.prototype.error = function(exception) {
    this._handleCharacterData();
    //place error event handling code below this line
}

MidasSAXEventHandler.prototype.fatalError = function(exception) {
    this._handleCharacterData();
    //place fatalError event handling code below this line
}

MidasSAXEventHandler.prototype.warning = function(exception) {
    this._handleCharacterData();
    //place warning event handling code below this line
}

//MidasSAXEventHandler Object Internal Functions
MidasSAXEventHandler.prototype._fullCharacterDataReceived =
               function(fullCharacterData){
    //place character (text) event handling code below this line
    this.charData(fullCharacterData);
}

MidasSAXEventHandler.prototype._handleCharacterData = function()  {
    if (this.characterData != ""){
        this._fullCharacterDataReceived(this.characterData);
    }
    this.characterData = "";
}