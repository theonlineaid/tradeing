import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import TradingInterface from '../../common/types/trading-list'
import { MarketDataStruct } from '../../common/types/market-data'
import { BlotterDataStruct } from '#common/types/blotter-data'

const initialState = {
  instrumentName: '',
  marketData: '',
  marketDept: '',
  moversGainers: '',
  orderSummary: '',
  blotter: '',
  position: '',
  execution: '',
  purchasePower: '',
}

export const blotterSlice = createSlice({
  name: 'linkedTable',
  initialState,
  reducers: {
    changeInstrumentName: (state, action: PayloadAction<any>) => {
      state.instrumentName = action.payload
    },
    changeMarketDataColor: (state, action: PayloadAction<any>) => {
      state.marketData = action.payload
      console.log(action.payload)
    },

    // Not exectuation 
    changeMarketDeptColor: (state, action: PayloadAction<any>) => {
      // state.marketDept = action.payload
      // console.log(action.payload)
      console.log('Payload received in changeMarketDeptColor:', action.payload);
      // Assuming action.payload contains the color value, update the state immutably
      return {
        ...state,
        marketDept: action.payload,
      };

    },
    changeMoversGainersColor: (state, action: PayloadAction<any>) => {
      state.moversGainers = action.payload
    },
    changeOrderSummaryColor: (state, action: PayloadAction<any>) => {
      state.orderSummary = action.payload
    },
    changeBlotterColor: (state, action: PayloadAction<any>) => {
      state.blotter = action.payload
    },
    changePositionColor: (state, action: PayloadAction<any>) => {
      state.position = action.payload
    },
    changeExecutionColor: (state, action: PayloadAction<any>) => {
      state.execution = action.payload
    },
    changePurchasePowerColor: (state, action: PayloadAction<any>) => {
      state.purchasePower = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  changeMarketDataColor, changeMarketDeptColor, changeMoversGainersColor, changeOrderSummaryColor,
  changeBlotterColor, changePositionColor, changeExecutionColor, changePurchasePowerColor, changeInstrumentName
} = blotterSlice.actions

export default blotterSlice.reducer
