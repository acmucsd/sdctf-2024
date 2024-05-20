import soundfile as sf
from PIL import Image
import math
import numpy as np

data, samplerate = sf.read('cat.wav',dtype='int16')

width = math.ceil(math.sqrt((len(data))))
height = width

# convert to binary, then split it up for each sample
x = 0
y = 0
img = Image.new("RGBA", (width, height), 0)
for sample in data:
    # convert to binary
    b1 = format(sample + 32768, "016b")

    # split up
    g = b1[:8]
    a = b1[8:16]
    r = b1[:8]
    b = b1[8:16]

    # convert to int
    r = np.uint8(int(r, 2))
    g = np.uint8(int(g, 2))
    b = np.uint8(int(b, 2))
    a = np.uint8(int(a, 2))

    # put in image
    if x == width:
        x = 0
        y += 1
    
    img.putpixel((x, y), (r, g, b, a))
    x += 1

img.save("wavs2.png", "PNG")  # save the new image