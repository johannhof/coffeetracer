class @Color
  constructor: (@r, @g, @b) ->
  add: (c) =>
    new Color(@r + c.r, @g + c.g, @b + c.b)
  sub: (c) =>
    new Color(@r - c.r, @g - c.g, @b - c.b)
  mul: (c) =>
    new Color(@r * c.r, @g * c.g, @b * c.b)
  mul: (d) =>
    new Color(@r * d, @g * d, @b * d)

canvas = document.getElementById("mainCanvas")
ctx = canvas.getContext("2d")
ctx.fillStyle = "white"
ctx.fillRect(0, 0, canvas.width, canvas.height)
width = canvas.width
height = canvas.height
imgData = ctx.getImageData(0, 0, width, height)
c = new Color(0, 0.5, 1)
for x in [0..width] by 1
  for y in [0..height] by 1
    imgData.data[(x * height + y) * 4 + 0] = c.r * 255;
    imgData.data[(x * height + y) * 4 + 1] = c.g * 255;
    imgData.data[(x * height + y) * 4 + 2] = c.b * 255;
ctx.putImageData(imgData, 0, 0)