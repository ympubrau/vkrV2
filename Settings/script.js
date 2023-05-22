const roundSizeSlider = document.getElementById('roundSizeSlider'),
    roundSizeText = document.getElementById('roundSizeText'),
    roundColorPicker = document.getElementById('roundColorPicker'),
    backgroundColorPicker = document.getElementById('backgroundColorPicker'),
    canvasBackgroundColorPicker = document.getElementById('canvasBackgroundColorPicker'),
    xPositionsText = document.getElementById('xPositionsText'),
    xPositionsSlider = document.getElementById('xPositionsSlider'),
    yPositionsText = document.getElementById('yPositionsText'),
    yPositionsSlider = document.getElementById('yPositionsSlider'),
    betweenPositionsText = document.getElementById('betweenPositionsText'),
    betweenPositionsSlider = document.getElementById('betweenPositionsSlider'),
    borderText = document.getElementById('borderText'),
    borderSlider = document.getElementById('borderSlider'),
    canvas = document.getElementById('canvas'),
    unitsValue = document.getElementById('units'),
    targetDiv = document.getElementById('demo'),
    randomSelector = document.getElementById('allocation'),
    btnHelper = [
        ...document.getElementsByClassName('btn'),
        document.getElementById('1'),
        document.getElementById('2'),
        document.getElementById('3'),
        document.getElementById('4'),
        document.getElementById('5'),
        document.getElementById('6'),
        document.getElementById('7'),

    ];

let roundSize = 50,
    units = 'pix',
    roundColor = '#000000',
    backgroundColor = '#F5F5DC',
    canvasBackgroundColor = '#FFFFFF',
    xPositions = 5,
    yPositions = 5,
    betweenPositions = 50,
    border = 50,
    random = true,
    ctx = canvas.getContext('2d')
;

redrawCanvas()
setButtons()

unitsValue.addEventListener('input', function () {
    units = unitsValue.value;
    if (units === 'proc'){
        for (let e of [roundSizeSlider,borderSlider,betweenPositionsSlider]){
            e.setAttribute('min', '1');
            e.setAttribute('max', '100');
        }

        roundSizeSlider.value = 20;
        roundSizeText.value = 20;
        roundSize = 20;

        betweenPositionsSlider.value = 20;
        betweenPositionsText.value = 20;
        betweenPositions = 20;

        borderSlider.value = 20;
        borderText.value = 20;
        border = 20;
    }
    else {
        roundSizeSlider.setAttribute('min', '10');
        roundSizeSlider.setAttribute('max', '500');
        roundSizeSlider.value = 100;
        roundSizeText.value = 100;
        roundSize = 100;

        betweenPositionsSlider.setAttribute('min', '20');
        betweenPositionsSlider.setAttribute('max', '200');
        betweenPositionsSlider.value = 50;
        betweenPositionsText.value = 50;
        betweenPositions = 50;

        borderSlider.setAttribute('min', '20');
        borderSlider.setAttribute('max', '200');
        borderSlider.value = 50;
        borderText.value = 50;
        border = 50;
    }
    redrawCanvas()
})

randomSelector.addEventListener('input', function () {
    random = randomSelector.value;
})

