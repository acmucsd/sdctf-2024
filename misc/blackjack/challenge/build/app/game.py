from __future__ import annotations
from typing import List

from shoe import Shoe
from player import Player
from dealer import Dealer
from hand import Hand

import builtins

TABLE_MINIMUM = 50
TABLE_MAXIMUM = 2000
TOO_MUCH_MONEY = 150000


def _input(*args, **kwargs):
    print("[BEGIN USER INTERACTION]")
    return builtins.input(*args, **kwargs)

input = _input

class Game:
    def __init__(self):
        self.player = None
        self.dealer = Dealer()
        self.reset_shoe()

    def start_game(self):
        name = "Player"
        balance = 30000
        self.player = Player(name, balance)

    def deal_cards(self, hand):
        for _ in range(2):
            hand.add_card(self.shoe.deal_card())

    def check_blackjack(self, hand):
        player_value = hand.get_value()
        dealer_value = self.dealer.hand.get_value()

        if player_value == 21 and dealer_value == 21:
            print(f"Your hand: {hand} (value: {hand.get_value()})")
            print(
                f"[Dealer] Dealer's ending hand: {self.dealer.hand} (value: {self.dealer.hand.get_value()})"
            )

            print("Push! It's a tie.")
            self.player.receive_payout(self.player.bet)  # eh
            return True
        elif player_value == 21:
            print(f"Your hand: {hand} (value: {hand.get_value()})")
            print(
                f"[Dealer] Dealer's ending hand: {self.dealer.hand} (value: {self.dealer.hand.get_value()})"
            )

            print("Blackjack! You win!")
            self.player.receive_payout(2.5 * self.player.bet)
            return True
        elif dealer_value == 21:
            print(f"Your hand: {hand} (value: {hand.get_value()})")
            print(
                f"[Dealer] Dealer's ending hand: {self.dealer.hand} (value: {self.dealer.hand.get_value()})"
            )

            print("Dealer has Blackjack. You lose.")
            return True

        return False

    def reset_table(self):
        self.player.reset()
        self.dealer.reset()

    def reset_shoe(self):
        print("[Dealer] Resetting shoe...")
        self.shoe = Shoe(4)
        self.shoe.shuffle()

    def generate_possible_actions(self, hand: Hand):
        actions = ["hit", "stand"]

        if len(hand.cards) == 2 and self.player.can_bet(self.player.bet):
            actions.append("double")
            if hand.cards[0].value == hand.cards[1].value:
                actions.append("split")

        return actions

    def player_hand_action(
        self, hand: Hand, bet: int, all_hands: List[Hand] = None, split_count=0
    ):
        if all_hands is None:
            all_hands = [hand]

        while True:
            print(f"(Hand {split_count}) Your hand: {hand} (value: {hand.get_value()})")

            possible_actions = self.generate_possible_actions(hand)
            action = input(
                f"What would you like to do? ({', '.join(possible_actions)}): "
            )

            if action not in possible_actions:
                print("Invalid action. Please try again.")
                continue

            if action == "hit":
                hand.add_card(self.shoe.deal_card())
                if hand.get_value() > 21:
                    print(
                        f"(Hand {split_count}) Your hand: {hand} (value: {hand.get_value()})"
                    )
                    break
            elif action == "stand":
                break
            elif action == "double":
                if len(hand.cards) != 2:
                    print("You can only double on two cards.")
                    continue
                if not self.player.place_bet(bet):
                    return
                hand.add_card(self.shoe.deal_card())
                hand.bet *= 2
                print(
                    f"(Hand {split_count}) Your hand: {hand} (value: {hand.get_value()})"
                )
                break
            elif action == "split":
                if len(hand.cards) != 2:
                    print("You can only split on two cards.")
                    continue
                if hand.cards[0].value != hand.cards[1].value:
                    print("You can only split pairs.")
                    continue
                if not self.player.place_bet(bet):
                    return

                new_hand = Hand(bet=bet)
                new_hand.add_card(hand.cards.pop())

                hand.add_card(self.shoe.deal_card())
                new_hand.add_card(self.shoe.deal_card())

                all_hands.append(new_hand)
                self.player_hand_action(new_hand, bet, all_hands, split_count + 1)
        return all_hands

    def resolve_hand(self, hand, i):
        bet = hand.bet
        print(f"(Hand {i}) Your hand: {hand} (value: {hand.get_value()})")

        if hand.get_value() > 21:
            print(f"(Hand {i}) You bust! Dealer wins.")
        elif self.dealer.hand.get_value() > 21:
            print(f"(Hand {i}) Dealer busts! You win!")
            self.player.receive_payout(bet * 2)
        elif self.dealer.hand.get_value() > hand.get_value():
            print(f"(Hand {i}) Dealer wins!")
        elif self.dealer.hand.get_value() < hand.get_value():
            print(f"(Hand {i}) You win!")
            self.player.receive_payout(bet * 2)
        else:
            print(f"(Hand {i}) Push! It's a tie.")
            self.player.receive_payout(bet)

    def play_round(self):
        self.reset_table()
        if self.shoe.remaining_cards() < 30:
            self.reset_shoe()

        print("Player balance:", self.player.balance)

        bet = int(input(f"{self.player.name}, enter your bet: "))
        while bet not in range(TABLE_MINIMUM, TABLE_MAXIMUM + 1):
            print(
                f"Invalid bet. Please enter a bet between {TABLE_MINIMUM} and {TABLE_MAXIMUM}."
            )
            bet = int(input(f"{self.player.name}, enter your bet: "))

        if not self.player.place_bet(bet):
            return

        initial_hand = Hand(bet=bet)

        self.deal_cards(initial_hand)
        self.deal_cards(self.dealer.hand)

        print(f"[Dealer] Dealer's up card: {self.dealer.hand.cards[0]}")

        if self.check_blackjack(initial_hand):
            return

        all_hands = self.player_hand_action(initial_hand, bet)

        print(
            f"[Dealer] Dealer's hand: {self.dealer.hand} (value: {self.dealer.hand.get_value()})"
        )
        while self.dealer.hand.get_value() < 17:
            print("[Dealer] Dealer hits.")
            self.dealer.hand.add_card(self.shoe.deal_card())
        else:
            print(
                f"[Dealer] Dealer's ending hand: {self.dealer.hand} (value: {self.dealer.hand.get_value()})"
            )
            if self.dealer.hand.get_value() > 21:
                print("[Dealer] Dealer busts!")
            else:
                print("[Dealer] Dealer stands.")

        for i, hand in enumerate(all_hands):
            self.resolve_hand(hand, i)
