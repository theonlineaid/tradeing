import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {MarketDataStruct} from '../../common/types/market-data'
import TradingInterface from '../../common/types/trading-list'

const INIT_BUY_SELL_API: TradingInterface = {
  // user: '0',
  // bo_id: 212,
  // bo_no: 2971681314,
  // dp_code: '775336955324256tr4t34t',
  // price: 0,
  // qty: 0,
  // scrip: '',
  order_type: '',
  qty: 0,
  price: 0,
  bo_id: '',
}

export interface BuySell {
  data: any
  modalData: MarketDataStruct
  boAccountData: any
  isBuy: boolean
  isLock: boolean
  isMin: boolean
  isConfirmShow: boolean
  type: string
  clientCode: string
  traderCode: string
  investorCode: string
  actionName: string
  buySellApi: TradingInterface
  userProfit: any
  errorMsg?: string
  rowNumber?: number
  // isShow: boolean
  isShow: {
    tableId: string
    isShow: boolean
  }
  isUpdateShow: boolean
  tradeList: boolean
}

export interface dataStruct {
  buy: any
  sell: any
}

const initialState: BuySell = {
  data: {} as dataStruct,
  modalData: {} as MarketDataStruct,
  boAccountData: [],
  type: 'marketDept',
  isBuy: true,
  isLock: false,
  isMin: false,
  isConfirmShow: false,
  actionName: '',
  clientCode: '',
  investorCode: '',
  traderCode: '',
  rowNumber: 10,
  buySellApi: INIT_BUY_SELL_API,
  userProfit: [],
  isShow: {tableId: '', isShow: false},
  isUpdateShow: false,
  tradeList: false,
}

type partialBuySellApiType<T> = {
  [P in keyof T]?: T[P]
}
export const buySellSlice = createSlice({
  name: 'buySell',
  initialState,
  reducers: {
    changeIsBuy: (state, action: PayloadAction<boolean | undefined>) => {
      state.isBuy = typeof action.payload === 'undefined' ? !state.isBuy : action.payload
    },
    changeIsLock: (state, action: PayloadAction<boolean | undefined>) => {
      state.isLock = typeof action.payload === 'undefined' ? !state.isLock : action.payload
    },
    changeIsMin: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMin = typeof action.payload === 'undefined' ? !state.isMin : action.payload
    },
    changeRowNumber: (state, action: PayloadAction<number>) => {
      state.rowNumber = action.payload
    },
    changeIsConfirmShow: (state, action: PayloadAction<boolean | undefined>) => {
      state.isConfirmShow =
        typeof action.payload === 'undefined' ? !state.isConfirmShow : action.payload
    },
    changeActionName: (state, action: PayloadAction<string>) => {
      state.actionName = action.payload
    },
    changeBuySellApi: (state, action: PayloadAction<partialBuySellApiType<TradingInterface>>) => {
      state.buySellApi = {
        ...state.buySellApi,
        ...action.payload,
      }
    },
    changeClientCode: (state, action: PayloadAction<string>) => {
      state.clientCode = action.payload
    },
    changeType: (state, action: PayloadAction<string>) => {
      state.type = action.payload
    },
    changeUserProfit: (state, action: PayloadAction<any[]>) => {
      state.userProfit = action.payload
    },
    changeData: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    changeBoAccountData: (state, action: PayloadAction<any>) => {
      const {users_status, user_detail, data}: any = action.payload

      if (users_status === 'trader') {
        state.investorCode = ''
        state.traderCode = user_detail.trader_code
        state.boAccountData = data
      } else {
        state.traderCode = user_detail.trader_code
        state.investorCode = user_detail.investor_code
      }
    },
    // changeIsShow: (state, action: PayloadAction<boolean | undefined>) => {
    changeIsShow: (state, action: PayloadAction<any>) => {
      console.log('===🔥===changeIsShow', action.payload)
      state.isShow = action.payload

      // state.isShow = typeof action.payload === 'undefined' ? !state.isShow : action.payload
    },
    changeIsUpdateShow: (state, action: PayloadAction<boolean | undefined>) => {
      state.isUpdateShow =
        typeof action.payload === 'undefined' ? !state.isUpdateShow : action.payload
    },
    changeTradeList: (state, action: PayloadAction<boolean | undefined>) => {
      state.tradeList = typeof action.payload === 'undefined' ? !state.tradeList : action.payload
    },
    changeModalData: (state, action: PayloadAction<any>) => {
      state.modalData = action.payload
    },
    resetBuySell: (state) => {
      ;(state.isConfirmShow = false), (state.actionName = ''), (state.isShow.isShow = false)
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  changeData,
  changeIsBuy,
  changeIsLock,
  changeIsMin,
  changeRowNumber,
  changeIsConfirmShow,
  changeActionName,
  changeBuySellApi,
  changeClientCode,
  changeType,
  changeUserProfit,
  changeBoAccountData,
  changeIsShow,
  changeIsUpdateShow,
  changeTradeList,
  changeModalData,
  resetBuySell,
} = buySellSlice.actions

export default buySellSlice.reducer
