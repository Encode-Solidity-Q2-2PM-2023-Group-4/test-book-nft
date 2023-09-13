import { ethers } from "ethers";
import { Book, Book__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { assert } from "console";
dotenv.config();

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

// Usage :  yarn ts-node --files .\scripts\userOf.ts 3
// The last argument is the token-id.
async function main() {

  const narg = process.argv.length - 2;
  //assert.equal(narg, 1, "The number of argument given is ${narg}, it must be 1.")
  assert(narg==1);
  const tokenid = process.argv[2];

  // Define provider and wallet
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
    
  // Attach
  const bookContractFactory = new Book__factory(signer);
  const bookContract = bookContractFactory.attach("0x69bfABd8de278B2ab3EC480175924a7C49146194") as Book;

  const usr_addr = await bookContract.userOf(tokenid);
  console.log(`The user who is renting token-${tokenid} is ${usr_addr}`);
  
  //const exp_time = await bookContract.userExpires(tokenid);
  //console.log(`The expiry time is ${exp_time}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
