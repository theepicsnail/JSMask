define(["jquery", "canvas"], function($, canvas) {
  return {
    render:function() {
      return $("<div>")
        .attr('id', 'workspace')
        .append(canvas.render());
    }
  };
});
