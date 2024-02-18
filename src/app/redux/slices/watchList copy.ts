import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {some} from 'lodash'
import {AppThunk, RootState} from '..'
import {riseNewError} from './error'

type Category = typeof initialState.categories[number]
interface WatchListDataInterface {
  id: number
  category: Category
}

export interface WatchListState {
  data: WatchListDataInterface[]
  categories: string[]
}

const initialState: WatchListState = {
  data: [],
  categories: ['favorite-1', 'favorite-2', 'favorite-3'],
}

export const watchListSlice = createSlice({
  name: 'watchList',
  initialState,
  reducers: {
    addInWatchList: (state, action: PayloadAction<WatchListDataInterface>) => {
      if (!some(state.data, ['id', action.payload?.id])) {
        state.data = [...state.data, action.payload]
      }
    },
    removeFromWatchList: (state, action: PayloadAction<{id: number}>) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id)
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories = [...state.categories, action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const {addInWatchList, removeFromWatchList} = watchListSlice.actions

export const addCategory =
  // (payload: Category): AppThunk =>

    (payload: any): AppThunk =>
    (dispatch, getState) => {
      const state: RootState = getState()
      if (state.settings.maxNumberOfWatchList <= state.watchList.categories.length) {
        dispatch(
          riseNewError({
            identifier: 'watchList',
            data: {
              message: 'Max watch list overed!',
              type: 'Error',
            },
            expTime: 250,
          })
        )
      } else if (state.watchList.categories.includes(payload)) {
        dispatch(
          riseNewError({
            identifier: 'watchList',
            data: {
              message: 'Category Already exits!',
              type: 'Error',
            },
            expTime: 250,
          })
        )
      } else {
        dispatch(watchListSlice.actions.addCategory(payload))
      }
    }

export default watchListSlice.reducer
