import {
  NodesDataFeedsState,
  NodesDataFeedsAction,
  UpdateNodeDetailInputData,
} from "../../types";

declare const ContractError;

export const updateNodeDetails = (
  state: NodesDataFeedsState,
  action: NodesDataFeedsAction
): { state: NodesDataFeedsState } => {
  const data = action.input.data as UpdateNodeDetailInputData;
  const caller = action.caller;

  const currentNodeState = state.nodes[caller];

  if (!currentNodeState) {
    throw new ContractError(`Node with owner ${caller} not found`);
  }

  state.nodes[caller] = {
    ...currentNodeState,
    ...data,
  };

  return { state };
};
