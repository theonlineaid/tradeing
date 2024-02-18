import {Action, ThunkAction, combineReducers, configureStore} from '@reduxjs/toolkit'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import {enableMapSet} from 'immer'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {itchAPI} from './api/itch'
import blotter from './slices/blotter'
import buySell from './slices/buysell'
import error from './slices/error'
import global from './slices/globalSlice'
import headerData from './slices/headerData'
import layouts from './slices/layouts'
import linkedTable from './slices/linkedTable'
import loginState from './slices/loginState'
import marketDataSlice from './slices/marketData'
import orderList from './slices/orderList'
import profileTabs from './slices/profileTabsData'
import settings from './slices/settings'
import temporaryCredential from './slices/temporaryCredential'
import theme from './slices/themeSlice'
import tradeListColumnShow from './slices/tradeListColumnShow'
import userData from './slices/userData'
import watchList from './slices/watchList'
import cacheStorage from './storage/cach'

const marketDataConf = {
  key: 'root',
  storage: cacheStorage,
}
const watchListConfig = {
  key: 'watch',
  storage,
}
const userConfig = {
  key: 'user',
  storage,
}
const settingsConfig = {
  key: 'settings',
  storage,
}
const linkedTableConfig = {
  key: 'linkedTable',
  storage,
}

enableMapSet()

const rootReducer = combineReducers({
  global,
  settings: persistReducer(settingsConfig, settings),
  tradeListColumnShow,
  userData: persistReducer(userConfig, userData),
  orderList,
  marketData: marketDataSlice,
  loginState,
  temporaryCredential,
  profileTabs,
  layouts,
  theme,
  buySell,
  blotter,
  watchList: persistReducer(watchListConfig, watchList),
  linkedTable: persistReducer(linkedTableConfig, linkedTable),
  headerData,
  error,
  [itchAPI.reducerPath]: itchAPI.reducer,
})

// Export Store
export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(itchAPI.middleware, thunk),
})

// Export persist
export const persistor = persistStore(store)

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useAppDispatch = () => useDispatch<any>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
