define(["canvas"], function(canvas){
  var inverse = [];
  for(var i=0; i < 256; ++i) 
    inverse[i]=255-i;

  function onClick(evt) {
    var sel = canvas.getSelection();
    var region = canvas.overlay.rect;
    for(var i = sel.data.length - 4; i >=0 ; i -=4) {
      sel.data[i]=inverse[sel.data[i]];
      sel.data[i+1]=inverse[sel.data[i+1]];
      sel.data[i+2]=inverse[sel.data[i+2]];
      //sel.data[i+3]=inverse[sel.data[i+3]];
    }
    canvas.display.ctx.putImageData(sel, region.x, region.y);
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "neg_btn")
        .click(onClick);
    }
  }; 
});
