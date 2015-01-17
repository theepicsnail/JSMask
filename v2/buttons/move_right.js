define(["canvas"], function(canvas){
  function onClick(evt) {
    canvas.overlay.rect.x+=1;
    canvas.overlay.redraw();
  }
  function shiftOp() {
    var rect = canvas.overlay.rect;
    rect.w += 8;
    canvas.overlay.redraw();
  }
  function onKey(evt) {
    if (evt.keyCode !== 39) {
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
        .attr("id", "move_right_btn")
        .click(onClick);
    }
  };
});
