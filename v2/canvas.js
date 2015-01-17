define(["jquery", "utils/canvas-relCoords", "utils/canvas-toBlob"], function($) {
  function Point(x,y) {
    this.x = x|0;
    this.y = y|0;
  }

  function Rect(x,y,w,h) {
    this.x = x|0;
    this.y = y|0;
    this.w = w|0;
    this.h = h|0;
  }

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
    this.p0 = new Point(0, 0); 
    this.p1 = new Point(0, 0);
    this.rect = new Rect(0,0,0,0);

    //this.selection = [-1,-1,-1,-1];
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

  Overlay.prototype.startSelection = function(evt) {
    this.p0.x = (evt.x+4)>>3<<3;
    this.p0.y = (evt.y+4)>>3<<3;
    this.p1.x = this.p0.x;
    this.p1.y = this.p0.y;
    this.updateSelection();
  };
  Overlay.prototype.continueSelection = function(evt) {
    this.p1.x = (evt.x+4)>>3<<3;
    this.p1.y = (evt.y+4)>>3<<3;
    this.updateSelection();
  };
  Overlay.prototype.endSelection = function(evt) {
    this.updateSelection();
  };

  Overlay.prototype.updateSelection = function() {
    var X = this.p0.x, 
        Y = this.p0.y,
        X2= this.p1.x,
        Y2= this.p1.y, W,H;
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
    this.rect.x = X;
    this.rect.y = Y;
    this.rect.w = W;
    this.rect.h = H;
    this.redraw();
  };

  Overlay.prototype.redraw = function() {
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
 
    var X = this.rect.x;
    var Y = this.rect.y;
    var W = this.rect.w;
    var H = this.rect.h;
    
    // Fix aliasing, by centering the edges on pixels 
    this.ctx.strokeRect(X-0.5, Y-0.5, W+1, H+1);

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
    var sel = this.overlay.rect;
    console.log(sel, this.display);
    return this.display.ctx.getImageData(sel.x, sel.y, sel.w, sel.h);
  };
  Canvas.prototype.getSelectionCells = function(cell_width, cell_height) {
    var X = this.overlay.rect.x;
    var Y = this.overlay.rect.y;
    var W = this.overlay.rect.w;
    var H = this.overlay.rect.h;
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

  Canvas.prototype.asImage = function () {
    var img = new Image();
    img.src = this.display.canvas.toDataURL("image/png");
    return img;
  };
  return new Canvas();
});
