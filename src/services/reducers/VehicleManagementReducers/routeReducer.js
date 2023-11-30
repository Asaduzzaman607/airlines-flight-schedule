import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    routeList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const routeSlice = createSlice({
    name: 'route',
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
        setRouteList: (state, action) => {
            state.routeList = action.payload
        },
        deleteroute: (state, action) => {
            let Index = state.routeList?.findIndex(value => value.id === action.payload)
            state.routeList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setRouteList, setSuccess, deleteRoute } = routeSlice.actions
export default routeSlice.reducer