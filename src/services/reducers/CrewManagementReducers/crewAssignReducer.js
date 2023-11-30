import { createSlice } from '@reduxjs/toolkit'

// initialize crew state
const initialState = {
    isLoading: false,
    isCrewAssignModalOpen: false,
    isLoadingAddUser: false,
    columns: [],
    List: [],
    errorMsg: null,
    success: false,
    crewAssignViolatedRuels: []
}

// create reducer actions
const crewAssignSlice = createSlice({
    name: 'crewassign',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setIsCrewAssignModalOpen: (state, action) => {
            state.isCrewAssignModalOpen = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setList: (state, action) => {
            state.List = action.payload
        },
        deleteCrew: (state, action) => {
            let Index = state.List?.findIndex(value => value.id === action.payload)
            state.List.splice(Index, 1)
        },
        setSuccess: (state, { payload }) => {
            state.success = payload
        },
        setViolatedRuelsForCockpitCrew: (state, { payload }) => {
            state.crewAssignViolatedRuels = payload
        }
    }
})

// export actions
export const { 
    setIsLoading, 
    setErrorMsg, 
    setIsLoadingAddUser, 
    setSuccess, 
    deleteCrew, 
    setViolatedRuelsForCockpitCrew, 
    setIsCrewAssignModalOpen 
} = crewAssignSlice.actions

export default crewAssignSlice.reducer