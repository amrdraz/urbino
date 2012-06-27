// please use a decent browser for testing purposes (e.g. Non-IE)

var paper = Raphael(document.getElementById('paper'), "100%", "100%");

function importSVG() {
    paper.clear();
  paper.importSVG(document.getElementById("inText").value);
  var arr = [];
  paper.forEach(function(el){
         arr.push(el);
     });
  console.log(arr);
};