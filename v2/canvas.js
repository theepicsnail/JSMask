define(["jquery", "utils/canvas-toBlob"], function($) {
  function Canvas() {
    console.log("canvas constructor");
    this.overlay = $("<canvas>")[0];
    this.overlay.ctx = this.overlay.getContext('2d');

    this.canvas = $("<canvas>")[0];
    this.ctx = this.canvas.getContext('2d');
    this.render = function() { 
      return $("<div>")
        .append(this.canvas)
        .append(this.overlay)
        ;
    };

    this.resize = function(dim) {
      this.canvas.width = dim.width;
      this.canvas.height = dim.height;
      this.overlay.width = dim.width;
      this.overlay.height = dim.height;
      
    };

    this.setImage = function(img) {
      this.resize(img);
      try {
        this.ctx.drawImage(img,0,0);
      } catch (e) {
        this.handleError();
      }

      this.overlay.ctx.strokeStyle="#0F0";
      this.overlay.ctx.strokeRect(0,0,100,100);
    };
    this.toBlob = $.proxy(this.canvas.toBlob, this.canvas); // Export toBlob
    this.handleError = function() {
      this.resize({width:200, height:100});
      this.ctx.fillStyle="#000";
      this.ctx.fillRect(0,0,200,100);
      this.ctx.fillStyle="#f00";
      this.ctx.font = "20px Georgia";
      this.ctx.fillText("Error loading", 10, 30);
    };
  }
  return new Canvas();
});
