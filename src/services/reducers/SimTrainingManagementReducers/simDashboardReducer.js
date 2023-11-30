import { createSlice } from '@reduxjs/toolkit'

// initialize sim info state
const initialState = {
    isLoading: false,
    columns: [],
    dataSource:[],
    simList: [],
    sim:[],
    simSearch:[],
    length:[],
    dashboardData: [],
    filterdSimList: [],
    simDetailsList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const simSlice = createSlice({
    name: 'simDashboard',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setSimList: (state, action) => {
            state.simList = action.payload
        },
        setSimSearch: (state, action) => {
            state.simSearch = action.payload
        },
        setLength: (state, action) => {
            state.length = action.payload
        },
        setSim: (state, action) => {
            state.sim = action.payload
        },
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload
        },
        setFilterdSimList: (state, action) => {
            state.filterdSimList = action.payload
        },
        setSimDetailsList: (state, action) => {
            state.simDetailsList = action.payload
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
export const { setLength,setPagination, setFilterdSimList, setIsLoading, setErrorMsg, setSimList, setSimDetailsList, setSuccess ,setSim,setDashboardData,setSimSearch } = simSlice.actions
export default simSlice.reducer