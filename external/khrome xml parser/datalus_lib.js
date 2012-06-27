function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1) return false;
   else return true;
}

function isFunction(o) {return 'function' == typeof o;}
function isObject(o) {return 'object' == typeof o;}

function getURLArguments(args){
    var result = "";
    var sep = "";
    for(var lcv=0; lcv < args.length ; lcv++){
        result += sep + args[lcv].name + "=" + args[lcv].value;
        if(sep == "") sep ="&";
    }
    return result;
}

function profile(object, deep, indent){
    if(!indent)  indent = '';
    properties = '';
    methods = '';
    var count = 0;
    var seperator = "";
    for (var field in object){
        if (isFunction(field)) {
            methods += indent+field+"()\n";
        }else{
            if(isObject(field)){
                properties += indent+field+"=>\n"+profile(object, deep, indent)+"\n";
                count = 0;
            }else{
                properties += indent+field+"="+object[field]+seperator;
            }
            count++;
            seperator = ", ";
            if(count == 8){
                seperator = ", \n"+indent;
            }
        }
        
    }
    return properties+"\n\n"+methods;
}

function arrayDefinition(array, name){
    var result = "var "+name+" = new Array("
    var sep = '';
    for(var lcv=0; lcv< array.length; lcv++){
        result += sep+"'"+array[lcv]+"'";
        if(sep == '') sep = ',';
    }
    result += ");"
    return result;
}

function dynamicJSInclude(scriptName) {
	var html = document.getElementsByTagName('head').item(0) || document.body;
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', scriptName);
    if (!html.appendChild(js)) {
		document.write('<script src="' + scriptName + '" type="text/javascript"></script>');
    }
}

var bSaf = (navigator.userAgent.indexOf('Safari') != -1);
var bOpera = (navigator.userAgent.indexOf('Opera') != -1);
var bMoz = (navigator.appName == 'Netscape');
function execJS(node) {
    var st = node.getElementsByTagName('SCRIPT');
    var strExec;
    for(var i=0;i<st.length; i++) {     
        if (bSaf) {
            strExec = st[i].innerHTML;
        } else if (bOpera) {
            strExec = st[i].text;
        } else if (bMoz) {
            strExec = st[i].textContent;
        } else {
            strExec = st[i].text;
        }
        try {
            eval(strExec.split("<!--").join("").split("-->").join(""));
        } catch(e) {
            alert(e);
        }
    }
}

function addClass(node, value){
    var cookie = readCookie(value);
    if(cookie) values = cookie.split(',');
    else values = new Array();
    var sep = '';
    var newCookie = '';
    for(var lcv=0; lcv < values.length; lcv++){
        newCookie += sep+values[lcv];
        if(sep == 0) sep = ',';
    }
    newCookie += sep+value;
    createCookie(value, newCookie, 7);
}

function removeClass(node, value){
    var cookie = readCookie(value);
    if(cookie) values = cookie.split(',');
    else values = new Array();
    var sep = '';
    var newCookie = '';
    for(var lcv=0; lcv < values.length; lcv++){
        if(values[lcv] != value){
            newCookie += sep+values[lcv];
            if(sep == 0) sep = ',';
        }
    }
    createCookie(value, newCookie, 7);
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+"; path=/;";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-100000000000);
}

function cookieStringQueuePush(queue, value){
    var cookie = readCookie(queue);
    if(cookie) values = cookie.split('%2C');
    else values = new Array();
    var sep = '';
    var newCookie = '';
    for(var lcv=0; lcv < values.length; lcv++){
        newCookie += sep+values[lcv];
        if(sep == 0) sep = ',';
    }
    newCookie += sep+value;
    createCookie(queue, newCookie, 7);
}

