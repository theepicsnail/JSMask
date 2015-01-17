requirejs.config({
  shim: {
    "utils/FileSaver": {
      deps:['utils/canvas-toBlob'],
      exports:"saveAs"
    },
    "utils/canvas-toBlob": {
      deps:['utils/Blob']
    }
  }
});

require(["jquery", "menu", "workspace", "footer"], function($, menu, workspace, footer){
  $(function(){
    r = $("<div>")
      .append(menu.render())
      .append(workspace.render())
      .append(footer.render());
    console.log(r);
    $('body').append(r);
  });
});
