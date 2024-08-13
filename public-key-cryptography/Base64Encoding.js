//encode

const unit8Array = new Uint8Array([72,101,108,108,111]);
const base64Encoded = Buffer.from(unit8Array).toString("base64");
console.log(base64Encoded);
