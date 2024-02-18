import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface TradeListColumnShowState {
  [key: string]: any
}

const initialState: TradeListColumnShowState = {}

export const tradeListColumnShowSlice = createSlice({
  name: 'tradeListColumnShow',
  initialState,
  reducers: {
    updateTradeListColumnShow: (state, action: PayloadAction<{[key: string]: any}>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateTradeListColumnShow} = tradeListColumnShowSlice.actions

export default tradeListColumnShowSlice.reducer
