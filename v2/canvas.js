define(["jquery", "utils/canvas-relCoords", "utils/canvas-toBlob"], function($) {
  function CanvasBase() {
    this.canvas = $("<canvas>")[0];
    this.ctx = this.canvas.getContext('2d');
  }
  CanvasBase.prototype.render = function() {
      return this.canvas;
  };
  CanvasBase.prototype.resize = function(dim) {
    this.canvas.width = dim.width;
    this.canvas.height = dim.height;
  };


  function Overlay() {
    CanvasBase.call(this);
    this.selection = [-1,-1,-1,-1];
    this.mousedown = false;
    this.canvas.onmousedown = $.proxy(function(e){ 
      this.mousedown = true;
      this.startSelection(this.canvas.relMouseCoords(e));
    },this);
    this.canvas.onmousemove = $.proxy(function(e){
      if(!this.mousedown) {
        return;
      }
      this.continueSelection(this.canvas.relMouseCoords(e));
    }, this);
    this.canvas.onmouseup = $.proxy(function(e) {
      this.endSelection(e);
      this.mousedown = false;
    }, this);
  }
  Overlay.prototype = new CanvasBase();
  Overlay.prototype.constructor = Overlay;

  Overlay.prototype.reset = function() {
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
  };
  Overlay.prototype.startSelection = function(evt) {
    this.reset();
    this.selection[0]=evt.x>>3<<3;
    this.selection[1]=evt.y>>3<<3;
  };
  Overlay.prototype.continueSelection = function(evt) {
    this.selection[2] = evt.x>>3<<3;
    this.selection[3] = evt.y>>3<<3;
    this.updateSelection();
  };
  Overlay.prototype.endSelection = function(evt) {
    var X = this.selection[0], 
        Y = this.selection[1],
        X2= this.selection[2],
        Y2= this.selection[3], W,H;
    if (X>X2) {
      W = X-X2;
      X = X2;
    } else {
      W = X2-X;
    }
    if (Y>Y2) {
      H = Y-Y2;
      Y = Y2;
    } else {
      H = Y2 - Y;
    }
    this.selection[0] = X;
    this.selection[1] = Y;
    this.selection[2] = W;
    this.selection[3] = H;
  };

  Overlay.prototype.updateSelection = function() {
    this.reset();
    var X = this.selection[0], 
        Y = this.selection[1],
        X2= this.selection[2],
        Y2= this.selection[3], W,H;
    if (X>X2) {
      W = X-X2;
      X = X2;
    } else {
      W = X2-X;
    }
    if (Y>Y2) {
      H = Y-Y2;
      Y = Y2;
    } else {
      H = Y2 - Y;
    }
    // Fix aliasing, by centering the edges on pixels 
    this.ctx.strokeRect(X-0.5, Y-0.5, W+1, H+1);

    //
    this.ctx.beginPath();
    for (X2 = 16; X2 < W ; X2 += 16) {
      this.ctx.moveTo(X + X2, Y);
      this.ctx.lineTo(X + X2, Y + H);
    }
    for (Y2 = 16; Y2 < H ; Y2 += 16) {
      this.ctx.moveTo(X, Y + Y2);
      this.ctx.lineTo(X + W, Y + Y2);
    }
    this.ctx.stroke();
  };

  function Canvas() {
    this.overlay = new Overlay();
    this.display = new CanvasBase();
    this.toBlob = $.proxy(this.display.toBlob, this.display); // Export toBlob
  }
  Canvas.prototype.render = function() { 
      return $("<div>")
        .append(this.display.render())
        .append(this.overlay.render())
        ;
    };

  Canvas.prototype.resize = function(dim) {
    this.overlay.resize(dim);
    this.display.resize(dim);
  };

  Canvas.prototype.setImage = function(img) {
    this.resize(img);
    try {
      this.display.ctx.drawImage(img,0,0);
    } catch (e) {
      this.handleError();
    }

    this.overlay.ctx.strokeStyle="#0F0";
    this.overlay.ctx.strokeRect(0,0,100,100);
  };

  Canvas.prototype.handleError = function() {
    this.resize({width:200, height:100});
    this.display.ctx.fillStyle="#000";
    this.display.ctx.fillRect(0,0,200,100);
    this.display.ctx.fillStyle="#f00";
    this.display.ctx.font = "20px Georgia";
    this.display.ctx.fillText("Error loading", 10, 30);
  };

  Canvas.prototype.getSelection = function() {
    var sel = this.overlay.selection;
    console.log(sel, this.display);
    return this.display.ctx.getImageData(sel[0], sel[1], sel[2], sel[3]);
  };
  Canvas.prototype.getSelectionCells = function(cell_width, cell_height) {
    var X = this.overlay.selection[0];
    var Y = this.overlay.selection[1];
    var W = this.overlay.selection[2];
    var H = this.overlay.selection[3];
    var dx, dy;
    var out = [], tmp;
    for(dy = 0 ; dy + cell_width <= H ; dy += cell_height) {
      tmp = [];
      for(dx = 0 ; dx + cell_width <= W ; dx += cell_width) {  
        tmp.push(this.display.ctx.getImageData(X + dx, Y + dy, cell_width, cell_height));
      }
      out.push(tmp);
    }
    return out;
  };

  return new Canvas();
});
