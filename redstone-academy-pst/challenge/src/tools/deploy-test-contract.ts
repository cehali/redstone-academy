import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import { NodesDataFeedsState } from "../contracts/nodesDataFeeds/types";
import {
  LoggerFactory,
  SmartWeave,
  SmartWeaveNodeFactory,
} from "redstone-smartweave";
import fs from "fs";
import path from "path";

let contractSrc: string;
let wallet: JWKInterface;
let walletAddress: string;
let initialState: NodesDataFeedsState;
let arweave: Arweave;
let smartweave: SmartWeave;

(async () => {
  arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });

  LoggerFactory.INST.logLevel("error");

  smartweave = SmartWeaveNodeFactory.memCached(arweave);
  wallet = await arweave.wallets.generate();
  const address = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${address}/1000000000000000`);
  walletAddress = await arweave.wallets.jwkToAddress(wallet);

  contractSrc = fs.readFileSync(
    path.join(__dirname, "../../dist/nodesDataFeeds.contract.js"),
    "utf8"
  );
  const stateFromFile: NodesDataFeedsState = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../dist/contracts/nodesDataFeeds/initial-state.json"
      ),
      "utf8"
    )
  );

  initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  };

  const contractTxId = await smartweave.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  console.log(contractTxId);

  await arweave.api.get("mine");
})();
