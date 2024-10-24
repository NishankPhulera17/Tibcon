import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart:{}
}

export const rewardCartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    additem:(state,action)=>{
        state.cart= action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { additem } = rewardCartSlice.actions

export default rewardCartSlice.reducer