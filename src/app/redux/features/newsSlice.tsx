import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getNewsDataFromSocket} from './newsApi'

const initialState = {
  newsData: [],
  newsByInstrument: [],
  isLoading: false,
  isError: false,
  error: '',
}

export const fetchNewsDataFromSocket: any = createAsyncThunk(
  'news/fetchNewsDataFromSocket',
  async () => {
    const newsData = await getNewsDataFromSocket()

    return newsData
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    editActive: (state, action) => {
      //   const e = state.newsData.find((e) => e.id === action.payload)
      //   console.log('=======State========', {...e}, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsDataFromSocket.pending, (state) => {
        state.isError = false
        state.isLoading = true
      })
      .addCase(fetchNewsDataFromSocket.fulfilled, (state, action) => {
        state.isError = false
        state.isLoading = false
        state.newsData = action.payload
      })
      .addCase(fetchNewsDataFromSocket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.error = action.error?.message || ''
        state.newsData = []
      })
  },
})

export default newsSlice.reducer
export const {editActive} = newsSlice.actions
