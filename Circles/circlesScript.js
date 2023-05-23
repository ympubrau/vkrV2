const canvas = document.getElementById('canvas');
let modal = document.getElementById('modal');
let span = document.getElementById("modal-background");
let mouse = {x: 0, y: 0, down: false};
let mouseDown;
let prevMouse = {y: 0, x:0};
let ctx = canvas.getContext('2d');
let circles = []
let ifCircleSelected = false;
let selectedCircle;
let resizing = false;
let resizingDirection;
let previousButton;
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


ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;


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
    console.log('qwe')
    if (e.compositions) {
        compositionResults = e.compositions;
        if (compositionResults.length > 0)
            document.getElementById('danger').hidden = true;
    }
    else {
        document.getElementById('danger').innerHTML = 'Сначала нужно пройти тестирование'
    }

    if (e.circles) {
        circleResults = e.circles
    }
}

function drawFirstCanvas(){
    let screenSize = window.innerHeight / 500;
    let betweenPositionsTemp, borderTemp;

    if (units === 'proc'){
        betweenPositionsTemp = betweenPositions * screenSize;
        borderTemp = border * screenSize;
    }
    else {
        betweenPositionsTemp = +betweenPositions ;
        borderTemp = +border;
    }


    document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;

    canvas.width = (xPositions - 1) * betweenPositionsTemp + (borderTemp * 2);
    canvas.height = (yPositions - 1) * betweenPositionsTemp + (borderTemp * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fill();


    let buttonsHeight = document.getElementById('buttons').clientHeight;
    canvas.style.marginTop = `${(window.innerHeight - canvas.clientHeight)/2 - buttonsHeight/2}px`;
}

function startTesting(){
    if (compositionResults.length === 0) {
        document.getElementById('danger').hidden = false;
        return
    }
    document.getElementById('danger').hidden = true;

    document.getElementById('startDiv').style.display = 'none';
    document.getElementById('demo').hidden = false;
    drawFirstCanvas();
}

canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = ((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    if (ifCircleSelected){
        let i = findCircle(selectedCircle);
        if (i === -1) return;
        let mouseX = mouse.x;
        let mouseY = mouse.y;

        if (!mouseDown){
            let topLeftPoint = [circles[i][0] - circles[i][2] - 2, circles[i][1] - circles[i][2] - 2];
            let topRightPoint = [circles[i][0] + circles[i][2] + 2, circles[i][1] - circles[i][2] - 2];
            let bottomLeftPoint = [circles[i][0] - circles[i][2] - 2, circles[i][1] + circles[i][2] + 2]
            let bottomRightPoint = [circles[i][0] + circles[i][2] + 2, circles[i][1] + circles[i][2] + 2]

            if (mouseX > topLeftPoint[0] && mouseX < topRightPoint[0]){
                resizing= true;
                if (mouseY > topLeftPoint[1] - 5 && mouseY < topLeftPoint[1] + 5){
                    document.body.style.cursor = 'n-resize';
                    resizingDirection = 'up'
                } else if (mouseY > bottomLeftPoint[1] - 5 && mouseY < bottomLeftPoint[1] + 5){
                    document.body.style.cursor = 's-resize';
                    resizingDirection = 'down';
                }
                else {
                    resizing = false;
                    document.body.style.cursor = 'default'
                }
                prevMouse.y = mouseY;
            }
            else if(mouseY > topLeftPoint[1] && mouseY < bottomRightPoint[1]){
                resizing= true;
                if (mouseX > topLeftPoint[0] - 5 && mouseX < topLeftPoint[0] + 5){
                    document.body.style.cursor = 'w-resize';
                    resizingDirection= 'left'
                } else if (mouseX > bottomRightPoint[0] - 5 && mouseX < bottomRightPoint[0] + 5){
                    document.body.style.cursor = 'e-resize';
                    resizingDirection = 'right';
                }
                else {
                    resizing= false;
                    document.body.style.cursor = 'default'
                }
                prevMouse.x = mouseX;
            }

        }

        if (mouseDown) {
            if (resizing){
                let m
                if (resizingDirection === 'down' ||resizingDirection === 'up'){
                    m = (prevMouse.y - mouse.y);
                    if (resizingDirection === 'down') m *= -1;
                }
                else {
                    m = (prevMouse.x - mouse.x);
                    if (resizingDirection=== 'right') m *= -1;
                }

                prevMouse.y = mouseY;
                prevMouse.x = mouseX;

                if (selectedCircle[2] + m <= 10) return;
                let min = minimumDist(circles[i]);
                let newR = selectedCircle[2] + m;
                if (newR >= min) return;

                if (!(selectedCircle[0] - newR > 0 &&
                    selectedCircle[0] + newR < canvas.width &&
                    selectedCircle[1] + newR < canvas.height &&
                    selectedCircle[1    ] - newR > 0)) return;

                circles.splice(i,1)
                selectedCircle = [selectedCircle[0], selectedCircle[1], newR]
                circles.push([selectedCircle[0], selectedCircle[1], newR])
                redrawCanvas()
                drawCircleBorder(selectedCircle[0], selectedCircle[1], newR)
            } else {
                let c = circles[i]
                let newMX = /*c[0] + mouseX - prevMouse.x*/ mouseX
                let newMY = /*c[1] + mouseY - prevMouse.y*/ mouseY
                if (!(newMX - c[2] > 0 && newMX + c[2] < canvas.width && newMY + c[2] < canvas.height && newMY - c[2] > 0))
                    return;

                circles.splice(i,1)

                let min = minimumDist([newMX,newMY,c[2]]) - c[2];

                prevMouse.y = mouseY;
                prevMouse.x = mouseX;
                if (min < 0){
                    selectedCircle = [c[0],c[1],c[2]]
                    circles.push([c[0],c[1],c[2]])
                    drawCircleBorder(c[0],c[1],c[2])
                }
                else{
                    selectedCircle = [newMX,newMY,c[2]]
                    circles.push([newMX,newMY,c[2]])
                    redrawCanvas()
                    drawCircleBorder(newMX,newMY,c[2])
                }
            }
        }
    }
});

canvas.addEventListener('mousedown', function (e){
    if (e.button === 0){
        mouseDown = true;
        let mouseX = mouse.x;
        let mouseY = mouse.y;
        let intersection = false;
        let isInCircle = false;
        if (resizing) return;

        for (let e of circles){
            if (!intersection){
                intersection = circleIntersection([mouseX,mouseY,20],e);
            }
            if ((mouseX >= e[0] - e[2] && mouseX <= e[0] + e[2]) && (mouseY >= e[1] - e[2] && mouseY <= e[1] + e[2])) {
                if (selectedCircle !== e){
                    redrawCanvas();
                }
                isInCircle = true;
                ifCircleSelected = true;
                console.log(ifCircleSelected);
                drawCircleBorder(e[0],e[1],e[2])
                return;
            }
        }

        if (!intersection && !ifCircleSelected){
            console.log(mouseY + " " + mouseX)
            if (mouseX - 20 > 0 && mouseX + 20 < canvas.width && mouseY + 20 < canvas.height && mouseY - 20 > 0){
                circles.push([mouseX,mouseY, 20])
                drawCircle(mouseX, mouseY, 20)
                redrawCanvas()
                ifCircleSelected = false;
                return;
            }
        }

        if (!resizing){
            ifCircleSelected = false;
            selectedCircle = [];
            redrawCanvas();
        }
    }
})

canvas.addEventListener('mouseup', function (){
    mouseDown = false;
    resizing = false;
    document.body.style.cursor = 'default'
    if (ifCircleSelected){
        drawCircleBorder(selectedCircle[0],selectedCircle[1],selectedCircle[2]);
    }
})

canvas.oncontextmenu = function () {
    console.log(selectedCircle)
    if (ifCircleSelected) {
        let i = findCircle(selectedCircle);
        circles.splice(i,1)
        selectedCircle = [];
        ifCircleSelected = false;
        redrawCanvas()
    }
}

window.addEventListener("keydown", (event) => {
    if (event.code === 'Escape') {
        modal.style.display = "none";
        span.style.display = "none";
    }
    if (ifCircleSelected){
        let e = event.code;
        let i = findCircle(selectedCircle);
        if (i === -1) return;

        let temp;
        let min;
        switch (e) {
            case "ArrowDown" || "Numpad2":
                temp = selectedCircle[1] + 1;
                min = minimumDist(selectedCircle) - selectedCircle[2] - 2;
                console.log(min, min < 1)

                if (temp + selectedCircle[2] > canvas.height) return;

                if (min < 1 && previousButton === 'ArrowDown')  selectedCircle = [selectedCircle[0], temp - 2, selectedCircle[2]]
                else selectedCircle = [selectedCircle[0], temp, selectedCircle[2]]

                previousButton = 'ArrowDown';
                break;

            case "ArrowUp" || "Numpad8":
                temp = selectedCircle[1] - 1;
                min = minimumDist(selectedCircle) - selectedCircle[2] - 2;
                console.log(min, min < 1)

                if (temp - selectedCircle[2] < 0) return;

                if (min < 1 && previousButton === 'ArrowUp')  selectedCircle = [selectedCircle[0], temp + 2, selectedCircle[2]]
                else selectedCircle = [selectedCircle[0], temp, selectedCircle[2]]

                previousButton = 'ArrowUp';
                break;

            case "ArrowLeft" || "Numpad4":
                temp = selectedCircle[0] - 1;
                min = minimumDist(selectedCircle) - selectedCircle[2] - 2;
                console.log(min, min < 1)

                if (temp - selectedCircle[2] < 0) return;

                if (min < 1 && previousButton === 'ArrowLeft')  selectedCircle = [temp + 2, selectedCircle[1], selectedCircle[2]]
                else selectedCircle = [temp, selectedCircle[1], selectedCircle[2]]

                previousButton = 'ArrowLeft';
                break;

            case "ArrowRight" || "Numpad6":
                temp = selectedCircle[0] + 1;
                min = minimumDist(selectedCircle) - selectedCircle[2] - 2;
                console.log(min, min < 1)

                if (temp - selectedCircle[2] > canvas.width) return;

                if (min < 1 && previousButton === 'ArrowRight')  selectedCircle = [temp - 2, selectedCircle[1], selectedCircle[2]]
                else  selectedCircle = [temp, selectedCircle[1], selectedCircle[2]]

                previousButton = 'ArrowRight';
                break;
        }
        circles.splice(i,1);
        circles.push([selectedCircle[0], selectedCircle[1], selectedCircle[2]])
        redrawCanvas()
        drawCircleBorder(selectedCircle[0], selectedCircle[1], selectedCircle[2])
    }
});

function drawCircleBorder(x,y,r){
    selectedCircle = [x,y,r];
    ctx.strokeStyle = '#00b2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2);
    ctx.stroke();
    ctx.closePath()
}

function drawCircle(x,y,r){
    ctx.strokeStyle = roundColor;
    ctx.fillStyle = roundColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function redrawCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let e of circles){
        drawCircle (e[0],e[1],e[2])
    }
}

