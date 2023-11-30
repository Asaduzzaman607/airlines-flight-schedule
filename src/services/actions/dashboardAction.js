import axios from 'axios';

// import actions
import {
  setAssigndCabinCrewList,
  setCabinCrewFlights,
  setDateAndCrewtype,
  setEmployeeTableColumns,
  setEmployeeWithFlights,
  setFlightAndRoleData,
  setInitialFormValuesForUpdateAction,
  setIsCabinCrewDrawerOpen,
  setIsCabinCrewFlightsLoading,
  setIsDashboardDrawerOpen,
  setIsDownloading,
  setIsLoading,
  setIsLoadingModal,
  setIsOccDataLoading,
  setIsSaveAssignCabinCrewFlightsLoading,
  setIsSaveFlightToDashboard,
  setOccData,
  setSelectedActionKey,
  setSubmittedDate,
  setViolatedRuels,
} from '../reducers/dashboardReducer';

// import API config
import { DASHBOARD } from '../../config';
import { getErrorMsg, showAlert } from './commonActions';

// get employee list with flights
const getCockpitCrewFlights = (params) => {
  return async (dispatch) => {
    // set isLoading to true
    dispatch(setIsLoading(true));
    dispatch(setEmployeeWithFlights([]));
    dispatch(setEmployeeTableColumns([]));
    dispatch(setDateAndCrewtype(params));
    try {
      // fetch employee with flight list
      const { data } = await axios.post(
        DASHBOARD.GET_EMPLOYEE_WITH_FLIGHTS,
        params
      );
      const { dates, flights } = await data;

      dispatch(setEmployeeWithFlights(flights?.length > 0 ? flights : []));
      dispatch(setEmployeeTableColumns(dates?.length > 0 ? dates : []));

      // set isLoading to false
      dispatch(setIsLoading(false));
    } catch (err) {
      console.error(err);

      // set isLoading to false
      dispatch(setIsLoading(false));
    }
  };
};

const getOccFlights = (params) => {
  return async (dispatch) => {
    try {
      dispatch(setIsOccDataLoading(true));
      const { data } = await axios.post(DASHBOARD.GET_OCC_FLIGHTS, params);
      dispatch(setOccData(data?.length > 0 ? data : []));
    } catch (err) {
      console.error(err);
      dispatch(setOccData([]));
    } finally {
      dispatch(setSubmittedDate(params?.fromDate));
      dispatch(setIsOccDataLoading(false));
    }
  };
};

// download occ day plan in doc
const downloadOccDayPlan = (params, selectedDate) => {
  return async (dispatch) => {
    try {
      // set isDownloading to true
      dispatch(setIsDownloading(true));
      const response = await axios.post(
        DASHBOARD.DOWNLOAD_OCC_DAILY_PLAN,
        params,
        {
          responseType: 'blob',
        }
      );

      // set file type
      let blob = new Blob([response.data], {
        type: 'application/msword',
      });

      // set file download
      let link = document.createElement('a');
      link.href = blob;
      link.href = window.URL.createObjectURL(blob);
      link.download = selectedDate + '.doc';
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      // set isDownloading to true
      dispatch(setIsDownloading(false));
    }
  };
};

// Save flight to employee dashboard
const saveFlightToDashboard = (params) => {
  return async (dispatch) => {
    try {
      // api call
      const { data } = await axios.post(
        DASHBOARD.SAVE_FLIGHT_TO_EMPLOYEE_DASH,
        params
      );
      dispatch(setIsSaveFlightToDashboard(true));

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
      dispatch(setViolatedRuels([]));
    } catch (err) {
      const errMsg = getErrorMsg(err);

      // Set isLoading to false
      dispatch(setViolatedRuels([]));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// validate assign crew
const validateAssignCrew = (params) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoadingModal(true));
    try {
      // api call
      const { data } = await axios.post(DASHBOARD.VALIDATE_ASSIGN_CREW, params);

      if (!data[0]?.violatedRules?.length)
        dispatch(saveFlightToDashboard(params));
      else {
        dispatch(setViolatedRuels(data[0]?.violatedRules));
        dispatch(setIsLoadingModal(false));
      }
    } catch (err) {
      const errMsg = getErrorMsg(err);

      // Set isLoading to false
      dispatch(setIsLoadingModal(false));
      dispatch(setViolatedRuels([]));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// Save flight to employee dashboard
const getFlgithAndRoleList = (params) => {
  return async (dispatch) => {
    try {
      // api call
      const { data } = await axios.post(DASHBOARD.GET_FLIGHT_ROLE_LIST, params);
      dispatch(setFlightAndRoleData(data ?? {}));
      dispatch(setIsDashboardDrawerOpen(true));
    } catch (err) {
      console.error(err);

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    }
  };
};

// remove crew from flight
const removeCockpitCrewFromFlight = (assignId, selectedDatesAndCrewType) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.patch(
        DASHBOARD.ASSIGN_COCKPIT_CREW + '/' + assignId,
        null,
        {
          params: { statusId: 0 },
        }
      );

      // get updated flight list
      dispatch(getCockpitCrewFlights(selectedDatesAndCrewType));

      // show success alert
      showAlert('success', message ?? 'Removed successfully.');
    } catch (err) {
      console.error(err);

      // get error msg and show alert
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    }
  };
};

