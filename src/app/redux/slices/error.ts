import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppThunk, RootState} from '..'
import {has} from 'lodash'

type errorIDs = 'trading' | 'watchList' | 'order'
type errorTypes = 'Error' | 'Warning' | 'Info'

interface ErrorDataInterface {
  message: string
  details?: any
  type: errorTypes
}

interface RiseNewErrorInterface {
  identifier: errorIDs
  data: ErrorDataInterface
  expTime?: number
}
export type ErrorSliceInterface = {
  [key in errorIDs]?: ErrorDataInterface
}

const initialState: ErrorSliceInterface = {
  trading: {
    message: '',
    details: '',
    type: 'Error',
  },
}

export const errorSlice = createSlice({
  name: 'errorSlice',
  initialState,
  reducers: {
    riseNewError: (state, action: PayloadAction<RiseNewErrorInterface>) => {
      return {
        ...state,
        [action.payload.identifier]: action.payload.data,
      }
    },
    removeError: (state, action: PayloadAction<errorIDs>) => {
      const backupData = {...state}
      delete backupData[action.payload]
      return backupData
    },
  },
})

// Action creators are generated for each case reducer function
export const {removeError} = errorSlice.actions

export default errorSlice.reducer

export const riseNewError =
  (payload: RiseNewErrorInterface): AppThunk =>
  (dispatch, getSate) => {
    dispatch(errorSlice.actions.riseNewError(payload))
    if (payload.expTime) {
      setTimeout(
        () => dispatch(errorSlice.actions.removeError(payload.identifier)),
        payload.expTime
      )
    }
  }
