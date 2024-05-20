from card import Card


class Hand:
    def __init__(self, cards=None, bet=0):
        self.cards = [] if cards is None else cards
        self.bet = bet

    def add_card(self, card):
        self.cards.append(card)

    def get_value(self):
        value = 0
        aces = 0
        for card in self.cards:
            if card.value.isnumeric():
                value += int(card.value)
            else:
                if card.value == "Ace":
                    aces += 1
                    value += 11
                else:
                    value += 10

        while value > 21 and aces:
            value -= 10
            aces -= 1

        return value

    def __repr__(self):
        return f"Hand: {', '.join(map(str, self.cards))}"
