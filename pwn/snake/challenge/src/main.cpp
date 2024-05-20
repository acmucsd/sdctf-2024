#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <unistd.h>
#include <termios.h>
#include <vector>
#include <ncurses.h>
#include <string>
#include <fcntl.h>
#include <cstring>

struct Point {
    int x;
    int y;
};

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
};

#define WIDTH 32
#define HEIGHT 32

#define DIR_INVERSE(dir) (dir == UP ? DOWN : (dir == DOWN ? UP : (dir == LEFT ? RIGHT : LEFT)))

enum ObjectType {
    EMPTY = 0,
    SNAKE_HEAD,
    SNAKE,
    FOOD,
    WALL,
    WEAK_WALL,
    FLAG_F,
    FLAG_L,
    FLAG_A,
    FLAG_G,
};

enum GameState {
    IN_PROGRESS,
    GAMEOVER,
    WIN
};

class Game {
private:
    ObjectType game_board[WIDTH][HEIGHT];
    Point snake[WIDTH * HEIGHT];
    int snake_size;
    Direction direction;
    size_t tick_count;
public:
    GameState state;
    Game() : snake_size(3), direction(LEFT), state(IN_PROGRESS), tick_count(0) {
        memset(game_board, 0, sizeof(game_board));
        snake[0].x = 7;
        snake[0].y = 7;

        game_board[WIDTH / 2 - 2][HEIGHT / 2]   = FLAG_F;
        game_board[WIDTH / 2 - 1][HEIGHT / 2]   = FLAG_L;
        game_board[WIDTH / 2][HEIGHT / 2]       = FLAG_A;
        game_board[WIDTH / 2 + 1][HEIGHT / 2]   = FLAG_G;

        game_board[WIDTH / 2 - 2][HEIGHT / 2 - 1] = WEAK_WALL;
        game_board[WIDTH / 2 - 1][HEIGHT / 2 - 1] = WEAK_WALL;
        game_board[WIDTH / 2][HEIGHT / 2 - 1]     = WEAK_WALL;
        game_board[WIDTH / 2 + 1][HEIGHT / 2 - 1] = WEAK_WALL;
        game_board[WIDTH / 2 - 2][HEIGHT / 2 + 1] = WEAK_WALL;
        game_board[WIDTH / 2 - 1][HEIGHT / 2 + 1] = WEAK_WALL;
        game_board[WIDTH / 2][HEIGHT / 2 + 1]     = WEAK_WALL;
        game_board[WIDTH / 2 + 1][HEIGHT / 2 + 1] = WEAK_WALL;
        game_board[WIDTH / 2 - 3][HEIGHT / 2]     = WEAK_WALL;
        game_board[WIDTH / 2 + 2][HEIGHT / 2]     = WEAK_WALL;

        for (int i = 0; i < WIDTH; i++) {
            game_board[i][0] = WALL;
            game_board[i][HEIGHT - 1] = WALL;
        }
        for (int i = 0; i < HEIGHT; i++) {
            game_board[0][i] = WALL;
            game_board[WIDTH - 1][i] = WALL;
        }

        snake[0].x = WIDTH - 5;
        snake[0].y = HEIGHT - 2;
        game_board[snake[0].x][snake[0].y] = SNAKE_HEAD;
        for (int i = 1; i < snake_size; i++) {
            snake[i].x = snake[0].x + i;
            snake[i].y = snake[0].y;
            game_board[snake[i].x][snake[i].y] = SNAKE;
        }

        srand(time(NULL));
        add_food();
    }

    void add_food() {
        int food_x, food_y;
        do {
            food_x = rand() % (WIDTH - 2) + 1;
            food_y = rand() % (HEIGHT - 2) + 1;
        } while (game_board[food_x][food_y] != EMPTY);
        game_board[food_x][food_y] = FOOD;
    }

