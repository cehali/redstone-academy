import { listNodes } from "./read/listNodes";
import { getNodeDetails } from "./read/getNodeDetails";
import { NodesAction, NodesContractResult, NodesState } from "./types";
import { registerNode } from "./write/registerNode";
import { updateNodeDetails } from "./write/updateNodeDetails";
import { removeNode } from "./write/removeNode";

type ContractResult = { state: NodesState } | NodesContractResult;

export const handle = async (
  state: NodesState,
  action: NodesAction
): Promise<ContractResult> => {
  const { input } = action;

  switch (input.function) {
    case "listNodes":
      return listNodes(state, input);
    case "getNodeDetails":
      return getNodeDetails(state, input);
    case "registerNode":
      return registerNode(state, action);
    case "updateNodeDetails":
      return updateNodeDetails(state, action);
    case "removeNode":
      return removeNode(state, action.caller);
  }
};
