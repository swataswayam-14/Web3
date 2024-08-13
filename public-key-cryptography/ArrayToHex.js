function arrayToHex(byteArray) {
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
      hexString += byteArray[i].toString(16).padStart(2, '0');
    }
    return hexString;
}
const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
const hexString = arrayToHex(byteArray);
console.log(hexString);
  