/**
 *this file contains a set of methods that exstend Raphael for my convenience 
 */

/*global Raphael*/

Raphael.el.setId = function(id){
    this.id = this.node.id =this.node.raphaelid = id;
};
Raphael.st.setId = function(id){
    this.id = id;
};

Raphael.fn.getElementByNode = function(node){
    if(/circle|rect|path|ellipse|image|text/.test(node.nodeName)){
        return this.getById(node.raphaelid);
    }
    return null;
};

Raphael.fn.print = function (){
    var ids = [];
     this.forEach(function(el){
         ids.push(el.id);
     });
    console.log(ids);
};

Raphael.el.getOffset = Raphael.st.getOffset = function(){
    var x = this.offX || 0, y = this.offY || 0;
        switch(x){
            case 0: x = 0; break;
            case 0.5: x= 3;break;
            case 1: x = 6; break;
        }
        switch(y){
            case 0: y = 0; break;
            case 0.5: y= 1;break;
            case 1: y = 2; break;
        }
        return x+y;
}

//**editor dependent methods**//

/**
  * get or set transformation to an element using its freetransform object se by the eitor
  * depednecy raphael.freetransform, el.ft
  * @param tr (sting) define transformation
  * @param val (number) tranformation value
  */
Raphael.el.trans =Raphael.st.trans = function(tr,val) {
    //console.log(this);
    //if(this.type==="path" && !el.ft ) return;
    var el = this, bb, ft = el.ft, at = ft.attrs, is = Raphael.is, offx,offy, bb = el.getBBox(), m;
     if((el.type==="set"?el[0]:el).matrix){
         m = (el.type==="set"?el[0]:el).matrix.split()
     }
    if(!tr){
        return Object.append(el.attr(), el.trans(['tx','ty','sx','sy','rotate', 'bwidth', 'bheight']));;
    } else {
        if(is(tr, 'array')){
            bb = {};
                tr.each(function(i){
                    bb[i] = el.trans(i);
                });
            return bb;
        }
        if(is(tr, 'object')){
            Object.each(tr, function(i, key){
                el.trans(key, i);
            });
            return;
        }
        if(typeof val !== 'undefined'){
            switch(tr){
            case 'tx':
                at.translate.x = (val-el.offX*bb.width)-at.x;
                break;
            case 'ty':
                at.translate.y = (val-el.offY*bb.height)-at.y;
                break;
            case 'bwidth':
                //val -= at.size.x;
                //at.x -= val/2;
                //at.translate.x += val/2;
                at.scale.x = val/at.size.x;
                //el.attr({width:at.size.x, x:at.x});
                break;
            case 'bheight':
                //val -= at.size.y;
                //at.y -= val/2;
                //at.translate.y += val/2;
                at.scale.y = val/at.size.y;
                //el.attr({height:at.size.y, y:at.y});
                break;
            case 'sx':
            
                at.scale.x = val;
                break;
            case 'sy':
                at.scale.y = val;
                break;
            case 'ox': //0.5 means center
                //el.ox = val;
                break;
            case 'oy':
                //TODO el.oy = val;
                break;
            case 'rotate':
                at.rotate = val;
                break;
            default: el.attr(tr,val); return;
            }
            
            //console.log("el update",el.matrix.split());
            ft.apply();
            
            return;
        } else {
            switch(tr) {
            case 'trs':
            console.log(m);
                val = [
                    ['R', m.rotate, at.center.x, at.center.y],
                    ['S', m.scalex, m.scaley, at.center.x, at.center.y],
                    ['T', m.dx||0, m.dy||0]
                    ];
                break;
            case 'tx':
                val = (bb.x + el.offX*bb.width).round(1);//(at.x+at.translate.x).round()+offx;
                break;
            case 'ty':
                val = (bb.y + el.offY*bb.height).round(1);//(at.y+at.translate.y).round()+offy;
                break;
            case 'bwidth':
                val = (bb.width).round();
                break;
            case 'bheight':
                val = (bb.height).round();
                break;
            case 'sx':
                val = ((m.scalex).round(3)).round(2);
                break;
            case 'sy':
                val = ((m.scaley).round(3)).round(2);
                break;
            case 'ox': //0.5 means center
                //TODO
                break;
            case 'oy':
                //TODO
                break;
            case 'rotate':
                val = m.rotate.round();
                break;
            default: val = el.attr(tr);
            }
            return val;
        }
    }
    
}
/**
 * get a seperate value of part of a transformation assumes the order is R S T
 */
