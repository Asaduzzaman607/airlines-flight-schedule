import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    vehicleList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    typeList:[]
}

// create reducer actions
const vehicleSlice = createSlice({
    name: 'vehicle',
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
        setVehicleList: (state, action) => {
            state.vehicleList = action.payload
        },
        setTypeList: (state, action) => {
            state.typeList = action.payload
        },
        deletevehicle: (state, action) => {
            let Index = state.vehicleList?.findIndex(value => value.id === action.payload)
            state.vehicleList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setVehicleList, setSuccess, setTypeList, deleteVehicle } = vehicleSlice.actions
export default vehicleSlice.reducer