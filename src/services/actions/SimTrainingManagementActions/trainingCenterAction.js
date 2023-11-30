import axios from 'axios'

// import api config
import { SIM_TRAINING } from '../../../config'

// import actions
import {
	setIsLoading,
	setTrainingCenterList,
	setSuccess,
	setPagination,
} from '../../reducers/SimTrainingManagementReducers/trainingCenterReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform TrainingCenter list
const transformItemList = (items) => {
	// check if TrainingCenter is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get TrainingCenter search list
const getTrainingCenterSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get TrainingCenter
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
				    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}
			const { data } = await axios.post(
				SIM_TRAINING.GET_TRAINING_CENTER + 'search' + PARAMS,
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
			dispatch(setTrainingCenterList(newList))

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

// add new TrainingCenter
const addTrainingCenter = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add TrainingCenter api call
			const { data } = await axios.post(SIM_TRAINING.ADD_TRAINING_CENTER, params)

            dispatch(setSuccess(true))
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

// edit TrainingCenter
const editTrainingCenterList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit TrainingCenter api call
			const { data } = await axios.put(
				SIM_TRAINING.ADD_TRAINING_CENTER + params.id,
				params
			)

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

// update TrainingCenter status
const deleteTrainingCenter = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const params = {
				statusId: 0,
			}
			// delete TrainingCenter api call
			const { data } = await axios.patch(SIM_TRAINING.GET_TRAINING_CENTER + id, null, {
				params,
			})

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getTrainingCenterSearchList(pageWithSize))
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
	addTrainingCenter,
	editTrainingCenterList,
	deleteTrainingCenter,
	getTrainingCenterSearchList,
}
