import unittest
import rubiks
import rich.pretty
rich.pretty.install()

class TestRubik(unittest.TestCase):

    def test_get_face_index(self):
        inputs = [(x, y) for y in range(0, 2) for x in range(0, 2)]
        expected = list(range(4))

        for i in range(len(inputs)):
            with self.subTest(i=i):
                setup = inputs[i]
                result = rubiks.get_face_index(setup[0], setup[1])

                self.assertEqual(result, expected[i])

    def test_rotate_face(self):
        face = [0, 1, 2, 3]
        rotations = [r for r in range(-3, 3)]
        expected = [
            [2, 0, 3, 1],
            [3, 2, 1, 0],
            [1, 3, 0, 2],
            [0, 1, 2, 3],
            [2, 0, 3, 1],
            [3, 2, 1, 0],
            [1, 3, 0, 2],
        ]

        for i in range(len(rotations)):
            with self.subTest(i=i):
               result = rubiks.rotate_face(face, rotations[i])
               self.assertEqual(result, expected[i])

    # score test
    # face = [0,1,0,0,1,0,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5]
    # print("Score:", face, get_score(face))

    # transforms test
    # print("Transforms:")
# for axis_index in range(NUM_OF_AXES):
#     for offset in range(CUBE_ORDER):
#         for direction in [True, False]:
#             state = list(range(NUM_TILES_TOTAL))
#             transform = get_transform(axis_index, offset, direction)
#             transformed_state = apply_transform(state, transform)
#             print(axis_index, offset, direction, transformed_state)