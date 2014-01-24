define(["utils/load-image", "jquery", "canvas"], function(loadImage, $, canvas){
  function onClick(evt) {
    load(prompt("Enter image url:"));
  }

  function load(url) {
    if (!url) {
      return;
    }
    loadImage(url, $.proxy(canvas.setImage, canvas));
  }

  // Auto load any url passed in after the # in the url
  // This isn't the /best/ place to put this, but it's definitely
  // the most convenient!
  $(function(){
    load(location.hash.substr(1));
  });

  return {
    render: function() {
      return $("<button>")
        .attr('id', 'load_cloud_btn')
        .click(onClick);
    }
  };
});

