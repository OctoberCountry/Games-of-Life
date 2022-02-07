// John Conway's Game of Life

//To do:
// Set the canvas size in Javascript instead of HTML
// Create a function/program to get a list of coordinates/color values from a pixel image. Use ctx.getImageData

// Get coordinates.
// Pass x and y into a function that gets and changes the board and redraws it.

//Allow users to upload text files that are parsed as patterns.
//Add more predefined patterns - spaceships etc.

//Create the canvas
let cellSize = 5;
let rows = 100
let cols = 200

const canvasContainer = document.querySelector(".canvas")
const canvas = document.createElement("canvas")
canvas.width = cols * cellSize
canvas.height = rows * cellSize
canvas.style.border = "1px solid black"
const ctx = canvas.getContext('2d');
canvasContainer.appendChild(canvas)
const canvasRect = canvas.getBoundingClientRect()

let activeRule = "Game of Life"
let isDrawing = false

let board = []
let active = false
let density = 0.5

canvas.addEventListener("mousedown", function () {
    isDrawing = true
})
canvas.addEventListener("mouseup", function () {
    isDrawing = false
})

canvas.addEventListener("mousemove", placeCell)

//Set the buttons to control the speed and patterns

let birthDisplay = document.querySelector("#birthValue")
let survivalDisplay = document.querySelector("#survivalValue")

let GolDisplay = document.querySelector(".GolButton")
GolDisplay.addEventListener("click", function () {
    birthDisplay.value = "3"
    survivalDisplay.value = "23"
})

let SeedsDisplay = document.querySelector(".SeedsButton")
SeedsDisplay.addEventListener("click", function () {
    //activeRule = "Seeds"
    birthDisplay.value = "2"
    survivalDisplay.value = ""
})
let LwdDisplay = document.querySelector(".LwdButton")
LwdDisplay.addEventListener("click", function () {
    //activeRule = [[3], [0, 1, 2, 3, 4, 5, 6, 7, 8]]
    birthDisplay.value = "3"
    survivalDisplay.value = "012345678"
})

let DiamoebaDisplay = document.querySelector(".DiamoebaButton")
DiamoebaDisplay.addEventListener("click", function () {
    birthDisplay.value = "35678"
    survivalDisplay.value = "5678"
})

let AnnealDisplay = document.querySelector(".AnnealButton")
AnnealDisplay.addEventListener("click", function () {
    birthDisplay.value = "4678"
    survivalDisplay.value = "35678"
})

let DayAndNightDisplay = document.querySelector(".DayAndNightButton")
DayAndNightDisplay.addEventListener("click", function () {
    birthDisplay.value = "3678"
    survivalDisplay.value = "34678"
})

const generationsDisplay = document.querySelector("#GenerationsDisplay")
let generationsCount = 0

let speed = 100
let speedDisplay = document.querySelector("#speed")
speedDisplay.oninput = function () {
    speed = parseInt(speedDisplay.value)
}
// speedDisplay.addEventListener("change", function () {
//     speed = speedDisplay.value
// })

let cellSizeDisplay = document.querySelector("#cellSize")
cellSizeDisplay.oninput = function () {
    if (active) {
        return
    }
    cellSize = parseInt(cellSizeDisplay.value)
    cols = canvas.width / cellSize
    rows = canvas.height / cellSize
    createBoard(density)
    drawBoard()
}

let densityDisplay = document.querySelector("#density")
densityDisplay.oninput = function () {
    density = parseFloat(densityDisplay.value)
    createBoard(density)
    drawBoard()
}

let patternDisplay = document.querySelector("#pattern")
patternDisplay.addEventListener("input", function () {
    if (patternDisplay.value == "gosperGliderGun") {
        createPattern(gosperGliderGun)
    }
    else if (patternDisplay.value == "acorn") {
        createPattern(acorn)
    }
    else if (patternDisplay.value == "rPentomino") {
        createPattern(rPentomino)
    }
})

const startButton = document.querySelector(".startButton")
startButton.addEventListener("click", function () {
    start()
})

const pauseButton = document.querySelector(".pauseButton")
pauseButton.addEventListener("click", function () {
    pause()
})

const stopButton = document.querySelector(".stopButton")
stopButton.addEventListener("click", function () {
    pause()
    generationsCount = 0
    createRandomBoard(0)
    drawBoard()
})

function placeCell(event) {
    if (isDrawing) {
        col = Math.floor(event.offsetX / cellSize)
        row = Math.floor(event.offsetY / cellSize)
        board[row][col] = 1
        drawCell("black", col, row)
    }
}

function drawCell(color, x, y) {
    ctx.fillStyle = color
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
}

//Create the 2D array for the board
function createBoard(density) {
    board = []
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            if (Math.random() < density) {
                board[i].push(1)
            }
            else {
                board[i].push(0)
            }
        }
    }
}

