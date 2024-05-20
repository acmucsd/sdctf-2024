#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <syscall.h>

int main() {
    setuid(0);
    setgid(0);
    char buf[0x100];
    int fd = open("flag", O_RDONLY);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    int n = read(fd, buf, sizeof(buf));
    if (n < 0) {
        perror("read");
        return 1;
    }
    write(1, buf, n);
    return 0;
}

