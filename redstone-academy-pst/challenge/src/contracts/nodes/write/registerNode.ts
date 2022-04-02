import { NodesState, NodesAction, RegisterNodeInputData } from "../types";

declare const ContractError;

export const registerNode = (
  state: NodesState,
  action: NodesAction
): { state: NodesState } => {
  const data = action.input.data as RegisterNodeInputData;

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

  if (state.nodes[action.caller]) {
    throw new ContractError(`Node with owner ${action.caller} already exists`);
  }

  state.nodes[action.caller] = data;

  return { state };
};
