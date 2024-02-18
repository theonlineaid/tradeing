import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

interface ProfileInterface {
  id: number
  client_code?: string
  email?: string
  is_active: boolean
  is_verified: boolean
  mobile?: string
  token: {
    access: string
    refresh: string
  }
  user_detail: any
  username: string
  users_status: string
}

interface SettingInterface {
  selectedLayout: string
}

export interface UserDataState {
  profile: ProfileInterface | any
  settings: SettingInterface
}

const initialState: UserDataState = {
  profile: null,
  settings: {
    selectedLayout: 'default',
  },
}

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<{[K in keyof ProfileInterface]?: any}>) => {
      const updatedData: ProfileInterface = state.profile ? state.profile : ({} as ProfileInterface)

      for (const key in action.payload) {
        updatedData[key] = action.payload[key]
      }

      state.profile = updatedData
    },
    removeUserProfile: (state, action: PayloadAction) => {
      state.profile = null
    },
    handleChangeTheme: (state, action: PayloadAction<string>) => {
      state.settings.selectedLayout = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateUserProfile, removeUserProfile, handleChangeTheme} = userDataSlice.actions

export default userDataSlice.reducer
