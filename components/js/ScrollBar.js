

/*global Options,Events,Class,Slider,Element,Raphael*/

var ScrollBar = (function(){
    var
     icon = {
        arrow: "M2 2 8 5 2 8z"
    },
    controlHoverIn = function (){
        this.attr("stroke","#48e");
    },
    controlHoverOut = function (){
        this.attr("stroke","none");
    },
    div = function(c,s){
        s = s || {};
        return new Element("div",{"class":c}).set(s);
    },
    img = function(src,c,s){
        s = s || {};
        return new Element("img",{src:src,"class":c}).set(s);
    },
    vect = function(size,rot,evens){
         var d = div("slider-arrow vect ",{styles:{width:size,height:size}}), r = Raphael(0,0,size,size),
            vec = r.path(icon.arrow)
                    .attr({
                        "fill":"#ddd", "stroke":"none", "cursor":"pointer",
                        transform:[["r",(rot),5,5],["S",size/10,size/10,0,0]]})
                    .hover(controlHoverIn, controlHoverOut);
            d.addEvents(evens||{});
            r.canvas.inject(d);
            d.store("vec",vec);
        return d;
    },
    has = "hasOwnProperty",
    getLarger = function(arr,horizontal){
      var h = (horizontal?'x':'y'),
      i=0,ii=arr.length,
      max = (arr[i].getScrollSize()[h] - arr[i].getSize()[h]);
      for (i=1; i < ii; i++) {
        max.max((arr[i].getScrollSize()[h] - arr[i].getSize()[h]));
      }
      
      return max;
    }
    ;
    return new Class({
        Implements:[Options,Events],
        options:{
        },
        initialize:function(contents, mode, width, height, offset){
            
            contents = this.contents = Array.from(contents);
            this.width = width;
            this.height = height;
            this.mode = mode;
            
            this.bound = {};
            [   "scrollFunc",
                "minus",
                "plus",
                "slide"
            ].each(function(name){
                this.bound[name] = this[name].bind(this);
            }, this);
            
            var
            wh = mode?"width":"height",
            hw = this[mode?"height":"width"],
            rt = mode?"right":"top",
            style = {};
            style[wh] = this[wh]-hw*2;
            
            style[rt] = hw;
            var
            cont = div("container").setStyles(style),
            handel = div("handel"),
            start = vect(hw,mode?"180":"-90",{mousedown:this.bound[mode?"plus":"minus"]}),
            end = vect(hw,mode?"0":"90",{mousedown:this.bound[mode?"minus":"plus"]}),
            d = this.scrollBar = div("scroll-bar "+(mode?"x":"y"),{styles:{width:width||"100%",height:height||"100%"}}).adopt(
                start,
                cont.adopt(handel),
                end
            );
            //console.log({d:cont},handel);
            this.start = start.retrieve("vec");
            this.end = end.retrieve("vec");
            if(offset){
                d.setStyle(rt, offset);
            }
            var
            steps = getLarger(contents,mode),
            slider = this.slider= new Slider(cont, handel, {    
                steps: steps,
                mode: (mode?'horizontal':'vertical'),
                onChange: this.bound.slide
            });
        },
        update:function(){
            var
            mode = this.mode,
            wh = mode?"width":"height",xy = (mode)?"x":"y",
            scrollArea = this.contents[0],
            saSize = scrollArea.getSize()[xy],
            scrollSize = scrollArea.getScrollSize()[xy],
            size = saSize.max(scrollSize),
            slider = this.slider,
            sw = this[wh]-this[mode?"height":"width"]*2;
            if(size<=saSize){
                size=0;
                this.detach();
            } else {
                this.attach();
                size = sw*(saSize/size);
            }
            slider.knob.setStyle(wh,size);
            slider.max = slider.range = scrollSize - saSize;
            slider.steps = scrollSize - saSize;
            slider.stepSize = 1;
            slider.stepWidth = sw;
            slider.autosize();
            if(!this.isOff && this.scrollOff){
                this.contents.invoke("addEvent",'mousewheel', this.bound.scrollFunc);
                this.scrollOff = false;
            }
        },
        detach:function(){
            this.slider.detach();
            this.isOff = true;
            this.contents.invoke("removeEvent",'mousewheel', this.bound.scrollFunc);
            this.end.attr("fill", "#888");
            this.start.attr("fill", "#888");
        },
        attach:function(){
            this.slider.attach();
            this.isOff = false;
            this.end.attr("fill", "#ddd");
            this.start.attr("fill", "#ddd");
        },
        hide:function(){
            this.scrollBar.addClass("hide");
        },
        show:function(){
            this.scrollBar.removeClass("hide");
        },
        size:function(){
            return this[this.mode?"width":"height"];
        },
        resize: function(size){
            var
            mode = this.mode,
            wh = mode?"width":"height",
            hw = this[mode?"height":"width"];
            this[wh] = size;
            this.scrollBar.setStyle(wh,size);
            this.slider.element.setStyle(wh,this[wh]-hw*2);
            this.update();
        },
        setContent: function(cont){
            var slider = this.slider;
            cont = this.contents = Array.from(cont);
            //console.log(cont);
            this.update();
        },
        slide: function(step){
            var
            mode = this.mode,
            x = (mode?step:0),
            y = (mode?0:step)
            ;
           // console.log(step);
            this.contents.each(function(c) {
                c.scrollTo(x, y);
            });
            
            this.fireEvent("change", [step]);
        },
        scrollFunc : function(e) {
            e.stop();
            var slider = this.slider, step = (slider.step - e.wheel * 10).round().limit(slider.min,slider.max);
            //console.log(slider.step, e.wheel, step);
            slider.set(step);
            
        },
        minus:function(){
            var slider = this.slider;
            slider.set(slider.step - (slider.steps*0.1).round());
        },
        plus:function(){
            var slider = this.slider;
            slider.set(slider.step + (slider.steps*0.1).round());
        }
        
    });
})();
