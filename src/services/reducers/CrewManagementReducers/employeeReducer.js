import { createSlice } from '@reduxjs/toolkit'

// initialize employee state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    isLoadingForCabin: false,
    columns: [],
    employeeList: [],
    cabinCrewList: [],
    employeeTypeList: [],
    contactTypeList: [],
    userTypeList: [],
    countryList: [],
    areaList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    isForeign:false
}

// create reducer actions
const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setIsLoadingForCabin: (state, action) => {
            state.isLoadingForCabin = action.payload
        },
        setCabinCrewList: (state, action) => {
            state.cabinCrewList = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsForeign: (state, action) => {
            state.isForeign = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setEmployeeList: (state, action) => {
            state.employeeList = action.payload
        },
        setUserTypeList: (state, action) => {
            state.userTypeList = action.payload
        },
        setAreaList: (state, action) => {
            state.areaList = action.payload
        },
        setCountryList: (state, action) => {
            state.countryList = action.payload
        },
        setEmployeeTypeList: (state, action) => {
            state.employeeTypeList = action.payload
        },
        setContactTypeList: (state, action) => {
            state.contactTypeList = action.payload
        },
        deleteEmployeeList: (state, action) => {
            let Index = state.employeeList?.findIndex(value => value.id === action.payload)
            state.employeeList.splice(Index, 1)
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
export const { 
    setIsForeign, 
    setPagination, 
    setIsLoading, 
    setErrorMsg, 
    setIsLoadingAddUser, 
    setEmployeeList, 
    setSuccess, 
    deleteEmployeeList, 
    setAreaList, 
    setUserTypeList, 
    setCountryList,
    setContactTypeList,
    setEmployeeTypeList,
    setIsLoadingForCabin,
    setCabinCrewList, 
} = employeeSlice.actions
export default employeeSlice.reducer