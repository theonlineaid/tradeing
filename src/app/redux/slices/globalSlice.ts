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
import initLayout from '../../modules/tws/constants/init-layout'

type modeType = 'dark' | 'light'
export interface GlobalState {
  layout: any
  mode: modeType
  tradingDataUpdate: number
  systemAllTable: any
}

const initialState: GlobalState = {
  layout: {
    dashboard: {
      layouts: initLayout,
    },
  },
  systemAllTable: [],
  mode: 'dark',
  tradingDataUpdate: 0,
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setSystemAllTableLists: (state, action: PayloadAction<any>) => {
      state.systemAllTable = action.payload
    },
    /**
     * update specific page and breakpoint layout
     * @param state -> prev State
     * @param action -> payload -> pageName, breakPoint & layout
     */
    updateLayoutState: (
      state,
      action: PayloadAction<{pageName: string; breakPoint: string; layout: any[]}>
    ) => {
      // state.layout[action.payload.pageName].layouts[action.payload.breakPoint] =
      //   action.payload.layout
      const newPartialLayout = {
        [action.payload.pageName]: {
          layouts: {
            ...state.layout[action.payload.pageName].layouts,
            [action.payload.breakPoint]: action.payload.layout,
          },
        },
      }

      return {
        ...state,
        layout: {
          ...state.layout,
          ...newPartialLayout,
        },
      }
    },
    updateFullPageLayout: (state, action: PayloadAction<{pageName: string; data: any}>) => {
      state.layout[action.payload.pageName].layouts = action.payload.data
    },
    changeMode: (state, action: PayloadAction<modeType>) => {
      if (action.payload === 'dark') {
        document.documentElement.classList.add('tw-dark')
      } else {
        document.documentElement.classList.remove('tw-dark')
      }
      state.mode = action.payload
    },
    incrementTradingDataUpdate: (state) => {
      state.tradingDataUpdate = state.tradingDataUpdate + 1
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateLayoutState,
  setSystemAllTableLists,
  updateFullPageLayout,
  changeMode,
  incrementTradingDataUpdate,
} = globalSlice.actions

export default globalSlice.reducer
