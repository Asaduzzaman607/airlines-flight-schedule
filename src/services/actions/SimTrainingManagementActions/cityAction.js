import axios from 'axios'

// import api config
import { SIM_TRAINING } from '../../../config'

// import actions
import {
	setIsLoading,
	setCityList,
	setSuccess,
	setPagination,
} from '../../reducers/SimTrainingManagementReducers/cityReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform City list
const transformItemList = (items) => {
	// check if City is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get City list
const getCityList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get City list
			const PARAMS = `?page=${page.page}&size=${page.pageSize}`
			const { data } = await axios.get(SIM_TRAINING.GET_CITY + PARAMS)
			dispatch(setSuccess(false))

			// set user pagination
			const { currentPage, totalElements: pageSize, totalPages: totalPage } = data
			dispatch(
				setPagination({
					currentPage,
					pageSize,
					totalPage,
					currentPageSize: page.pageSize,
				})
			)

			// set City to CityList
			const CityList = transformItemList(data?.model)
			dispatch(setCityList(CityList))

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

// get City search list
const getCitySearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get City
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(SIM_TRAINING.GET_CITY + 'search' + PARAMS, PAYLOAD)

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
			dispatch(setCityList(newList))

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

// add new City
const addCity = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add City api call
			const { data } = await axios.post(SIM_TRAINING.GET_CITY, params)

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

// edit City
const editCityList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit City api call
			const { data } = await axios.put(SIM_TRAINING.GET_CITY + params.id, params)

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

// update City status
const deleteCity = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete City api call
			const { data } = await axios.patch(`${SIM_TRAINING.GET_CITY}${id}?statusId=0`)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getCitySearchList(pageWithSize))
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
export { getCityList, addCity, editCityList, deleteCity, getCitySearchList }
