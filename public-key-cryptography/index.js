let bytes = new Uint8Array([0,123,43,255,256])
console.log(bytes);

Uint8Array[1] = 300;
console.log(bytes);
