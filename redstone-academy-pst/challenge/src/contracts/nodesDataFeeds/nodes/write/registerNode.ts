import {
  NodesDataFeedsState,
  NodesDataFeedsAction,
  RegisterNodeInputData,
} from "../../types";

declare const ContractError;

export const registerNode = (
  state: NodesDataFeedsState,
  action: NodesDataFeedsAction
): { state: NodesDataFeedsState } => {
  const data = action.input.data as RegisterNodeInputData;
  const caller = action.caller;

  const isValidData =
    data.name &&
    data.logo &&
    data.description &&
    data.dataFeedId &&
    data.evmAddress &&
    data.ipAddress;

  if (!isValidData) {
    throw new ContractError("Invalid node data");
  }

  if (state.nodes[caller]) {
    throw new ContractError(`Node with owner ${caller} already exists`);
  }

  state.nodes[caller] = data;

  return { state };
};
