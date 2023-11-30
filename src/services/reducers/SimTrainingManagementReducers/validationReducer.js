import { createSlice } from '@reduxjs/toolkit';

// initialize validation info state
const initialState = {
  isLoading: false,
  columns: [],
  validationList: [],
  filterdValidationList: [],
  validationDetailsList: [],
  errorMsg: null,
  success: false,
  pagination: {},
  nintyDaysValidity: "NO",
};

// create reducer actions
const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
    },
    setNintyDaysValidity: (state, action) => {
      state.nintyDaysValidity = action.payload;
    },
    setValidationList: (state, action) => {
      state.validationList = action.payload;
    },
    setFilterdValidationList: (state, action) => {
      state.filterdValidationList = action.payload;
    },
    setValidationDetailsList: (state, action) => {
      state.validationDetailsList = action.payload;
    },
    setSuccess: (state, { payload }) => {
      state.success = payload;
    },
    deleteData: (state, action) => {
      let Index = state.validationList?.findIndex(
        (value) => value.id === action.payload
      );
      state.validationList.splice(Index, 1);
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

// export actions
export const {
  setNintyDaysValidity,
  setPagination,
  setFilterdValidationList,
  setIsLoading,
  setErrorMsg,
  setValidationList,
  setValidationDetailsList,
  setSuccess,
  deleteData,
} = validationSlice.actions;
export default validationSlice.reducer;
