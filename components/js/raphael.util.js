/**
 *this file contains a set of methods that exstend Raphael for my convenience 
 */

/*global Raphael*/

Raphael.el.setId = function(id){
    this.id = id;
    this.node.raphaelid = id;
};

Raphael.fn.getElementByNode = function(node){
    if(/circle|rect|path|ellipse|image|text/.test(node.tagName)){
        return this.getById(node.raphaelid);
    }
};