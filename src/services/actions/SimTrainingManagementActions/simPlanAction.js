import axios from 'axios';

// import api config
import { SIM_TRAINING } from '../../../config';

// import actions
import {
  setIsLoading,
  setSimPlanList,
  setSuccess,
  setPagination,
  setSimPlanApprovalHistory,
  setApprovalHistoryModalOpen,
  setEligibleEmployeeForSim,
  setEndDateData,
  setSelectedRowsInDestination,
} from '../../reducers/SimTrainingManagementReducers/simPlanReducer';
import { getErrorMsg, showAlert } from '../commonActions';
import { getFlightInfoSearchList } from '../FlightManagementActions/flightInfoAction';

// transform SimPlan list
const transformItemList = (items) => {
  // check if SimPlan is invalid or has an empty array, then return empty array
  if (!items || items.length <= 0) {
    return [];
  }

  return items.map((item) => ({ ...item, key: item?.id }));
};

// get SimPlan search list
const getSimPlanSearchList = (searchValue) => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true));

    try {
      // get SimPlan
      const PARAMS = `?page=${
        searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
      }&size=${
        searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize
      }`;
      const PAYLOAD = {
        [searchValue?.columnName ??
        searchValue?.stored_SearchBlock_Value?.columnName]:
          searchValue?.value ??
          searchValue?.stored_SearchBlock_Value?.inputFieldValue,
        aircraftTypeId: searchValue?.aircraftTypePermission,
      };
      const { data } = await axios.post(
        SIM_TRAINING.GET_SIM_PLAN + 'search' + PARAMS,
        PAYLOAD
      );

      const {
        currentPage,
        totalElements: pageSize,
        totalPages: totalPage,
      } = data;
      dispatch(
        setPagination({
          currentPage,
          pageSize,
          totalPage,
          currentPageSize:
            searchValue?.pageSize ??
            searchValue?.stored_SearchBlock_Value?.pageSize,
        })
      );
      dispatch(setSuccess(false));

      // set Transform List
      const newList = transformItemList(data?.model);
      dispatch(setSimPlanList(newList));

      // set isLoading to false since data fetching has done.
      dispatch(setIsLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setSuccess(false));

      // get error msg
      const errMsg = getErrorMsg(error);
      showAlert('error', errMsg);

      // set isLoading to false since data fetching has an error.
      dispatch(setIsLoading(false));
    }
  };
};

// add new SimPlan
const addSimPlan = (params) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // add SimPlan api call
      const { data } = await axios.post(SIM_TRAINING.GET_SIM_PLAN, params);
      dispatch(setIsLoading(false));

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// edit SimPlan
const editSimPlanList = (params) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // edit SimPlan api call
      const { data } = await axios.put(
        SIM_TRAINING.GET_SIM_PLAN + params.id,
        params
      );

      dispatch(setSuccess(true));
      dispatch(setIsLoading(false));

      showAlert('success', data?.message ?? 'Successfully Update.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// update SimPlan status
const deleteSimPlan = (id, pagination, stored_SearchBlock_Value) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      const params = {
        statusId: 0,
      };
      // delete SimPlan api call
      const { data } = await axios.patch(SIM_TRAINING.GET_SIM_PLAN + id, null, {
        params,
      });

      let pageWithSize = {
        page: pagination.currentPage - 1,
        pageSize: pagination.currentPageSize,
        stored_SearchBlock_Value,
      };
      dispatch(getSimPlanSearchList(pageWithSize));
      dispatch(setIsLoading(false));

      showAlert('success', data?.message ?? 'Successfully Deleted.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// add new SimPlan Review request
const addReviewRequest = (params, getTableDataAction) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // add SimPlan api call
      const { data } = await axios.put(params.API, params);
      dispatch(setIsLoading(false));

      getTableDataAction && dispatch(getTableDataAction());

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// add new SimPlan Review
const addReview = (params, getTableDataAction) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // add SimPlan api call
      const { data } = await axios.put(params.API, params);
      dispatch(setIsLoading(false));

      getTableDataAction && dispatch(getTableDataAction());

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// add new SimPlan approved
const addApproved = (params, getTableDataAction) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // add SimPlan api call
      const { data } = await axios.put(params.API, params);
      dispatch(setIsLoading(false));

      getTableDataAction && dispatch(getTableDataAction());

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// add new SimPlan reject
const Rejected = (params, getTableDataAction) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // api call
      const { data } = await axios.put(params.API, params);
      dispatch(setIsLoading(false));

      getTableDataAction && dispatch(getTableDataAction());

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};



// get sim plan approval history
const getApprovalHistory = (param) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      const params = {
        masterId: param?.ids[0],
        moduleId: param?.moduleId,
        menuId: param?.menuId,
      };

      // api call
      const { data } = await axios.get(
        SIM_TRAINING.GET_APPROVAL_HISTORY,
        { params },
        param
      );
      dispatch(setIsLoading(false));

      if (data?.length) {
        dispatch(setApprovalHistoryModalOpen(true));
      } else {
        dispatch(setApprovalHistoryModalOpen(false));

        // show success message
        showAlert('warning', 'Data not found for this row.');
      }

      dispatch(setSimPlanApprovalHistory(data));
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// get sim plan approval history
const getEligibleEmployeeSim = (items) => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true));

    try {
      const { data } = await axios.post(
        SIM_TRAINING.GET_EMPLOYEE_BY_EMPLOYEE_GROUP,
        items
      );

      dispatch(setSuccess(false));

      // set Transform List
      const newList = transformItemList(data?.model);
      dispatch(setEligibleEmployeeForSim(newList));

      // set isLoading to false since data fetching has done.
      dispatch(setIsLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setSuccess(false));

      // get error msg
      const errMsg = getErrorMsg(error);
      showAlert('error', errMsg);

      // set isLoading to false since data fetching has an error.
      dispatch(setIsLoading(false));
    }
  };
};

// cancel flight
const cancelFlightItem = (id) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoading(true));
    try {
      // api call
      const { data } = await axios.patch(SIM_TRAINING.CANCEL_FLIGHT_ITEM, [id]);
      dispatch(setIsLoading(false));

      dispatch(getFlightInfoSearchList({ page: 0, pageSize: 10 }));

      // show success message
      showAlert('success', data?.message ?? 'Successfully Canceled.');
    } catch (err) {
      console.error(err);
      // Set isLoading to false
      dispatch(setIsLoading(false));

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);
    }
  };
};

// export actions
export {
  addSimPlan,
  editSimPlanList,
  deleteSimPlan,
  getSimPlanSearchList,
  addReviewRequest,
  addApproved,
  addReview,
  Rejected,
  getApprovalHistory,
  cancelFlightItem,
  getEligibleEmployeeSim,
  setSelectedRowsInDestination,
  setEligibleEmployeeForSim,
  setEndDateData,
};
