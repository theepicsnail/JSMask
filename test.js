
var canvas
var context;
var selectedRect = [null,null,null,null];
var gridSize = 8;
var DEFAULT_IMAGE = "def.jpg"
var workingImage = null; // The image that gets modified as we work.
var baseImage = null; //A copy of the image that was loaded.

function X(){return Math.min(selectedRect[0],selectedRect[2]);}
function Y(){return Math.min(selectedRect[1],selectedRect[3]);}
function W(){return Math.abs(selectedRect[0]-selectedRect[2]);}
function H(){return Math.abs(selectedRect[1]-selectedRect[3]);}

//Image operations {{{
function setBaseImage(src){

    console.log("Base Image")
    var img = new Image();
    img.onload = function(){
        canvas.width=img.width
        canvas.height=img.height
        selectedRect = [null,null,null,null]
        baseImage = img
        workingImage = img.cloneNode()
        renderImage()
    }
    img.src = src;
}
function reset(){
    workingImage = baseImage.cloneNode();
    renderFull()
}
function save(){
    renderImage();
    open(canvas.toDataURL("image/png"));//.replace("image/png","image/octet-stream");
}

function renderImage(){
    if(workingImage == null) return;
    with(context){
        drawImage(workingImage,0,0)
    }
}

function renderFull(cursorPos){
    renderImage();
    function cross(x,y){
        with(context){
            beginPath()
            moveTo(0,y)
            lineTo(canvas.width,y)
            moveTo(x,0)
            lineTo(x,canvas.height)
            stroke()
        }
    }


    with(context){
        lineWidth   = 3;
        strokeStyle = "rgb(0,255,0)"
        if(selectedRect[2]!=null){
            strokeRect(X(),Y(),W(),H());
        }else if(selectedRect[0])
            cross(selectedRect[0],selectedRect[1])
        if(cursorPos){
            strokeStype ="rgb(255,0,0)"
            cross(cursorPos.x, cursorPos.y)
        }
    }
}

function swapPixel(data, o1, o2){
    //This function will be called a LOT. 
    //Avoided loops and extra variable declarations.
    var t = data[o1];
    data[o1] = data[o2]; //red
    data[o2] = t;
    
    t = data[o1+1];
    data[o1+1] = data[o2+1]; //green
    data[o2+1] = t;
    
    t = data[o1+2];
    data[o1+2] = data[o2+2]; //blue
    data[o2+2] = t;

//    t = data[o1+3];
//    data[o1+3] = data[o2+3]; //alpha always 255 everywhere.
//    data[o2+3] = t;
}
function swapRG(data){
    for(var i = 0 ;i < data.length ; i+=4){
        var tmp = data[i];
        data[i] = data[i+1];
        data[i+1]=tmp;
    }
}
function flipBlock(data){
    for(var x=0; x < 8; x++)
    for(var y=x+1; y < 8 ; y++){
        var src = x+y*8;
        var dst = y+x*8;
        swapPixel(data,src*4,dst*4);
    }
}

function getSelectionData(clip){
    if(selectedRect.indexOf(null)!=-1)
    {
        alert("Select a region first!");
        return [];
    }
    renderImage()
    w = W()
    h = H()
    if(clip)
    {
        w-=w%clip;
        h-=h%clip;
    }
    return context.getImageData(X(),Y(),w,h);
}
function getSelectionDataGrid(size){
    renderImage()
    var out = [];
    var maxX = W();
    var maxY = H();
    maxX-=maxX%size;
    maxY-=maxY%size;
    maxX+=X();
    maxY+=Y();
    for(var y = Y() ; y < maxY; y+=size)
    for(var x = X() ; x < maxX; x+=size)
        out.push(context.getImageData(x,y,size,size))
    return out;
}


function putSelectionData(data){
    if(data)
        context.putImageData(data,X(),Y(),0,0,data.width,data.height);
    workingImage.onload = renderFull
    workingImage.src = canvas.toDataURL()
}
//}}}
//Gmask operations {{{
function xor(){ 
    var imgData = getSelectionData()
    for (i=0; i<imgData.width*imgData.height*4;i+=4)
    {
    imgData.data[i]^=0x80;
    imgData.data[i+1]^=0x80;
    imgData.data[i+2]^=0x80;
    imgData.data[i+3]=255;
    }
    putSelectionData(imgData);
}

