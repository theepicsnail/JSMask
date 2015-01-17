    function GetFLTables(h, w){//{{{
        var fs = [];
        var ct = 0;
        var nc = h*w;
        var i,d=0;
        var now = (h-1)*w;
        for(i = 0 ; i < nc ; i++)
            fs[i]={'n':0,'id':0}

        var finished = false;
        while(!finished){
            if (w-d > 0)
                for(i=0; i<w-d; i++){
                    fs[ct++].n=now + i
                    if(ct == nc){
                        finished = true;
                        break;
                    }
                }
            if(finished) continue;

            now = fs[ct-1].n-w;
            d++;
            if(h-d>0)
                for(i = 0; i < h-d; i++){
                    fs[ct++].n = now-i*w;
                    if(ct == nc){
                        finished = true;
                        break;
                    }
                }
            if(finished) continue;
            now = fs[ct-1].n-1;
            if(w-d>0)
                for(i = 0 ; i < w-d; i++){
                    fs[ct++].n = now - i;
                    if(ct == nc){
                        finished = true;
                        break;
                    }
                }
            if(finished) continue;
            
            now = fs[ct-1].n+w;
            d++;
            if(h-d > 0)
                for(i = 0 ; i < h-d; i++){
                    fs[ct++].n = now+i*w;
                    if(ct == nc){
                        finished = true;
                        break
                    }
                }
            if(finished) continue;
            now = fs[ct-1].n+1;
        }
        for(i = 0 ; i < nc; i++){
            fs[i].id=fs[nc-i-1].n;
        }

        fs.sort(function(a,b){return a.id-b.id});

        return fs;
    }//}}}
 
define(["canvas"], function(canvas){

  function onClick(evt) {
    var sel = canvas.getSelectionCells(8, 8);
    var region = canvas.overlay.rect;
    var x = region.x;
    var y = region.y;
    var w = region.w/8;
    var h = region.h/8;
    var fl = GetFLTables(h, w);
    console.log(fl);
    fl.forEach(function(val, idx){
        console.log(idx, val);
        var xoff = idx%w;
        var yoff = (idx-xoff)/w;
        var selX = val.n%w;
        var selY = (val.n-selX)/w;
        console.log(selX, selY, sel.length, sel[0].length);
        canvas.display.ctx.putImageData(sel[selY][selX], x+xoff*8, y+yoff*8);
    });
  }
  return {
    render: function() {
      return $("<button>")
        .attr("id", "fl_btn")
        .click(onClick);
    }
  }; 
});