Raphael.fn.getAnimValue = function(tr, anim){
    var ts = Raphael.parseTransformString(anim.anim[100]['transform']),
    n=0, val;
    switch(tr){
    case 'tx':case'ty':
        n=2;
        break;
    case 'sx':case 'sy':
        n=1;
        break;
    case 'rotate':
        n=0
        break;
    }
    return ts[n];
}

Raphael.el.ftUpdate = function(attr, val){
    var at = this.ft.attrs;
    if(typeof attr === 'object' && !(attr instanceof Array)){
        Object.each(attr, function(v, key){
            el.ftUpdate(key, v);
        });
        return;
    }
    if(typeof val !== 'undefined'){
        switch(attr){
        case 'tx':
            at.translate.x = val;
            break;
        case 'ty':
            at.translate.y = val;
            break;
        case 'bwidth':
            //val -= at.size.x;
            //at.x -= val/2;
            //at.translate.x += val/2;
            at.scale.x = val/at.size.x;
            //el.attr({width:at.size.x, x:at.x});
            break;
        case 'bheight':
            //val -= at.size.y;
            //at.y -= val/2;
            //at.translate.y += val/2;
            at.scale.y = val/at.size.y;
            //el.attr({height:at.size.y, y:at.y});
            break;
        case 'sx':
            at.scale.x = val;
            break;
        case 'sy':
            at.scale.y = val;
            break;
        case 'ox': //0.5 means center
            //el.ox = val;
            break;
        case 'oy':
            //TODO el.oy = val;
            break;
        case 'rotate':
            at.rotate = val;
            break;
        }
        //console.log(attr, val);
        this.ft.updateHandles();
    }
} 
/**
 * get a seperate value of part of a transformation assumes the order is R S T
 */
Raphael.el.setFt = Raphael.st.setFt = function(ft, ft2){
    if(!ft) return;
    var at = this.ft.attrs, att = ft.attrs, at2;
    if(ft2){
        at2 = ft2.attrs;
    } else {
        at2 = {
            translate:{x:0,y:0},
            scale:{x:1,y:1},
            rotate:0
        };
    }
    at.translate.x = att.translate.x;
    at.translate.y = att.translate.y;
    at.scale = {x:att.scale.x, y: att.scale.y};
    at.rotate = att.rotate;
    at.x = at.x;
    at.y = att.y;
    this.ft.apply();
}

/**
 * returns a sting in javascript that would generate this element if Rapahel is in the enviroment
 * assumes paper is the Rapahel objec tname by default
 */
Raphael.el.toJS = function(options){
    var o = options,  p= o.paper||"paper", el = this, anim = el.anim, attr = el.attr();
    
    if(attr.transform){
       if(el.matrix.toTransformString() ===""){
           delete attr.transform;
       } else {
           if(o.transformAsSting){
               attr.transform = el.transform();
           }
       }
    }
    if(el.type==="path" && o.pathAsSting){
        attr.path = attr.path.join(" ");
    }
    s = p+"."+el.type+"().attr("+JSON.encode(attr)+")"+
    (anim?
        ".animate("+(anim.times>1?"Raphael.animation(":"")+(JSON.encode(anim.anim)+","+anim.ms)+(anim.times>1?").repeat("+anim.times+")"
            :")")
        :"");
    
    return s;
}

/**
 * returns a sting in javascript that would generate this element if Rapahel is in the enviroment
 * assumes paper is the Rapahel objec tname by default
 */
Raphael.fn.toJS = function(options){
    var o = options||{}, p = this, name = o.name || "paper",
        absolute= o.absolute || false, x = o.x || 0, y = o.y||0,
        w = o.width || p.canvas.offsetWidth, h = o.height || p.canvas.offsetHeight,
        s="";
    s += "\/*Created in Urbino v0.4*\/"+
         "\/*Initialize paper*\/"+
          "var "+name+"=Raphael("+(absolute?x+","+y:'holder')+","+w+","+h+"),"+
          "els={";
        p.forEach(function(el){
            if(!el.noparse)
                s+=""+el.id+":"+el.toJS(name)+",";
        });
    s+="};";
    return s;
}

//Mootools
Array.implement("insertSort", function(n){
    var ar = this, i;
    if(ar.length===0) ar[0] = n;
     for(i=ar.length;~i;i--){ //insert in order
        if(ar[i-1] && ar[i-1]===n) return true;
        if(ar[i-1]<n){
            ar.splice(i,0,n); return true;
        }
    }
});