function invert(){
    var imgData = getSelectionData()
    for (i=0; i<imgData.width*imgData.height*4;i+=4)
    {
    imgData.data[i]=255-imgData.data[i];
    imgData.data[i+1]=255-imgData.data[i+1];
    imgData.data[i+2]=255-imgData.data[i+2];
    imgData.data[i+3]=255;
    }
    putSelectionData(imgData);
}
function rgb(){
    var imgData = getSelectionData()
    for (i=0; i<imgData.width*imgData.height*4;i+=4)
    {
    var tmp = imgData.data[i];
    imgData.data[i]=imgData.data[i+1];
    imgData.data[i+1]=imgData.data[i+2];
    imgData.data[i+2]=tmp;
    imgData.data[i+3]=255;
    }
    putSelectionData(imgData);
}
function vglass(){
    var imgData = getSelectionData(8);
    var size = imgData.width*imgData.height;
    for(var i =0; i< size; i+=8){
        for(var tx = 0; tx<4 ; tx++){
            swapPixel(imgData.data,(i+tx)*4,(i+7-tx)*4)
        }
    }
    putSelectionData(imgData);
}
function hglass(){
    var imgData = getSelectionData(8);
    var size = imgData.width*imgData.height;
    for(var r =0; r< size; r+=imgData.width*8){
        for(var c = 0; c < imgData.width ; c++){
            for(var ty = 0; ty<4 ; ty++){
                swapPixel(
                    imgData.data,
                    (r+c+imgData.width*(ty)  )*4,
                    (r+c+imgData.width*(7-ty))*4
                )
            }
        }
    }
    putSelectionData(imgData);
}
function win(){
    var imgData = getSelectionData(16);
    var size = imgData.width*imgData.height;
    for(var i =0; i< size; i+=16){
        swapPixel(imgData.data,(i+ 0)*4,(i+12)*4)
        swapPixel(imgData.data,(i+ 1)*4,(i+ 8)*4)
        swapPixel(imgData.data,(i+ 2)*4,(i+ 6)*4)
        swapPixel(imgData.data,(i+ 3)*4,(i+15)*4)
        swapPixel(imgData.data,(i+ 4)*4,(i+ 9)*4)
        swapPixel(imgData.data,(i+ 5)*4,(i+13)*4)
        swapPixel(imgData.data,(i+ 7)*4,(i+11)*4)
        swapPixel(imgData.data,(i+10)*4,(i+14)*4)
    }
    putSelectionData(imgData);
   
}
function meko(inv){
    var grid  = getSelectionDataGrid(16);
    var perm = genPerm(grid.length);
    var x = X();
    var y = Y();
    var w = Math.floor(W()/16)
    if(inv)
        perm = inverse(perm)

    perm.forEach(function (idx,val){
        var xoff = idx%w;
        var yoff = (idx-xoff)/w;
        context.putImageData(grid[val],x+xoff*16,y+yoff*16);
    });
    putSelectionData()
    invert();
}

function fl(){
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
    

    var grid = getSelectionDataGrid(8);
    var x = X();
    var y = Y();
    var w = W()/8;
    var h = H()/8;
    var fl = GetFLTables(h,w)
    fl.forEach(function(val,idx){
        var xoff = idx%w;
        var yoff = (idx-xoff)/w;
        context.putImageData(grid[val.n], x+xoff*8, y+yoff*8);
    });
    putSelectionData();
    invert()
}

function Q0(){
    hglass();
    vglass();
    invert();
}




function CP(){
    var code = prompt("Enter a password:","password").toUpperCase()
    if(code.length == 0 || code.length >15){
        alert("Code invalid.")
        return
    }
    function codeAt(i){
        return code.charCodeAt(i%code.length)-65
    }

    var grid = getSelectionDataGrid(8);
    var w = W()/8;
    var h = H()/8;
    var cells = w*h;
    var x = cells-1;
    var y = code.length + cells % code.length;
    var cpTable = [];
    var table = [];
    var cpKey =[
        0x10, 0x17, 0x13, 0x15, 0x09,
        0x08, 0x0a, 0x14, 0x06, 0x05,
        0x16, 0x02, 0x0d, 0x03, 0x01,
        0x04, 0x19, 0x0c, 0x0f, 0x0e,
        0x12, 0x07, 0x0b, 0x18, 0x11, 0x1a];

    for(var i = 0 ; i < cells ; i++){
        table[i]=-1;
        cpTable[i]={'pair':i,'flag':false};
    }

    for(var i = 0 ; i < cells; i++){
        x = cpKey[codeAt(i)]+x+y;
        if(x >= cells) x%=cells;
        while(table[x] != -1){
            if(i%2){
                if(x==0) x = cells
                x--;
            }else{
                x++;
                if(x>=cells)
                    x = 0;
            }
        }
        table[x]=i
        y++;
    }
    var i=0;
    for(var j = cells - 1; i < j; j--){
        cpTable[table[i]].pair=table[j]
        cpTable[table[j]].pair=table[i]
        if((table[i]^table[j])&1){
            cpTable[table[i]].flag=true;
            cpTable[table[j]].flag=true;
        }
        i++;
    }
    x=X();
    y=Y();
    cpTable.forEach(function(ent, idx){
        var flag = ent.flag;
        var pos = ent.pair;
        var xoff = idx%w;
        var yoff = Math.floor(idx/w);
        if(flag)
            flipBlock(grid[pos].data)      
        swapRG(grid[pos].data)
        context.putImageData(grid[pos],x+xoff*8,y+yoff*8);
    });
    putSelectionData();
    invert()
}


//}}}
// UI stuff {{{
function pos(ev){
    var x = ev.clientX - canvas.offsetLeft + (gridSize>>1);
    var y = ev.clientY - canvas.offsetTop + (gridSize>>1);
    x-=x%gridSize
    y-=y%gridSize
    return {'x':x, 'y':y}
}

function loadImage() {
    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onload = function(evt) {
        setBaseImage(evt.target.result);
    };
    reader.readAsDataURL(file);
}
function click(ev){
    p = pos(ev)
    if(selectedRect[0]==null || selectedRect[2]!=null){
        selectedRect[0] = p.x;
        selectedRect[1] = p.y;
        selectedRect[2] = null;
        selectedRect[3] = null;
    }else if(selectedRect[2]==null){
        selectedRect[2] = p.x;
        selectedRect[3] = p.y;
    }
    renderFull()
}
function move(e){
    if(workingImage == null) return;
    renderImage()
    p = pos(e)
    renderFull(p)
}
function mouseOut(e){
    renderFull()
}
function setRegion(){
    selectedRect = [null,null,null,null]
}

function onload(){
    document.getElementById('files').addEventListener('change', loadImage,false);
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    
    canvas.addEventListener('click', click,false);
    canvas.addEventListener('mousemove', move,false);
    canvas.addEventListener('mouseout', mouseOut,false);
    setBaseImage(DEFAULT_IMAGE)
}
//}}}
