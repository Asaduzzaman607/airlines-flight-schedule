import axios from 'axios';

// import api config
import { LEAVE_CONFIG, LEAVE_TYPE } from '../../../config';

// import actions
import {
  setEmployeeTypeList,
  setIsLoading,
  setIsLoadingAddUser,
  setLeaveConfigList,
  setLeaveTypeList,
  setPagination,
  setSuccess,
} from '../../reducers/FlightManagementReducers/leaveConfigReducer';
import { getErrorMsg, showAlert } from '../commonActions';

// transform Leave Config list
const transformItemList = (items) => {
  // check if Leave Config is invalid or has an empty array, then return empty array
  if (!items || items.length <= 0) {
    return [];
  }

  return items.map((item) => ({ ...item, key: item?.id }));
};

// get Leave Type list
const getLeaveTypeList = (searchValue) => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true))
    try {
      // get Leave Type list
      const { data } = await axios.get(LEAVE_TYPE.GET_LEAVE_TYPE + 'v2?id=' + searchValue)

      dispatch(setSuccess(false));

      // set Leave Type to Leave Type List
      const LeaveTypeList = transformItemList(data)
      dispatch(setLeaveTypeList(LeaveTypeList))

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

// get Leave Type list
const getLeaveTypeListForConfig = () => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true))
    try {
      // get Leave Type list
      const { data } = await axios.get(LEAVE_TYPE.GET_LEAVE_TYPE)

      dispatch(setSuccess(false));

      // set Leave Type to Leave Type List
      const LeaveTypeList = transformItemList(data?.model)
      dispatch(setLeaveTypeList(LeaveTypeList))

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

// get Employee Type list
const getEmployeeTypeList = () => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true));

    try {
      // get Employee Type list
      const { data } = await axios.get(
        LEAVE_CONFIG.GET_LEAVE_CONFIG + 'employee-type'
      );

      dispatch(setSuccess(false));

      // set Employee Type to Employee Type List
      const LeaveTypeList = transformItemList(data);
      dispatch(setEmployeeTypeList(LeaveTypeList));

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

// get Leave Config search list
const getLeaveConfigSearchList = (searchValue) => {
  return async (dispatch) => {
    // set isLoading to true while fetching user data
    dispatch(setIsLoading(true));

    try {
      // get Leave Config
      const PARAMS = `?page=${searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
        }&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize
        }`;
      const PAYLOAD = {
        [searchValue?.columnName ??
          searchValue?.stored_SearchBlock_Value?.columnName]:
          searchValue?.value ??
          searchValue?.stored_SearchBlock_Value?.inputFieldValue,
      };
      const { data } = await axios.post(
        LEAVE_CONFIG.GET_LEAVE_CONFIG + 'search' + PARAMS,
        PAYLOAD
      );

      dispatch(
        setPagination({
          currentPage: data?.currentPage,
          pageSize: data?.totalElements,
          totalPage: data?.totalPages,
          currentPageSize:
            searchValue?.pageSize ??
            searchValue?.stored_SearchBlock_Value?.pageSize,
        })
      );
      dispatch(setSuccess(false));

      // set Transform List
      const newList = transformItemList(data?.model);
      dispatch(setLeaveConfigList(newList));

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

// add Leave Config
const addLeaveConfig = (params) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoadingAddUser(true));
    try {
      // add Leave Config api call
      const { data } = await axios.post(LEAVE_CONFIG.GET_LEAVE_CONFIG, params);

      // show success message
      showAlert('success', data?.message ?? 'Successfully Added.');
      dispatch(setIsLoadingAddUser(false));
    } catch (err) {
      console.error(err);

      // show error msg
      const errMsg = getErrorMsg(err);
      showAlert('error', errMsg);

      // Set isLoading to false
      dispatch(setIsLoadingAddUser(false));
    }
  };
};

// edit Leave Config
const editLeaveConfig = (params) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoadingAddUser(true));
    try {
      // edit Leave Config api call
      const { data } = await axios.put(
        LEAVE_CONFIG.GET_LEAVE_CONFIG + params.id,
        params
      );

      showAlert('success', data?.message ?? 'Successfully Updated.');
      dispatch(setSuccess(true));
      dispatch(setIsLoadingAddUser(false));
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoadingAddUser(false));
      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// update Leave Config status
const deleteLeaveConfig = (id, pagination) => {
  return async (dispatch) => {
    // Set isLoading to true
    dispatch(setIsLoadingAddUser(true));
    try {
      // delete Leave Config api call
      const { data } = await axios.patch(
        LEAVE_CONFIG.GET_LEAVE_CONFIG + id + '?statusId=0'
      );

      let pageWithSize = {
        page: pagination.currentPage - 1,
        pageSize: pagination.currentPageSize,
      };
      dispatch(getLeaveConfigSearchList(pageWithSize));
      dispatch(setIsLoadingAddUser(false));

      showAlert('success', data?.message ?? 'Successfully Deleted.');
    } catch (err) {
      const errMsg = getErrorMsg(err);
      // Set isLoading to false
      dispatch(setIsLoadingAddUser(false));
      // show error msg
      showAlert('error', errMsg);
    }
  };
};

// export actions
export {
  addLeaveConfig,
  deleteLeaveConfig,
  editLeaveConfig,
  getEmployeeTypeList,
  getLeaveConfigSearchList,
  getLeaveTypeList,
  getLeaveTypeListForConfig
};
