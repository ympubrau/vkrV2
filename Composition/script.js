canvas = document.getElementById('canvas');

let roundSize = 50,
    tempRoundSize = roundSize,
    units = 'pix',
    roundColor = '#000000',
    backgroundColor = '#F5F5DC',
    canvasBackgroundColor = '#FFFFFF',
    xPositions = 5,
    yPositions = 5,
    betweenPositions = 50,
    tempBetweenPositions = betweenPositions,
    border = 50,
    tempBorder = border,
    random = false,
    ctx = canvas.getContext('2d'),
    positions = [],
    currentIndex = 0,
    compositionResults = [],
    circleResults = [],
    fileUploaded = false,
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

    let screenSize = window.innerHeight / 500;

    if (units === 'proc'){
        tempRoundSize = +roundSize * screenSize;
        tempBetweenPositions = betweenPositions * screenSize;
        tempBorder = border * screenSize;
    }
    else {
        tempRoundSize = +roundSize;
        tempBetweenPositions = +betweenPositions ;
        tempBorder = +border;
    }
    fileUploaded = true;
}

function redrawCanvas(){
    document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;

    canvas.width = (xPositions - 1) * tempBetweenPositions + (tempBorder * 2);
    canvas.height = (yPositions - 1) * tempBetweenPositions + (tempBorder * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fill();

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    for (let i = 0; i < xPositions; i++){
        for (let j = 0; j < yPositions; j++){
            positions.push([tempBorder + i * tempBetweenPositions,tempBorder + j * tempBetweenPositions])
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

    for (let e of buttons){
        let d = document.getElementById('btn' + e[0]);
        d.hidden = false;
        d.innerHTML = e[1]
    }

    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    ctx.beginPath();
    ctx.arc(positions[0][0], positions[0][1], tempRoundSize/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()
    canvas.style.paddingTop = `${(window.innerHeight - canvas.height)/2}px`;
}

function startTesting(){
    if (fileUploaded) {
        document.getElementById('results').hidden = true;
        document.getElementById('danger').hidden = true;
        document.getElementById('buttons').hidden = false;
        document.getElementById('startDiv').style.display = 'none';
        document.getElementById('demo').hidden = false;
        currentIndex = 0;
        positions = [];
        redrawCanvas();
    }
    else {
        document.getElementById('danger').hidden = false;
    }
}

function testing(){
    if (currentIndex < positions.length - 1){
        currentIndex++;
        ctx.rect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fill();
        ctx.strokeStyle = roundColor;
        ctx.fillStyle = roundColor;
        ctx.beginPath();
        ctx.arc(positions[currentIndex][0], positions[currentIndex][1], tempRoundSize/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
        console.log(currentIndex);
    }
    else {
        document.getElementById('results').hidden = false;
        document.getElementById('buttons').hidden = true;
        ctx.width = canvas.width - tempBorder * 2;
        ctx.height = canvas.height - tempBorder * 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        for (let i = 0; i < positions.length; i++){
            switch (positions[i][2]){
                case 'btn1':
                    ctx.fillStyle = '#000000';
                    break;
                case 'btn2':
                    ctx.fillStyle = '#444444';
                    break;
                case 'btn3':
                    ctx.fillStyle = '#646464';
                    break;
                case 'btn4':
                    ctx.fillStyle = '#858585';
                    break;
                case 'btn5':
                    ctx.fillStyle = '#b0b0b0';
                    break;
                case 'btn6':
                    ctx.fillStyle = '#d5d5d5';
                    break;
                case 'btn7':
                    ctx.fillStyle = '#FFFFFF';
                    break;
            }
            ctx.beginPath();
            ctx.rect(positions[i][0] - tempBetweenPositions/2, positions[i][1] - tempBetweenPositions/2, tempBetweenPositions, tempBetweenPositions);
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
    temp.addEventListener('click', function (){
        if (currentIndex < positions.length) positions[currentIndex].push(temp.id);
        testing()
    })
}
