import {
  NodesDataFeedsState,
  NodesDataFeedsInput,
  GetNodeDetailsInputData,
  GetNodesDetailsResult,
} from "../../types";

declare const ContractError;

export const getNodeDetails = (
  state: NodesDataFeedsState,
  input: NodesDataFeedsInput
): GetNodesDetailsResult => {
  const data = input.data as GetNodeDetailsInputData;
  if (!data?.address) {
    throw new ContractError("Missing node address");
  }

  const nodeDetails = state.nodes[data.address];

  if (!nodeDetails) {
    throw new ContractError(`Node with address ${data.address} do not exist`);
  }

  return { result: { ...nodeDetails, address: data.address } };
};
