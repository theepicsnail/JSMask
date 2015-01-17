define(["canvas"], function(canvas){
  function onClick(evt) {
    canvas.overlay.rect.y-=1;
    canvas.overlay.redraw();
  }
  function shiftOp() {
    var rect = canvas.overlay.rect
    if(rect.h >8) {
      rect.h -= 8;
      canvas.overlay.redraw();
    }
  }
  function onKey(evt) {
    if (evt.keyCode !== 38) {
      return true;
    }

    if (evt.shiftKey) {
      shiftOp();
    } else {
      onClick();
    }

    evt.preventDefault();
    return false;
  }
  return {
    render: function() {
      window.addEventListener("keydown", onKey, true);
      return $("<button>")
        .attr("id", "move_up_btn")
        .click(onClick);
    }
  };
});
