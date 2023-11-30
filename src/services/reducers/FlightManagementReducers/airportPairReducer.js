import { createSlice } from '@reduxjs/toolkit'

// initialize airport pair state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    airportPairList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const airportPairSlice = createSlice({
    name: 'airportpair',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setAirportPairList: (state, action) => {
            state.airportPairList = action.payload
        },
        deleteAirportPairList: (state, action) => {
            let Index = state.airportPairList?.findIndex(value => value.id === action.payload)
            state.airportPairList.splice(Index, 1)
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setAirportPairList, setSuccess, deleteairportpairList } = airportPairSlice.actions
export default airportPairSlice.reducer