from CRSA import *
import binascii
N = GaussianRational(Fraction(10219121982771366305832683912), Fraction(256598150620723458401298913015))
c = GaussianRational(Fraction(86082088096209998978235198960), Fraction(12817076461245760907545717511))
e = 65537

# factorize the norm of N - just throw into Alpertron or something, this is factorizable on a laptop
p = 231906082905097407399531022697
q = 284369605703967913507454687977

tot = (p - 1) * (q - 1)

d = pow(e, -1, tot)
m = pow(c, d, N)

# In reality there are four possible remainders with norm smaller than N
# this function shows what these four possible remainders are
def reduce_mod(self, N):
    x = self/N
    y1 = GaussianRational(Fraction(floor(x.real)), Fraction(floor(x.imag)))
    y2 = GaussianRational(Fraction(floor(x.real)), Fraction(ceil(x.imag)))
    y3 = GaussianRational(Fraction(ceil(x.real)), Fraction(floor(x.imag)))
    y4 = GaussianRational(Fraction(ceil(x.real)), Fraction(ceil(x.imag)))
    ys = [y1,y2,y3,y4]
    assert(all(y.real*y.real + y.imag+y.imag < N.real*N.real + N.imag*N.imag for y in ys))
    return tuple(self - y*N for y in ys)

answers = reduce_mod(m, N)

for answer in answers:
    # find the one with positive real/imag components
    if (answer.real > 0 and answer.imag > 0):
        flag1 = binascii.unhexlify(hex(int(answer.real))[2:]).decode()
        flag2 = binascii.unhexlify(hex(int(answer.imag))[2:]).decode()
        print(f"{flag1}{flag2}")