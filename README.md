# Memory Game
A responsive memory game web application; this game displays number of moves as well as a timer.

![Memory Game Screenshot](memorygame.png)

## About the Game
### How to Play
You task is to match pairs of cards. Playing is very simple - you turn over one card and then try to find a matching card. You can choose from various deck options.

### Timer 
A timer at the top of the deck shows the time elapsed (in seconds) since the beginning of the game. _Web storage API_ is used to store fastest game completion time locally within the user's browser.

### Ratings
Ratings are assigned based on the moves used for winning.

|Moves | Rating(stars) |
-------| --------------
|< 12  | 3             |
|< 18  | 2             |
|> 18  | 1             |

## Live Version
Check out the live version of this app [here](https://ssaleem.github.io/Memory-Game/).
