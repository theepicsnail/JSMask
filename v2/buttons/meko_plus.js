define(["mekorand", "canvas"], function(meko, canvas){
  function onClick(evt) {
    
    var cells = canvas.getSelectionCells(16, 16);
    var perm = meko.genPerm(cells.length * cells[0].length);
    
    var x = canvas.overlay.rect.x;
    var y = canvas.overlay.rect.y;

    var columns = cells[0].length;

    var rowId, colId, i= 0;
    for(rowId = 0 ; rowId < cells.length ; rowId ++) {
      for(colId = 0 ; colId < columns ; colId ++, i++) {
        
        
        var j = perm[i];
        var permR = j/columns >> 0;
        var permC = j%columns; 
        
        var cell = cells[permR][permC];
        canvas.display.ctx.putImageData(cell, 
            x + 16 * colId, y + 16 * rowId);
      }
    }
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "m_plus_btn")
        .click(onClick);
    }
  }; 
});
