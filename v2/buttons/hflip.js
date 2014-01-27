define(["canvas"], function(canvas){
  function onClick(evt) {
    
    var img = canvas.asImage();
    var sel = canvas.overlay.selection;

    var ctx = canvas.display.ctx;
    ctx.scale(-1, 1);
    ctx.drawImage(img, sel[0], sel[1], sel[2], sel[3], 
            -(sel[0]+sel[2]), sel[1] , sel[2], sel[3]);
    ctx.scale(-1, 1);
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "hflip_btn")
        .click(onClick);
    }
  }; 
});



