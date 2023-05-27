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
            let w = ((xPositions - 1) * betweenPositions + border * 2) / 2;
            let h = ((yPositions - 1) * betweenPositions + border * 2) / 2;
            let rightPhrase, rSign;
            let upPhrase, uSign;

            if (centers[i][0] > w - 5 && centers[i][0] < w + 5) {
                rightPhrase = 'Почти по центру';
                rSign = ' ≈ '
            } else if (centers[i][0] > w) {
                rightPhrase = 'вправо'
                rSign = ' < ';
            } else {
                rightPhrase = 'влево';
                rSign = ' > ';
            }

            if (centers[i][1] > h - 5 && centers[i][1] < h + 5) {
                upPhrase = 'Почти по центру';
                uSign = ' ≈ '
            } else if (centers[i][1] > h) {
                upPhrase = 'вниз'
                uSign = ' < ';
            } else {
                upPhrase = 'вверх';
                uSign = ' > ';
            }


            d = document.getElementById(i)
            d.innerHTML += `<canvas class="circles" id="canvas${i}"  width="100" height="100" style="border: 1px  solid black"></canvas>`;

            d.innerHTML += `<details open>
                                <summary style="padding-bottom: 10px">Дополнительная информация</summary>
                                    <table>
                                        <thead>
                                            <th>Центр масс композиции</th>
                                            <th>Абсолютные координаты</th>
                                            <th>Координаты поля напр.</th>
                                            <th>Смещение</th>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Право-лево (Х)</td>
                                            <td>${w}</td>
                                            <td>${rSign} ${centers[i][0]}</td>
                                            <td>${rightPhrase}</td>
                                        </tr>
                                        <tr>
                                            <td>Верх-низ (Y)</td>
                                            <td>${h}</td>
                                            <td>${uSign} ${centers[i][1]}</td>
                                            <td>${upPhrase}</td>
                                        </tr>
                                    </tbody>
                                    </table>
                            </details>`

            d.innerHTML += `<details>
                                <summary>Круги:</summary> 
                                <table>
                                    <thead>
                                        <th>X</th>
                                        <th>Y</th>
                                        <th>R</th>
                                    </thead>
                                    <tbody id="table-${i}"></tbody>
                                 </table>
                            </details>`

        }


        for (let i = 0; i < circleResults.length; i++){
            d = document.getElementById('table-' + i)
            for (let e of circleResults[i]){
                d.innerHTML += `<td>${(Math.round(e[0]))}</td><td>${(Math.round(e[1]))}</td><td>${(Math.round(e[2]))}</td>`;
            }
            d.innerHTML += `<td style="color: blue"><b>${(Math.round(centers[i][0]))}</b></td>
                            <td style="color: blue"><b>${(Math.round(centers[i][1]))}</b></td>
                            <td style="color: blue"><b>${(Math.round(centers[i][2]))}</b></td>`;
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

        if (compositionResults.length > 1) {
            let temp = [];
            for (let q = 0; q < compositionResults[0].length; q++) {
                let t = 0;
                for (let i = 0; i < compositionResults.length; i++) {
                    t += Number(compositionResults[i][q][2].substring(3))
                }
                temp.push([compositionResults[0][q][0], compositionResults[0][q][1], `btn${((t / compositionResults.length))}`])
            }
            compositionResults.push(temp)
        }


        for (let i = 0; i < compositionResults.length; i++){
            d.innerHTML += `<div id="${i  + circleResults.length}"></div>`
            if (compositionResults.length > 1 && i === (compositionResults.length - 1)) {
                document.getElementById(i  + circleResults.length).innerHTML += `<h3>Среднее значение:</h3>`
            }
        }

        for (let i = 0; i < compositionResults.length; i++){
            d = document.getElementById(`${i + circleResults.length}`);
            d.innerHTML += `<canvas id="canvas${i  + circleResults.length}"  width="100" height="100" style="border: 1px  solid black"></canvas>`;
        }

        for (let q = 0; q < compositionResults.length; q++){
            let halfXPos = Math.floor(xPositions / 2);
            let halfYPos = Math.floor(yPositions / 2);

            let rightSum = 0;
            let leftSum = 0;
            let upSum = 0;
            let downSum = 0;
            let downColor, downSign, upColor;
            let rightSign, rightColor, leftColor;


            for (let i = 0; i < halfYPos; i++) {
                for (let j = 0; j < xPositions; j++) {
                    upSum += compositionResults[q][i * xPositions + j][2].substring(3) - 1;
                }
            }

            for (let i = halfYPos + 1; i < yPositions; i++) {
                for (let j = 0; j < xPositions; j++) {
                    downSum += compositionResults[q][i * xPositions + j][2].substring(3) - 1;
                }
            }

            for (let i = 0; i < yPositions; i++) {
                for (let j = 0; j < halfXPos; j++) {
                    leftSum += compositionResults[q][i * xPositions + j][2].substring(3) - 1;
                }
            }

            for (let i = 0; i < yPositions; i++) {
                for (let j = halfXPos + 1; j < xPositions; j++) {
                    rightSum += compositionResults[q][i * xPositions + j][2].substring(3) - 1;
                }
            }

            if (upSum === downSum) {
                downSign = 'Одинаковая напряженность';
                downColor = '#d0cece';
                upColor = '#d0cece';
            } else if (upSum > downSum) {
                downSign = 'Низ спокойнее';
                downColor = '#9cc2e5'
                upColor = '#f7caac'
            } else {
                downSign = 'Верх спокойнее';
                downColor = '#f7caac'
                upColor = '#9cc2e5'
            }

            if (leftSum === rightSum) {
                rightSign = 'Одинаковая напряженность';
                rightColor = '#d0cece';
                leftColor = '#d0cece';
            } else if (leftSum > rightSum) {
                rightSign = 'Право спокойнее';
                rightColor = '#9cc2e5'
                leftColor = '#f7caac'
            } else {
                rightSign = 'Лево спокойнее';
                rightColor = '#f7caac'
                leftColor = '#9cc2e5'
            }

            d = document.getElementById(`${q + circleResults.length}`);
            d.innerHTML += `<details open>
                                 <summary style="padding-bottom: 10px">Дополнительная информация</summary>
                                 <table class="dopInfo">
                                        <tbody>
                                        <tr>
                                            <td>Верх</td>
                                            <td style="text-align: center; background: ${upColor}">${upSum}</td>
                                            <td rowspan="2">${downSign}</td>
                                        </tr>
                                        <tr>
                                            <td>Низ</td>
                                            <td style="text-align: center; background: ${downColor}">${downSum}</td>
                                        </tr>
                                           
                                        </tbody>
                                 </table>
                                 <br>  
                                 <table class="dopInfo">
                                        <tbody>
                                        <tr>
                                            <td>Лево</td>
                                            <td>Право</td>                                         
                                            <td rowspan="2">${rightSign}</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center; background: ${leftColor}">${leftSum}</td>
                                            <td style="text-align: center; background: ${rightColor}">${rightSum}</td>
                                        </tr>
                                        </tbody>
                                 </table>  
                            </details>`
        }

        for (let q = 0; q < compositionResults.length; q++) {
            d = document.getElementById(`${q + circleResults.length}`);
            d.innerHTML += `<details>
                                 <summary>Матрица</summary>
                                    <table>
                                        <tbody id="tableMaps-${q}"></tbody>
                                    </table>
                            </details>`
            d = document.getElementById('tableMaps-' + q);
            for (let i = 0; i < yPositions; i++) d.innerHTML += `<tr id="tableMaps-${q}-row-${i}"></tr>`
        }


        let t = 0;
        for (let q = 0; q < compositionResults.length; q++) {
            for (let i = 0; i < yPositions; i++) {
                d = document.getElementById(`tableMaps-${q}-row-${i}`);
                for (let j = 0; j < xPositions; j++) {
                    d.innerHTML += `<td>${compositionResults[q][i * xPositions + j][2].substring(3) - 1 + t}</td>`
                }
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
        for (let i = 0; i < compositionResults.length - 1; i++){
            d.innerHTML += `<canvas id="canvas${i + compositionResults.length + circleResults.length}" style="border: 1px  solid black" width="100" height="100"></canvas>`;
        }
        d.innerHTML += `<p>X: ${xAvg} | Y : ${yAvg} | R: ${rAvg}</p>`;

        //не среднее значение!!
        for (let i = 0; i < compositionResults.length - 1; i++){
            let ctx = setUpCanvas(i + compositionResults.length + circleResults.length);
            drawCompositionCanvas(i + compositionResults.length + circleResults.length, compositionResults[i])
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

function drawCompositionCanvas(w,positions){
    let ctx = setUpCanvas(w);
    let wi = (xPositions - 1) * betweenPositions + border * 2;
    let h = (yPositions - 1) * betweenPositions + border * 2;

    for (let e of positions){
        let c = ((e[2].substring(3)) - 1) *  (255 / (buttons.length -1))
        ctx.fillStyle = `rgba(${c},${c},${c},100)`

        let posX = 0;
        let posY = 0;
        let tempW = 0;
        let tempH = 0;
        if (e[0] === border) {
            posX = border / 2;
            tempW = border / 2;
        }
        if (e[0] === wi - border) {
            tempW = border / 2;
        }
        if (e[1] === border) {
            posY = border / 2;
            tempH = border / 2;
        }
        if (e[1] === h - border) {
            tempH = border / 2;
        }

        ctx.beginPath();
        ctx.rect(e[0] - betweenPositions/2 - posX,
                 e[1] - betweenPositions/2 - posY,
                 betweenPositions + tempW,
                 betweenPositions + tempH);
        ctx.fill();
        ctx.closePath()
    }
}

function drawCirclesCanvas(i,e){
    let ctx = setUpCanvas(i, true);

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    for (let q of e){
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(q[0], q[1], q[2], 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    drawMassCenter(centers[i], ctx)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#0479ff';
    let w = (xPositions - 1) * betweenPositions + border * 2;
    let h = (yPositions - 1) * betweenPositions + border * 2;

    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2)
    ctx.stroke();
    ctx.closePath()

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

function setUpCanvas(i){
    let canvas = document.getElementById(`canvas${i}`)
    let ctx = canvas.getContext('2d');

    canvas.width = (xPositions - 1) * betweenPositions + border * 2;
    canvas.height = (yPositions - 1) * betweenPositions + border * 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx
}