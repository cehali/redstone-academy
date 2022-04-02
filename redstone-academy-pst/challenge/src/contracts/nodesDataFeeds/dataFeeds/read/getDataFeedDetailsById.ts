import {
  NodesDataFeedsState,
  NodesDataFeedsInput,
  GetDataFeedDetailsByIdInputData,
  GetDataFeedDetailsByIdResult,
} from "../../types";

declare const ContractError;

export const getDataFeedDetailsById = (
  state: NodesDataFeedsState,
  input: NodesDataFeedsInput
): GetDataFeedDetailsByIdResult => {
  const data = input.data as GetDataFeedDetailsByIdInputData;
  if (!data?.id) {
    throw new ContractError("Missing data feed id");
  }

  const id = data.id;
  const dataFeedDetails = state.dataFeeds[id];

  if (!dataFeedDetails) {
    throw new ContractError(`Data feed with id ${id} does not exist`);
  }

  return { result: { ...dataFeedDetails, id: id } };
};
