import { createSlice } from '@reduxjs/toolkit'

// initialize trainingCenter state
const initialState = {
    isLoading: false,
    columns: [],
    trainingCenterList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const trainingCenterReducer = createSlice({
    name: 'trainingCenter',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setTrainingCenterList: (state, action) => {
            state.trainingCenterList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setTrainingCenterList, setSuccess } = trainingCenterReducer.actions
export default trainingCenterReducer.reducer