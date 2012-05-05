/***
 *  Version: .1
 * Requires: Mootools
 *    Title: Missing Drag and Drop functions in RaphaelJS
 *
 * Matthew Hazlett
 * Clarity Computers
 * http://www.devclarity.com/
 * 3/4/2012
 *
 ****
 *
 * RaphaelJS is an awsome library for doing canvas
 * related projects in a cross browser fassion.
 *
 * Raphiel Extentions:
 * What the extention does is fill in a few little
 * gaps in the library that specifically relate to
 * drag and drop.  See the comments for details.
 *
 * Class Library:
 * A class that handles the Drag and Drop operations
 * for you.  All you have to do is listen for the
 * events.
 *
 * Events:
 *      Drag.fireEvent('dragStart', [this, this.intersectsWith(), dragAxis, dragInfo]);
 *      Drag.fireEvent('dragMove',  [this, this.intersectsWith(), dragAxis, dragInfo, dragValues]);
 *      Drag.fireEvent('dragDone',  [this, this.intersectsWith()]);
 *      Drag.fireEvent('dragOut',   [this, source]);
 *
 * EX:
 *      Drag.add([this.box, this.circle, this.box2]);
 *
 *      Drag.addEvents({
 *          dragStart: function(ele, intersects, axis, info){
 *              ele.attr('fill', 'red');
 *          },
 *          dragMove: function(ele, intersects, axis, info, newValues){
 *              intersects.each(function(el){
 *                  el.attr('fill', 'green');
 *              });
 *          },
 *          dragOut: function(ele, source){
 *              source.attr('fill', '#333');
 *          },
 *          dragDone: function(ele, intersects){
 *              ele.attr('fill', '#333');
 *              intersects.each(function(el){
 *                  el.attr('fill', 'blue');
 *              });
 *          }
 *      });
 *
 ***
 * Function: getFirst()
 *     Args: none
 *    Notes: This function walks the list of objects
 *           in RaphaelJS the find the first object created
 *  Returns: object
 *      Use: firstObject = myObject.getFirst();
 */
Raphael.el.getFirst = function(){
    var thisObject = this,
        saveObject = null;

    while (thisObject != null){
        saveObject = thisObject;
        thisObject = thisObject.prev;
    }

    return saveObject;
};

/***
 * Function: getAll()
 *     Args: none
 *    Notes: This function walks the list of objects
 *           in RaphaelJS and returns an array of objects
 *  Returns: [ object, object, object ]
 *      Use: allObjects = myObject.getAll();
 */
Raphael.el.getAll = function(){
    var root  = this.getFirst(),
        child = root,
        list  = [];

    while (child != null){
        if (child != this) list.push(child);
            child = child.next;
    }

    return list;
};

/***
 * Function: intersects(myObject)
 *     Args: Object to compare
 *    Notes: This function takes two objects and tells you
 *           if they intersect
 *  Returns: boolean
 *      Use: isIntersect = myObject.intersects(myObject);
 */
Raphael.el.intersects = function(cmp){
    var r1Box = this.getBBox(true),
        r2Box = cmp.getBBox(true);

    r1 = {
        top: (r1Box.y).toInt(),
        left: (r1Box.x).toInt(),
        bottom: (r1Box.y + r1Box.height).toInt(),
        right: (r1Box.x + r1Box.width).toInt()
    };

    r2 = {
        top: (r2Box.y).toInt(),
        left: (r2Box.x).toInt(),
        bottom: (r2Box.y + r2Box.height).toInt(),
        right: (r2Box.x + r2Box.width).toInt()
    };

    return !(r2.left > r1.right ||
             r2.right < r1.left ||
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
};

/***
 * Function: intersectsWith()
 *     Args: none
 *    Notes: This function looks at all the objects
 *           and sees if this object intersects with any
 *  Returns: [ object, object, object ]
 *      Use: allIntersect = myObject.intersectsWith();
 */
Raphael.el.intersectsWith = function(){
    var list = [];

    this.getAll().each(function(el){
        if (this.intersects(el)) {
            list.push(el);
        }
    }.bind(this));

    return list;
};

var DragHelper = new Class({
    Implements: Events,

    initialize: function(){
        this.dragOuts = [];
    },

    add: function(el){
        switch (typeOf(el)){
            case 'array':
                el.each(function(e){
                    e.drag(this.moveDrag, this.startDrag, this.doneDrag);
			        e.attr('cursor', 'pointer');
                }.bind(this));
                break;

             case 'object':
                el.drag(this.moveDrag, this.startDrag, this.doneDrag);
		        el.attr('cursor', 'pointer');
                break;

            default:
                alert('Unsupported type ' + typeOf(el));
        }
    },

    addDragOuts: function(el){
        el.each(function(ele){
            if (!Drag.dragOuts.contains(ele)){
                Drag.dragOuts.push(ele);
            }
        }.bind(this));

        return Drag.dragOuts;
    },

    startDrag: function (x, y){
        var dragAxis = this.type == 'rect' ? ['x', 'y'] : ['cx', 'cy'];
        var dragInfo = [ this.attr(dragAxis[0]), this.attr(dragAxis[1]) ];

        this.toFront();
        this.attr('opacity', .8);
        this.attr('cursor', 'hand');

        this.data('dragAxis', dragAxis);
        this.data('dragInfo', dragInfo);

        Drag.addDragOuts(this.intersectsWith());
        Drag.fireEvent('dragStart', [this, Drag.dragOuts, dragAxis, dragInfo]);
    },

    moveDrag: function (dx, dy){
        var dragAxis   = this.data('dragAxis'),
            dragInfo   = this.data('dragInfo'),
            dragValues = [this.attr(dragAxis[0], dragInfo[0] + dx),
                          this.attr(dragAxis[1], dragInfo[1] + dy)];

        this.attr('cursor', 'move');
        this.paper.safari();

        Drag.dragOuts.each(function(el){
            if (!this.intersects(el)) {
                Drag.dragOuts.erase(el);
                Drag.fireEvent('dragOut', [this, el]);
            }
        }.bind(this));

        Drag.addDragOuts(this.intersectsWith());
        Drag.fireEvent('dragMove', [this, Drag.dragOuts, dragAxis, dragInfo, dragValues]);
    },

    doneDrag: function (){
        this.attr('opacity', 1);
        this.attr('cursor', 'pointer');

        Drag.dragOuts.empty();
        Drag.fireEvent('dragDone', [this, this.intersectsWith()]);
    }
});

window.addEvent('domready', function() {
    Drag = new DragHelper();
});
