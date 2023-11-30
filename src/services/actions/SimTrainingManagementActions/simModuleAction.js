import axios from 'axios'

// import api config
import { SIM_TRAINING } from '../../../config'

// import actions
import {
	setIsLoading,
	setSimModuleList,
	setSuccess,
	setPagination,
} from '../../reducers/SimTrainingManagementReducers/simModuleReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform SimModule list
const transformItemList = (items) => {
	// check if SimModule is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get SimModule search list
const getSimModuleSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get SimModule
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(
				SIM_TRAINING.GET_SIM_MODULE + 'search' + PARAMS,
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
			dispatch(setSimModuleList(newList))

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

// add new SimModule
const addSimModule = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add SimModule api call
			const { data } = await axios.post(SIM_TRAINING.GET_SIM_MODULE, params)

			dispatch(setIsLoading(false))
			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit SimModule
const editSimModuleList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit SimModule api call
			const { data } = await axios.put(SIM_TRAINING.GET_SIM_MODULE + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))
			showAlert('success', data?.message ?? 'Successfully Update.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update SimModule status
const deleteSimModule = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const params = {
				statusId: 0,
			}
			// delete SimModule api call
			const { data } = await axios.patch(SIM_TRAINING.GET_SIM_MODULE + id, null, { params })

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getSimModuleSearchList(pageWithSize))
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
export { addSimModule, editSimModuleList, deleteSimModule, getSimModuleSearchList }