    void draw() {
        clear();
        draw_help();
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                switch (game_board[x][y]) {
                case EMPTY:
                    mvaddch(y, x, ' ');
                    break;
                case SNAKE_HEAD:
                    mvaddch(y, x, '@');
                    break;
                case SNAKE:
                    mvaddch(y, x, '+');
                    break;
                case FOOD:
                    mvaddch(y, x, 'o');
                    break;
                case WALL:
                    mvaddch(y, x, '*');
                    break;
                case WEAK_WALL:
                    mvaddch(y, x, '#');
                    break;
                case FLAG_F:
                    mvaddch(y, x, 'F');
                    break;
                case FLAG_L:
                    mvaddch(y, x, 'L');
                    break;
                case FLAG_A:
                    mvaddch(y, x, 'A');
                    break;
                case FLAG_G:
                    mvaddch(y, x, 'G');
                    break;
                }
            }
        }
        if (state == GAMEOVER) {
            mvprintw(HEIGHT / 2, WIDTH / 2 - 4, "GAME OVER");
        } else if (state == WIN) {
            mvprintw(HEIGHT / 2, WIDTH / 2 - 4, "YOU WIN! ENJOY YOUR FLAG!");
            int fd = open("./flag", O_RDONLY);
            char flag[100];
            memset(flag, 0, sizeof(flag));
            read(fd, flag, 100);
            mvprintw(HEIGHT / 2 + 1, WIDTH / 2 - 4, flag);
        }
        refresh();
    }

    void draw_help() {
        mvprintw(3, WIDTH + 3, "Use WASD or arrow keys to move the snake");
        mvprintw(5, WIDTH + 3, "*:    wall");
        mvprintw(7, WIDTH + 3, "#:    door, can be destroyed when strength > 150");
        mvprintw(9, WIDTH + 3, "o:    food");
        mvprintw(11, WIDTH + 3, "FLAG: maybe the thing you want");
        mvprintw(13, WIDTH + 3, "Current strength: %d", snake_size);
    }

    ObjectType __attribute__((always_inline)) object_at(int x, int y) {
        return game_board[x][y];
    }

    void tick() {
        if (state != IN_PROGRESS) {
            return;
        }
        Point new_head = snake[0];
        switch (direction) {
        case UP:
            new_head.y--;
            break;
        case DOWN:
            new_head.y++;
            break;
        case LEFT:
            new_head.x--;
            break;
        case RIGHT:
            new_head.x++;
            break;
        }
        ObjectType obj = object_at(new_head.x, new_head.y);
        if (obj == WALL || obj == SNAKE) {
            state = GAMEOVER;
            return;
        }
        if (obj == WEAK_WALL) {
            if (snake_size > 150) {
                game_board[new_head.x][new_head.y] = EMPTY;
                return;
            }
            Point last_segment = snake[snake_size - 1];
            game_board[last_segment.x][last_segment.y] = EMPTY;
            snake_size--;
            if (snake_size == 1) {
                state = GAMEOVER;
            }
            return;
        }
        if (obj == FLAG_F || obj == FLAG_L || obj == FLAG_A || obj == FLAG_G) {
            state = WIN;
            return;
        }
        int new_size = snake_size;
        if (obj == FOOD) {
            new_size += 2;
            Direction grow_dir = DIR_INVERSE(direction);
            if (snake_size >= 2) {
                Point tail = snake[snake_size - 1];
                Point tail2 = snake[snake_size - 2];
                if (tail.x == tail2.x) {
                    grow_dir = tail.y > tail2.y ? DOWN : UP;
                } else {
                    grow_dir = tail.x > tail2.x ? RIGHT : LEFT;
                }
            }
            for (int i = snake_size; i < new_size; i++) {
                snake[i].x = snake[i - 1].x + (grow_dir == LEFT ? -1 : (grow_dir == RIGHT ? 1 : 0));
                snake[i].y = snake[i - 1].y + (grow_dir == UP ? -1 : (grow_dir == DOWN ? 1 : 0));
            }
        }
        int prev_size = snake_size;
        move_snake(new_head, new_size);
        if (new_size > prev_size) {
            add_food();
        }
        tick_count++;
    }

    void move_snake(Point new_head, int new_size) {
        game_board[snake[new_size - 1].x][snake[new_size - 1].y] = EMPTY;
        for (int i = new_size - 1; i > 0; i--) {
            snake[i] = snake[i - 1];
        }
        snake[0] = new_head;
        game_board[snake[0].x][snake[0].y] = SNAKE_HEAD;
        for (int i = 1; i < new_size; i++) {
            game_board[snake[i].x][snake[i].y] = SNAKE;
        }
        snake_size = new_size;
    }

    void set_direction(Direction dir) {
        direction = dir;
    }
};

WINDOW* wnd;

int init() {
    wnd = initscr();
    cbreak();
    noecho();
    clear();
    refresh();
    keypad(wnd, true);
    nodelay(wnd, true);
    curs_set(0);

    attron(A_BOLD);
    box(wnd, 0, 0);
    attroff(A_BOLD);

    return 0;
}

void run() {

    int in_char;
    int x = 10;
    int y = 10;
    auto game = new Game();
    while (1) {
        usleep(150000);
        in_char = wgetch(wnd);
        game->tick();
        game->draw();
        if (game->state != IN_PROGRESS) {
            continue;
        }
        switch (in_char) {
        case 'q':
            return;
            break;
        case KEY_UP:
        case 'w':
            game->set_direction(UP);
            break;
        case KEY_DOWN:
        case 's':
            game->set_direction(DOWN);
            break;
        case KEY_LEFT:
        case 'a':
            game->set_direction(LEFT);
            break;
        case KEY_RIGHT:
        case 'd':
            game->set_direction(RIGHT);
            break;
        default:
            break;
        }
    }
    clear();
}

int main() {
    int init_status = init();
    if (init_status == 0) run();
    endwin();
    while(1);
}
