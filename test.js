var canvas;
var context;
function loadImage() {


    var files = document.getElementById('files').files;
    document.getElementById('tmp').file = files[0]
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onload = function(evt) {
        console.log("--------")

        var image = new Image();
        image.onload = function(){
            console.log("Image loaded.")
            console.log(image.width)
            canvas.width=image.width;
            canvas.height=image.height;
            context.drawImage(this,0,0)
        };
        image.src = evt.target.result;


    };


    if (file.webkitSlice) {
      var blob = file.webkitSlice(0,file.size);
    } else if (file.mozSlice) {
      var blob = file.mozSlice(0,file.size);
    }
    reader.readAsDataURL(blob);
}
function click(ev){
    var gridSize = 16;
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    x-=x%gridSize
    y-=y%gridSize
    with(context){
        strokeStyle = "rgb(255,0,0)"
        fillRect(x,y,gridSize,gridSize)
    }
}
function move(e){}
function onload(){

    document.getElementById('files').addEventListener('change', loadImage,false);
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    
    canvas.addEventListener('click', click,false);
    canvas.addEventListener('move', move,false);
}
