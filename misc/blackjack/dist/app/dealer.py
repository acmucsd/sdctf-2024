from hand import Hand


class Dealer:
    def __init__(self):
        self.hand = Hand()

    def reset(self):
        self.hand = Hand()
