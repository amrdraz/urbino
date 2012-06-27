/**
 * @author Draz
 */


var MenuPanel = new Class({
    Implements: PropMixin,
    Extends: Panel,
    bind: function (arr){
        this.bound = this.bound || {};
        Array.from(arr).each(function (name) {
            this.bound[name] = this[name].bind(this);
        }, this);
    },
    initialize: function (R, options) {
        options = options || {};

        this.parent(options);
        this.paper = R;
        this.bind(["svgExport","raphaelExport","svgImport","save","load"]);
        var p = this.panel.addClass("menu-panel"), src = this.src =  options.src || "";
        p.adopt(
            new Element("a", {href: src+"svg.php", text: "Download SVG", events: {
                mousedown: this.bound.svgExport
            }}),
            new Element("a", {href: src+"html.php",text: "Download Raphael", events: {
                mousedown: this.bound.raphaelExport
            }}),
            new Element("a", {href: "#",text: "Import SVG", events: {
                mousedown: this.bound.svgImport
            }}),
            new Element("a", {text: "Save", title:"Not working",events: {
                mousedown: this.bound.save
            }}),
            new Element("a", {text: "Load",title:"Not working", events: {
                mousedown: this.bound.load
            }}),
            new Element("form",{"class":"hide",html:""})
        );
    },
    svgExport: function (e) {
        var r = new Request ( {
            url: this.src+"svgw.php",
            async:false,
        }).post(Object.toQueryString({"svg": this.paper.toSVG()}));
    },
    raphaelExport : function (e) {
        var r = new Request ( {
            url: this.src+"htmlw.php",
            async:false,
        }).post(Object.toQueryString({"js": js_beautify(this.paper.toJS()),"svg": this.paper.toSVG()}));
    },
    svgImport: function (e) {
        var p = this.paper, set = p.set(),
        r = new XML2Object ({xmlurl:prompt("Please type in a url","GUC-logo.svg"),
        "onComplete": function(svg){
           console.log(svg.xmlObj);
           Object.each(svg.xmlObj.childNodes, function(el){
               var attr = el.attributes, m, match;
               if(el.name==="path"){
                   attr.path = attr.d;
                   delete attr.d;
               }
               if(el.name==="image"){
                   attr.src = attr['xlink:href'];
                   delete attr['xlink:href'];
                   delete attr.fill;
                   delete attr['fill-opacity'];
               }
               if(el.name==="text"){
                   if(Object.getLength(el.childNodes)){
                       attr.text = el.childNodes[0].value;
                   } else {
                       attr.text = el.value;
                   }
               }
               el = p[el.name]().attr("stroke","none").attr(attr);
               if(attr.transform){
                   //console.log(attr.transform);
                   if(/^[m|M]/.test(attr.transform)){
                       if ( match = attr.transform.match( /\(([^)]+)/ ) ) m = match[1];
                       m = m.split(/[, ]+/);
                       attr.transform = Raphael.matrix(m[0],m[1],m[2],m[3],m[4],m[5]).toTransformString();
                   } else if(/^[t|T]/.test(attr.transform)){
                       if ( match = attr.transform.match( /\(([^)]+)/ ) ) m = match[1];
                       m = m.split(/[, ]+/);
                       attr.transform = ["T",m[0],",",m[1]]+"";
                   } else if(/^[s|S]/.test(attr.transform)){
                       if ( match = attr.transform.match( /\(([^)]+)/ ) ) m = match[1];
                       m = m.split(/[, ]+/);
                       attr.transform = "S"+m[0]+m[1]?m1+" "+m[2]?" "+m[2]+" "+m[3]:"":"";
                   } else if(/^[r|R]/.test(attr.transform)){
                       if ( match = attr.transform.match( /\(([^)]+)/ ) ) m = match[1];
                       m = m.split(/[, ]+/);
                       attr.transform = "R"+m[0]+m[1]?" "+m[1]+" "+m[2]:"";
                   }
                   
                el.transform(attr.transform);
               }
               set.push(el);
           });
           window.fireEvent("element.create", [set, "set"]);
        }
        });
    },
    save : function (e) {
        return;
        var r = new Request ( {
            url: "svgw.php"
        }).post(Object.toQueryString({"svg": this.paper.toRaphael()}));
    },
    load : function (e) {
        return;
        var r = new Request ( {
            url: "svgw.php"
        }).post(Object.toQueryString({"svg": this.paper.toRaphael()}));
    }
    
});