roundSizeText.addEventListener('input', function () {
    let v = roundSizeText.value

    if (v >= +roundSizeSlider.getAttribute('max')) {
        v = +roundSizeSlider.getAttribute('max');
    } else if (v <= +roundSizeSlider.getAttribute('min')){
        v = +roundSizeSlider.getAttribute('min')
    }

    roundSize = v;
    roundSizeSlider.value = v;
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

backgroundColorPicker.addEventListener('input', function () {
    backgroundColor = backgroundColorPicker.value;
    redrawCanvas();
})

canvasBackgroundColorPicker.addEventListener('input', function () {
    canvasBackgroundColor = canvasBackgroundColorPicker.value;
    redrawCanvas();
})

xPositionsText.addEventListener('input', function () {
    let v = xPositionsText.value

    if (v >= +xPositionsSlider.getAttribute('max')) {
        v = +xPositionsSlider.getAttribute('max');
    } else if (v <= +xPositionsSlider.getAttribute('min')){
        v = +xPositionsSlider.getAttribute('min')
    }

    xPositions = v;
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

    if (v >= +yPositionsSlider.getAttribute('max')) {
        v = +yPositionsSlider.getAttribute('max');
    } else if (v <= +yPositionsSlider.getAttribute('min')){
        v = +yPositionsSlider.getAttribute('min')
    }

    yPositions = v;
    yPositionsSlider.value = v;
    redrawCanvas();
})

yPositionsSlider.addEventListener('input', function () {
    yPositions = yPositionsSlider.value;
    yPositionsText.value = yPositions;
    redrawCanvas();
})

betweenPositionsText.addEventListener('input', function () {
    let v = betweenPositionsText.value

    if (v >= +betweenPositionsSlider.getAttribute('max')){
        v = +betweenPositionsSlider.getAttribute('max')
    } else if (v <= +betweenPositionsSlider.getAttribute('min')){
        v = +betweenPositionsSlider.getAttribute('min')
    }

    betweenPositions = v;
    betweenPositionsSlider.value = v;
    redrawCanvas();
})

betweenPositionsSlider.addEventListener('input', function () {
    betweenPositions = betweenPositionsSlider.value;
    betweenPositionsText.value = betweenPositions;
    redrawCanvas();
})

borderText.addEventListener('input', function () {
    let v = borderText.value

    if (v > +borderSlider.getAttribute('max')){
        v = +borderSlider.getAttribute('max')
    } else if (v <= +borderSlider.getAttribute('min')){
        v = +borderSlider.getAttribute('min')
    }

    border = v;
    borderSlider.value = v;
    redrawCanvas();
})

borderSlider.addEventListener('input', function () {
    border = borderSlider.value;
    borderText.value = border;
    redrawCanvas();
})

for (let e of btnHelper){ e.addEventListener('input', setButtons) }

function redrawCanvas(){
    let screenSize = window.innerHeight / 500;
    let betweenPositionsTemp, borderTemp, roundSizeTemp;

    if (units === 'proc'){
        roundSizeTemp = +roundSize * screenSize;
        betweenPositionsTemp = betweenPositions * screenSize;
        borderTemp = border * screenSize;
    }
    else {
        roundSizeTemp = +roundSize;
        betweenPositionsTemp = +betweenPositions ;
        borderTemp = +border;
    }

    targetDiv.style.backgroundColor = backgroundColor;

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
}

function setButtons(){
    let btns = document.getElementsByClassName('btn');
    for (let e of btns) {
        let targetBtn = document.getElementById('btn' + e.classList[1]);
        if (e.checked){
            targetBtn.hidden = false;
            targetBtn.innerHTML = document.getElementById(e.classList[1]).value;
        } else targetBtn.hidden = true;
    }
}

function downloadJson(){
    let allocation = randomSelector.value;
    let btns = document.getElementsByClassName('btn');
    
    let data = {
        units: units,
        random: allocation,
        roundSize: roundSize,
        xPositions: xPositions,
        yPositions: yPositions,
        betweenPositions : betweenPositions,
        border : border,
        roundColor: roundColor,
        canvasBackgroundColor : canvasBackgroundColor,
        backgroundColor : backgroundColor,
        buttons : [],
        compositionResults: [],
        circles: []
    }

    for (let e of btns) {
        let targetBtn = document.getElementById('btn' + e.classList[1]);
        if (e.checked){
            targetBtn.innerHTML = document.getElementById(e.classList[1]).value;
            data.buttons.push([e.classList[1], targetBtn.innerText]);
        }
    }

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    const link = document.createElement("a");
    link.setAttribute("href",dataStr);
    link.setAttribute("download", "settings.json");
    link.click();
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
    /*
    if (e.compositions || e.circles) {
        if (e.compositions.length > 0 || e.circles.length > 0){
            alert('в файле не должно быть выполненного тестирования!')
            return;
        }
    }
    */


    if (units !== e.units){
        units = e.units;
        unitsValue.value = units
        unitsValue.dispatchEvent(new Event('input'))
    }

    roundSize = e.roundSize;
    roundSizeSlider.value = roundSize;
    roundColorPicker.value = roundSize;

    roundColor = e.roundColor;
    roundColorPicker.value = roundColor;

    backgroundColor = e.backgroundColor;
    backgroundColorPicker.value = backgroundColor;

    canvasBackgroundColor = e.canvasBackgroundColor;
    canvasBackgroundColorPicker.vallue = canvasBackgroundColor;

    xPositions = e.xPositions;
    xPositionsSlider.value = xPositions;
    xPositionsText.value = xPositions;

    yPositions = e.yPositions;
    yPositionsSlider.value = yPositions;
    yPositionsText.value = yPositions;

    betweenPositions = e.betweenPositions;
    betweenPositionsSlider.value = betweenPositions;
    betweenPositionsText.value = betweenPositions;

    border = e.border;
    borderSlider.value = border;
    borderText.value = border;

    random = e.random;
    randomSelector.value = random;

    let btns = []
    for (let q of e.buttons){
        btns.push(document.getElementsByClassName(q[0])[0])
    }

    for (let i = 0; i < 7; i++) {
        if (!btns.includes(btnHelper[i])) {
            console.log(btnHelper[i])
            btnHelper[i].checked = false;
            btnHelper[i].dispatchEvent(new Event('input'));
        }
    }

    for (let q of e.buttons) {
        console.log(q)
        let d = document.getElementById(q[0]);
        d.value = q[1];
    }

    redrawCanvas()

}