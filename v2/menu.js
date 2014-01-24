define(["require", "jquery", "buttons"], function(require, $, buttons) {
  return {
    render:function() {
      var container = $("<div>").attr('id', 'menu');
      var idx = 0;
      for(idx = 0 ; idx < buttons.names.length; idx++) {
        container.append(buttons[buttons.names[idx]].render());
      }
      return container;
    }
  };
});
