import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

// TODO: Demo table settings data
const INITIAL_FONTSIZE = 10
const tabletSettings = [
  {id: '1', tableName: 'trading_GROUP', fontSize: INITIAL_FONTSIZE},
  {id: '2', tableName: 'performance_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '3', tableName: 'orderSummery_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '4', tableName: 'blotter_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '5', tableName: 'execution_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '6', tableName: 'purchase_power_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '7', tableName: 'position_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
  {id: '8', tableName: 'news_INDIVIDUAL', fontSize: INITIAL_FONTSIZE},
]

export interface DashboardSettingInterface {
  trading_list: boolean
  trading_map: boolean
  trading_bar: boolean
  market_map: boolean
  order_list: boolean
  buy_sell: boolean
  tradeBuySell: boolean
  userTrades: boolean
  lineChart: boolean
  barChart_2: boolean
  areaChart: boolean
  marque: boolean
}

export interface TableSettingsInterface {
  id: string
  tableName: string
  fontSize: number
}

export interface SettingsInterface {
  dashboard: DashboardSettingInterface
  maxNumberOfWatchList: number
  tableSettings: TableSettingsInterface[]
}

const initialState: SettingsInterface = {
  dashboard: {
    trading_list: true,
    trading_map: true,
    trading_bar: false,
    market_map: true,
    order_list: true,
    buy_sell: true,
    tradeBuySell: true,
    userTrades: false,
    lineChart: true,
    barChart_2: true,
    areaChart: false,
    marque: true,
  },
  maxNumberOfWatchList: 6,
  tableSettings: tabletSettings,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateDashboardSetting: (
      state,
      action: PayloadAction<Record<keyof DashboardSettingInterface, boolean>>
    ) => {
      state.dashboard = {
        ...state.dashboard,
        ...action.payload,
      }
    },
    changeMaxNumberOfWatchList: (state, action: PayloadAction<number>) => {
      state.maxNumberOfWatchList = action.payload
    },
    fontSizeIncrement: (state, action: PayloadAction<{tableName: string; fontSize: number}>) => {
      const {fontSize, tableName} = action.payload
      const updateTableSettings = state.tableSettings.map((t) =>
        t.tableName === tableName ? {...t, fontSize: t.fontSize >= 30 ? 30 : t.fontSize + 1} : t
      )

      state.tableSettings = updateTableSettings
    },
    fontSizeDecrement: (state, action: PayloadAction<{tableName: string; fontSize: number}>) => {
      const {fontSize, tableName} = action.payload
      const updateTableSettings = state.tableSettings.map((t) =>
        t.tableName === tableName
          ? {...t, fontSize: t.fontSize <= INITIAL_FONTSIZE ? INITIAL_FONTSIZE : t.fontSize - 1}
          : t
      )

      state.tableSettings = updateTableSettings
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateDashboardSetting,
  changeMaxNumberOfWatchList,
  fontSizeIncrement,
  fontSizeDecrement,
} = settingsSlice.actions

export default settingsSlice.reducer
