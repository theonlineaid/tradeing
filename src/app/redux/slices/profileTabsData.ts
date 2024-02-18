import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface ProfileTabsDataState {
  data: {id: string; label: string; path: string; isVisibleInMobile?: boolean}[]
}

const initialState: ProfileTabsDataState = {
  data: [
    {id: '#/action-1', label: 'Overview', path: '/profile/overview', isVisibleInMobile: true},
    {id: '#/action-2', label: 'BO Account', path: '/profile/bo-account', isVisibleInMobile: true},
    {
      id: '#/action-3',
      label: 'Add another Profile',
      path: '/profile/add-profile',
      isVisibleInMobile: true,
    },
    {
      id: '#/action-4',
      label: 'Account Summery(User)',
      path: '/profile/account-summery',
      isVisibleInMobile: true,
    },
  ],
}

export const profileTabsDataSlice = createSlice({
  name: 'profileTabsData',
  initialState,
  reducers: {
    updateProfileTabsData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateProfileTabsData} = profileTabsDataSlice.actions

export default profileTabsDataSlice.reducer
