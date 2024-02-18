import {PayloadAction, createSlice} from '@reduxjs/toolkit'

type UserAllThemesType = {
  name: string
  code: string
  pk: number
  is_default: boolean
  is_active: boolean
}

interface ThemeType {
  userAllThemes: UserAllThemesType[]
  selectedTheme: any
}

const initialState: ThemeType = {
  userAllThemes: [],
  selectedTheme: {},
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setUserALlThemes: (state, action: PayloadAction<UserAllThemesType[]>) => {
      const selectedTheme = action.payload.find((t) => t.is_active)

      state.userAllThemes = action.payload
      state.selectedTheme = selectedTheme
    },
  },
})

// Action creators are generated for each case reducer function
export const {setUserALlThemes} = themeSlice.actions

export default themeSlice.reducer
