import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showCampaign:true,

  
}

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    
    setShowCampaign: (state, action) => {
      state.showCampaign = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {setShowCampaign } = campaignSlice.actions

export default campaignSlice.reducer