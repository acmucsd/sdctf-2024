STATIC=static/.keep static/index.html.h static/styles.css.h static/main.js.h static/404.html.h static/405.txt.h static/flag.txt.h static/no_note.txt.h

server: utf8.o server.o
	gcc -pthread -o server utf8.o server.o

server.o: server.c $(STATIC)
	gcc -c -fPIC -ggdb -o server.o server.c

utf8.o: utf8.c
	gcc -c -fPIC -ggdb -o utf8.o utf8.c

clean:
	rm -f server server.o utf8.o
	rm -f static/*.h

static/.keep:
	mkdir -p static
	touch static/.keep

static/index.html.h: static_src/index.html
	deno run static_utf32.ts index_html < static_src/index.html > static/index.html.h

static/styles.css.h: static_src/styles.css
	deno run static_utf32.ts css < static_src/styles.css > static/styles.css.h

static/main.js.h: static_src/main.js
	deno run static_utf32.ts js < static_src/main.js > static/main.js.h

static/flag.txt.h: static_src/flag.txt
	deno run static_utf32.ts flag < static_src/flag.txt > static/flag.txt.h

static/no_note.txt.h: static_src/no_note.txt
	deno run static_utf32.ts no_note < static_src/no_note.txt > static/no_note.txt.h

static/404.html.h: static_src/404.html
	deno run static_utf32.ts error_404 < static_src/404.html > static/404.html.h

static/405.txt.h: static_src/405.txt
	deno run static_utf32.ts error_405 < static_src/405.txt > static/405.txt.h

run: server
	./server
