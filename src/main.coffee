canvas = document.getElementById("mainCanvas");
ctx = canvas.getContext("2d");
test1 = new Vector3(1,1,1)
test2 = new Vector3(1,2,3)
alert(test1.add(test2).magnitude)
