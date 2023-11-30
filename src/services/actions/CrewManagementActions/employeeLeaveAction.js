import axios from 'axios'

// import api config
import { EMPLOYEE } from '../../../config'

// import actions
import {
	setIsLoading,
	setEmployeeLeaveList,
	setSuccess,
	setPagination,
	setEmployeeList
} from '../../reducers/CrewManagementReducers/employeeLeaveReducer'
import { getErrorMsg, showAlert } from '../commonActions'
import { setIsCabinCrewDrawerOpen, setIsDashboardDrawerOpen } from '../../reducers/dashboardReducer';
import { getCabinCrewFlights, getCockpitCrewFlights } from '../dashboardAction';

// transform EmployeeLeave list
const transformItemList = (items) => {
	// check if EmployeeLeave is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Employee search list
const getEmployeeListForLeave = (params) => {
	
	return async (dispatch) => {
		try {
			// get Employee list
			const { data } = await axios.get(
				EMPLOYEE.GET_EMPLOYEE_LIST_FOR_LEAVE, {params}
			)

			// reset setSuccess status
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setEmployeeList(newList))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)
		}
	}
}

// get EmployeeLeave search list
const getEmployeeLeaveSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get EmployeeLeave
			const PARAMS = `?page=${searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
				}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(
				EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST + 'search' + PARAMS,
				PAYLOAD
			)
			const { currentPage, totalElements: pageSize, totalPages: totalPage } = data
			dispatch(
				setPagination({
					currentPage,
					pageSize,
					totalPage,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setEmployeeLeaveList(newList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// add new EmployeeLeave 
const addEmployeeLeave = params => {
	return async (dispatch, getState) => {
		const { selectedDatesAndCrewType } = getState().dashboard;
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add EmployeeLeave api call
			await axios.post(EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST, params)
			// show success message
			showAlert('success', 'Successfully Added !!')
			dispatch(setIsLoading(false))
			if (selectedDatesAndCrewType) {
				// close drawer
				dispatch(setIsDashboardDrawerOpen(false));
				dispatch(setIsCabinCrewDrawerOpen(false));
				// get flight list
				dispatch(getCockpitCrewFlights(selectedDatesAndCrewType));
				// get flight list
				dispatch(getCabinCrewFlights(selectedDatesAndCrewType));
			}


		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit EmployeeLeave 
const editEmployeeLeaveList = params => {
	return async (dispatch, getState) => {
		const { selectedDatesAndCrewType } = getState().dashboard;
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit EmployeeLeave api call
			await axios.put(EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST + params.id, params)

			showAlert('success', 'Successfully Updated !!')
			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))
			if (selectedDatesAndCrewType) {
				// close drawer
				dispatch(setIsDashboardDrawerOpen(false));
				dispatch(setIsCabinCrewDrawerOpen(false));
				// get flight list
				dispatch(getCockpitCrewFlights(selectedDatesAndCrewType));
				// get flight list
				dispatch(getCabinCrewFlights(selectedDatesAndCrewType));
			}
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update EmployeeLeave status
const deleteEmployeeLeave = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const params = {
				statusId: 0,
			}
			// delete EmployeeLeave api call
			const { data } = await axios.patch(EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST + id, null, { params })

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getEmployeeLeaveSearchList(pageWithSize))
			dispatch(setIsLoading(false))

			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}


// export actions
export {
	addEmployeeLeave,
	editEmployeeLeaveList,
	deleteEmployeeLeave,
	getEmployeeLeaveSearchList,
	getEmployeeListForLeave
}
