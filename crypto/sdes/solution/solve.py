import pwn
import binascii

p = pwn.remote("127.0.0.1", 35027)

permutation_table = [list(0 for _ in range(256)) for _ in range(8)]
for c in range(256):
    pt = c.to_bytes() * 8
    pt_hex = binascii.hexlify(pt)
    p.sendline(b"E")
    p.sendline(pt_hex)
    p.recvuntil(b"Encrypted message:")
    p.recvline()
    ct_hex = p.recvline()[:-1]
    ct = binascii.unhexlify(ct_hex)
    for i in range(8):
        permutation_table[i][c] = ct[i]
p.sendline(b"D")
p.recvuntil(b"Here is your message:")
p.recvline()
ct_hex = p.recvline()[:-1]
ct = binascii.unhexlify(ct_hex)
print(ct)
pt = b""
for (i, c) in enumerate(ct):
    c_decrypted = permutation_table[i][c]
    pt += c_decrypted.to_bytes()
pt_hex = binascii.hexlify(pt)
p.sendline(pt_hex)
p.interactive()
