import { NodesState } from "../types";

declare const ContractError;

export const removeNode = (
  state: NodesState,
  caller: string
): { state: NodesState } => {
  const currentNodeState = state.nodes[caller];

  if (!currentNodeState) {
    throw new ContractError(`Node with owner ${caller} not found`);
  }

  delete state.nodes[caller];

  return { state };
};