function cookieStringQueueRemove(queue, value){
    var cookie = readCookie(queue);
    if(cookie) values = cookie.split('%2C');
    else values = new Array();
    var sep = '';
    var newCookie = '';
    for(var lcv=0; lcv < values.length; lcv++){
        if(values[lcv] != value){
            newCookie += sep+values[lcv];
            if(sep == 0) sep = ',';
        }
    }
//    if ( newCookie == '' ) {
//   	eraseCookie(queue);
//   } else { 
		createCookie(queue, escape(newCookie));
//	}
}

function cookieStringQueuePop(queue){ //LIFO get
    var cookie = readCookie(queue);
    if(cookie) values = cookie.split('%2C');
    else return null;
    var sep = '';
    var newCookie = '';
    for(var lcv=0; lcv < values.length-1; lcv++){
        newCookie += sep+values[lcv];
        if(sep == 0) sep = ',';
    }
    createCookie(queue, newCookie, 7);
    return values[values.length-1];
}

function cookieStringQueueJenga(queue){//FIFO get
    var cookie = readCookie(queue);
    if(cookie) values = cookie.split(',');
    else return null;
    var sep = '';
    var newCookie = '';
    for(var lcv=1; lcv < values.length; lcv++){
        newCookie += sep+values[lcv];
        if(sep == 0) sep = ',';
    }
    createCookie(queue, newCookie, 7);
    return values[0];
}

function  RemedialDOMParser(){
    this.parseFromString = ael_dom_parse;
}

function ael_dom_parse(str, contentType) {
    if (typeof ActiveXObject != "undefined") {
     var d = new ActiveXObject("MSXML.DomDocument");
     d.loadXML(str);
     return d;
    } else if (typeof XMLHttpRequest != "undefined") {
     var req = new XMLHttpRequest;
     req.open('GET', 'data:' + (contentType || 'application/xml') + ';charset=utf-8,' + encodeURIComponent(str), false);
     if (req.overrideMimeType) req.overrideMimeType(contentType);
     req.send(null);
     return req.responseXML;
    }
}

function addDOMinnerHTML(node, response){
    if(typeof ActiveXObject != "undefined"){ //we're in IE, we must set it through the dom
        if(true){ //this should test if response is set
            var parser = new RemedialDOMParser();
            var responseXML = parser.parseFromString(response.responseText, 'text/xml');
            if(node.tagName == 'TABLE'){
                for(var rowPos=0; rowPos<responseXML.childNodes.length; rowPos++){
                    var row = node.insertRow();
                    var xmlRow = responseXML.childNodes[rowPos];
                    duplicateAttributes(xmlRow, row);
                    //if(xmlRow.nodeType == 1){
                        for(var colPos=0; colPos<xmlRow.childNodes.length; colPos++){
                            var cell = row.insertCell();
                            var xmlCell = xmlRow.childNodes[colPos].firstChild;
                            duplicateAttributes(xmlRow.childNodes[colPos], cell);
                            if(xmlCell.nodeType == 3){
                                cell.innerHTML = xmlCell.text;
                            } else if(xmlCell.nodeType == 1){
                                duplicateAttributes(xmlRow.childNodes[colPos], cell);
                                var text = textualize(xmlCell);
                                cell.innerHTML = text;
                            }
                        }
                    //}
                }
            } else node.appendChild(responseXML);
        }
    } else node.innerHTML = node.innerHTML+response.responseText; //every other browser does a simple overwrite
}