function findCircle(e){
    for (let [index,q] of circles.entries()){
        if (q[0] === e[0] && q[1] === e[1]){
            return index
        }
    }
    return -1;
}

function circleIntersection(c1,c2){
    return Math.floor(Math.sqrt((c1[0] - c2[0])*(c1[0] - c2[0]) + (c1[1] - c2[1])*(c1[1] - c2[1]))) < (c1[2] + c2[2]) ;
}

function minimumDist(c1){
    let dist = Number.MAX_SAFE_INTEGER;

    for (let e of circles) {
        if (e[0] === c1[0] && e[1] === c1[1]) continue;
        let temp = (Math.sqrt((e[0] - c1[0]) * (e[0] - c1[0]) + (e[1] - c1[1]) * (e[1] - c1[1]))) - e[2] + 2;
        if (temp < dist) dist = temp;
    }
    return dist;
}

function saveComposition(){
    circleResults.push([...circles])
    document.getElementById('endTest').hidden = false;
    document.getElementById('newTest').hidden = false;
    document.getElementById('saveTest').hidden = true;
    circles = [];
}

function newTest(){
    redrawCanvas()
    document.getElementById('endTest').hidden = true;
    document.getElementById('newTest').hidden = true;
    document.getElementById('saveTest').hidden = false;
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
        compositions : compositionResults,
        circles : [...circleResults]
    }

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    const link = document.createElement("a");
    link.setAttribute("href",dataStr);
    link.setAttribute("download", "settings.json");
    link.click();
}


window.onclick = function(event) {
    if (event.target === span) {
        modal.style.display = "none";
        span.style.display = "none";
    }
}

function revealModal(){
    modal.style.display = "block";
    span.style.display = "block";
}