// update crew role for a flight
const updateCrewRoleCommandInAFlight = (
  params,
  assignId,
  selectedDatesAndCrewType
) => {
  return async (dispatch) => {
    try {
      // update crew
      const {
        data: { message },
      } = await axios.put(
        DASHBOARD.ASSIGN_COCKPIT_CREW + '/' + assignId,
        params
      );

      // get updated flight list
      dispatch(getCockpitCrewFlights(selectedDatesAndCrewType));

      // close drawer and set initial value to null
      dispatch(setInitialFormValuesForUpdateAction(null));
      dispatch(setSelectedActionKey(null));
      dispatch(setIsDashboardDrawerOpen(false));

      // show success alert
      showAlert('success', message ?? 'Crew updated successfully.');
    } catch (err) {
      console.error(err);

      // get error msg and show alert
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    }
  };
};

// get cabin crew flight list
const getCabinCrewFlights = (params) => {
  return async (dispatch) => {
    dispatch(setIsCabinCrewFlightsLoading(true));
    try {
      const { data } = await axios.post(
        DASHBOARD.GET_CABIN_CREW_FLIGHTS,
        params
      );
      dispatch(setCabinCrewFlights(data));
    } catch (err) {
      console.error(err);

      // get error msg and show alert
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    } finally {
      dispatch(setIsCabinCrewFlightsLoading(false));
    }
  };
};

// get cabin crew flight list
const getAssignCabinCrewFlights = (params) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        DASHBOARD.GET_ASSIGNED_CABIN_CREW,
        params
      );
      dispatch(setAssigndCabinCrewList(data));
    } catch (err) {
      console.error(err);

      // get error msg and show alert
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    } finally {
      //
    }
  };
};

// Save cabin crew flight list
const saveAssignCabinCrewFlights = (params) => {
  return async (dispatch, getState) => {
    const { selectedDatesAndCrewType } = getState().dashboard;
    dispatch(setIsSaveAssignCabinCrewFlightsLoading(true));
    try {
      // api call
      const { data } = await axios.post(
        DASHBOARD.SAVE_ASSIGNED_CABIN_CREW,
        params
      );

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');

      // close drawer
      dispatch(setIsCabinCrewDrawerOpen(false));

      // get flight list
      dispatch(getCabinCrewFlights(selectedDatesAndCrewType));
    } catch (err) {
      console.error(err);

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    } finally {
      dispatch(setIsSaveAssignCabinCrewFlightsLoading(false));
    }
  };
};

// Save cabin crew flight list
const addCabinCrewStandBy = (payload) => {
  return async (dispatch, getState) => {
    const { selectedDatesAndCrewType } = getState().dashboard;
    dispatch(setIsSaveAssignCabinCrewFlightsLoading(true));
    try {
      // api call
      const { data } = await axios.post(
        DASHBOARD.ASSIGN_STAND_BY_CABIN_CREW,
        payload
      );

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');

      // close drawer
      dispatch(setIsCabinCrewDrawerOpen(false));

      // get flight list
      dispatch(getCabinCrewFlights(selectedDatesAndCrewType));
    } catch (err) {
      console.error(err);

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    } finally {
      dispatch(setIsSaveAssignCabinCrewFlightsLoading(false));
    }
  };
};

// Save cabin crew flight list
const addCockpitCrewStandBy = (payload) => {
  return async (dispatch, getState) => {
    const { selectedDatesAndCrewType } = getState().dashboard;
    dispatch(setIsLoading(true));
    try {
      // api call
      const { data } = await axios.post(
        DASHBOARD.ASSIGN_STAND_BY_COCKPIT_CREW,
        payload
      );

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');

      // close drawer
      dispatch(setIsDashboardDrawerOpen(false));

      // get flight list
      dispatch(getCockpitCrewFlights(selectedDatesAndCrewType));
    } catch (err) {
      console.error(err);

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
};
export {
  addCabinCrewStandBy,
  addCockpitCrewStandBy,
  downloadOccDayPlan,
  getAssignCabinCrewFlights,
  getCabinCrewFlights,
  getCockpitCrewFlights,
  getFlgithAndRoleList,
  getOccFlights,
  removeCockpitCrewFromFlight,
  saveAssignCabinCrewFlights,
  saveFlightToDashboard,
  updateCrewRoleCommandInAFlight,
  validateAssignCrew,
};
