                                                                                                                                   import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface LoginState {
  login: boolean
  token?: string
}

const initialState: LoginState = {
  login: false,
}

export const loginStateSlice = createSlice({
  name: 'loginState',
  initialState,
  reducers: {
    logoutUser: (state, action: PayloadAction<boolean>) => {
      state.login = action.payload
      state.token = ''
    },
    loginUser: (state, action: PayloadAction<string>) => {
      state.login = true
      state.token = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {logoutUser, loginUser} = loginStateSlice.actions

export default loginStateSlice.reducer
