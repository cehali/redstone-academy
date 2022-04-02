import {
  NodesDataFeedsState,
  NodesDataFeedsAction,
  UpdateDataFeedInputDate,
} from "../../types";

declare const ContractError;

export const updateDataFeed = (
  state: NodesDataFeedsState,
  action: NodesDataFeedsAction
): { state: NodesDataFeedsState } => {
  const data = action.input.data as UpdateDataFeedInputDate;
  const { id, update } = data;

  const currentDataFeedState = state.dataFeeds[id];
  if (!currentDataFeedState) {
    throw new ContractError(`Data feed with id ${id} not found`);
  }

  if (action.caller !== currentDataFeedState.admin) {
    throw new ContractError("Only admin can update data feed");
  }

  state.dataFeeds[id] = {
    ...currentDataFeedState,
    ...update,
  };

  return { state };
};
