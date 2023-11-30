import { createSlice } from '@reduxjs/toolkit'

// initialize user state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    userList: [],
    userTypeList: [],
    errorMsg: null,
    selectedUser: null,
    isLoadingUser: false,
    success: false,
    pagination: {},
    isResetPassword: false,
}

// create reducer actions
const userSlice = createSlice({
    name: 'user',
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
        setUserList: (state, action) => {
            state.userList = action.payload
        },
        setUserTypeList: (state, action) => {
            state.userTypeList = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setIsLoadingUser: (state, action) => {
            state.isLoadingUser = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.userList?.findIndex(value => value.id === action.payload)
            state.userList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setIsResetPassword: (state, action) => {
            state.isResetPassword = action.payload
        }
    }
})

// export actions
export const { 
    setPagination, 
    setSuccess, 
    setIsLoading, 
    setErrorMsg, 
    setUserList, 
    setIsLoadingAddUser, 
    setSelectedUser, 
    setIsLoadingUser, 
    deleteData, 
    setUserTypeList,
    setIsResetPassword 
} = userSlice.actions
export default userSlice.reducer