import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ColorState {
    [tableId: string]: string;
}

const initialState: ColorState = {};

export const dropDownColorSlice = createSlice({
    initialState,
    name: 'DropdownColor',
    reducers: {
        updateTableColor: (state, action: PayloadAction<any>) => {
            const { tableId, color } = action.payload;
            // Update the state directly with the tableId as a property
            state[tableId] = color;

            console.log(action.payload)
        },
    },
});

export const { updateTableColor } = dropDownColorSlice.actions;

export default dropDownColorSlice.reducer;