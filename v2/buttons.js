var BUTTONS = [
//List of buttons, in the order they should be displayed
'file_open',
'cloud_open',
'file_save',
'neg',
'move_left',
'move_down',
'move_up',
'move_right',
'vflip',
'hflip',
'meko_plus',
'meko_minus',
'fl',
];
/*
    'buttons/cp', 'buttons/file_open', 'buttons/file_save', 'buttons/fl', 
    'buttons/hflip', 'buttons/hwin', 'buttons/meko_minus', 'buttons/meko_plus', 
    'buttons/move_down', 'buttons/move_left', 'buttons/move_right', 
    'buttons/move_up', 'buttons/neg', 'buttons/q0', 'buttons/redo', 
    'buttons/rgb', 'buttons/undo', 'buttons/url_open', 'buttons/vflip', 
    'buttons/vwin', 'buttons/win', 'buttons/xor', 'buttons/zoom_in', 
    'buttons/zoom_out'];
*/

var MODULES = [];
var idx;
for (idx = 0 ; idx < BUTTONS.length ; idx ++) {
  MODULES.push('buttons/' + BUTTONS[idx]);
}

define(MODULES, function() {
  var idx = 0;
  var obj = {};
  for (idx = 0; idx < MODULES.length ; idx++) {
    obj[BUTTONS[idx]]=arguments[idx];
  }
  obj.names=BUTTONS;
  return obj;
});

