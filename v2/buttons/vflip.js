
define(["canvas"], function(canvas){
  function onClick(evt) {
    
    var img = canvas.asImage();
    var sel = canvas.overlay.rect;

    var ctx = canvas.display.ctx;
    ctx.scale(1, -1);
    ctx.drawImage(img, sel.x, sel.y, sel.w, sel.h, 
              sel.x, -(sel.y+sel.h), sel.w, sel.h);
    ctx.scale(1, -1);
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "vflip_btn")
        .click(onClick);
    }
  }; 
});
