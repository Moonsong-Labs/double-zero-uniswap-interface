import { Flex, Separator } from 'ui/src'
import {
  TokenApprovalTransactionStepRow,
  TokenRevocationTransactionStepRow,
} from 'uniswap/src/components/ConfirmSwapModal/steps/Approve'
import { Permit2SignatureStepRow } from 'uniswap/src/components/ConfirmSwapModal/steps/Permit'
import { SwapTransactionStepRow } from 'uniswap/src/components/ConfirmSwapModal/steps/Swap'
import { WrapTransactionStepRow } from 'uniswap/src/components/ConfirmSwapModal/steps/Wrap'
import { StepStatus } from 'uniswap/src/components/ConfirmSwapModal/types'
import {
  TransactionStep,
  TransactionStepType,
} from 'uniswap/src/features/transactions/swap/utils/generateTransactionSteps'

interface ProgressIndicatorProps {
  steps: TransactionStep[]
  currentStep?: { step: TransactionStep; accepted: boolean }
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps): JSX.Element | null {
  function getStatus(targetStep: TransactionStep): StepStatus {
    const currentIndex = steps.findIndex((step) => step.type === currentStep?.step.type)
    const targetIndex = steps.indexOf(targetStep)
    if (currentIndex < targetIndex) {
      return StepStatus.Preview
    } else if (currentIndex === targetIndex) {
      return currentStep?.accepted ? StepStatus.InProgress : StepStatus.Active
    } else {
      return StepStatus.Complete
    }
  }

  if (steps.length === 0) {
    return null
  }

  return (
    <Flex px="$spacing12">
      <Separator my="$spacing12" />
      {steps.map((step, i) => (
        <Flex key={`progress-indicator-step-${i}`}>
          <Step step={step} status={getStatus(step)} />
          {i !== steps.length - 1 && <Flex backgroundColor="$neutral3" height={10} mt={1} mx={11} width={2} />}
        </Flex>
      ))}
    </Flex>
  )
}

function Step({ step, status }: { step: TransactionStep; status: StepStatus }): JSX.Element {
  switch (step.type) {
    case TransactionStepType.WrapTransaction:
      return <WrapTransactionStepRow step={step} status={status} />
    case TransactionStepType.TokenApprovalTransaction:
      return <TokenApprovalTransactionStepRow step={step} status={status} />
    case TransactionStepType.TokenRevocationTransaction:
      return <TokenRevocationTransactionStepRow step={step} status={status} />
    case TransactionStepType.Permit2Signature:
      return <Permit2SignatureStepRow step={step} status={status} />
    case TransactionStepType.SwapTransaction:
    case TransactionStepType.SwapTransactionAsync:
    case TransactionStepType.UniswapXSignature:
      return <SwapTransactionStepRow step={step} status={status} />
  }
}