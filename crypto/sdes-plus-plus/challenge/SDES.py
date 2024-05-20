import random
import itertools
NUM_BOXES = 8

# bidirectional s-box
class BDSBox:
    def __init__(self, permutation):
        assert(len(permutation) == 256)
        self.permutation = permutation
        self.configuration = 0

    def substitute_forward(self, b):
        return self.permutation[b]
    
    def substitute_backward(self, b):
        return self.permutation.index(b)

    def rotate(self, count=1):
        new_permutation = [0] * 256
        for i in range(256):
            new_permutation[i] = (self.permutation[i] + count) % 256
        self.permutation = new_permutation
        self.configuration = (self.configuration + count) % 256

class SDES:
    def __init__(self, key=0):
        self.moving_boxes: list[BDSBox] = []
        # create the mirror box first
        # these pairs will map to each other in the mirror s-box, i.e. 0 -> 1, 1 -> 0, 2 -> 3, 3 -> 2, etc etc
        pairs = [(x+1, x) for x in range(0, 256, 2)]
        self.mirror_box = BDSBox(list(itertools.chain.from_iterable(pairs)))
        self.key = key
        fixed_rng = random.Random() # used to generate the fixed S-boxes
        fixed_rng.seed(1234) # fixed seed, used ONLY for the permutations in the S-boxes
        for _ in range(NUM_BOXES):
            box_permutation = list(range(256))
            fixed_rng.shuffle(box_permutation)
            box = BDSBox(box_permutation)
            self.moving_boxes.append(box)
    
    @staticmethod
    def get_configuration_tuple(configuration):
        result = []
        for i in range(NUM_BOXES):
            result.append((configuration >> (i * 8)) % 256)
        return tuple(result)

    def configure_boxes(self, configuration_tuple):
        for (i, box) in enumerate(self.moving_boxes):
            box.rotate(256 - box.configuration) # reset box to configuration 0 first
            box.rotate(configuration_tuple[i]) # then rotate the box so that it goes to the wanted configuration

    def encrypt(self, message: bytes) -> bytes:
        moving_key = self.key
        ciphertext = []
        for b in message:
            self.configure_boxes(self.get_configuration_tuple(moving_key))
            scrambled_b = b
            for box in self.moving_boxes:
                scrambled_b = box.substitute_forward(scrambled_b)
            scrambled_b = self.mirror_box.substitute_forward(scrambled_b)
            for box in self.moving_boxes[::-1]:
                scrambled_b = box.substitute_backward(scrambled_b)
            ciphertext.append(scrambled_b)
            moving_key = (moving_key + 1) % (2 << (8 * NUM_BOXES))
        return bytes(ciphertext)
    
    def decrypt(self, message: bytes) -> bytes:
        return self.encrypt(message)