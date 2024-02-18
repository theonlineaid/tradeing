import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {HandleUpdateInterface} from '../../common/types/common'
import { findIndex } from 'lodash'
import { MarketDataStruct } from '../../common/types/market-data'

export interface MarketDataInterface {
  data: MarketDataStruct[]
  fields?: {}
  isError: boolean
  isLoading: boolean
  errorMsg?: string
  filters: {
    market: string,
    category: string,
    sector: string,
    option: string
  }
}

const initialState: MarketDataInterface = {
  data: [],
  fields: {},
  isError: false,
  isLoading: true,
  filters:{
    market:'',
    category: '',
    sector: '',
    option: '',
  }

}

export const marketDataSlice = createSlice({
  name: 'tradeListData',
  initialState,
  reducers: {
    handleError: (state, action: PayloadAction<{isError: boolean, errorMsg: string}>) => {
      state.isError = action.payload.isError
      state.errorMsg = action.payload.errorMsg
    },
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    handleFields: (state, action: PayloadAction<boolean>) => {
      state.fields = action.payload
    },
    handleMarketData: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    updateMarketData: (state, action: PayloadAction<MarketDataStruct>) => {
      const newData = action.payload
      const idx = findIndex(state.data, (prevData) => prevData.id === newData.id)
      if (idx === -1) {
        state.data = [...state.data, newData]
      } else {
        const updateData = state.data
        updateData[idx] = newData
        state.data = updateData
      }
      // if (action.payload.data.length) {
      //   state.data = action.payload.data
      //   state.isError = action.payload.isError
      //   state.isLoading = action.payload.isLoading
      //   state.errorMsg = action.payload.errorMsg
      // } else {
      //   state.isError = true
      //   state.isLoading = false
      //   state.errorMsg = "No data received from server! It's old data"
      // }
    },
    storeFilterData: (state, action:any) => {
    
      console.log(action)
      
    },


    // updateSocketChange: (state, action: PayloadAction<any[]>) => {
    //   state.data = action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { updateMarketData, handleError, handleMarketData, handleFields, handleLoading , storeFilterData} = marketDataSlice.actions

export default marketDataSlice.reducer