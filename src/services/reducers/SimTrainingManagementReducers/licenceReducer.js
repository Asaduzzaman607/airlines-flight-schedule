import { createSlice } from '@reduxjs/toolkit';

// initialize licence info state
const initialState = {
  isLoading: false,
  columns: [],
  licenceList: [],
  filterdLicenceList: [],
  licenceDetailsList: [],
  errorMsg: null,
  success: false,
  pagination: {},
  employeeList: [],
  lastPPC: [],
};

// create reducer actions
const licenceSlice = createSlice({
  name: 'licence',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
    },
    setLicenceList: (state, action) => {
      state.licenceList = action.payload;
    },
    setFilterdLicenceList: (state, action) => {
      state.filterdLicenceList = action.payload;
    },
    setLastPPC: (state, action) => {
      state.lastPPC = action.payload;
    },
    setLicenceDetailsList: (state, action) => {
      state.licenceDetailsList = action.payload;
    },
    setEmployeeList: (state, action) => {
      state.employeeList = action.payload;
    },
    setSuccess: (state, { payload }) => {
      state.success = payload;
    },
    deleteData: (state, action) => {
      let Index = state.licenceList?.findIndex(
        (value) => value.id === action.payload
      );
      state.licenceList.splice(Index, 1);
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

// export actions
export const {
  setLastPPC,
  setEmployeeList,
  setPagination,
  setFilterdLicenceList,
  setIsLoading,
  setErrorMsg,
  setLicenceList,
  setLicenceDetailsList,
  setSuccess,
  deleteData,
} = licenceSlice.actions;
export default licenceSlice.reducer;
