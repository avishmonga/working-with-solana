const {Connection , PublicKey,clusterApiUrl , Keypair , LAMPORTS_PER_SOL } = require('@solana/web3.js');

let publicKeyFromArg = process.argv[2];


const newPair = new Keypair();

const publicKey = new PublicKey(newPair.publicKey).toString();

const privateKey = newPair.secretKey;

console.log(publicKeyFromArg)

// console.log('publick key'  , newPair);

// console.log('connection' , connection);


const getSolBalance = async() =>{

    try {
        const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
        const myWallet =  Keypair.fromSecretKey(privateKey)


        const walletBalance = await connection.getBalance(new PublicKey(publicKeyFromArg));

        console.log(parseInt(walletBalance)/LAMPORTS_PER_SOL);

    } catch (error) {
        console.log(error)
    }
}

const airDropSol = async () =>{

    try{
    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    const myWallet = await  Keypair.fromSecretKey(privateKey)
    console.log('Airdroping starts here.......>>>>')

    const airDropSignature =await  connection.requestAirdrop(
        new PublicKey(publicKeyFromArg),
        2* LAMPORTS_PER_SOL
    )
     await connection.confirmTransaction(airDropSignature);
    }catch(err){
        console.log(err)
    }

}

const main = async () =>{
await getSolBalance()

await airDropSol()

await getSolBalance()
}
main()