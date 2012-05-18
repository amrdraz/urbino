/** 
 * Path Manger raphael plugin
 * Copyright (c) 2012 Amr Draz
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*global Raphael*/

/**
 * path managment function
 * @author Amr Draz
 * @dependency Raphael
 * @param patharray (array) the path that wil be managed 
 * @param options (obj) object for optional modifications can conatin
 *                      - handelattr (obj) an object in Raphael's attr format for handel style
 *                      - controlattr (obj) an object in Raphael's attr format for segment's control anchor styles
 *                      - anchorattr (obj) an object in Raphael's attr format for segment anchor styles
 */
Raphael.fn.pathManager = function(patharray, options, callback) {
    // Enable method chaining
    //if ( subject && subject.customPath ) return subject.customPath;
    var r = this, pm, guideattr = {"fill":"none", "stroke":"#4f8"};
    
    var
    options = options || {},
    handelattr = options.handelattr || {stroke: "#49f", "stroke-dasharray": ""},
    controlattr = options.controlattr || {r:2,fill: "#222",stroke: "#48f"},
    anchorattr = options.anchorattr || {r:3,fill: "#48e",stroke: "#333"},
    isLine = function(bez) {
        return (bez[0]==bez[2] && bez[1]==bez[3] && bez[4]==bez[6] && bez[5]==bez[7]);
    },
    mid = function (a,b,t){
        return [(1-t)*a[0] + t*b[0], (1-t)*a[1] + t*b[1]];
    },
    splitBez = function(t, bez) {
        
        var 
        P0 = bez.splice(0,2),
        P1 = bez.splice(0,2),
        P2 = bez.splice(0,2),
        P3 = bez.splice(0,2);
        
        P0 = mid(P0, P1, t);    //reuse P0 setting it to the first mid anchor
        P1 = mid(P1, P2, t);    //reuse P1 setting it to the second mid anchor
        P2 = mid(P2, P3, t);    //reuse P2 setting it to the third mid anchor
        
        P0 = mid(P0, P1, t);    //reuse P0 setting it to the new segment's anchor anchor with the previous line
        P2 = mid(P1, P2, t);    //reuse P2 setting it to the new segment's anchor anchor with the next line
        
        P1 = mid(P0, P2, t);    //reuse P1 setting it to the new segment's anchor
        
        return [P1[0],P1[1],P0[0],P0[1], P2[0],P2[1]];
    },
        
        toggleClose = function(seg) {
            var i,ii,segs = path.segments, pa = path.patharray,end,mCount;
            if(seg.prev === null){
                end = seg;
                while(end.next!==null){ end = end.next;}
                pa.splice(end.index+1,0, ["C", end.attr("nx"),end.attr("ny"), seg.attr("px"),seg.attr("py"), seg.attr("ax"), seg.attr("ay")]);
                segs.splice(end.index+1, 0, segment(["Z"], end.index, {"prev":end, "next":seg}));
                
                for (i=end.index+1, ii = segs.length; i < ii; i++) {
                    segs[i].index++;
                };
            } else {
                end = seg.prev;
                pa.splice(end.index,1);
                segs.splice(end.index, 1);
                
                end.prev.next = null;
                seg.prev = null;
                for (i=end.index, ii = segs.length; i < ii; i++) {
                    segs[i].index--;
                };
                
                end.remove();
            }
             
            path.redraw();
        },
        down= function (x,y,e){
            var seg = this.parentSet;
            if(e.altKey){
                if(/prev|next/.test(this.control)){
                    seg.symmetry = false;
                } else {
                    seg.symmetry = true;
                    var a = seg.attr(["ax","ay"]);
                    seg.attr({"nx":a.ax, "ny":a.ay, "px":a.ax, "py":a.ay});
                    seg.updateHandels();
                    seg.path.redraw();
                    seg.drawing = true;
                }
            }
        },
        move = function (dx, dy) {
            var el = this, seg = el.parentSet;
            if(seg.drawing){
                el = seg.attr("n");
            }
            el.update(dx - (el.dx || 0), dy - (el.dy || 0));
            el.dx = dx;
            el.dy = dy;
        },
        up = function (e) {
            var seg = this.parentSet;
            if((this.dx ===0 && this.dy === 0)){
                if(e.shiftKey || (seg.next==null && seg.prev==null)) {
                    removeSegment(seg);
                    return;
                } else {
                    
                    if(seg.type=="M" && !e.altKey) {toggleClose(seg);}
                }
            }
            if(seg.drawing){
                seg.attr("n").dx = 0;
                seg.attr("n").dy = 0;
            } 
            this.dx = this.dy = 0;
            seg.drawing = false;

        },
        segDbclick = function (e){
            var seg = this.parentSet;
            if(seg.type=="M" && !e.altKey) {toggleClose(seg);}
        },
        segmentAttr = function(att, set){
            var res,p, seg = this, i = seg.index, pa = seg.path.patharray,
            attrs = ["index","symmetry","next","nx","ny","n","prev","px","py","p","ax","ay","a"];
            if(!att){
                seg.attr(attrs);
                return;
            }
            //output a an object with all specified attributes
            if(Raphael.is(att, "array")){
                res = {};
                for(i = 0, p = att.length; i< p;i++){
                    if(attrs.contains(att[i])){
                        res[att[i]] = seg.attr(att[i]);
                    }
                }
                return res;
            }
            //inputed an object set several attribues
            if(Raphael.is(att, "object")){
                for(p in att){
                    if(att.hasOwnProperty(p) && attrs.contains(p)){
                        seg.attr(p,att[p]);
                    }
                }
                return;
            }
            //Inputed 2 values set  one attribute
            if(set){
                switch(att) {
                    case "index":
                        seg.index = set;
                        break;
                    case "symmetry":
                        seg.symmetry = set;
                        break;
                    case "next":
                        seg.next = set || null;
                        if(set) {set.prev = seg;}
                        break;
                    case "prev":
                        seg.prev = set || null;
                        if(set) {set.next = seg;}
                        break;
                    case "nx":
                        seg[2].attr("cx", set);
                        if(seg.next!==null){pa[i+1][1] = set;}
                        seg.handelarray[2][1] = set;
                        break;
                    case "ny":
                        seg[2].attr("cy", set);
                        if(seg.next!==null){pa[i+1][2] = set;}
                        seg.handelarray[2][2] = set;
                        break;
                    case "px":
                        seg[1].attr("cx", set);
                        if(seg.type=="M"){
                            if(seg.prev!==null){pa[seg.prev.index][3] = set;}
                        } else {
                            pa[i][3] = set;
                        }
                        seg.handelarray[0][1] = set;
                        break;
                    case "py":
                        seg[1].attr("cy", set);
                        if(seg.type=="M"){
                            if(seg.prev!==null){pa[seg.prev.index][4] = set;}
                        } else {
                            pa[i][4] = set;
                        }
                        seg.handelarray[0][2] = set;
                        break;
                    case "ax":
                        seg[3].attr("cx", set);
                        if(seg.type==="M"){
                            pa[i][1] = set;
                            if(seg.prev!==null){
                                pa[seg.prev.index][5] = set;
                            }
                        } else {
                            pa[i][5] = set;
                        }
                        seg.handelarray[1][1] = set;
                        break;
                    case "ay":
                        seg[3].attr("cy", set);
                        if(seg.type==="M"){
                            pa[i][2] = set;
                            if(seg.prev!==null){
                                pa[seg.prev.index][6] = set;
                            }
                        } else {
                            pa[i][6] = set;
                        }
                        seg.handelarray[1][2] = set;
                        break;
                }
                return;
            }
            //Inputed just 1 value Get one attribute
            switch(att) {
                case "symmetry": res = seg.symmetry;   break;
                case "index": res = seg.index;         break;
                case "next" : res = seg.next;          break;
                case "prev" : res = seg.prev;          break;
                case "nx"   : res = seg[2].attr("cx"); break;
                case "ny"   : res = seg[2].attr("cy"); break;
                case "n"    : res = seg[2];            break;
                case "px"   : res = seg[1].attr("cx"); break;
                case "py"   : res = seg[1].attr("cy"); break;
                case "p"    : res = seg[1];            break;
                case "ax"   : res = seg[3].attr("cx"); break;
                case "ay"   : res = seg[3].attr("cy"); break;
                case "a"    : res = seg[3];            break;
            }
            return res;
        },
        updateHandels = function(){
            this[0].attr("path", this.handelarray);
        },
    /**
     * method that creates a path segment control anchor
     * if type is a line suuch as 'M' or 'L' only the fisrt 2 values in s is taken into consideration
     * if type is 'S' the last 2 anchors are not considered
     * @param s (array) [type,anchorX,anchorY[, previousX,previousY[,nextX,nextY]]]
     * @param index (num) the corrisponding index of this segment in the path
     * @param options (obj) options additional options for segment can include
     *                      - prev (obj) a refrence the previous segment
     *                      - next (obj) a refrence to the next segment
     *                      - symmetry (bool) symetry on or not default true
     * segment contains
     * - handelarray (array) array for the handels path
     * - 
     */
    segment  = function(s, index, options) {
        var
        seg = r.set(),
        a = s[1],b = s[2],c,d,f,e,
        options = options || {};
        
        seg.update = true;
        seg.drawing = false;
        seg.path = path;
        seg.updateHandels = updateHandels;
        seg.attr = segmentAttr;
        
        seg.index = index;
        seg.symmetry = true;
        seg.prev = null;
        seg.next = null;
        seg.attr(options);
        
        if (s[0]=="Z"){
            seg.type = "Z";
            return seg;
        }
        if(s[0]=="M") {
                c = e = a;
                d = f= b;
                seg.type = "M";
        } else {
            switch(s[0]){
                case "L":
                    c = e = a;
                    d = f= b;
                    break;
                case "C":
                    e = s[5]; f = s[6];
                    c = s[3]; d = s[4];
                    break;
                case "S":
                    c = e = s[3]; d = f = s[4];
                    //TODO correctly implent this
                    break;
            }
            seg.type = "C";
        }
        seg.handelarray = [["M",c,d],["L",a,b],["L",e,f]];
        seg.push(
            r.path(seg.handelarray).attr(handelattr),  //segment handels
            r.circle(c,d, 5).attr(controlattr),            //circle for prev line
            r.circle(e,f, 5).attr(controlattr),      //circle for next line
            r.circle(a,b, 5).attr(anchorattr)     //circle for this segment anchor
        );
        seg[1].control = "prev";
        
        seg[2].control = "next";
        
        seg[3].control = "anchor";
        seg[3].dblclick(segDbclick);
        
        seg.forEach(function(el){
            if(el.type=="circle"){
                el.drag(move, down, up);
                el.update = update;
                el.dx =el.dy = 0;
            }
            el.parentSet = seg;
            el.noparse = true;
        });
        
        return seg;
    },
    addSegment = function(e){
        var
        segs = path.segments, pa = path.patharray,
        ip = r.canvas.getParent().getPosition(),
        x = (e.x - ip.x),
        y = (e.y - ip.y),
        seg, set, h;
        
        if(!e.shiftKey){return;}
        
        ip = Raphael.pathIntersection(this.attr("path"), [["M",(x),(y+3)],["L",(x),(y-3)]])[0];
        if(ip === undefined){
            ip = Raphael.pathIntersection(this.attr("path"), [["M",(x+3),(y)],["L",(x-3),(y)]])[0];
        }
        seg = (isLine(ip.bez1))?[ip.x,ip.y,ip.x,ip.y,ip.x,ip.y]:splitBez(ip.t1, ip.bez1);
        
        ip = ip.segment1;       //reuse as index for old segments's anchor
        
        x = pa[ip][1];          //reuse as temp value for next anchor x
        y = pa[ip][2];          //reuse as temp value for next anchor y
        pa[ip][1] = seg[4];     //set new anchor next anchor x
        pa[ip][2] = seg[5];     //set new anchor next anchor y
        
        pa.splice(ip,0,["C",x,y, seg[2],seg[3],seg[0], seg[1]]);
        seg = segment(["C", seg[0],seg[1],seg[2], seg[3],seg[4], seg[5]], ip-1, {prev:segs[ip-1], next:segs[ip]});
        
        segs.splice(ip,0,seg);
        
        for (var i = ip, ii= segs.length; i < ii; i++) {
            segs[i].index++;
        }
        //console.log(pa);
        //console.log(segs);
    },
    removeSegment = function(seg){
       var
       i= seg.index, num = 1,
       prev = seg.prev, next = seg.next,
       pa = seg.path.patharray, segs = seg.path.segments;
       
       
       if(segs.length===0){return;}
       if(next===null && prev===null){
           seg.remove();
           pa.pop();
           segs.pop();
           seg.path.redraw();
           return;
       }
       
       if(seg.type==="M" ){
           if(next!==null && next.type=="Z"){
               num++;
           } else {
               if(next!==null) {
                   next.attr("prev", prev);
               }
               next.type = "M";
               pa[i+1] = ["M", next.attr("ax"), next.attr("ay")];
               if(prev!==null) {
                   pa[prev.index][5] = next.attr("ax");
                   pa[prev.index][6] = next.attr("ay");
                   pa[prev.index][3] = next.attr("nx");
                   pa[prev.index][4] = next.attr("ny");
               }
           }
       } else {
           prev.attr({"next":next});
           if(next!==null){
               pa[i+1][1] = prev.attr("nx");
               pa[i+1][2] = prev.attr("ny");
           }
       }
       
       
       pa.splice(i,num);
       segs.splice(i,num);
       
       for (var ii= segs.length; i < ii; i++) {
           segs[i].index-=num;
       }
       seg.remove();
       //console.log(pa);
       //console.log(segs);
       seg.path.redraw();
   
    },
    update = function(x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y,
            seg = this.parentSet,
            i = seg.index,
            toggle = false,
            pa = seg.path.patharray;
        
        switch(this.control){
        case "next":
            seg.attr({"nx": X, "ny": Y});
            if(seg.symmetry && seg.update) {
                seg.update = false;
                seg.attr("p").update(-x,-y);
                seg.update = true;
            }
            if(seg.update) {
                seg.updateHandels();
                seg.path.redraw();
            }
            
            break;
        case "prev":
            seg.attr({"px": X, "py": Y});
            if(seg.symmetry && seg.update) {
                seg.update = false;
                seg.attr("n").update(-x,-y);
                seg.update = true;
            }
            if(seg.update) {
                seg.updateHandels();
                seg.path.redraw();
            }
            break;
        case "anchor":
            seg.attr({"ax": X, "ay": Y});
            toggle = seg.symmetry;
            seg.symmetry = false;
            seg.update = false;
            seg.attr("n").update(x, y);
            seg.update = true;
            seg.attr("p").update(x, y);
            seg.symmetry = toggle;
            break;
      }
    
    },
    /**
     * inserts a new segment anchor at the end of the path
     */
    insertSegment = function (x,y){
        var segs = path.segments, pa = path.patharray,
        seg, type,
        prev = (segs.length>0)?segs.last():null;
        
        if(prev !== null && (prev.type!="Z")) {
            type = "L";
            pa.push(["C", prev.attr("nx"),prev.attr("ny"),x,y,x,y]);
        } else {
            segs.lastM = segs.length;
            type = "M";
            prev = null;
            pa.push(["M",x,y]);
        }
        
        seg = segment([type, x, y], pa.length-1, {"prev":prev});
        
        segs.push(seg);
        
        seg.path.redraw();
    },
    parse = function(p) {
         var segs = path.segments,pa = path.patharray = Raphael._path2curve(p),
         x,y, seg;
         
         path.attr("path", pa);
         
         for (var i=0, ii = pa.length; i < ii; i++) {
          
          p = pa[i];
          x = p[1]; y = p[2];
          if(p[0]==="M"){
            lastM = segs.lastM = i;
            segs.push(segment(["M", x, y], i,{"symmetry":false}));
          } else {
                seg = segs.last();
                seg.attr({"nx":x, "ny":y});
                seg.updateHandels();
                
                if(i+1==ii || (i+1!=ii && pa[i+1][0]=="M" && p[i][5]==p[lastM][1] && p[i][6]==p[lastM][2])){
                    
                    segs.push(segment(["Z"], i, {"prev":seg, "next":segs[lastM]}));
                    segs[lastM].attr({"px":p[3],"py":p[4]});
                } else {
                    x = p[5]; y = p[6];
                    segs.push(segment(["C",x,y,p[3],p[4],x,y], i, {"prev":seg, "symmetry":false}));
                }
          }
          
        }
         
        return path;
    },
    parsePath = function (set)  {
        var arr = [], index = 0, p,p2,p3;
        this.handelarray.empty();
        for (var i=0, ii = set.length; i < ii; i++) {
            p = set[i];
            p.arrayIndex = index;
          switch(set[i].data("control")){
            case "M":
                arr.push(["M", p.attr("cx"), p.attr("cy")]);
                this.handelarray.push([]);
                break;
            case "Ca":
                p2=set[++i];
                p2.arrayIndex = index;
                p3=set[++i];
                p3.arrayIndex = index;
                arr.push(["C", p.attr("cx"),p.attr("cy"),p2.attr("cx"),p2.attr("cy"),p3.attr("cx"),p3.attr("cy")]);
                this.handelarray.push([["M", set[i-3].attr("cx"), set[i-3].attr("cy")],
                                    ["L", p.attr("cx"),p.attr("cy")],
                                    ["M", p2.attr("cx"),p2.attr("cy")],
                                    ["L", p3.attr("cx"),p3.attr("cy")]]);
                break;
            case "L":
                arr.push(["L", p.attr("cx"), p.attr("cy")]);
                break;
            case "Z":
                arr.push(["Z"]);
                break;
          }
          index++;
        }
        return arr;
    }
    ;

    var
    path = r.path();
    path.patharray = [];
    
    path.guide = r.path().attr(guideattr);
    path.guide.noparse = true;
    path.guide.click(addSegment);
    
    path.segments = r.set();
    path.segments.last = function(){return this[this.length-1];};
    
    if(patharray) {parse(patharray);}
    path.drawing = true;
    if(path.node.set) {path.node.set("fill-rule","evenodd");}
    
    
var selected = true;

path.insertSegment = function(x,y) {insertSegment(x,y);};
path.closePath = function(){closeSubPath();};
path.redraw = function (){
        var pa = this.patharray;
        this.guide.attr("path",(pa.length>0)?pa:"");
        this.attr("path",(pa.length>0)?pa:"");
    };
path.unplug = function(){
    path.segments.remove();
    path.guide.remove();
    
    path.drawing = false;
    
    delete path.segments;
    delete path.guide;
};
path.plug = function(){
    var pa = path.patharray || path.attr(path),
    trans = path.transform();
    
    path.guide = r.path().attr(guideattr);
    path.guide.noparse = true;
    path.guide.click(addSegment);
    
    path.patharray = [];
    path.segments = r.set();
    path.segments.last = function(){return this[this.length-1];};
    
    path.drawing = true;
    
    path.transform("");
    
    pa = Raphael.transformPath(pa,trans);
    parse(pa);
    };
path.hide = function(oldFunc){
    return function (){
            path.unplug();
            oldFunc.call(path,arguments);
        };
    }(path.hide);
path.show = function(oldFunc){
    return function (){
            oldFunc.call(path,arguments); 
            path.plug();
        };
    }(path.show);
path.remove = function(oldFunc){
    return function (){
            path.unplug();
            oldFunc.call(path,arguments); 
        };
    }(path.remove); 
//set.update = function() {set[0].update();};
//set.parsePath = function() {set[0].parsePath();};
//set.move = function() {set[0].move();};
//set.up = function() {set[0].up();};
    return path;
};