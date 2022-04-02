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

  const dataFeedDetails = state.dataFeeds[data.id];

  if (!dataFeedDetails) {
    throw new ContractError(`Data feed with id ${data.id} do not exist`);
  }

  return { result: { ...dataFeedDetails, id: data.id } };
};
