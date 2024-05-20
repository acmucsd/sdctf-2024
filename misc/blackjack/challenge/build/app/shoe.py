import random
from card import Card


class Shoe:
    def __init__(self, size):
        self.size = size
        self.cards = []
        self.suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
        self.values = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "Jack",
            "Queen",
            "King",
            "Ace",
        ]

        self.total_cards = size * 52

        for _ in range(size):
            for suit in self.suits:
                for value in self.values:
                    self.cards.append(Card(suit, value))

    def shuffle(self):
        random.shuffle(self.cards)

    def deal_card(self):
        return self.cards.pop()

    def remaining_cards(self):
        return len(self.cards)
