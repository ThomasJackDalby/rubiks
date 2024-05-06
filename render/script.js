CUBE_ORDER = 2
CUBE_WIDTH = 100
MARGIN = 10

class Tile {
    constructor(text, direction, color) {
        this.text = text;
        this.direction = direction;
        this.color = color;
    }

    draw() {
        push();
        
        rotateX(this.direction.x);
        rotateY(this.direction.y);
        rotateZ(this.direction.z);
        translate(0, 0, CUBE_WIDTH / 2.0);
        
        fill(this.color)
        plane(CUBE_WIDTH, CUBE_WIDTH);

        translate(CUBE_WIDTH * -0.4, CUBE_WIDTH * -0.1, 1);
        fill(0)
        text(this.text, 0, 0)
        pop();
    }
}
class Cube {
    constructor(position) {
        this.position = position;
        this.direction = createVector(0, 0, 0);
        this.tiles = []
    }

    draw() {
        push();

        rotateX(this.direction.x);
        rotateY(this.direction.y);
        rotateZ(this.direction.z);

        let p = p5.Vector.mult(this.position, CUBE_WIDTH)
        translate(p);

        for (let i=0;i<this.tiles.length;i++){
            let tile = this.tiles[i];
            tile.draw();
        }

        pop();
    }
}

var tiles = []
var cubes = []
var faces = []

var WHITE = [255, 255, 255]
var RED = [255, 0, 0]
var GREEN = [0, 255, 0]
var BLUE = [0, 0, 255]
var YELLOW = [255, 255, 0]
var ORANGE = [255, 100, 0]

let inconsolata;
function preload() {
    inconsolata = loadFont('./inconsolata.otf');
}

// cubes
// bottom left to top right

function get_index(i, j, k) {
    return i * CUBE_ORDER * CUBE_ORDER + j * CUBE_ORDER + k
}

function setup() {
    createCanvas(1000, 1000, WEBGL);
    textFont(inconsolata);
    textSize(40);

    CENTRE_OFFSET = (CUBE_ORDER - 1) / 2.0
    for(let i=0;i<CUBE_ORDER;i++) {
        for(let j=0;j<CUBE_ORDER;j++) {
            for(let k=0;k<CUBE_ORDER;k++) {
                //if (CUBE_ORDER % 2 == 0 && i == CUBE_ORDER / 2  && j == 0 && k == 0) cubes.push(null);
                cubes.push(new Cube(createVector(i - CENTRE_OFFSET, j - CENTRE_OFFSET, k - CENTRE_OFFSET)));
            }
        }
    }

    let colours = [
        WHITE,
        BLUE,
        RED,
        YELLOW,
        GREEN,
        ORANGE
    ]
    let angles = [
        [180, 0],
        [0, 90],
        [90, 0],
        [0, 0],
        [0, 270],
        [270, 0],
    ]
    let face_indexes = [
        (i, j) => get_index(i, j, 0),
        (i, j) => get_index(CUBE_ORDER-1, i, j),
        (i, j) => get_index(i, 0, j),
        (i, j) => get_index(i, j, CUBE_ORDER-1),
        (i, j) => get_index(0, i, j),
        (i, j) => get_index(i, CUBE_ORDER-1, j),
    ]

    tile_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

    let tile_index = 0
    for (let f=0;f<6;f++) {
        let face = []
        let angle = angles[f];
        let get_face_index = face_indexes[f];
        for(let i=0;i<CUBE_ORDER;i++) {
            for(let j=0;j<CUBE_ORDER;j++) {
                let c = get_face_index(i, j);
                let cube = cubes[c];
                let tile_value = tile_values[tile_index]
                let colour = colours[Math.floor(int(tile_value/(CUBE_ORDER*CUBE_ORDER)))];
                let tile = new Tile(tile_value, createVector(angle[0], angle[1], 0), colour);
                tiles.push(tile)
                cube.tiles.push(tile);
                face.push(cube);
                tile_index++;
            }
        }
        faces.push(face)
    }
}
function draw() {
    background(100);
    stroke(0)
    fill(250);
    //noLoop();
    ortho();
    orbitControl();
    angleMode(DEGREES);

    // for(let i=0;i<faces[4].length;i++){
    //     let cube = faces[4][i];
    //     cube.direction.y += 2;
    //     if (cube.direction.y > 360) {
    //         cube.direction.y -= 360;
    //     }
    // }

    for (let i=0;i<cubes.length;i++){
        let cube = cubes[i];
        if (cube == null) continue;
        cube.draw();
    }
}