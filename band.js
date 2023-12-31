const { Client, Wallet, Message, Coin, Transaction, Fee } = require('@bandprotocol/bandchain.js')
const fs = require('fs')
const path = require('path')

const grpcURL = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcURL)

// Setup the client
async function createOracleScript() {
  // Setup the wallet
  const { PrivateKey } = Wallet
  const mnemonic = "test"
  const privateKey = PrivateKey.fromMnemonic(mnemonic)
  const publicKey = privateKey.toPubkey()
  console.log("publicKey",publicKey)
  const sender = publicKey.toAddress().toAccBech32()
  console.log("pubKey",sender)

  // Setup the transaction's properties
  const chainId = await client.getChainId()
  const execPath = path.resolve(__dirname, './target/wasm32-unknown-unknown/release/hello_world.wasm')
  console.log("execPath",execPath)
  const code = fs.readFileSync(execPath)

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('360000')

  const requestMessage = new Message.MsgCreateOracleScript(
    'Hello World!', // oracle script name
    code, // oracle script code
    sender, // owner
    sender, // sender
    '', // description
    '{repeat:u64}/{response:string}', // schema
    'https://ipfs.io/ipfs/QmSSrgJ6QuFDJHyC2SyTgnHKRBhPdLHUD2tJJ86xejrCfn' // source code url
  )

  // Construct the transaction
  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(350000)

  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Sign the transaction
  const signDoc = txn.getSignDoc(publicKey)
  const signature = privateKey.sign(signDoc)
  const txRawBytes = txn.getTxData(signature, publicKey)

  // Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes)

  return sendTx
}

;(async () => {
  console.log(await createOracleScript())
})()