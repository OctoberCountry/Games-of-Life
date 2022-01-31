// John Conway's Game of Life

//To do:
// Create dropdown tables in HTML to dynamically select different patterns, board sizes and generation speeds.
// Set the canvas size in Javascript instead of HTML
// Create a function/program to get a list of coordinates/color values from a pixel image. Use ctx.getImageData


// Get coordinates.
// Pass x and y into a function that gets and changes the board and redraws it.

//Allow users to upload text files that are parsed as patterns.
//Add more predefined patterns - spaceships etc.


//Create the canvas
let cellSize = 5;
const rows = 100
const cols = 200

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

canvas.addEventListener("mousedown", function () {
    isDrawing = true
})
canvas.addEventListener("mouseup", function () {
    isDrawing = false
})

canvas.addEventListener("mousemove", placeCell)

//Set the buttons to control the speed and patterns

let GolDisplay = document.querySelector(".GolButton")
GolDisplay.addEventListener("click", function () {
    activeRule = "Game of Life"
})

let SeedsDisplay = document.querySelector(".SeedsButton")
SeedsDisplay.addEventListener("click", function () {
    activeRule = "Seeds"
})
let LwdDisplay = document.querySelector(".LwdButton")
LwdDisplay.addEventListener("click", function () {
    activeRule = "Life without Death"
})

let customDisplay = document.querySelector(".customButton")
customDisplay.addEventListener("click", function () {
    activeRule = "Custom"
})

let birthDisplay = document.querySelector("#birthValue")
let survivalDisplay = document.querySelector("#survivalValue")

const generationsDisplay = document.querySelector("#GenerationsDisplay")
let generationsCount = 0

let speed = 100
let speedDisplay = document.querySelector("#speed")
speedDisplay.addEventListener("change", function () {
    speed = speedDisplay.value
})

let cellSizeDisplay = document.querySelector("#cellSize")
cellSizeDisplay.addEventListener("change", function () {
    cellSize = cellSizeDisplay.value
    drawBoard()
})

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

let board = []

const startButton = document.querySelector(".start")
let active = false

startButton.addEventListener("click", function () {
    start()
})

const resetButton = document.querySelector("#reset")
resetButton.addEventListener("click", function () {
    board = []
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            board[i].push(0)
        }
    }
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
function createBoard() {
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            let num = Math.floor(Math.random() * 2)
            board[i].push(num)
        }
    }
}

//Draw the cells on the canvas according to their value in the array, 0 or 1, dead or alive
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function generateCustom() {
    console.log("custom")
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

//The original Game of Life rules. B3S23
function generateGol() {
    let nextBoard = []

    for (let i = 0; i < rows; i++) {
        nextBoard.push([])
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(board, i, j)
            let state = board[i][j];
            if (state === 0 && neighbors === 3) {
                nextBoard[i].push(1)
            }
            else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextBoard[i].push(0)

            }
            else {
                nextBoard[i].push(board[i][j])
            }
        }
    }
    board = nextBoard

    generationsCount++
    drawBoard()

}
//The Life without Death rule. Notation: B3/S012345678
function generateLwd() {
    console.log("Life without death")
    let nextBoard = []

    for (let i = 0; i < rows; i++) {
        nextBoard.push([])
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(board, i, j)
            let state = board[i][j];
            if (neighbors === 3) {
                nextBoard[i].push(1)
            }
            // else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
            //     nextBoard[i].push(0)

            // }
            else {
                nextBoard[i].push(board[i][j])
            }
        }
    }
    board = nextBoard

    generationsCount++
    drawBoard()

}

function generateSeeds() {
    let newBoard = []
    for (let i = 0; i < rows; i++) {
        newBoard.push([])
        for (let j = 0; j < cols; j++) {
            if (countNeighbors(board, i, j) === 2) {
                newBoard[i].push(1)
                drawCell("black", j, i)
            }
            else {
                newBoard[i].push(0)
                drawCell("white", j, i)
            }

        }
    }
    board = newBoard
    generationsCount++
    //drawBoard()
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
        clearInterval(startFunction)
        active = false
    }
    else {

        if (activeRule === "Game of Life") {
            startFunction = setInterval(generateGol,
                speed)
        }
        else if (activeRule === "Seeds") {
            startFunction = setInterval(generateSeeds,
                speed)
        }
        else if (activeRule === "Life without Death") {
            startFunction = setInterval(generateLwd,
                speed)
        }
        else if (activeRule === "Custom") {
            startFunction = setInterval(generateCustom,
                speed)
        }
        active = true
        return
    }
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


createBoard()
drawBoard()
