define(["canvas"], function(canvas){
  function onClick(evt) {
    canvas.overlay.rect.y+=1;
    canvas.overlay.redraw();
  }
  function shiftOp() {
    var rect = canvas.overlay.rect;
    rect.h += 8;
    canvas.overlay.redraw();
  }
  function onKey(evt) {
    if (evt.keyCode !== 40) {
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
        .attr("id", "move_down_btn")
        .click(onClick);
    }
  };
});
