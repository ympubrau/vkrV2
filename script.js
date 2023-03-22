const roundSizeSlider = document.getElementById('roundSizeSlider'),
    roundSizeText = document.getElementById('roundSizeText'),
    roundColorPicker = document.getElementById('roundColorPicker'),
    xPositionsText = document.getElementById('xPositionsText'),
    xPositionsSlider = document.getElementById('xPositionsSlider'),
    yPositionsText = document.getElementById('yPositionsText'),
    yPositionsSlider = document.getElementById('yPositionsSlider'),
    betweenPositionsText = document.getElementById('betweenPositionsText'),
    betweenPositionsSlider = document.getElementById('betweenPositionsSlider'),
    borderText = document.getElementById('borderText'),
    borderSlider = document.getElementById('borderSlider'),
    canvas = document.getElementById('canvas'),
    screenProps = document.getElementById('screen');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;

let roundSize = 100,
    roundColor = '000000',
    xPositions = 5,
    yPositions = 5,
    betweenPositions = 50,
    border = 50,
    xSide = 16,
    ySide = 9;
let ctx = canvas.getContext('2d');

redrawCanvas()

roundSizeText.addEventListener('input', function () {
    let v = roundSizeText.value
    if (v >= 500) {
        roundSize = 500;
        roundSizeText.value = 500;
    }
    else {
        roundSize = v;
    }

    roundSizeSlider.value = roundSize;
    redrawCanvas();
})

roundSizeSlider.addEventListener('input', function () {
    roundSize = roundSizeSlider.value;
    roundSizeText.value = roundSize;
    redrawCanvas();
})

roundColorPicker.addEventListener('input', function () {
    roundColor = roundColorPicker.value;
    redrawCanvas();
})

xPositionsText.addEventListener('input', function () {
    let v = xPositionsText.value
    if (v >= 12) {
        xPositions = 12;
        xPositionsText.value = 12;
    }
    else {
        xPositions = v;
    }

    xPositionsSlider.value = xPositions;
    redrawCanvas();
})

xPositionsSlider.addEventListener('input', function () {
    xPositions = xPositionsSlider.value;
    xPositionsText.value = xPositions;
    redrawCanvas();
})

yPositionsText.addEventListener('input', function () {
    let v = yPositionsText.value
    if (v >= 12) {
        yPositions = 12;
        yPositionsText.value = 12;
    }
    else {
        yPositions = v;
    }

    yPositionsSlider.value = yPositions;
    redrawCanvas();
})

yPositionsSlider.addEventListener('input', function () {
    yPositions = yPositionsSlider.value;
    yPositionsText.value = yPositions;
    redrawCanvas();
})

betweenPositionsText.addEventListener('input', function () {
    let v = betweenPositionsText.value
    betweenPositions = v;
    if (v < 20) {
        betweenPositions = 20;
        betweenPositionsText.value = 20;
    }
    else if (v > 100){
        betweenPositions = 100;
        betweenPositionsText.value = 100;
    }
    betweenPositionsSlider.value = betweenPositions;
    redrawCanvas();
})

betweenPositionsSlider.addEventListener('input', function () {
    betweenPositions = betweenPositionsSlider.value;
    betweenPositionsText.value = betweenPositions;
    redrawCanvas();
})

borderText.addEventListener('input', function () {
    border = borderText.value;
    borderSlider.value = border;
    redrawCanvas();
})

borderSlider.addEventListener('input', function () {
    border = borderSlider.value;
    borderText.value = border;
    redrawCanvas();
})

screenProps.addEventListener('input', function () {
   let v = screenProps.value;

   switch (v) {
       case "default":{
           xSide = 16;
           ySide = 9;
           break;
       }

       case "defaultSquare":{
           xSide = 4;
           ySide = 3;
           break;
       }

       case "square":{
           xSide = 1;
           ySide = 1;
           break;
       }

       case "a4":{
           xSide = 1.414;
           ySide = 1;
           break;
       }
   }

   redrawCanvas();
})

function redrawCanvas(){
    let screenParts = xSide + ySide;
    canvas.width = window.innerHeight * 2 / screenParts * xSide;
    canvas.height = window.innerHeight * 2 / screenParts * ySide;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints()
    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    ctx.beginPath();
    ctx.arc(+border + +betweenPositions, +border + +betweenPositions, roundSize/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()
}

function drawPoints() {
    for (let i = 0; i < xPositions; i++){
        for (let j = 0; j < yPositions; j++){
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(+border + i * +betweenPositions, +border + j * +betweenPositions, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath()
        }
    }
}

function downloadJson(){
    let data = {

    }

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    const link = document.createElement("a");
    link.setAttribute("href",dataStr);
    link.setAttribute("download", "scene.json");
    link.click();
}