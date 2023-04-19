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
    compositionResults = [],
    circleResults = [],
    buttons = []
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

function applySettings(e) {
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
    displayAll();
}

function displayAll() {
    document.getElementById('startDiv').hidden = true;
    let d = document.getElementById('pars');
    d.innerHTML += `
        <p>Единицы измерения: ${units === 'proc' ? 'Проценты' : 'Пиксели'}</p>
        <p>Распределение: ${random ? 'Случайное' : 'Последовательное'}</p>
        <p>Размер круга: ${roundSize} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Рамка: ${border} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Расстояние между центрами: ${betweenPositions} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Позиции по X: ${xPositions} | Позиции по Y: ${yPositions}</p>
        <p>Цвет круга: ${roundColor}</p>  
        <p>Цвет полотна: ${canvasBackgroundColor}</p> 
        <p>Цвет фона: ${backgroundColor}</p> 
        <p>Состояния: </p>
    `
    for (let e of buttons){
        d.innerHTML += `<p style="margin-left: 2em">${e[1]}</p>`
    }

    let screenSize = window.innerHeight / 500;
    if (units === 'proc'){
        roundSize = +roundSize * screenSize;
        betweenPositions = betweenPositions * screenSize;
        border = border * screenSize;
    }
    else {
        roundSize = +roundSize;
        betweenPositions = +betweenPositions ;
        border = +border;
    }

    d = document.getElementById('compositions')
    if (compositionResults.length === 0) {
        d.innerHTML = '<p><b>Тепловых карт нет</b></p>'
    }
    else {
        d.innerHTML += '<p><b>Тепловые карты:</b></p>'
        for (let i = 0; i < compositionResults.length; i++){
            d.innerHTML += `<canvas id="canvas${i}" style="" width="100" height="100"></canvas>`;
        }
        for (let i = 0; i < compositionResults.length; i++){
            drawCompositionCanvas(i,compositionResults[i])
        }
    }


    d = document.getElementById('circles')
    if (circleResults.length === 0) {
        d.innerHTML = '<p><b>Композиций с кругами нет</b></p>'
    }
    else {
        d.innerHTML += '<p><b>Композиции с кругами:</b></p>'
        for (let i = 0; i < circleResults.length; i++){
            d.innerHTML += `<canvas id="canvas${i + compositionResults.length}" style="border: 1px solid red" width="100" height="100"></canvas>`;
        }
        for (let i = 0; i < circleResults.length; i++){
            drawCirclesCanvas(i + compositionResults.length, circleResults[i])

        }
    }
}

function drawCompositionCanvas(i,positions){
    let canvas = document.getElementById(`canvas${i}`)
    let ctx = canvas.getContext('2d');

    canvas.width = (xPositions - 1) * betweenPositions + (border * 2);
    canvas.height = (yPositions - 1) * betweenPositions + (border * 2);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log(canvas, canvas.width, canvas.height)

    for (let i = 0; i < positions.length; i++){
        console.log('qwe')
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
}

function drawCirclesCanvas(i,e){
    console.log(e)
    let canvas = document.getElementById(`canvas${i}`)
    let ctx = canvas.getContext('2d');

    canvas.width = (xPositions - 1) * betweenPositions + (border * 2);
    canvas.height = (yPositions - 1) * betweenPositions + (border * 2);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log(canvas, canvas.width, canvas.height)

    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    for (let q of e){
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(q[0], q[1], q[2], 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    let m = 0,mx = 0,my = 0, r = 0;
    for (let q of e){
        let sq = Math.PI * q[2] * q[2];
        r += q[2];
        m += sq;
        mx += sq * q[0];
        my += sq * q[1];
    }
    let x = mx / m;
    let y = my / m;
    let radius = r / e.length;

    ctx.fillStyle = '#4728ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
