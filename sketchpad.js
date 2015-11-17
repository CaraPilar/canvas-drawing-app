var canvas;
var dataURL;
var context;
var radius = 10;
var cPushArray = new Array();
var cStep = -1;
var dragging;

function init(){
	canvas = document.getElementById('myCanvas');
	dataURL = canvas.toDataURL();
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	dragging = false;
	context.lineWidth = (radius * 2);
	 storeSnapshot();
}

init();

function storeSnapshot() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(canvas.toDataURL());
}

//will put a circle down wherever the user clicks
var putPoint = function(e){
	if(dragging){
	context.lineTo(e.clientX, e.clientY);
	context.stroke();
	context.beginPath();
	//context.arc(e.offsetX, e.offsetY, radius, 0, 2 * Math.PI); //offset no supported by Firefox
	context.arc(e.clientX, e.clientY, radius, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.moveTo(e.clientX, e.clientY);
	}
}

var engage = function(e){
	dragging= true;
	putPoint(e);
}

var disengage = function(){
	dragging = false;
	context.beginPath();
	context.save();	
	storeSnapshot();
}

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mouseup', disengage);
canvas.addEventListener('mousemove', putPoint);

/*Tool Bar Script*/
var minRad = 0.5,
	maxRad = 100,
	defaultRad = 20,
	interval = 5,
	radSpan = document.getElementById('radval'),
	decRad = document.getElementById('decrad'),
	incRad = document.getElementById('incrad');

var setRadius = function(newRadius){
	//console.log(newRadius);
	if(newRadius < minRad)
		newRadius = minRad
	else if(newRadius > maxRad)
		newRadius = maxRad;
	radius = newRadius;
	console.log(radius);
	context.lineWidth = radius * 2;
	radSpan.innerHTML = radius;
}

decRad.addEventListener('click',function(){
	setRadius(radius-interval);
	//console.log(interval);
});

incRad.addEventListener('click',function(){
	if(radius % 1 !== 0){setRadius(parseInt(radius) + interval);
	}else{ setRadius(radius + interval);}
	
	//console.log(interval);
});

var colors = ['black', 'grey', 'white', 'red', 'orange', 'yellow', 'green', 'blue','indigo', 'violet'];
var swatches = document.getElementsByClassName('swatch');
/*for(var i=0, n=swatches.length; i< n; i++){
	swatches[i].addEventListener('click', setSwatch);
}
*/
for(var i=0,n=colors.length; i <n; i++){
	var swatch= document.createElement('div');
	swatch.className = 'swatch';
	swatch.style.backgroundColor= colors[i];
	swatch.addEventListener('click', setSwatch);
	document.getElementById('colors').appendChild(swatch);
}

function setColor(color){
	context.fillStyle = color;
	context.strokeStyle = color;
	var active = document.getElementsByClassName('active')[0];
	if(active){
		active.className ='swatch';
	}
}


function setSwatch(e){
	//identify swatch being clicked
	var swatch = e.target;
	setColor(swatch.style.backgroundColor);
	swatch.className += ' active';
}

//sets first swatch as selected
setSwatch({target: document.getElementsByClassName('swatch')[0]});

/*Clear Canvas*/
var clearButton = document.getElementById('clearCanvas');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas(e){
	storeSnapshot();
	context.clearRect(0, 0, canvas.width, canvas.height);
}

/*Undo*/
var undoButton = document.getElementById('undo')
undoButton.addEventListener('click', cUndo);

function cUndo() {
	var canvasPic = new Image();
    if (cStep > 0) {
        cStep--;
        console.log(cStep);
        
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
        	context.clearRect(0, 0, canvas.width, canvas.height);
        	context.drawImage(canvasPic, 0, 0); }

        }else{
        	    canvasPic.onload = function () {
        	context.clearRect(0, 0, canvas.width, canvas.height);
        	context.drawImage(canvasPic.src, 0, 0); }
        }
}

/*Redo*/
var restoreButton = document.getElementById('restore');
restoreButton.addEventListener('click', restoreCanvas);

function restoreCanvas(e){
	if(cStep >= 0 && (cStep < cPushArray.length-1)){
		console.log(cPushArray.length);
		cStep++;
				//console.log(cStep);
		var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
        	context.clearRect(0, 0, canvas.width, canvas.height);
        	context.drawImage(canvasPic, 0, 0); }
        	console.log(cPushArray);
        }
}


function chooseColoringImg(src){
	 var canvasImg = new Image();
     canvasImg.src = "lion3.gif";
     canvasImg.onload = function () {
     	context.clearRect(0, 0, canvas.width, canvas.height);
      	context.drawImage(canvasImg, canvas.width / 2 - canvasImg.width / 2, canvas.height / 2 - canvasImg.height / 2);
      }
}


/*Erase*/
/*Save*/


/* Ideas */

/**
Adding User Input Text: http://jsfiddle.net/epoch/v29Qe/
Drag & Drop Feature: http://html5.litten.com/how-to-drag-and-drop-on-an-html5-canvas/
Erase: http://stackoverflow.com/questions/25907163/html5-canvas-eraser-tool-without-overdraw-white-color
Drawing Tools: Brush, Pencil, Pen, Eraser, Crop, Copy, Cut Paste
Clip Art, Stickers (Coloring Book)
http://www.techrepublic.com/blog/web-designer/html5-drawing-images-and-adding-text-to-the-canvas-element/
http://www.coloring.ws/lions.htm

**/