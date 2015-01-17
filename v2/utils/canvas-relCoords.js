define(function(){
  function relMouseCoords(evt){
    var rect = this.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
});
