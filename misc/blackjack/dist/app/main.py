import os
from game import Game, TABLE_MINIMUM, TABLE_MAXIMUM, TOO_MUCH_MONEY

FLAG = os.environ.get("FLAG", "sdctf{test_flag}")

game = Game()
game.start_game()
while True:
    game.play_round()
    if game.player.balance < TABLE_MINIMUM:
        print("You don't have enough money to play another round. Goodbye.")
        break
    if game.player.balance > TOO_MUCH_MONEY:
        print("I'm sorry I'm going to have to back you off. You're too good for us.")
        print(f"Here is a flag for your troubles: {FLAG}")
        break
