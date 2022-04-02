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

  const currentNodeState = state.nodes[action.caller];

  if (!currentNodeState) {
    throw new ContractError(`Node with owner ${action.caller} not found`);
  }

  state.nodes[action.caller] = {
    ...currentNodeState,
    ...data,
  };

  return { state };
};
