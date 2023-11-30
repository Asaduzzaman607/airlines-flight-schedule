import axios from 'axios'

// import api config
import { LICENCE } from '../../../config'

// import actions
import {
	setIsLoading,
	setValidationList,
	setFilterdValidationList,
	setValidationDetailsList,
	setSuccess,
	setPagination,
	setNintyDaysValidity
} from '../../reducers/SimTrainingManagementReducers/validationReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// check item list
const transformItemList = (items) => {
	// check if validation info is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get validation list
const getValidationList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get validation schedule
			const { data } = await axios.get(
				LICENCE.ADD_LICENCE_VALIDATION + `?page=${page.page}&size=${page.pageSize}`
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

			// set validation to validation List
			const ValidationList = transformItemList(data?.model)

			dispatch(setValidationList(ValidationList))

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

// get validation search list
const getValidationSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get validation
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}

			const { data } = await axios.post(
				LICENCE.ADD_LICENCE_VALIDATION + 'search' + PARAMS,
				PAYLOAD
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

			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setValidationList(newList))

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

// get validation row details
const getValidationDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// get validation list
			const { data } = await axios.get(LICENCE.GET_LICENCE_VALIDATION_LIST + id)
			dispatch(setValidationDetailsList(data))
			dispatch(setIsLoading(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// get validation row details
const getNintyDaysValidity = (param) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// get validation list
			const { data } = await axios.get(LICENCE.GET_NINETY_DAYS_VALIDITY + param.id)

			dispatch(setNintyDaysValidity(data?.ninetyDaysCurrencyValid))

			dispatch(setIsLoading(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// add validation
const addValidation = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add validation api call
			const { data } = await axios.post(LICENCE.ADD_LICENCE_VALIDATION, params)
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
// get filtered validation
const getFilteredValidation = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// filtered validation api call
			const { data } = await axios.post(LICENCE.GET_FILTERED_SCHEDULE, params)
			dispatch(setFilterdValidationList(data?.model))

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

// edit validation
const editValidationList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit validation api call
			const { data } = await axios.put(LICENCE.ADD_LICENCE_VALIDATION + params.id, params)

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

// update validation status
const deleteValidation = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete validation api call
			const { data } = await axios.patch(
				LICENCE.ADD_LICENCE_VALIDATION + id + '?statusId=0'
			)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getValidationSearchList(pageWithSize))
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
	getValidationList,
	getFilteredValidation,
	addValidation,
	editValidationList,
	deleteValidation,
	getValidationDetails,
	getValidationSearchList,
	getNintyDaysValidity
}
