import { createSlice } from '@reduxjs/toolkit'

// initialize simulationHistory state
const initialState = {
    isLoading: false,
    columns: [],
    simulationHistoryList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    selectedMonth:"January 2023"
}

// create reducer actions
const simulationHistoryReducer = createSlice({
    name: 'simulationHistory',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setSimulationHistoryList: (state, action) => {
            state.simulationHistoryList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setSelectedMonth: (state, action) => {
            state.selectedMonth =  action.payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setSimulationHistoryList, setSuccess,setSelectedMonth } = simulationHistoryReducer.actions
export default simulationHistoryReducer.reducer