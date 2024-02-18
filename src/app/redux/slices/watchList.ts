import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {some} from 'lodash'
import {AppThunk, RootState} from '..'
import {riseNewError} from './error'

type Category = typeof initialState.categories[number]
type SelectedTab = typeof initialState.selectedTab

interface WatchListDataInterface {
  id?: number
  data?: any
  category?: string
}

export interface CategoryType {
  id?: string
  name: string
}

export interface WatchListState {
  data: WatchListDataInterface[]
  categories: CategoryType[]
  selectedTab: string
}

const initialState: WatchListState = {
  data: [],
  categories: [{id: '1', name: 'favorite-1'}],
  selectedTab: '',
}

export const watchListSlice = createSlice({
  name: 'watchList',
  initialState,
  reducers: {
    addSelectedTab: (state, action: PayloadAction<SelectedTab>) => {
      state.selectedTab = action.payload
    },
    addInWatchList: (state, action: PayloadAction<WatchListDataInterface>) => {
      if (!some(state.data, ['id', action.payload?.data?.id])) {
        const data = {...action.payload.data, category: action.payload.category}
        state.data = [...state.data, data]
      }
    },
    removeFromWatchList: (state, action: PayloadAction<{id: number}>) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id)
    },
    addWatchList: (state, action: PayloadAction<CategoryType>) => {
      state.categories = [...state.categories, action.payload]
    },
    updateWatchList: (state, action: PayloadAction<CategoryType>) => {
      const {name, id} = action.payload

      // Find the category name from the category list
      const findCategory = state.categories.find((c) => c.id === id)

      // Update the watch list data category name by the new category name
      const updateData = state.data.map((d) =>
        d.category === findCategory?.name ? {...d, category: name} : d
      )

      // Update the category name
      const updateCategory = state.categories.map((c) => (c.id === id ? {...c, name} : c))

      // Update the state
      state.data = updateData
      state.categories = updateCategory
    },
    removeWatchList: (state, action: PayloadAction<CategoryType>) => {
      // Remove the watch list data with the same name
      const filterData = state.data.filter((d) => d.category !== action.payload.name)

      // Remove the category name with the same ID
      const filterCategory = state.categories.filter((c) => c.id !== action.payload.id)

      // Update the state
      state.data = filterData
      state.categories = filterCategory
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories = [...state.categories, action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  addInWatchList,
  removeFromWatchList,
  addSelectedTab,
  addWatchList,
  removeWatchList,
  updateWatchList,
} = watchListSlice.actions

export const addCategory =
  (payload: Category): AppThunk =>
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
