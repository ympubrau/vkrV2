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
    positions = [],
    currentIndex = 0,
    compositionResults = [],
    circleResults = [],
    buttons = [
        ['1', 'Неподвижен'],
        ['5', 'Замедляется'],
        ['2', 'Начинает движение'],
        ['6', 'Заканчивает двжиение'],
        ['3', 'Ускоряется'],
        ['7', 'Левитирует'],
        ['4', 'Максимальная скорость']]
;

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
    if (e.compositions) {
        compositionResults = e.compositions;
    }
    if (e.circles) {
        circleResults = e.circles
    }
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
    betweenPositions = betweenPositionsTemp;
    roundSize = roundSizeTemp;
    border = borderTemp;

    document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;

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
            positions.push([borderTemp + i * betweenPositionsTemp,borderTemp + j * betweenPositionsTemp])
        }
    }

    if (random){
        for (let i = positions.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = positions[i];
            positions[i] = positions[j];
            positions[j] = temp;
        }
    }

    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    ctx.beginPath();
    ctx.arc(borderTemp, borderTemp, roundSizeTemp/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()
    canvas.style.paddingTop = `${(window.innerHeight - canvas.offsetHeight)/2}px`;
}


function startTesting(){
    document.getElementById('results').hidden = true;
    document.getElementById('startDiv').style.display = 'none';
    document.getElementById('demo').hidden = false;
    document.getElementById('buttons').hidden = false;
    currentIndex = 0;
    positions = [];
    redrawCanvas();
}

function testing(){
    if (currentIndex !== positions.length){
        ctx.rect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fill();
        ctx.strokeStyle = roundColor;
        ctx.fillStyle = roundColor;
        ctx.beginPath();
        ctx.arc(positions[currentIndex][0], positions[currentIndex][1], roundSize/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
        console.log(currentIndex);
        currentIndex++;
    }
    else {
        document.getElementById('buttons').hidden = true;
        document.getElementById('results').hidden = false;
        ctx.width = canvas.width - border*2;
        ctx.height = canvas.height - border*2;
        ctx.fillStyle = '#FFFFFF';
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        for (let i = 0; i < positions.length; i++){
            switch (positions[i][2]){
                case 'btn1':
                    ctx.fillStyle = '#FFFFFF';
                    break;
                case 'btn2':
                    ctx.fillStyle = '#d5d5d5';
                    break;
                case 'btn3':
                    ctx.fillStyle = '#b0b0b0';
                    break;
                case 'btn4':
                    ctx.fillStyle = '#858585';
                    break;
                case 'btn5':
                    ctx.fillStyle = '#646464';
                    break;
                case 'btn6':
                    ctx.fillStyle = '#444444';
                    break;
                case 'btn7':
                    ctx.fillStyle = '#000000';
                    break;
            }
            ctx.beginPath();
            ctx.rect(positions[i][0] - betweenPositions/2, positions[i][1] - betweenPositions/2, betweenPositions, betweenPositions);
            ctx.fill();
            ctx.closePath()
        }
        compositionResults.push([...positions]);
    }
}

function endTesting(){
    let data = {
        units: units,
        random: random,
        roundSize: roundSize,
        xPositions: xPositions,
        yPositions: yPositions,
        betweenPositions : betweenPositions,
        border : border,
        roundColor: roundColor,
        canvasBackgroundColor : canvasBackgroundColor,
        backgroundColor : backgroundColor,
        buttons : buttons,
        compositions : [...compositionResults],
        circles : circleResults
    }

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    const link = document.createElement("a");
    link.setAttribute("href",dataStr);
    link.setAttribute("download", "settings.json");
    link.click();
}

for (let e of buttons){
    let temp = document.getElementById('btn' + e[0])
    temp.hidden = false;
    temp.innerHTML = e[1];
    temp.addEventListener('click', function (){
        if (currentIndex < positions.length) positions[currentIndex].push(temp.id);
        testing()
    })
}