import axios from 'axios'

// import api config
import { SIM_TRAINING } from '../../../config'

// import actions
import {
	setIsLoading,
	setTrainerList,
	setSuccess,
	setPagination,
} from '../../reducers/SimTrainingManagementReducers/trainerReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Trainer list
const transformItemList = (items) => {
	// check if Trainer is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Trainer search list
const getTrainerSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Trainer
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(SIM_TRAINING.GET_TRAINER + 'search' + PARAMS, PAYLOAD)

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
			dispatch(setTrainerList(newList))

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

// add new Trainer
const addTrainer = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add Trainer api call
			const { data } = await axios.post(SIM_TRAINING.GET_TRAINER, params)

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

// edit Trainer
const editTrainerList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit Trainer api call
			const { data } = await axios.put(SIM_TRAINING.GET_TRAINER + params.id, params)

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

// update Trainer status
const deleteTrainer = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const params = {
				statusId: 0,
			}
			// delete Trainer api call
			const { data } = await axios.patch(SIM_TRAINING.GET_TRAINER + id, null, { params })

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getTrainerSearchList(pageWithSize))
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
export { addTrainer, editTrainerList, deleteTrainer, getTrainerSearchList }
