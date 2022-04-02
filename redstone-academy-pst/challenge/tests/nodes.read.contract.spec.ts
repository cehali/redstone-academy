import ArLocal from "arlocal";
import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import {
  Contract,
  LoggerFactory,
  SmartWeave,
  SmartWeaveNodeFactory,
} from "redstone-smartweave";
import fs from "fs";
import path from "path";
import { NodesInput, NodesState } from "../src/contracts/nodes/types";
import { mockNodes } from "./helpers/nodes.mock";
import { addFunds } from "../utils/addFunds";
import { mineBlock } from "../utils/mineBlock";

describe("Nodes contract - read", () => {
  let contractSrc: string;
  let wallet: JWKInterface;
  let walletAddress: string;
  let arweave: Arweave;
  let arlocal: ArLocal;
  let smartweave: SmartWeave;
  let initialState: NodesState;
  let contract: Contract<NodesState>;

  beforeAll(async () => {
    arlocal = new ArLocal(1820, false);
    await arlocal.start();

    arweave = Arweave.init({
      host: "localhost",
      port: 1820,
      protocol: "http",
      logging: false,
    });

    LoggerFactory.INST.logLevel("error");

    smartweave = SmartWeaveNodeFactory.memCached(arweave);
    wallet = await arweave.wallets.generate();
    await addFunds(arweave, wallet);
    walletAddress = await arweave.wallets.jwkToAddress(wallet);

    contractSrc = fs.readFileSync(
      path.join(__dirname, "../dist/nodes/nodes.contract.js"),
      "utf8"
    );

    initialState = {
      canEvolve: true,
      contractAdmins: [walletAddress],
      nodes: mockNodes,
    };

    const contractTxId = await smartweave.createContract.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });

    contract = smartweave.contract(contractTxId);
    contract.connect(wallet);
    await mineBlock(arweave);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  describe("listNodes", () => {
    test("list all nodes", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "listNodes",
        data: {},
      });
      const expectedNodes = [
        "testNodeAddress1",
        "testNodeAddress2",
        "testNodeAddress3",
        "testNodeAddress4",
        "testNodeAddress5",
        "testNodeAddress6",
      ];
      expect(result).toEqual(expectedNodes);
    });

    test("list nodes limited to 2", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "listNodes",
        data: {
          limit: 2,
        },
      });
      const expectedNodes = ["testNodeAddress1", "testNodeAddress2"];
      expect(result).toEqual(expectedNodes);
    });

    test("list nodes after third", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "listNodes",
        data: {
          startAfter: 3,
        },
      });
      const expectedNodes = [
        "testNodeAddress4",
        "testNodeAddress5",
        "testNodeAddress6",
      ];
      expect(result).toEqual(expectedNodes);
    });

    test("list nodes limited to 3 after second", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "listNodes",
        data: {
          limit: 3,
          startAfter: 2,
        },
      });
      const expectedNodes = [
        "testNodeAddress3",
        "testNodeAddress4",
        "testNodeAddress5",
      ];
      expect(result).toEqual(expectedNodes);
    });
  });

  describe("getNodeDetails", () => {
    test("get details of first node", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "getNodeDetails",
        data: {
          address: "testNodeAddress1",
        },
      });
      const expectedNodeDetails = {
        address: "testNodeAddress1",
        name: "testName1",
        logo: "logo",
        description: "testDescription",
        dataFeedId: "testId",
        evmAddress: "testAddress",
        ipAddress: "testIpAddress",
        url: "testUrl",
      };
      expect(result).toEqual(expectedNodeDetails);
    });

    test("get details of middle node", async () => {
      const { result } = await contract.dryWrite<NodesInput>({
        function: "getNodeDetails",
        data: {
          address: "testNodeAddress4",
        },
      });
      const expectedNodeDetails = {
        address: "testNodeAddress4",
        name: "testName4",
        logo: "logo",
        description: "testDescription",
        dataFeedId: "testId",
        evmAddress: "testAddress",
        ipAddress: "testIpAddress",
        url: "testUrl",
      };
      expect(result).toEqual(expectedNodeDetails);
    });

    test("throw error if no address in input", async () => {
      const { errorMessage } = await contract.dryWrite<NodesInput>({
        function: "getNodeDetails",
        data: {},
      });
      expect(errorMessage).toBe("Missing node address");
    });

    test("throw error if invalid address in input", async () => {
      const { errorMessage } = await contract.dryWrite<NodesInput>({
        function: "getNodeDetails",
        data: {
          address: "invalidNodeAddress",
        },
      });

      expect(errorMessage).toBe(
        "Node with address invalidNodeAddress do not exist"
      );
    });
  });
});
