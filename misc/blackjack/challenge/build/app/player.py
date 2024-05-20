from hand import Hand


class Player:
    def __init__(self, name, balance):
        self.name = name
        self.balance = balance
        self.bet = None

    def place_bet(self, amount):
        if amount > self.balance:
            print("You don't have enough money to place that bet.")
            return False
        else:
            self.balance -= amount
            self.bet = amount

            print(
                f"{self.name} placed a bet ${amount}. Remaining balance: ${self.balance}"
            )
            return True

    def receive_payout(self, amount):
        self.balance += amount

    def reset(self):
        self.bet = None

    def can_bet(self, amount):
        return self.balance > amount
