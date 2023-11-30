import axios from 'axios'

// import api config
import { LICENCE, EMPLOYEE } from '../../../config'

// import actions
import {
	setIsLoading,
	setLicenceList,
	setFilterdLicenceList,
	setLicenceDetailsList,
	setSuccess,
	setPagination,
	setEmployeeList,
	setLastPPC
} from '../../reducers/SimTrainingManagementReducers/licenceReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// check item list
const transformItemList = (items) => {
	// check if licence info is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get licence list
const getLicenceList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get licence schedule
			const { data } = await axios.get(
				LICENCE.ADD_LICENCE + `?page=${page.page}&size=${page.pageSize}`
			)
			dispatch(setSuccess(false))

			// set user pagination
			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize: page.pageSize,
				})
			)

			// set licence to licence List
			const LicenceList = transformItemList(data?.model)

			dispatch(setLicenceList(LicenceList))

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

// get Last PPC
const getLastPPC = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get licence schedule
			const { data } = await axios.get(
				LICENCE.GET_LAST_PPC 
			)
			dispatch(setSuccess(false))

			// set licence to licence List
			const lastPPC = transformItemList(data)

			dispatch(setLastPPC(lastPPC))

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

// get licence search list
const getLicenceSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get licence
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ??
					searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
				isForeign:
					searchValue?.isForeign ?? searchValue?.stored_SearchBlock_Value?.isForeign,
			}
			const { data } = await axios.post(LICENCE.ADD_LICENCE + 'search' + PARAMS, PAYLOAD)
			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)

			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setLicenceList(newList))

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

// get licence row details
const getLicenceDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// get licence list
			const { data } = await axios.get(LICENCE.GET_LICENCE_LIST + id)
			dispatch(setLicenceDetailsList(data))
			dispatch(setIsLoading(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// add licence
const addLicence = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add licence api call
			const { data } = await axios.post(LICENCE.ADD_LICENCE, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoading(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}
// get filtered licence
const getFilteredLicence = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// filtered licence api call
			const { data } = await axios.post(LICENCE.GET_FILTERED_SCHEDULE, params)
			dispatch(setFilterdLicenceList(data?.model))

			dispatch(setIsLoading(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}

// get Employee search list
const getEmployeeList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get Employee
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
					isForeign:
					searchValue?.isForeign ?? searchValue?.stored_SearchBlock_Value?.isForeign,
			}
			const { data } = await axios.post(
				EMPLOYEE.GET_EMPLOYEE_LIST +'search'+ PARAMS, PAYLOAD
			)
		
			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)

			// reset setSuccess status
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setEmployeeList(newList))

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


// edit licence
const editLicenceList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit licence api call
			const { data } = await axios.put(LICENCE.ADD_LICENCE + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			showAlert('error', errMsg)
		}
	}
}

// update licence status
const deleteLicence = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete licence api call
			const { data } = await axios.patch(LICENCE.ADD_LICENCE + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getLicenceSearchList(pageWithSize))
			dispatch(setIsLoading(false))

			// show success message
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
	getLicenceList,
	getFilteredLicence,
	addLicence,
	editLicenceList,
	deleteLicence,
	getLicenceDetails,
	getLicenceSearchList,
	getEmployeeList,
	getLastPPC
}
