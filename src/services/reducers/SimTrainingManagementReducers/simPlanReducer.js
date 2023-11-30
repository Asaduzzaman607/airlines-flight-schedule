import { createSlice } from '@reduxjs/toolkit'

// initialize simPlan state
const initialState = {
    isLoading: false,
    columns: [],
    simPlanList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    simPlanHistory: [],
    approvalHistoryModalOpen: false,
    eligibleEmployeeForSim:[],
    endDateData:false,
    employeeSearchData:{},
    allEligibleEmp:[],
    selectedRowKeys:[],
    simPlanHistoryRowData:[],
    simPlanRowData:[],
    isStatusActive:false,
    selectedRowsInDestination:[]
}

// create reducer actions
const simPlanSlice = createSlice({
    name: 'simPlan',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setSimPlanList: (state, action) => {
            state.simPlanList = action.payload
        },
        setSelectedRowsInDestination: (state, action) => {
            state.selectedRowsInDestination = action.payload
        },
        setEmployeeSearchData: (state, action) => {
            state.employeeSearchData = action.payload
        },
        setEligibleEmployeeForSim: (state, action) => {
            state.eligibleEmployeeForSim = action.payload
        },
        setAllEligibleEmp: (state, action) => {
            state.allEligibleEmp = action.payload
        },   
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setSelectedRowKeys:(state, action) => {
            state.selectedRowKeys = action.payload
        },   
        setEndDateData: (state, {payload}) => {
            state.endDateData = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setSimPlanApprovalHistory: (state, action) => {
            state.simPlanHistory = action.payload
        },
        setApprovalHistoryModalOpen: (state, action) => {
            state.approvalHistoryModalOpen = action.payload
        },
        setSimPlanRowData: (state, action) => {
            state.simPlanRowData = action.payload
        },
        setSimPlanHistoryRowData: (state, action) => {
            state.simPlanHistoryRowData = action.payload
        },
        setIsStatusActive: (state, action) => {
            state.isStatusActive = action.payload
        }
    }
})

// export actions
export const { 
    setPagination, 
    setIsLoading, 
    setErrorMsg, 
    setSimPlanList, 
    setSuccess, 
    setSimPlanEmployeeList, 
    setSimPlanApprovalHistory, 
    setApprovalHistoryModalOpen,
    setEligibleEmployeeForSim,
    setEndDateData,
    setEmployeeSearchData,
    setAllEligibleEmp,
    setSelectedRowKeys,
    setSimPlanRowData,
    setSimPlanHistoryRowData,
    setIsStatusActive,
    setSelectedRowsInDestination
} = simPlanSlice.actions

export default simPlanSlice.reducer