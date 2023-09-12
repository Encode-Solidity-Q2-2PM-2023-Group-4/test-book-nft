import { ethers } from "ethers";
import { Book, Book__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

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
  const bookContract = bookContractFactory.attach("0x69bfABd8de278B2ab3EC480175924a7C49146194") as Book;

  // Mint some tokens
  const mintTx = await bookContract.mint("ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4", ["random"]);
  await mintTx.wait();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
