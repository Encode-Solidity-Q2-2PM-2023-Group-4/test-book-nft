import { ethers } from "ethers";
import { Book, Book__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() {
  const tokenID = Number(process.argv[2]);
  const rentalAddress = process.argv[3];
  // Define provider and wallet
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
    
  // Attach
  const bookContractFactory = new Book__factory(signer);
  const bookContract = bookContractFactory.attach("0x69bfABd8de278B2ab3EC480175924a7C49146194") as Book;

  // Lend NFT to Adam
  const currentBlocktime: number = Math.floor(Date.now() / 1000);
  const rentTx = await bookContract.setUser(tokenID, rentalAddress, currentBlocktime + 120);
  await rentTx.wait();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
