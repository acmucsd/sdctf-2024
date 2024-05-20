import soundfile as sf
from PIL import Image
import numpy as np

samplerate = 44100
data = []

# read the image
with Image.open("wavs.png") as img:
    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            r = format(r, "08b")
            g = format(g, "08b")
            b = format(b, "08b")
            a = format(a, "08b")

            # combine the two 8 bit numbers into one 16 bit number
            v1 = np.int16(int(g + a, 2) - 32768) #if you forget to subtract your ears will bleed
            v2 = np.int16(int(r + b, 2) - 32768)
            data.append((v1, v2))

# convert to wav using soundfile
sf.write("output.wav", data, samplerate)