export interface MarketOrder {
  side: 'B' | 'S'
  qty: number
  executed_qty?: number
  price: number
  order_numbers: []
}

export interface MarketDataStruct {
  id: number
  short_name: string
  group: string
  board?: string
  sector?: string
  bq: number
  bid: number
  ask: number
  aq: number
  last: number
  open: number
  high: number
  low: number
  volume: number
  d: number
  settle_1: number
  settle: number
  ct_tvol: number
  orders: MarketOrder[]
  executed_orders?: MarketOrder[]
  order_numbers?: number
  status: string
  chg: number
  buy_pending: number
  sell_pending: number
  reference: number
  orderbook: number
  isin_code: string
  instrument_type: string
  firm_id: string
  market_type: string
  session: string
  share_type: string
  ticker : string
  

  // open: number
  // high: number
  // low: number
  // ltp: number
  // chg: number
  // status: number
  // dh: number
  // val: number
  // dl: number
  // vol: number
  // vwap: number
}

export type MarketDataType = {
  marketDatas: MarketDataStruct[]
  saveData: (todo: MarketDataStruct) => void
  updateData: (id: number) => void
  flashHandler: () => void
  flash: boolean
}
