/**
 * title      : Global Slice
 * description: All basic useable states
 * project    : Benemoy
 * Author     : bdTask Limited
 * Developer  : MMR Ahmad
 * Date       : 26-10-2022
 */

import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import type {Layout} from 'react-grid-layout/lib/utils'
import {LayoutStateInterface} from '../../common/types/layout'
import {LayoutInterface} from '../../common/types/redux'

export interface InitialStateInterface {
  isLoading: boolean
  isError: boolean
  errorMsg?: string
  data: LayoutInterface[]
  selected: Layout
  haveLocalChange: boolean
  isEnableEdit: boolean
  layoutState: LayoutStateInterface
}

const initialState: InitialStateInterface = {
  isLoading: true,
  isError: false,
  errorMsg: '',
  data: [
    // {
    //   layoutName: 'default',
    //   pages: [
    //     {
    //       name: 'dashboard',
    //       layout: initLayout,
    //       minimize: null,
    //     },
    //   ],
    // },
  ],
  selected: {},
  haveLocalChange: false,
  isEnableEdit: false,
  layoutState: {
    currentBreakpoint: 'lg',
    compactType: 'vertical',
    mounted: false,
  },
}

export const layoutsSlice = createSlice({
  name: 'layouts',
  initialState,
  reducers: {
    addInitialLayout: (state, action: PayloadAction<any>) => {
      state.data = [action.payload]
    },

    addNewLayout: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload)
    },
    updateLayout: (
      state,
      action: PayloadAction<{
        isLoading: boolean
        isError: boolean
        errorMsg?: string
        data: Record<string, any>
      }>
    ) => {
      const _default = state.data.find((layout) => layout.layoutName === 'default')
      state.isLoading = action.payload.isLoading
      state.isError = action.payload.isError
      state.errorMsg = action?.payload?.errorMsg
      if (action.payload.data?.length) {
        const _payload = action.payload.data
          .filter((data) => !!data.layout)
          .map((item) => {
            return item.layout
          })
        state.data = [_default, ..._payload]
      }
    },

    updateLayoutDataLocal: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload
    },

    updateSelectedLayout: (state, action: PayloadAction<Layout>) => {
      state.selected = action.payload
    },

    updateHaveLocalChange: (state, action: PayloadAction<boolean>) => {
      state.haveLocalChange = action.payload
    },

    updateIsEnableEdit: (state, action: PayloadAction<boolean>) => {
      state.isEnableEdit = action.payload
    },

    updateLayoutState: (state, action: PayloadAction<{[key: string]: string | boolean}>) => {
      state.layoutState = {
        ...state.layoutState,
        ...action.payload,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  addInitialLayout,
  addNewLayout,
  updateLayout,
  updateHaveLocalChange,
  updateIsEnableEdit,
  updateLayoutState,
  updateSelectedLayout,
  updateLayoutDataLocal,
} = layoutsSlice.actions

export default layoutsSlice.reducer
