import axios from 'axios'

// import api config
import { LICENCE } from '../../../config'

// import actions
import {
	setIsLoading,
	setCaabList,
	setFilterdCaabList,
	setCaabDetailsList,
	setSuccess,
	setPagination,
	setActiveStatus,
} from '../../reducers/SimTrainingManagementReducers/caabReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// check item list
const transformItemList = (items) => {
	// check if caab info is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get caab list
const getCaabList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get caab schedule
			const { data } = await axios.get(
				LICENCE.ADD_CAAB + `?page=${page.page}&size=${page.pageSize}`
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

			// set caab to caab List
			const CaabList = transformItemList(data?.model)

			dispatch(setCaabList(CaabList))

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

// get caab search list
const getCaabSearchList = (searchValue, isActive) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get caab
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`

			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
				searchValue?.value ??
				searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
				searchValue?.stored_SearchBlock_Value?.dataSearchValue ??
                searchValue?.stored_SearchBlock_Value?.typeSearchValue,
				isActive: isActive,
			}

			const { data } = await axios.post(LICENCE.ADD_CAAB + 'search' + PARAMS, PAYLOAD)

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
			dispatch(setCaabList(newList))

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

// get caab row details
const getCaabDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// get caab list
			const { data } = await axios.get(LICENCE.GET_CAAB_LIST + id)
			dispatch(setCaabDetailsList(data))
			dispatch(setIsLoading(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// add caab
const addCaab = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add caab api call
			const { data } = await axios.post(LICENCE.ADD_CAAB, params)

			dispatch(setIsLoading(false))
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
// get filtered caab
const getFilteredCaab = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// filtered caab api call
			const { data } = await axios.post(LICENCE.GET_FILTERED_SCHEDULE, params)
			dispatch(setFilterdCaabList(data?.model))

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

// edit caab
const editCaabList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit caab api call
			const { data } = await axios.put(LICENCE.ADD_CAAB + params.id, params)

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

// update caab status
const deleteCaab = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch, getState) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete caab api call
			const { data } = await axios.patch(LICENCE.ADD_CAAB + id + '?statusId=0')

			const { activeTab } = getState().caab

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getCaabSearchList(pageWithSize, activeTab === 'active'))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)

			// show error msg
			showAlert('error', errMsg)
		} finally {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// change status
const updateStatus = (param) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// api call
			const { data } = await axios.patch(LICENCE.GET_STATUS + param.id, null, {
				params: { isActive: param?.isActive },
			})

			dispatch(getCaabSearchList({ page: 0, pageSize: 500 }, !param?.isActive))

			dispatch(setCaabDetailsList(data))
			dispatch(setActiveStatus(true))

			dispatch(setIsLoading(false))
			// show success message
			showAlert('success', data?.message ?? 'Status changed successfully.')
		} catch (err) {
			console.error(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error msg
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		}
	}
}

// export actions
export {
	getCaabList,
	getFilteredCaab,
	addCaab,
	editCaabList,
	deleteCaab,
	getCaabDetails,
	getCaabSearchList,
	updateStatus,
}
