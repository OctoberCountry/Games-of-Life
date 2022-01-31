// John Conway's Game of Life

//To do:
// Create dropdown tables in HTML to dynamically select different patterns, board sizes and generation speeds.
// Set the canvas size in Javascript instead of HTML
// Create a function/program to get a list of coordinates/color values from a pixel image. Use ctx.getImageData

//Pseudo code of the image converter:
//Draw the image on the canvas
// Create board of all dead cells
//for loop of all pixels on image, determine color (rgb value 0)
// if color black, change cell at coordinates (use i value) to alive.

//To do: Make the blank board clickable, so the user can add/paint living cells

// Get coordinates.
// Pass x and y into a function that gets and changes the board and redraws it.






// const canvas = document.getElementById('canvas');

//Create the canvas
const cellSize = 5;
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

// Get x and y coordinates for click event and place a living cell.
function getMousePos(event) {
    let col = Math.floor((event.clientX - canvasRect.x) / cellSize)
    let row = Math.floor((event.clientY - canvasRect.y) / cellSize)
    if (board[row][col] === 1) {
        board[row][col] = 0
    }
    else {
        board[row][col] = 1
    }

    drawBoard()
}

canvas.addEventListener("mousemove", getMousePos)



//Set the buttons to control the speed and patterns
const generationsDisplay = document.querySelector("#GenerationsDisplay")
let generationsCount = 0

let speed = 100

let speedDisplay = document.querySelector("#speed")
speedDisplay.addEventListener("change", function () {
    speed = speedDisplay.value
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


//Create the 2D array
function createBoard() {
    for (let i = 0; i < rows; i++) {
        board.push([])
        for (let j = 0; j < cols; j++) {
            let num = Math.floor(Math.random() * 2)
            board[i].push(num)
        }
    }
}

//Draw the cells on the canvas according to their value, 0 or 1, dead or alive
function drawBoard() {

    // Drawing the board
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

    // Computing the values of the next generation board
    // let nextBoard = createBoard()

    // for (let i = 0; i < board.length; i++) {
    //     for (let j = 0; j < board.length; j++) {
    //         //For the edges of the board, let them stay unchanged. Another option is to wrap around.
    //         let state = board[i][j]
    //         if (i == 0 || i == rows - 1 || j == 0 || j == cols - 1) {
    //             nextBoard[i][j] = state;
    //         }
    //         else {
    //             //Count live neighbors
    //             let sum = 0
    //             let neighbors = countNeighbors(board, i, j)

    //             if (state === 0 && neighbors === 3) {
    //                 nextBoard[i][j] = 1
    //             }
    //             else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
    //                 nextBoard[i][j] = 0
    //             }
    //             else {
    //                 nextBoard[i][j] = state;
    //             }
    //         }
    //     }

    // }
    // board = nextBoard
}

function generation() {
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
        startFunction = setInterval(generation,
            speed)
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
