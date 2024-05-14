#include "static/404.html.h"
#include "static/405.txt.h"
#include "static/flag.txt.h"
#include "static/index.html.h"
#include "static/main.js.h"
#include "static/no_note.txt.h"
#include "static/styles.css.h"
#include "utf8.h"
#include <netinet/in.h>
#include <pthread.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

// https://dev.to/jeffreythecoder/how-i-built-a-simple-http-server-from-scratch-using-c-739

#define BUFFER_SIZE 10000

struct utf8 index_html_response;
struct utf8 css_response;
struct utf8 js_response;
struct utf8 flag_response;
struct utf8 no_note_response;
struct utf8 error_404_response;
struct utf8 error_405_response;
struct utf8 flag_key;

struct utf8 create_response(char *headers, size_t size, struct utf8 body) {
  // Assumes `headers` is null-terminated, so headers[size - 1] is '\0'
  size_t response_len = size + 1 + body.n;
  char *response = malloc(response_len);
  memcpy(response, headers, size - 1);
  // CRLF is recommended for HTTP: https://stackoverflow.com/a/5757349
  response[size - 1] = '\r';
  response[size] = '\n';
  memcpy(response + size + 1, body.bytes, body.n);

  struct utf8 result = {.bytes = response, .n = response_len};
  return result;
}

void *handle_client(void *arg) {
  int client_fd = *((int *)arg);
  char *buffer = (char *)malloc(BUFFER_SIZE * sizeof(char));

  ssize_t bytes_received = recv(client_fd, buffer, BUFFER_SIZE, 0);
  if (bytes_received > 10) {
    if (strncmp(buffer, "POST / ", 7) == 0) {
      bool seen_lf = false;
      char *body = buffer;
      while (bytes_received > 0) {
        if (*body == '\n') {
          if (seen_lf) {
            // Saw two adjacent LFs, so the next byte is the start of the body
            body++;
            bytes_received--;
            break;
          }
          seen_lf = true;
        } else if (*body != '\r') {
          // Ignore CR to allow for \r\n\r\n. Note that this also allows things
          // like \n\r\r\r\r\r\n but whatever.
          seen_lf = false;
        }

        body++;
        bytes_received--;
      }

      struct utf8 response =
          flag_key.n == bytes_received &&
                  strncmp(flag_key.bytes, body, flag_key.n) == 0
              ? flag_response
              : no_note_response;
      send(client_fd, response.bytes, response.n, 0);
    } else if (strncmp(buffer, "GET / ", 6) == 0) {
      send(client_fd, index_html_response.bytes, index_html_response.n, 0);
    } else if (strncmp(buffer, "GET /c ", 7) == 0) {
      send(client_fd, css_response.bytes, css_response.n, 0);
    } else if (strncmp(buffer, "GET /java ", 10) == 0) {
      send(client_fd, js_response.bytes, js_response.n, 0);
    } else if (strncmp(buffer, "GET ", 4) == 0) {
      send(client_fd, error_404_response.bytes, error_404_response.n, 0);
    } else {
      send(client_fd, error_405_response.bytes, error_405_response.n, 0);
    }
  }

  close(client_fd);
  free(arg);
  free(buffer);
  return NULL;
}

#define TRY(attempt, failure)                                                  \
  ((success = attempt) < 0 ? (fprintf(stderr, failure), exit(1), 0) : success)

int main() {
  setbuf(stdout, 0); // needed for docker ¯\_(ツ)_/¯
  printf("Good morning everyone!\n");

  int flag_key_chars[] = {'f', 'l', 'a', 'g'};
  flag_key = utf8_encode(flag_key_chars, 4);
  char index_html_headers[] = "HTTP/1.1 200 OK\n"
                              "Content-Type: text/html; charset=UTF-8\n";
  index_html_response =
      create_response(index_html_headers, sizeof(index_html_headers),
                      utf8_encode(index_html, index_html_len));
  char css_headers[] = "HTTP/1.1 200 OK\n"
                       "Content-Type: text/css; charset=UTF-8\n";
  css_response = create_response(css_headers, sizeof(css_headers),
                                 utf8_encode(css, css_len));
  char js_headers[] = "HTTP/1.1 200 OK\n"
                      "Content-Type: application/javascript; charset=UTF-8\n";
  js_response =
      create_response(js_headers, sizeof(js_headers), utf8_encode(js, js_len));
  char no_note_headers[] = "HTTP/1.1 404 Not Found\n"
                           "Content-Type: text/plain; charset=UTF-8\n";
  no_note_response = create_response(no_note_headers, sizeof(no_note_headers),
                                     utf8_encode(no_note, no_note_len));
  char flag_headers[] = "HTTP/1.1 200 OK\n"
                        "Content-Type: text/plain; charset=UTF-8\n";
  flag_response = create_response(flag_headers, sizeof(flag_headers),
                                  utf8_encode(flag, flag_len));
  char error_404_headers[] = "HTTP/1.1 404 Not Found\n"
                             "Content-Type: text/html; charset=UTF-8\n";
  error_404_response =
      create_response(error_404_headers, sizeof(error_404_headers),
                      utf8_encode(error_404, error_404_len));
  char error_405_headers[] = "HTTP/1.1 405 Method Not Allowed\n"
                             "Content-Type: text/plain; charset=UTF-8\n";
  error_405_response =
      create_response(error_405_headers, sizeof(error_405_headers),
                      utf8_encode(error_405, error_405_len));

  int success;
  int server_fd = TRY(socket(AF_INET, SOCK_STREAM, 0), "socket failed\n");
  struct sockaddr_in server_addr;
  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = INADDR_ANY;

  int port = 10068;
  do {
    port++;
    server_addr.sin_port = htons(port);
  } while (bind(server_fd, (struct sockaddr *)&server_addr,
                sizeof(server_addr)) < 0);
  TRY(listen(server_fd, 10), "listen failed\n");
  printf("I am excited to announce that we are now listening at "
         "http://localhost:%d/\n",
         port);

  while (1) {
    struct sockaddr_in client_addr;
    socklen_t client_addr_len = sizeof(client_addr);
    int *client_fd = malloc(sizeof(int));

    if ((*client_fd = accept(server_fd, (struct sockaddr *)&client_addr,
                             &client_addr_len)) < 0) {
      fprintf(stderr, "accept failed\n");
      free(client_fd);
      continue;
    }

    pthread_t thread_id;
    pthread_create(&thread_id, NULL, handle_client, (void *)client_fd);
    pthread_detach(thread_id);
  }

  return 0;
}
