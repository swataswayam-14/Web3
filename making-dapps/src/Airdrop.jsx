import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export function Airdrop() {
    const wallet = useWallet();
    const {connection} = useConnection();
    function sendAirdropToUser()
    {
        connection.requestAirdrop(wallet?.publicKey, 10)//second variable here "10" is lamports
        alert("airdroped sol")
    }
    return <div>
        Hi mr. {wallet?.publicKey?.toString() + "grab a dunhill and start investing"}
        <input type="text" name="Amount" placeholder="Amount" id="amount" />
        <button onClick={sendAirdropToUser}>
            Request Airdrop
        </button>
    </div>
}