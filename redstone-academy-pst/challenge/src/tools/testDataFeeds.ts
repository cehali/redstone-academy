import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import {
  NodesDataFeedsInput,
  NodesDataFeedsState,
} from "../contracts/nodesDataFeeds/types";
import {
  Contract,
  LoggerFactory,
  SmartWeave,
  SmartWeaveNodeFactory,
} from "redstone-smartweave";

let wallet: JWKInterface;
let arweave: Arweave;
let smartweave: SmartWeave;
let contract: Contract<NodesDataFeedsState>;

const contractTxId = "exZuXlB-PERdZieuUYdP_HvAZx2jdjTrfdJ4zpZZreY";

const testId = "newTestId";
const testDataFeedDetails = {
  id: testId,
  name: "testName",
  logo: "testLogo",
  description: "testDescription",
  manifestTxId: "testManifestId",
};

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

  smartweave = SmartWeaveNodeFactory.memCached(arweave);
  contract = smartweave.contract(contractTxId);
  contract.connect(wallet);
  await arweave.api.get("mine");

  const createDataFeedTransactionId =
    await contract.writeInteraction<NodesDataFeedsInput>({
      function: "createDataFeed",
      data: testDataFeedDetails,
    });

  console.log(`createDataFeedTransactionId: ${createDataFeedTransactionId}`);

  await arweave.api.get("mine");

  const newDataFeedDetails = {
    name: "newTestName",
    logo: "newTestLogo",
    description: "newTestDescription",
    manifestTxId: "newTestManifestId",
  };
  const updateDataFeedTransactionId =
    await contract.writeInteraction<NodesDataFeedsInput>({
      function: "updateDataFeed",
      data: {
        id: testId,
        update: newDataFeedDetails,
      },
    });

  console.log(`updateDataFeedTransactionId: ${updateDataFeedTransactionId}`);

  await arweave.api.get("mine");

  const getDataFeedDetailsByIdResult =
    await contract.dryWrite<NodesDataFeedsInput>({
      function: "getDataFeedDetailsById",
      data: {
        id: testId,
      },
    });

  console.log(getDataFeedDetailsByIdResult.result);

  const listDataFeedsResult = await contract.dryWrite<NodesDataFeedsInput>({
    function: "listDataFeeds",
    data: {},
  });

  console.log(listDataFeedsResult.result);
})();