//Draw the cells on the canvas according to their value in the array, 0 or 1, dead or alive
function drawBoard() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(cellSize * j, cellSize * i, cellSize, cellSize);
            }
            else if (board[i][j] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(cellSize * j, cellSize * i, cellSize, cellSize);
            }
        }
    }
    generationsDisplay.innerText = generationsCount
}

function generate(notation) {
    console.log("custom")
    let nextBoard = []
    for (let i = 0; i < rows; i++) {
        nextBoard.push([])
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(board, i, j)
            let state = board[i][j];
            //Calculating which cells are birthed from death
            if (state === 0 && notation[0].includes(neighbors)) {
                nextBoard[i].push(1)
            }
            //Calculating which cells survive from life
            else if (state === 1 && notation[1].includes(neighbors)) {
                nextBoard[i].push(1)
            }
            //All other cells die off
            else {
                nextBoard[i].push(0)
            }
        }
    }
    //Updating the board and generations count
    board = nextBoard
    generationsCount++
    drawBoard()

}

function generateCustom() {
    let nextBoard = []
    let birthNums = birthDisplay.value.split("").map(x => parseInt(x))
    let survivalNums = survivalDisplay.value.split("").map(x => parseInt(x))
    for (let i = 0; i < rows; i++) {
        nextBoard.push([])
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(board, i, j)
            let state = board[i][j];
            //Calculating which cells are birthed
            if (state === 0 && birthNums.includes(neighbors)) {//neighbors === parseInt(birthDisplay.value)) {
                nextBoard[i].push(1)
            }
            //Calculating which cells survive
            else if (state === 1 && survivalNums.includes(neighbors)) { //neighbors === parseInt(survivalDisplay.value)) {
                nextBoard[i].push(1)
            }
            //All other cells die off
            else {
                nextBoard[i].push(0)
            }
        }
    }
    //Updating the board and generations count
    board = nextBoard
    generationsCount++
    drawBoard()
}

// Count the neighbors
function countNeighbors(grid, x, y) {
    if (x == 0 || x == rows - 1) {
        return 0
    }
    else if (y == 0 || y == cols - 1) {
        return 0
    }
    let sum = 0
    let neighbors = [
        grid[x - 1][y - 1],
        grid[x - 1][y],
        grid[x - 1][y + 1],
        grid[x][y - 1],
        grid[x][y + 1],
        grid[x + 1][y - 1],
        grid[x + 1][y],
        grid[x + 1][y + 1]
    ]
    for (n of neighbors) {
        sum += n
    }
    // for (let i = -1; i < 2; i++) {
    //     for (let j = -1; j < 2; j++) {
    //         sum += grid[x + i][y + j]
    //     }
    // }
    //sum -= grid[x][y]
    return sum
}

let startFunction
function start() {
    if (active) {
        // clearInterval(startFunction)
        // active = false
    }
    else {
        startFunction = setInterval(generateCustom,
            speed)
        active = true
        return
    }
}

function pause() {
    clearInterval(startFunction)
    active = false
}

let acorn = centerPattern([[1, 2], [2, 4], [3, 1], [3, 2], [3, 5], [3, 6], [3, 7]])
let gliderGun = [[1, 1], [2, 2], [2, 3], [3, 1], [3, 2]]
let lightSpaceship = []
const rPentomino = centerPattern([[1, 2], [1, 3], [2, 1], [2, 2], [3, 2]])

function centerPattern(list) {
    for (n of list) {
        n[0] += rows / 2
        n[1] += cols / 2
    }
    return list
}

const ggg =

    [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]


function createPatternList(list) {
    let startX = (rows - list.length) / 2
    let startY = (cols - list[0].length) / 2
    let newList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[0].length; j++) {
            if (list[i][j] === 1) {
                newList.push([i, j])
                // board[i + startX][j + startY] = 1
            }
        }
    }
    return newList
    // drawBoard()
}
let gosperGliderGun = createPatternList(ggg)
gosperGliderGun = centerPattern(gosperGliderGun)

const blinkerObject = [
    {
        x: 5,
        y: 5
    },
    {
        x: 5,
        y: 6
    },
    {
        x: 5,
        y: 7
    },
]
// Creating the patterns using a list of objects with x and y coordinates.
function createPatternObject(list) {
    board = []
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            board[i].push(0)
        }
    }
    for (coord of list) {
        board[coord.x][coord.y] = 1
    }
    generationsCount = 0
    drawBoard()
}
// Creating the patterns using an array of arrays with x and y coordinates.
function createPattern(list) {
    board = []
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            board[i].push(0)
        }
    }
    for (let i = 0; i < list.length; i++) {
        let x = list[i][0]
        let y = list[i][1]
        board[x][y] = 1
    }
    generationsCount = 0
    drawBoard()

}


createBoard(0.9)
drawBoard()
