var parser = new SVGParser();
var svgRequest = new Request({
    url: 'awesome.svg',
    onSuccess: function(responseText, responseXML) {
        //once we recieve the SVG, we parse it
        parser.parse(responseText);
    }
}).send();