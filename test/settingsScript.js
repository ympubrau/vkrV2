const canvas = document.getElementById('canvas');
let mouse = {x: 0, y: 0, down: false};
let mouseDown;
let prevMouse = {y: 0, x:0};
let ctx = canvas.getContext('2d');
let circles = []
let ifCircleSelected = false;
let selectedCircle;
let resizing = false;
let resizingDirection;
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
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

                circles.splice(i,1)
                selectedCircle = [selectedCircle[0], selectedCircle[1], newR]
                circles.push([selectedCircle[0], selectedCircle[1], newR])
                redrawCanvas()
                drawCircleBorder(selectedCircle[0], selectedCircle[1], newR)
            } else {
                let c = circles[i]
                let newMX = /*c[0] + mouseX - prevMouse.x*/ mouseX
                let newMY = /*c[1] + mouseY - prevMouse.y*/ mouseY

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



canvas.addEventListener('mousedown', function (){
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
        circles.push([mouseX,mouseY, 20])
        drawCircle(mouseX, mouseY, 20)
        redrawCanvas()
        ifCircleSelected = false;
        return;
    }

    if (!resizing){
        ifCircleSelected = false;
        selectedCircle = [];
        redrawCanvas();
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

canvas.addEventListener('click', function (){

})

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
    ctx.strokeStyle = 'black';
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
        let temp = Math.floor(Math.sqrt((e[0] - c1[0]) * (e[0] - c1[0]) + (e[1] - c1[1]) * (e[1] - c1[1]))) - e[2] + 2;
        if (temp < dist) dist = temp;
    }

    return dist;

}