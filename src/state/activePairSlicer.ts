import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { emptyPosition, Position } from '../models';

interface ActiveState {
  position: Position 
}
const initialState: ActiveState = {
  position: emptyPosition
};

export const activePairSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<Position>) => {
      state.position = action.payload
    },
  },
})

export const { setActive } = activePairSlice.actions

export default activePairSlice.reducer;