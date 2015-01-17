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
        
        var cell = cells[rowId][colId];
        
        var j = perm[i];
        var permR = j/columns >> 0;
        var permC = j%columns; 
        canvas.display.ctx.putImageData(cell, 
            x + 16 * permC, y + 16 * permR);
      }
    }
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "m_minus_btn")
        .click(onClick);
    }
  }; 
});
