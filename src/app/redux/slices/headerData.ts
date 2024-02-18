import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import TradingInterface from '../../common/types/trading-list'
import { MarketDataStruct } from '../../common/types/market-data'


export interface HeaderData {
  buySell?: any,
  blotter?: any,
  orderSummary?: any,
  position?: any,
  execution?: any,
}


const initialState: HeaderData = {
  buySell: null,
  blotter: null,
  orderSummary: null,
  position: null,
  execution: null,
}

type partialHeaderDataApiType<T> = {
  [P in keyof T]?: T[P]
}

export const headerDataSlice = createSlice({
  name: 'headerData',
  initialState,
  reducers: {
    changeBuySell: (state, action: PayloadAction<any>) => {
      state.buySell = action.payload
    },
    changeBlotter: (state, action: PayloadAction<any>) => {
      state.blotter = action.payload
    },
    changeOrderSummary: (state, action: PayloadAction<any>) => {
      state.orderSummary = action.payload
    },
    changePosition: (state, action: PayloadAction<any>) => {
      state.position = action.payload
    },
    changeExecution: (state, action: PayloadAction<any>) => {
      state.execution = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  changeBuySell,
  changeBlotter,
  changeExecution,
  changePosition,
  changeOrderSummary,
} = headerDataSlice.actions

export default headerDataSlice.reducer
