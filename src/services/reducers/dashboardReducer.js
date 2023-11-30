import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  employeeWithFlights: [],
  employeeTableColumns: [],
  isOccDataLoading: false,
  occData: [],
  submittedDate: null,
  isDownloading: false,
  isLoadingModal: false,
  violatedRuels: [],
  isSaveFlightToDashboard: false,
  selectedEmployeeInfo: {},
  selectedHeaderItem: {},
  selectedColItem: {},
  flightAndRoleList: {},
  selectedDateAndCrewtype: {},
  isDashboardDrawerOpen: false,
  selectedActionKey: null,
  initialFormValuesForUpdateAction: null,
  selectedFlight: null,
  selectedDatesAndCrewType: null,
  isCabinCrewFlightsLoading: false,
  cabinCrewFlights: {
    dataList: [],
    headerList: [],
  },
  isCabinCrewDrawerOpen: false,
  assigndCabinCrewList: [],
  isSaveAssignCabinCrewFlightsLoading: false,
  selectedCabinCrewActionKey: '',
  selectedCabinCrewFlights: {},
  initialFormValuesForUpdateCabinCrew: {},
  cabinCrewdetails: {},
  initialValuesStandBy: null,
  initialValuesLeave: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setEmployeeWithFlights: (state, action) => {
      state.employeeWithFlights = action.payload;
    },
    setEmployeeTableColumns: (state, action) => {
      state.employeeTableColumns = action.payload;
    },
    setIsOccDataLoading: (state, action) => {
      state.isOccDataLoading = action.payload;
    },
    setOccData: (state, action) => {
      state.occData = action.payload;
    },
    setFlightAndRoleData: (state, action) => {
      state.flightAndRoleList = action.payload;
    },
    setSubmittedDate: (state, action) => {
      state.submittedDate = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setIsLoadingModal: (state, action) => {
      state.isLoadingModal = action.payload;
    },
    setViolatedRuels: (state, action) => {
      state.violatedRuels = action.payload;
    },
    setIsSaveFlightToDashboard: (state, action) => {
      state.isSaveFlightToDashboard = action.payload;
    },
    setSelectedEmployeeHeader: (state, action) => {
      state.selectedEmployeeInfo = action.payload.emp;
      state.selectedHeaderItem = action.payload.header;
      state.selectedColItem = action.payload.selectedCellData;
    },
    setDateAndCrewtype: (state, action) => {
      state.selectedDateAndCrewtype = action.payload;
    },
    setIsDashboardDrawerOpen: (state, action) => {
      state.isDashboardDrawerOpen = action.payload;
    },
    setSelectedActionKey: (state, action) => {
      state.selectedActionKey = action.payload;
    },
    setInitialFormValuesForUpdateAction: (state, action) => {
      state.initialFormValuesForUpdateAction = action.payload;
    },
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    setSelectedDatesAndCrewType: (state, action) => {
      state.selectedDatesAndCrewType = action.payload;
    },
    setIsCabinCrewFlightsLoading: (state, action) => {
      state.isCabinCrewFlightsLoading = action.payload;
    },
    setCabinCrewFlights: (state, action) => {
      state.cabinCrewFlights = action.payload;
    },
    setIsCabinCrewDrawerOpen: (state, action) => {
      if (!action.payload) {
        state.initialFormValuesForUpdateCabinCrew = {};
      }
      state.isCabinCrewDrawerOpen = action.payload;
    },
    setAssigndCabinCrewList: (state, action) => {
      state.assigndCabinCrewList = action.payload;
    },
    setIsSaveAssignCabinCrewFlightsLoading: (state, action) => {
      state.isSaveAssignCabinCrewFlightsLoading = action.payload;
    },
    setSelectedCabinCrewActionKey: (state, action) => {
      state.selectedCabinCrewActionKey = action.payload;
    },
    setSelectedCabinCrewFlights: (state, action) => {
      state.selectedCabinCrewFlights = action.payload;
    },
    setInitialFormValuesForUpdateCabinCrew: (state, action) => {
      state.initialFormValuesForUpdateCabinCrew = action.payload;
    },
    setCabinCrewdetails: (state, action) => {
      state.cabinCrewdetails = action.payload;
    },
    setInitialValuesStandBy: (state, action) => {
      state.initialValuesStandBy = action.payload;
    },
    setInitialValuesLeave: (state, action) => {
      state.initialValuesLeave = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setEmployeeWithFlights,
  setEmployeeTableColumns,
  setIsOccDataLoading,
  setOccData,
  setSubmittedDate,
  setIsDownloading,
  setIsLoadingModal,
  setSelectedEmployeeHeader,
  setFlightAndRoleData,
  setViolatedRuels,
  setIsSaveFlightToDashboard,
  setDateAndCrewtype,
  setIsDashboardDrawerOpen,
  setSelectedActionKey,
  setInitialFormValuesForUpdateAction,
  setSelectedFlight,
  setSelectedDatesAndCrewType,
  setIsCabinCrewFlightsLoading,
  setCabinCrewFlights,
  setIsCabinCrewDrawerOpen,
  setAssigndCabinCrewList,
  setIsSaveAssignCabinCrewFlightsLoading,
  setSelectedCabinCrewActionKey,
  setSelectedCabinCrewFlights,
  setInitialFormValuesForUpdateCabinCrew,
  setCabinCrewdetails,
  setInitialValuesStandBy,
  setInitialValuesLeave,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
