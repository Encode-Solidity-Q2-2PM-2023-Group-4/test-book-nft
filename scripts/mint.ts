import { ethers } from "ethers";
import { Book, Book__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.parseUnits("1");

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() {
  // Define provider and wallet
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
    
  // Attach
  const bookContractFactory = new Book__factory(signer);
  const bookContract = bookContractFactory.attach(process.env.VOTING_TOKEN_ADDRESS ?? "") as Book;

  // Mint some tokens
  const mintTx = await bookContract.mint("ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4", ["random"]);
  await mintTx.wait();
  console.log(`Minted ${MINT_VALUE.toString()} decimal units to account ${signer.address}.\n`);
  const balanceBN = await bookContract.balanceOf(signer.address);  
  console.log(`Account ${signer.address} has ${balanceBN.toString()} decimal units of VoteToken.\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
