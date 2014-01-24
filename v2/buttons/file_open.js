define(["utils/load-image", "jquery", "canvas"], function(loadImage, $, canvas){
  // Used to create the file input prompt
  var fileInput = $("<input>").attr('type', 'file');
  
  fileInput.on('change', function(evt) {
    evt.preventDefault();
    evt = evt.originalEvent;
    var target = evt.target;
    var file = target && target.files && target.files[0];
    if (!file) {
      console.warn("No file to load.", target);
      return;
    }
    console.log("load:", file);
    loadImage(file, $.proxy(canvas.setImage, canvas));

/*      file, function(img){
        canvas.setImage(img);
        console.log("Loaded:", img);
      },{}
      //{canvas:true}
    );
*/  });

  function onClick(evt) {
    fileInput.show().focus().click().hide();
  }

  return {
    render: function() {
      return $("<button>")
        .attr('id', 'load_disk_btn')
        .click(onClick);
    }
  };
});

