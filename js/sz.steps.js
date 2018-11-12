window.onload = function(){
	var directions = ["horizontal", "vertical"];
	var lengths = ["short", "long", "normal"];
	var direction_index = 0;
	var length_index = 0;
	var directBtnObj = document.querySelector("#direction-btn");
	var lengthBtnObj = document.querySelector("#length-btn");
	var stepsContainer = document.querySelector(".sz-steps");
	
	directBtnObj.onclick = function(){
		directBtnObj.value = "change to " + directions[direction_index%2];
		removeClass(stepsContainer, "sz-steps-" + directions[direction_index%2]);
		addClass(stepsContainer, "sz-steps-" + directions[(direction_index+1)%2]);
		direction_index++;
	};
	
	lengthBtnObj.onclick = function(){
		lengthBtnObj.value = "change to " + lengths[(length_index+1)%3];
		removeClass(stepsContainer, "sz-steps-length-" + lengths[(length_index-1)%3]);
		addClass(stepsContainer, "sz-steps-length-" + lengths[length_index%3]);
		length_index++;
	};
}

function hasClass(elem, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
	ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
  }
}
 
function removeClass(elem, cls) {
  if (hasClass(elem, cls)) {
	var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
	while (newClass.indexOf(' ' + cls + ' ') >= 0) {
	  newClass = newClass.replace(' ' + cls + ' ', ' ');
	}
	elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}