//set up the raphael canvas
var panel = Raphael("widget_panel", 1000, 600);
//setup our own XML Parser
SVGParser = new Class({
Extends : MidasXMLParser,
open: function(tag, attributes){
    if(tag == "path"){
        //when we find a path, draw it on the raphael canvas
        var shape = panel.path(attributes["d"]).attr({
           fill:"#000000",
           "stroke-width": 1
        });
    }
}
});