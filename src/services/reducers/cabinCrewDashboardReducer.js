import { createSlice } from '@reduxjs/toolkit'

// initial state
const initialState = {
	isDrawerOpen: false,
}

const cabinCrewDashboardSlice = createSlice({
	name: 'cabinCrewDashboard',
	initialState,
	reducers: {
		setIsDrawerOpen: (state, action) => {
			state.isDrawerOpen = action.payload
		},
	},
})

export const { setIsDrawerOpen } = cabinCrewDashboardSlice.actions
export default cabinCrewDashboardSlice.reducer
