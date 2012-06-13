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

        this.parent(options||{});
        this.paper = R;
        this.bind(["svgExport","raphaelExport","save","load"]);
        var p = this.panel.addClass("menu-panel");
        p.adopt(
            new Element("a", {href: "svg.php", text: "Download SVG", events: {
                mousedown: this.bound.svgExport
            }}),
            new Element("a", {href: "raphael.php", title:"Not working",text: "Download Raphael", events: {
                mousedown: this.bound.rapahelExport
            }}),
            new Element("a", {text: "Save", title:"Not working",events: {
                mousedown: this.bound.save
            }}),
            new Element("a", {text: "Load",title:"Not working", events: {
                mousedown: this.bound.load
            }})
        );
    },
    svgExport: function (e) {
        var r = new Request ( {
            url: "svgw.php",
            async:false,
        }).post(Object.toQueryString({"svg": this.paper.toSVG()}));
    },
    raphaelExport : function (e) {
        var r = new Request ( {
            url: "svgw.php"
        }).post(Object.toQueryString({"svg": this.paper.toRaphael()}));
    },
    save : function (e) {
        var r = new Request ( {
            url: "svgw.php"
        }).post(Object.toQueryString({"svg": this.paper.toRaphael()}));
    },
    load : function (e) {
        var r = new Request ( {
            url: "svgw.php"
        }).post(Object.toQueryString({"svg": this.paper.toRaphael()}));
    }
    
});
