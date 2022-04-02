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

const testNodeDetails = {
  name: "testName",
  logo: "testLogo",
  description: "testDescription",
  dataFeedId: "testId",
  evmAddress: "testAddress",
  ipAddress: "testIP",
  url: "testUrl",
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

  const registerNodeTransactionId =
    await contract.writeInteraction<NodesDataFeedsInput>({
      function: "registerNode",
      data: testNodeDetails,
    });

  console.log(`registerNodeTransactionId: ${registerNodeTransactionId}`);

  await arweave.api.get("mine");

  const newNodeDetails = {
    name: "newTestName",
    logo: "newTestLogo",
    description: "newTestDescription",
    dataFeedId: "newTestId",
    evmAddress: "testAddress",
    ipAddress: "newTestIP",
    url: "newTestUrl",
  };
  const updateNodeDetailsTransactionId =
    await contract.writeInteraction<NodesDataFeedsInput>({
      function: "updateNodeDetails",
      data: newNodeDetails,
    });

  console.log(
    `updateNodeDetailsTransactionId: ${updateNodeDetailsTransactionId}`
  );

  await arweave.api.get("mine");

  const getNodeDetailsResult = await contract.dryWrite<NodesDataFeedsInput>({
    function: "getNodeDetails",
    data: {
      address,
    },
  });

  console.log(getNodeDetailsResult.result);

  const listNodesResult = await contract.dryWrite<NodesDataFeedsInput>({
    function: "listNodes",
    data: {},
  });

  console.log(listNodesResult.result);

  const removeNodeTransactionId =
    await contract.writeInteraction<NodesDataFeedsInput>({
      function: "removeNode",
      data: {},
    });

  console.log(`removeNodeTransactionId: ${removeNodeTransactionId}`);

  await arweave.api.get("mine");

  const listNodesResultAfterRemoving =
    await contract.dryWrite<NodesDataFeedsInput>({
      function: "listNodes",
      data: {},
    });

  console.log(listNodesResultAfterRemoving.result);
})();
