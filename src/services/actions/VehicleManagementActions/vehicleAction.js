import axios from 'axios'

// import api config
import { VCC } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setVehicleList,
	setSuccess,
	setPagination,
	setTypeList
} from '../../reducers/VehicleManagementReducers/vehicleReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Vehicle list
const transformItemList = (items) => {
	// check if Vehicle is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Vehicle list
const getVehicleList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Vehicle list
			const { data } = await axios.get(
				VCC.GET_VEHICLE_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set Vehicle to Vehicle List
			const VehicleList = transformItemList(data?.model)
			dispatch(setVehicleList(VehicleList))

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

//get type
const getType = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Vehicle list
			const { data } = await axios.get(VCC.GET_TYPE)
	
			dispatch(setSuccess(false))

			// set Vehicle to Vehicle List
			const VehicleList = transformItemList(data?.model)	
			dispatch(setTypeList(VehicleList))

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

// get Vehicle search list
const getVehicleSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
        try {
            // get Vehicle
            const PARAMS = `?page=${searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
            const PAYLOAD ={
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ??
					searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
					searchValue?.stored_SearchBlock_Value?.typeSearchValue
			}
            const { data } = await axios.post(VCC.GET_VEHICLE_LIST + 'search' + PARAMS, PAYLOAD)   

            dispatch(setPagination({ 
                currentPage: data?.currentPage, pageSize: data?.totalElements, 
                totalPage: data?.totalPages, 
                currentPageSize: searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize 
            }))
            dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setVehicleList(newList))

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

// add Vehicle
const addVehicle = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add Vehicle api call
			const {data} = await axios.post(VCC.GET_VEHICLE_LIST, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit Vehicle
const editVehicle = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit Vehicle api call
			const {data} = await axios.put(VCC.GET_VEHICLE_LIST + params.id, params)

			dispatch(setSuccess(true))
			showAlert('success', data?.message ?? 'Successfully Updated.')
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update Vehicle status
const deleteVehicleData = (id, pagination) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete Vehicle api call
			const {data} = await axios.patch(VCC.GET_VEHICLE_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
			}
			dispatch(getVehicleList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// export actions
export { getVehicleList, addVehicle, editVehicle, deleteVehicleData, getVehicleSearchList, getType}
