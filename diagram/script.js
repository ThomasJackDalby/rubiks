
const template = [
    [1, 1],
    [2, 1],
    [1, 2],
    [1, 3],
    [0, 1],
    [1, 0],
]

const HEIGHT_FACES = 4
const WIDTH_FACES = 3

const TILE_SIZE = 10;
const CUBE_ORDER = 2;
const MARGIN = 2;
const FACE_SIZE = TILE_SIZE * CUBE_ORDER

const BLACK = [0, 0, 0]
const WHITE = [255, 255, 255]
const RED = [255, 0, 0]
const GREEN = [0, 255, 0]
const BLUE = [0, 0, 255]
const YELLOW = [255, 255, 0]
const ORANGE = [255, 100, 0]
const COLOURS = [WHITE, RED, GREEN, BLUE, YELLOW, ORANGE]

function setup() {
    createCanvas(1000, 500);
    background(51);
    textSize(6);
    textAlign(CENTER, CENTER);
}

// function get_index(i, j, k) {
//     return i * CUBE_ORDER * CUBE_ORDER + j * CUBE_ORDER + k
// }

// let face_indexes = [
//     (i, j) => get_index(i, j, 0),
//     (i, j) => get_index(CUBE_ORDER-1, i, j),
//     (i, j) => get_index(i, 0, j),
//     (i, j) => get_index(i, j, CUBE_ORDER-1),
//     (i, j) => get_index(0, i, j),
//     (i, j) => get_index(i, CUBE_ORDER-1, j),
// ]
function get_colour(tile_value) {
    return COLOURS[Math.floor(int(tile_value/(CUBE_ORDER*CUBE_ORDER)))];
}

function drawCube(tiles, x, y) {
    let tile_index = 0;
    for (let i=0;i<template.length;i++) {
        let face_template = template[i];
        let cx = x + (FACE_SIZE + MARGIN) * face_template[0];
        let cy = y + (FACE_SIZE + MARGIN) * face_template[1];
        
        for (let j=0;j<CUBE_ORDER;j++) {
            for (let k=0;k<CUBE_ORDER;k++) {
                let tile_value = tiles[tile_index];
                let tx = cx + k * TILE_SIZE;
                let ty = cy + j * TILE_SIZE;
                let colour = get_colour(tile_value); // COLOURS[tile_value];
                fill(colour);
                stroke(BLACK)
                rect(tx, ty, TILE_SIZE, TILE_SIZE)

                fill(BLACK)
                noStroke();
                text(tile_value, tx+TILE_SIZE/2, ty+TILE_SIZE/2);

                tile_index++;
            }
        }
    }
}

let transforms = [
    [2, 0, 3, 1, 9, 5, 8, 7, 17, 19, 10, 11, 12, 13, 14, 15, 16, 23, 18, 22, 20, 21, 4, 6],
    [0, 1, 2, 3, 4, 11, 6, 10, 8, 9, 16, 18, 13, 15, 12, 14, 21, 17, 20, 19, 5, 7, 22, 23],
    [0, 21, 2, 23, 6, 4, 7, 5, 8, 1, 10, 3, 12, 9, 14, 11, 16, 17, 18, 19, 20, 13, 22, 15],
    [20, 1, 22, 3, 4, 5, 6, 7, 0, 9, 2, 11, 8, 13, 10, 15, 17, 19, 16, 18, 12, 21, 14, 23],
    [0, 1, 6, 7, 4, 5, 13, 12, 10, 8, 11, 9, 19, 18, 14, 15, 16, 17, 2, 3, 20, 21, 22, 23],
    [4, 5, 2, 3, 15, 14, 6, 7, 8, 9, 10, 11, 12, 13, 17, 16, 0, 1, 18, 19, 21, 23, 20, 22],
    [0, 1, 2, 3, 4, 20, 6, 21, 8, 9, 7, 5, 14, 12, 15, 13, 10, 17, 11, 19, 18, 16, 22, 23],
    [1, 3, 0, 2, 22, 5, 23, 7, 6, 4, 10, 11, 12, 13, 14, 15, 16, 8, 18, 9, 20, 21, 19, 17],
    [8, 1, 10, 3, 4, 5, 6, 7, 12, 9, 14, 11, 20, 13, 22, 15, 18, 16, 19, 17, 0, 21, 2, 23],
    [0, 9, 2, 11, 5, 7, 4, 6, 8, 13, 10, 15, 12, 21, 14, 23, 16, 17, 18, 19, 20, 1, 22, 3],
    [16, 17, 2, 3, 0, 1, 6, 7, 8, 9, 10, 11, 12, 13, 5, 4, 15, 14, 18, 19, 22, 20, 23, 21],
    [0, 1, 18, 19, 4, 5, 2, 3, 9, 11, 8, 10, 7, 6, 14, 15, 16, 17, 13, 12, 20, 21, 22, 23]
]

let faces = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    [5, 7, 4, 6, 11, 10, 9, 8, 1, 3, 0, 2, 17, 19, 16, 18, 20, 21, 22, 23, 14, 12, 15, 13],
    [10, 8, 11, 9, 2, 0, 3, 1, 7, 6, 5, 4, 21, 23, 20, 22, 14, 12, 15, 13, 16, 17, 18, 19],
    [13, 15, 12, 14, 21, 23, 20, 22, 18, 16, 19, 17, 2, 0, 3, 1, 9, 11, 8, 10, 6, 4, 7, 5],
    [19, 18, 17, 16, 12, 13, 14, 15, 22, 20, 23, 21, 4, 5, 6, 7, 3, 2, 1, 0, 9, 11, 8, 10],
    [23, 22, 21, 20, 17, 19, 16, 18, 15, 14, 13, 12, 11, 10, 9, 8, 6, 4, 7, 5, 3, 2, 1, 0]
]

let debug_transforms = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    [0, 1, 2, 3, 12, 13, 14, 15, 22, 23, 4, 6, 9, 8, 19, 17, 20, 21, 5, 7, 11, 10, 18, 16],
    [2, 0, 3, 1, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 8, 16, 17, 18, 19, 20, 21, 22, 23],
    [0, 1, 2, 3, 10, 18, 11, 19, 13, 12, 21, 20, 4, 5, 6, 7, 23, 15, 22, 14, 16, 17, 8, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
]

// function draw(){
//     noLoop();
//     for(let t=0;t<transforms.length;t++){
//         let transform = transforms[t];
//         for (let i=0;i<transform.length;i++) {
//             let tx = i * TILE_SIZE;
//             let ty = t * (TILE_SIZE + MARGIN);

//             let tile_value = transform[i];
//             let colour = get_colour(tile_value); // COLOURS[tile_value];

//             fill(colour);
//             stroke(BLACK)
//             rect(tx, ty, TILE_SIZE, TILE_SIZE)

//             fill(BLACK)
//             noStroke();
//             text(tile_value, tx+TILE_SIZE/2, ty+TILE_SIZE/2);
//         }
//     }
// }

function draw() {
    noLoop();
    // translate(width/2.0, height/2.0);

    const columns = 4;
    let column = 0;
    let row = 0;
    for(let t=0;t<transforms.length;t++) {
        let transform = transforms[t];
        
        let rx = column * (WIDTH_FACES * (FACE_SIZE + MARGIN) + 10) + 10;
        let ry = row * (HEIGHT_FACES * (FACE_SIZE + MARGIN) + 10) + 10;
        drawCube(transform, rx, ry);

        column += 1;
        if (column > columns) {
            column = 0;
            row += 1;
        }
    }
}