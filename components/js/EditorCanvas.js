/**
 * controls how raphael elements are handeled in the editor
 * @author Amr Draz
 * @dependency raphael.js
 */

function select() {
    var el = this;
    window.fireEvent("selectElement",  {element:el} );
}

function dragMove(dx, dy){
    var dragAxis   = this.data('dragAxis'),
            startPoints   = this.data('startPoints'),
            attrs = {};
        attrs[dragAxis[0]] = startPoints[0] + dx;
        attrs[dragAxis[1]] = startPoints[1] + dy;
        this.attr(attrs);
        this.attr('cursor', 'move');
        this.paper.safari();
        window.fireEvent('updateElement', attrs);
        window.fireEvent('dragMove', [this, dragAxis, startPoints, attrs]);
}
function dragStart(x,y){
    var dragAxis = this.type == 'rect' ? ['x', 'y'] : ['cx', 'cy'];
        var startPoints = [ this.attr(dragAxis[0]), this.attr(dragAxis[1]) ];

        this.toFront();
        this.attr('opacity', .6);
        this.attr('cursor', 'move');

        this.data('dragAxis', dragAxis);
        this.data('startPoints', startPoints);

        window.fireEvent('dragStart', [this, dragAxis, startPoints]);
}
function dragEnd(){
        this.attr('opacity', 1);
        this.attr('cursor', 'default');

        window.fireEvent('dragDone', [this]);
}