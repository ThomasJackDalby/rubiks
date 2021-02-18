
"""rubix.py: A 'simple' rubik's cube solver"""

CUBE_ORDER = 2
NUM_OF_DIRECTIONS = 2
NUM_OF_AXES = 3
NUM_FACES = 2 * NUM_OF_AXES
NUM_TILES_FACE = CUBE_ORDER * CUBE_ORDER
NUM_TILES_TOTAL = NUM_TILES_FACE * NUM_FACES
NUM_TRANSFORMS = CUBE_ORDER * NUM_OF_AXES * NUM_OF_DIRECTIONS
FACE_POSITIONS = [
    [0, 1, 2, 3, 4, 5],
    [1, 2, 0, 4, 5, 3],
    [2, 0, 1, 5, 3, 4],
    [3, 5, 4, 0, 2, 1],
    [4, 3, 5, 1, 0, 2],
    [5, 4, 3, 2, 1, 0]
]
FACE_ROTATIONS = [
    [0, 0, 0, 0, 0, 0],
    [3, 2, 3, 3, 0, 1],
    [1, 1, 2, 3, 1, 0],
    [3, 3, 1, 1, 3, 1],
    [2, 0, 1, 0, 2, 3],
    [2, 3, 2, 2, 1, 2]
]
TRANSFORMS = []

# The state is stored as a flattened array of 6 faces, split into flattened arrays of each face.
# Each tile has a value of 0 to 6 representing each tile colour.
# e.g. for a 2x2 cube
# cube_state = "000022224444111133335555"
# faces are ordered x0 x1 y0 y1 z0 z1

def get_tile_index(f, x, y):
    """Get the index for a tile in the cube state."""
    return f * NUM_TILES_FACE + get_face_index(x, y)

def get_face_index(x, y):
    """Get the index for a tile within a face."""
    return y * CUBE_ORDER + x

def get_score(state):
    score = 0
    face_size = CUBE_ORDER * CUBE_ORDER
    offset = 0
    for i in range(NUM_FACES):
        for j in range(face_size):
            if state[j + offset] == i:
                score += 1
        offset += face_size
    return score

def rotate_face(face, amount):
    if amount == 0:
        return face
    elif amount < 0:
        delta = 1
        get_rotated_face_index = lambda x, y: get_face_index(y, CUBE_ORDER - x - 1)
    else:
        delta = -1
        get_rotated_face_index = lambda x, y: get_face_index(CUBE_ORDER - y - 1, x)

    next_face = [0] * NUM_TILES_FACE
    for y in range(CUBE_ORDER):
        for x in range(CUBE_ORDER):
            i = get_face_index(x, y)
            j = get_rotated_face_index(x, y)
            next_face[j] = face[i]
    return rotate_face(next_face, amount + delta)

def get_face_transform(f):
    positions = FACE_POSITIONS[f]
    rotations = FACE_ROTATIONS[f]
    return [tile for face in [rotate_face([i + positions[j] * NUM_TILES_FACE for i in range(NUM_TILES_FACE)], rotations[j]) for j in range(6)] for tile in face]

def get_cube_index(x, y, z):
    """Get the index for a tile within a face."""
    return z * NUM_TILES_FACE + y * CUBE_ORDER + x

# A transform is defined as a direction on an axix with an offset
# The 12 possible transforms for a 2x2 are:
# 000 001 010 011
# 100 101 110 111
# 200 201 210 211
# Note: Some of these are inversions of each other.

def get_transform_index(axis_index, offset, direction):
    direction_index = 1 if not direction else 0
    transform_index = axis_index * CUBE_ORDER * NUM_OF_DIRECTIONS + offset * NUM_OF_DIRECTIONS + direction_index
    return transform_index

def get_transform(axis_index, offset, direction):
    transform_index = get_transform_index(axis_index, offset, direction)
    return TRANSFORMS[transform_index]

def apply_transform(state, transform):
    return [state[t] for t in transform]

def get_inverse_transform(transform):
    """Generates a transform which is the inverse of the provided transform"""
    inverse_transform = [0] * len(transform)
    for i in range(len(transform)):
        inverse_transform[transform[i]] = i
    return inverse_transform

def get_face_to_action_transform():
    """Transforms face state from cube coords to action coords"""
    transform = []
    transform += list(range(NUM_TILES_FACE))
    transform += list(range(3*NUM_TILES_FACE, 4*NUM_TILES_FACE))
    for i in range(CUBE_ORDER):
        a = [get_tile_index(5, j, CUBE_ORDER-i-1) for j in range(CUBE_ORDER)]
        b = [get_tile_index(1, i, j) for j in range(CUBE_ORDER)]
        c = [get_tile_index(2, CUBE_ORDER-j-1, i) for j in range(CUBE_ORDER)]
        d = [get_tile_index(4, CUBE_ORDER-i-1, CUBE_ORDER-j-1) for j in range(CUBE_ORDER)]
        section = a + b + c + d
        transform += section
    return transform

def get_action_transform(offset, amount):
    """ Transforms a cube state in action coordinates with a clockwise or counter-clockwise rotation."""
    transform = list(range(NUM_TILES_TOTAL))

    if offset == 0:
        transform[0:NUM_TILES_FACE] = rotate_face(transform[0:NUM_TILES_FACE], amount)
    if offset == CUBE_ORDER-1:
        transform[NUM_TILES_FACE:2*NUM_TILES_FACE] = rotate_face(transform[NUM_TILES_FACE:2*NUM_TILES_FACE], -amount)

    NUM_TILES_OFFSET = CUBE_ORDER * 4

    s = 2 * NUM_TILES_FACE + offset * NUM_TILES_OFFSET
    transform_slice = transform[s:s + NUM_TILES_OFFSET]

    if amount > 0:
        transform[s:s+NUM_TILES_OFFSET] = transform_slice[1:] + [transform_slice[0]]
    else:
        transform[s:s+NUM_TILES_OFFSET] = [transform_slice[-1]] + transform_slice[:-1]
    return transform

def get_transform(face_index, offset, amount):

    cube_to_face_transform = get_face_transform(face_index)
    face_to_action_transform = get_face_to_action_transform()
    action_transform = get_action_transform(offset, amount)
    inverse_face_to_action_transform = get_inverse_transform(face_to_action_transform)
    inverse_cube_to_face_transform = get_inverse_transform(cube_to_face_transform)

    compound_transform = list(cube_to_face_transform)
    compound_transform = apply_transform(compound_transform, face_to_action_transform)
    compound_transform = apply_transform(compound_transform, action_transform)
    compound_transform = apply_transform(compound_transform, inverse_face_to_action_transform)
    compound_transform = apply_transform(compound_transform, inverse_cube_to_face_transform)

    return compound_transform

for i in range(NUM_FACES):
    for j in range(CUBE_ORDER):
        for k in [-1, 1]:
            print(i, j, k)
            print(get_transform(i, j, k))