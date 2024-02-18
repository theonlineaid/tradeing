import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {HandleUpdateInterface} from '../../common/types/common'

export interface OrderListState {
  data: any[]
  isError: boolean
  isLoading: boolean
  errorMsg?: string
}

const initialState: OrderListState = {
  data: [],
  isError: false,
  isLoading: true,
}

export const orderListSlice = createSlice({
  name: 'orderList',
  initialState,
  reducers: {
    updateOrderList: (state, action: PayloadAction<HandleUpdateInterface>) => {
      return action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateOrderList} = orderListSlice.actions

export default orderListSlice.reducer
