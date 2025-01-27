import {
  ApiKeyDTO,
  FilterableApiKeyProps,
  RevokeApiKeyDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { revokeApiKeysStep } from "../steps"

type RevokeApiKeysStepInput = {
  selector: FilterableApiKeyProps
  revoke: RevokeApiKeyDTO
}

type WorkflowInput = RevokeApiKeysStepInput

export const revokeApiKeysWorkflowId = "revoke-api-keys"
export const revokeApiKeysWorkflow = createWorkflow(
  revokeApiKeysWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<ApiKeyDTO[]> => {
    return new WorkflowResponse(revokeApiKeysStep(input))
  }
)
