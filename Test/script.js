canvas = document.getElementById('canvas');

let roundSize = 50,
    units = 'pix',
    roundColor = '#000000',
    backgroundColor = '#F5F5DC',
    canvasBackgroundColor = '#FFFFFF',
    xPositions = 5,
    yPositions = 5,
    betweenPositions = 50,
    border = 50,
    random = false,
    ctx = canvas.getContext('2d'),
    buttons = [
        ['1', 'Неподвижен'],
        ['5', 'Замедляется'],
        ['2', 'Начинает движение'],
        ['6', 'Заканчивает двжиение'],
        ['3', 'Ускоряется'],
        ['7', 'Левитирует'],
        ['4', 'Максимальная скорость']]
;

function startTesting(){
    document.getElementById('startDiv').style.display = 'none';
    document.getElementById('demo').hidden = false;
    redrawCanvas();
}

function uploadFile(inp) {
    let file = inp.files[0];
    let text;
    const reader = new FileReader();
    reader.onload = (evt) => {
        text = JSON.parse(evt.target.result.toString());
        applySettings(text);
    };
    reader.readAsText(file);

}

function applySettings(e){
    console.log(e)
    roundSize = e.roundSize;
    units = e.units;
    roundColor = e.roundColor;
    backgroundColor = e.backgroundColor;
    canvasBackgroundColor = e.canvasBackgroundColor;
    xPositions = e.xPositions;
    yPositions = e.yPositions;
    betweenPositions = e.betweenPositions;
    border = e.border;
    random = e.random;
    buttons = e.buttons;
    console.log(buttons)
}

function redrawCanvas(){
    let screenSize = window.innerHeight / 500;
    let betweenPositionsTemp, borderTemp, roundSizeTemp;

    if (units === 'proc'){
        roundSizeTemp = +roundSize * screenSize;
        betweenPositionsTemp = betweenPositions * screenSize;
        borderTemp = border * screenSize;
        console.log(betweenPositionsTemp + " " + borderTemp)
    }
    else {
        roundSizeTemp = +roundSize;
        betweenPositionsTemp = +betweenPositions ;
        borderTemp = +border;
    }

    document.getElementById('demo').style.backgroundColor = backgroundColor;

    canvas.width = (xPositions - 1) * betweenPositionsTemp + (borderTemp * 2);
    canvas.height = (yPositions - 1) * betweenPositionsTemp + (borderTemp * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fill();

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    for (let i = 0; i < xPositions; i++){
        for (let j = 0; j < yPositions; j++){
            ctx.beginPath();
            ctx.arc(borderTemp + i * betweenPositionsTemp, borderTemp + j * betweenPositionsTemp, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    ctx.beginPath();
    ctx.arc(borderTemp, borderTemp, roundSizeTemp/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()

    for (let e of buttons){
       let temp = document.getElementById('btn' + e[0])
        temp.hidden = false;
        temp.innerHTML = e[1];
    }
}