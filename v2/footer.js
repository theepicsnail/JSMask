define(["jquery"], function($) {
  return {
    render:function() {
      return $("<div>").attr('id', 'footer').html("footer");
    }
  };
});
