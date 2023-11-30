import { createSlice } from '@reduxjs/toolkit'

// initialize role state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    roleList: [],
    roleDetailsList: {},
    errorMsg: null,
    success: false,
    pagination: {},
    roleBasedUserList: [],
}

// create reducer actions
const roleSlice = createSlice({
    name: 'role',
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
        setRoleList: (state, action) => {
            state.roleList = action.payload
        },
        setRoleDetails: (state, action) => {
            state.roleDetailsList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.roleList?.findIndex(value => value.id === action.payload)
            state.roleList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setRoleBasedUserList: (state, action) => {
            state.roleBasedUserList = action.payload
        }
    }
})

// export actions
export const { setRoleBasedUserList, setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setRoleList, setRoleDetails, setSuccess, deleteData } = roleSlice.actions
export default roleSlice.reducer