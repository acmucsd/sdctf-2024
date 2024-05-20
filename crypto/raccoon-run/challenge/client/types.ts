export const NUM_RACCOONS = 8
export const FINISH_LINE = 1000
export const TARGET_BET = 1000

export type GameState = {
  /**
   * Between 0 and a bit more than `FINISH_LINE`; the position of each
   * raccoon. There are `NUM_RACCOONS` raccoons.
   */
  raccoons: number[]
  /**
   * Indices of raccoons that have finished, in order of when they finished.
   */
  finishers: number[]
  can_bet: 'true' | 'false'
  /** Amount of money. */
  account: number
}

export type ServerMessage =
  | ({ type: 'race_information' } & GameState)
  | {
      type: 'response'
      /** Feedback from the server. Content varies. */
      value: string | number
    }
  | {
      type: 'flag'
      /** The flag. */
      value: string
    }
  | {
      type: 'result'
      /** The finishers (indices of raccoons). */
      value: number[]
    }
  | {
      type: 'bet_status'
      /** Like feedback, but only used to indicate bet status. */
      value: string
    }
  | {
      type: 'betting-starts'
      until: number
    }

export type ClientMessage =
  | {
      /** Make a bet. */
      type: 'bet'
      /** The indices of raccoons in the order they finish. */
      order: number[]
      /** The amount of money to bet. */
      amount: number
    }
  | {
      /** Buy a flag. Requires `TARGET_BET` money. */
      type: 'buy_flag'
    }
  | {
      /** Returns a `response` with either `bet` or `race`. */
      type: 'state'
    }
  | {
      /** Get money. */
      type: 'account'
    }