function duplicateAttributes(targetNode, node){ // also outputs an attribute string
    // unfortunately because a text dom cannot use the for([index] in [object]) syntax
    // in IE we cannot use a general copy loop and must look for attributes in this
    // cludgy, inelegant enumerated way.
    var attributes ='';
    //tag specific attributes
    if(targetNode.tagName == 'img'){
        attributes += ' src="'+targetNode.getAttribute('src')+'"';
        if(node) node.setAttribute('src', targetNode.getAttribute('src'));
    }
    if(targetNode.tagName == 'a'){
        attributes += ' href="'+targetNode.getAttribute('href')+'"';
    }
    //copy event triggers
    if(targetNode.getAttribute('onclick') != null && targetNode.getAttribute('onclick') != ''){
        attributes += ' onclick="'+targetNode.getAttribute('onclick')+'"';
    }
    //basic elements
    if(targetNode.getAttribute('id') != null && targetNode.getAttribute('id') != ''){
        attributes += ' id="'+targetNode.getAttribute('id')+'"';
        if(node) node.setAttribute('id', targetNode.getAttribute('id'));
    }
    if(targetNode.getAttribute('class') != null && targetNode.getAttribute('class') != ''){
        attributes += ' class="'+targetNode.getAttribute('class')+'"';
        if(node) node.setAttribute('className', targetNode.getAttribute('class'));
    }
    if(targetNode.getAttribute('style') != null && targetNode.getAttribute('style') != ''){
        attributes += ' style="'+targetNode.getAttribute('style')+'"';
        // todo: this is an object, so changing it around could be tricky
    }
    //positioning/layout
    if(targetNode.getAttribute('align') != null && targetNode.getAttribute('align') != '')
        attributes += ' align="'+targetNode.getAttribute('align')+'"';
        if(node) node.setAttribute('align', targetNode.getAttribute('align'));
    //geometry
    if(targetNode.getAttribute('height') != null && targetNode.getAttribute('height') != ''){
        attributes += ' height="'+targetNode.getAttribute('height')+'"';
    }
    if(targetNode.getAttribute('width') != null && targetNode.getAttribute('width') != '')
        attributes += ' width="'+targetNode.getAttribute('width')+'"';
    if(targetNode.getAttribute('border') != null && targetNode.getAttribute('border') != '')
        attributes += ' border="'+targetNode.getAttribute('border')+'"';
    if(targetNode.getAttribute('padding') != null && targetNode.getAttribute('padding') != '')
        attributes += ' padding="'+targetNode.getAttribute('padding')+'"';
    return attributes;
}

function textualize(node){
    var result = '';
    if(node.nodeType == 1){ //node is a tag
        //get attributes
        var attributes = duplicateAttributes(node);
        //write the tag
        if(node.childNodes.length > 0){ //binary tag
            result = "<" +node.tagName+attributes+">";
            for(var childIndex=0;childIndex < node.childNodes.length; childIndex++){
                result += textualize(node.childNodes[childIndex]);
            }
            result += "</" +node.tagName+">\n";
        }else{ //unary tag
            result = "<" +node.tagName+attributes+" />";
        }
        
    }else if (node.nodeType == 3){ //node is text
        result = node.text;
    }
    return result;
}

function setDOMinnerHTML(node, response){
    if(typeof ActiveXObject != "undefined"){ //we're in IE, we must set it through the dom
        //remove anything here
        while(node.firstChild) node.removeChild(node.firstChild);
        addDOMinnerHTML(node, response);
    } else{ 
        if(response.responseText) node.innerHTML = response.responseText; //every other browser does a simple overwrite
        else node.innerHTML = response;
    }
}

function Properties(){
    this.properties = new Array();
    this.comments = new Array(); //comments indexed by line number
    
    this.save = function(){
        var props = this.properties;
        var result = '';
        for(key in props){
            result += key+'='+props[key]+"\n";
        }
        return result;
    }
    
    this.get = function(name){
        return this.properties[name];
    }
    
    this.set = function(name, value){
        this.properties[name] = value;
    }
    
    this.load = function(fileBody){
        var lines = fileBody.split("\n");
        for(var lineNumber=0; lineNumber<lines.length; lineNumber++){
            //todo: add comment support (#)
            var pieces = lines[lineNumber].split('=');
            if(pieces.length >= 2){ // it has a key and a value
                var key = pieces[0];
                var value = '';
                for(var lcv=1;lcv<pieces.length; lcv++){
                    if(lcv == pieces.length-1) value += pieces[lcv];
                    else value += pieces[lcv]+'=';
                }
            }
        }
    }
}
