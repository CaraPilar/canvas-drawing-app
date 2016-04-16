var canvas;
var dataURL;
var context;
var radius = 10;
var cPushArray = new Array();
var cStep = -1;
var dragging;
var rect;
var offsetx;
var offsety;
var eraserOn = false;

init();

function init() {
    canvas = document.getElementById('myCanvas');
    dataURL = canvas.toDataURL();
    context = canvas.getContext('2d');
    rect = canvas.getBoundingClientRect();
    canvas.width = 1000; //window.innerWidth;
    canvas.height = 550; //window.innerHeight;
    dragging = false;
    context.lineWidth = (radius * 2);
    storeSnapshot();
}

function storeSnapshot() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
    }
    cPushArray.push(canvas.toDataURL());
}

//will put a circle down wherever the user clicks
var putPoint = function(e) {
    if (dragging) {
        context.lineTo(e.clientX - 174, e.clientY - 50);
        context.stroke();
        context.beginPath();
        if (eraserOn == true) {
            context.globalCompositeOperation = "destination-out";
        } else {
            context.globalCompositeOperation = "source-over";
        }
        context.arc(e.clientX - 174, e.clientY - 50, radius, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.moveTo(e.clientX - 174, e.clientY - 50);
    }
}

var engage = function(e) {
    dragging = true;
    putPoint(e);
}

var disengage = function() {
    dragging = false;
    context.beginPath();
    if (eraserOn == true) {
        context.globalCompositeOperation = "source-over";
    }
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

var setRadius = function(newRadius) {
    //console.log(newRadius);
    if (newRadius < minRad)
        newRadius = minRad
    else if (newRadius > maxRad)
        newRadius = maxRad;
    radius = newRadius;
    context.lineWidth = radius * 2;
    radSpan.innerHTML = radius;
}

decRad.addEventListener('click', function() {
    setRadius(radius - interval);
    //console.log(interval);
});

incRad.addEventListener('click', function() {
    if (radius % 1 !== 0) {
        setRadius(parseInt(radius) + interval);
    } else {
        setRadius(radius + interval);
    }
    //console.log(interval);
});

var colors = ['black', 'grey', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var swatches = document.getElementsByClassName('swatch');
/*for(var i=0, n=swatches.length; i< n; i++){
	swatches[i].addEventListener('click', setSwatch);
}
*/
for (var i = 0, n = colors.length; i < n; i++) {
    var swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click', setSwatch);
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    var active = document.getElementsByClassName('active')[0];
    if (active) {
        active.className = 'swatch';
    }
}

function setSwatch(e) {
    //identify swatch being clicked
    eraserOn = false;
    var swatch = e.target;
    setColor(swatch.style.backgroundColor);
    swatch.className += ' active';
    var eraser = document.getElementById('eraser');
    eraser.className = '';

}

//sets first swatch as selected
setSwatch({
    target: document.getElementsByClassName('swatch')[0]
});

/*Clear Canvas*/
var clearButton = document.getElementById('clearCanvas');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas(e) {
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
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }

    } else {
        canvasPic.onload = function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic.src, 0, 0);
        }
    }
}

/*Redo*/
var restoreButton = document.getElementById('restore');
restoreButton.addEventListener('click', restoreCanvas);

function restoreCanvas(e) {
    if (cStep >= 0 && (cStep < cPushArray.length - 1)) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }
    }
}


document.onkeydown = KeyPress;

/*Erase*/
var eraserButton = document.getElementById('eraser');
eraserButton.addEventListener('click', setEraser);

function setEraser(e) {
    eraserOn = true;
    var eraser = document.getElementById('eraser');
    eraser.className += ' set';
    var active = document.getElementsByClassName('active')[0];
    if (active) {
        active.className = 'swatch';
    }
}

/* This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
 */
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
 */
document.getElementById('save').addEventListener('click', function() {
    downloadCanvas(this, 'myCanvas', 'test.png');
}, false);


/* Undo/Redo on KeyPress */
function KeyPress(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        cUndo();
    } else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
        restoreCanvas();
    }
}

/************* Ideas *************/

/*Save*/
//Save Canvas as png/jpg

/**
Adding User Input Text: http://jsfiddle.net/epoch/v29Qe/

Advanced Color Tool

Drag & Drop Feature: http://html5.litten.com/how-to-drag-and-drop-on-an-html5-canvas/

Erase: http://stackoverflow.com/questions/25907163/html5-canvas-eraser-tool-without-overdraw-white-color

Drawing Tools: Brush, Pencil, Pen, Eraser, Crop, Copy, Cut Paste

Background Fill


Clip Art, Stickers (Coloring Book)
http://www.techrepublic.com/blog/web-designer/html5-drawing-images-and-adding-text-to-the-canvas-element/
http://www.coloring.ws/lions.htm
**/