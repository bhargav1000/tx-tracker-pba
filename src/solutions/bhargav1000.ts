import type {
  API,
  FinalizedEvent,
  IncomingEvent,
  NewBlockEvent,
  NewTransactionEvent,
  OutputAPI,
} from "../types"

export default function bhargav1000(api: API, outputApi: OutputAPI) {
  return (event: IncomingEvent) => {
    // Requirements:
    //
    // 1) When a transaction becomes "settled"-which always occurs upon receiving a "newBlock" event-
    //    you must call `outputApi.onTxSettled`.
    //
    //    - Multiple transactions may settle in the same block, so `onTxSettled` could be called
    //      multiple times per "newBlock" event.
    //    - Ensure callbacks are invoked in the same order as the transactions originally arrived.
    //
    // 2) When a transaction becomes "done"-meaning the block it was settled in gets finalized-
    //    you must call `outputApi.onTxDone`.
    //
    //    - Multiple transactions may complete upon a single "finalized" event.
    //    - As above, maintain the original arrival order when invoking `onTxDone`.
    //    - Keep in mind that the "finalized" event is not emitted for all finalized blocks.
    //
    // Notes:
    // - It is **not** ok to make redundant calls to either `onTxSettled` or `onTxDone`.
    // - It is ok to make redundant calls to `getBody`, `isTxValid` and `isTxSuccessful`
    //
    // Bonus 1:
    // - Avoid making redundant calls to `getBody`, `isTxValid` and `isTxSuccessful`.
    //
    // Bonus 2:
    // - Upon receiving a "finalized" event, call `api.unpin` to unpin blocks that are either:
    //     a) pruned, or
    //     b) older than the currently finalized block.

    const onNewBlock = ({ blockHash, parent }: NewBlockEvent) => {
      // TODO:: implement it
      // get all txns in body from blockHash

      const body = api.getBody(blockHash);
      const unpinnedBlocks = api.unpin(body);
      console.log(unpinnedBlocks);
      // for each txn check if it is valid
      for (const txn of body) {
        if (api.isTxSuccessful(blockHash, txn) === true) {
          outputApi.onTxSettled(blockHash, txn);
        }
      }
    }

    const onNewTx = ({ value: transaction }: NewTransactionEvent) => {
      // TODO:: implement it

      // on every new txn, check if it is valid
    }

    const onFinalized = ({ blockHash }: FinalizedEvent) => {
      // TODO:: implement it
      const body = api.getBody(blockHash);

      // for each txn check if it is valid
      for (const txn of body) {
        if (api.isTxValid(blockHash, txn) === true) {
          return api.isTxSuccessful(blockHash, txn);
        }
      }
    }
    
    // return (event: IncomingEvent) => {
      switch (event.type) {
        case "newBlock": {
          onNewBlock(event)
          break
        }
        case "newTransaction": {
          onNewTx(event)
          break
        }
        case "finalized":
          onFinalized(event)
      }
    // }
  }
}
