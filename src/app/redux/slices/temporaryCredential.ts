import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface TemporaryCredentialState {
  email: string
  password: string
}

const initialState: TemporaryCredentialState = {
  email: '',
  password: '',
}

export const temporaryCredentialSlice = createSlice({
  name: 'temporaryCredential',
  initialState,
  reducers: {
    updateTemporaryCredential: (state, action: PayloadAction<TemporaryCredentialState>) => {
      state.email = action.payload?.email
      state.password = action.payload?.password
    },
    removeTemporaryCredential: (state, action: PayloadAction<undefined>) => {
      state.email = ''
      state.password = ''
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateTemporaryCredential, removeTemporaryCredential} =
  temporaryCredentialSlice.actions

export default temporaryCredentialSlice.reducer
