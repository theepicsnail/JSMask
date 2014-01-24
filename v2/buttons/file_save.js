define(["utils/FileSaver", "jquery", "canvas"], function(saveAs, $, canvas){
  function onClick(evt) {
    var filename = prompt("Save as:", (+new Date() + ".png"));
    if (!filename) {
      return;
    }
    canvas.toBlob(function(blob) {
      saveAs(blob, filename);
    });
  }

  return {
    render: function() {
      return $("<button>")
        .attr('id', 'save_btn')
        .click(onClick);
    }
  };
});

