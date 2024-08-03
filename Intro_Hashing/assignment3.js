const crypto = require('crypto');

const transactions = [
    {
        parties: "swayam => rishi",
        amount: 200
    },
    {
        parties: "rishi => swayam",
        amount: 800
    },
    {
        parties: "koustav => swayam",
        amount: 102
    },
    {
        parties: "swayam => sriram",
        amount: 360
    }
]

function findHashWithPrefix(prefix) {
    let inputStr = "";
    transactions.map((transaction)=>{
        inputStr += transaction.parties+" | "+transaction.amount+", "
    })
    console.log(inputStr);
    
    let input = 0;
    while(true) {

        let inputStrFinal = inputStr +input.toString();
        let hash = crypto.createHash('sha256').update(inputStrFinal).digest('hex');
        if(hash.startsWith(prefix)) {
            return {
                input: inputStr,
                hash: hash
            }
        }
        input ++;
    }
}
const result = findHashWithPrefix('0000');
console.log(`Input: ${result.input}`);
console.log(`Hash: ${result.hash}`);