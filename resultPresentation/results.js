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
    buttons = [],
    centers = []
;
let qwe = [];
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
    [...document.getElementsByTagName('details')].forEach(e => e.hidden = false);
    document.getElementById('startDiv').hidden = true;
    document.getElementById('startDiv').style.display = 'none'
    let d = document.getElementById('pars');
    d.innerHTML += `
        <p>Единицы измерения: ${units === 'proc' ? 'Проценты' : 'Пиксели'}</p>
        <p>Распределение: ${random ? 'Случайное' : 'Последовательное'}</p>
        <p>Размер круга: ${roundSize} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Рамка: ${border} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Расстояние между центрами: ${betweenPositions} ${units === 'proc' ? '%' : 'px'}</p>
        <p>Позиции по X: ${xPositions} | Позиции по Y: ${yPositions}</p>
        <p>Цвет круга: ${roundColor} | Цвет полотна: ${canvasBackgroundColor} | Цвет фона: ${backgroundColor}</p>  
    `
    d.innerHTML += 'Состояния: '
    for (let e of buttons){
        d.innerHTML += `${e[1]}, `
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

    countMassCenters()

    d = document.getElementById('circles')
    if (circleResults.length === 0) {
        d.innerHTML = '<p><b>Композиций с кругами нет</b></p>'
    } else {
        for (let i = 0; i < circleResults.length; i++){
            d.innerHTML += `<div class="moved" id="${i}"></div>`;
        }

        for (let i = 0; i < circleResults.length; i++){
            d = document.getElementById(i)
            d.innerHTML += `<canvas class="circles" id="canvas${i}"  width="100" height="100"></canvas>`;
            d.innerHTML += `<details id="details-${i}"><summary>Круги:</summary></details>`
        }

        for (let i = 0; i < circleResults.length; i++){
            d = document.getElementById('details-' + i)
            for (let e of circleResults[i]){
                d.innerHTML += `<p>X: ${(Math.round(e[0]))} | Y : ${(Math.round(e[1]))} | R: ${(Math.round(e[2]))}</p>`;
            }
            d.innerHTML += `<p style="color: blue"><b>X: ${centers[i][0]} | Y : ${centers[i][1]} | R: ${centers[i][2]}</b></p>`;
        }

        for (let i = 0; i < circleResults.length; i++) {
            drawCirclesCanvas(i, circleResults[i])
        }
    }

    d = document.getElementById('compositions')
    if (compositionResults.length === 0) {
        d.innerHTML = '<p><b>Тепловых карт нет</b></p>'
    } else {
        const cmp = (a, b) => (a > b) - (a < b)
        compositionResults.forEach(e => {
            e.sort(function(a, b) {
                return cmp(a[1],b[1]) || cmp(a[0],b[0])
            })
        })

        for (let i = 0; i < compositionResults.length; i++){
            d.innerHTML += `<div id="${i  + circleResults.length}"></div>`;
        }

        for (let i = 0; i < compositionResults.length; i++){
            d = document.getElementById(`${i + circleResults.length}`);
            d.innerHTML += `<canvas id="canvas${i  + circleResults.length}"  width="100" height="100"></canvas>`;
        }

        for (let q = 0; q < compositionResults.length; q++) {
            d = document.getElementById(`${q + circleResults.length}`);
            d.innerHTML += '<br>'
            for (let i = 0; i < yPositions; i++) {
                console.log('qwe')
                for (let j = 0; j < xPositions; j++) {
                    d.innerHTML += compositionResults[q][i * xPositions + j][2].substring(3) - 1
                    qwe.push([compositionResults[q][i * xPositions + j][2].substring(3) - 1])
                }
                d.innerHTML += '<br>'
            }
        }
        for (let q = 0; q < compositionResults.length; q++){
            drawCompositionCanvas(q + circleResults.length, compositionResults[q])
        }
    }

    let xAvg = 0, yAvg = 0, rAvg = 0;
    for (let e of centers){
        xAvg += e[0]
        yAvg += e[1]
        rAvg += e[2]
    }
    xAvg = Math.floor(xAvg / centers.length)
    yAvg = Math.floor(yAvg / centers.length)
    rAvg = Math.floor(rAvg / centers.length)

    d = document.getElementById('finalComps')
    if (compositionResults.length === 0 || circleResults.length === 0 ) {
        d.innerHTML = '<p><b>Невозможно представить результаты</b></p>'
    }
    else {
        for (let i = 0; i < compositionResults.length; i++){
            d.innerHTML += `<canvas id="canvas${i + compositionResults.length + circleResults.length}" style="" width="100" height="100"></canvas>`;
        }
        d.innerHTML += `<p>X: ${xAvg} | Y : ${yAvg} | R: ${rAvg}</p>`;

        for (let i = 0; i < compositionResults.length; i++){
            let ctx = setUpCanvas(i + compositionResults.length + circleResults.length);
            drawCompositionCanvas(i+ compositionResults.length + circleResults.length,compositionResults[i])
            ctx.fillStyle = "rgba(0,231,196,0.9 )";
            ctx.strokeStyle = "rgba(0,60,255,0.95)";
            for (let e of centers) {
                ctx.beginPath();
                ctx.arc(e[0], e[1], e[2], 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(e[0], e[1], e[2], 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }
            ctx.fillStyle = "rgba(231,212,0,0.9)";
            ctx.strokeStyle = "rgba(0,60,255,0.95)";

            ctx.beginPath();
            ctx.arc(xAvg, yAvg, rAvg, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(xAvg, yAvg, rAvg, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawCompositionCanvas(i,positions){
    let ctx = setUpCanvas(i);

    for (let i = 0; i < positions.length; i++){
        //qwe[i].push(positions[i][2].substring(3) - 1)
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
        ctx.rect(positions[i][0] - betweenPositions/2 - border/2, positions[i][1] - betweenPositions/2 - border/2, betweenPositions, betweenPositions);
        ctx.fill();
        ctx.closePath()
    }
}

function drawCirclesCanvas(i,e){
    let ctx = setUpCanvas(i, true);

    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    for (let q of e){
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(q[0], q[1], q[2], 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    drawMassCenter(centers[i], ctx)
}

function drawMassCenter(e, ctx) {
    ctx.fillStyle = '#4728ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(e[0], e[1], e[2], 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function countMassCenters() {
    for (let e of circleResults) {
        let m = 0, mx = 0, my = 0, r = 0;
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
        centers.push([Math.round(x),Math.round(y),Math.round(radius)])
    }
}

function setUpCanvas(i, q){
    let canvas = document.getElementById(`canvas${i}`)
    let ctx = canvas.getContext('2d');

    let temp = q ? border * 2 : border

    canvas.width = (xPositions - 1) * betweenPositions + border * 2;
    canvas.height = (yPositions - 1) * betweenPositions + temp;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx
}