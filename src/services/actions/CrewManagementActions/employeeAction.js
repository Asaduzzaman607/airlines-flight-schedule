import axios from 'axios'

// import api config
import { EMPLOYEE, LOCATION, USER } from '../../../config'

// import actions
import {
	setAreaList,
	setCountryList,
	setEmployeeList,
	setIsLoading,
	setIsLoadingAddUser,
	setPagination,
	setSuccess,
	setUserTypeList,
    setContactTypeList,
    setEmployeeTypeList
} from '../../reducers/CrewManagementReducers/employeeReducer'
import {
    setIsLoadingForCabin,
    setCabinCrewList,
	setCabinCrewPagination,
} from '../../reducers/CrewManagementReducers/cabinCrewListReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform aircraft list
const transformItemList = (items) => {
	// check if Employee is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Employee list
const getEmployeeList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Employee
			// const {data} = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + `?page=${page.page}&size=${page.pageSize}`)
			const { data } = await axios.post(
				EMPLOYEE.SEARCH_EMPLOYEE,
				{
					aircraftTypeId: page?.aircraftTypePermission,
					page: page.page,
					size: page.pageSize,
				},
				{ params: { page: 0, size: 500 } }
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

			// set Employee to Employee
			const EmployeeList = transformItemList(data?.model)
			dispatch(setEmployeeList(EmployeeList))

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

// get Employee search list
const getEmployeeSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get Employee
            const PARAMS = `search?page=${
                    searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
                }&size=${
                    searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize
                }`
            const PAYLOAD = {
                [searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
                    searchValue?.value ??
                    searchValue?.stored_SearchBlock_Value?.inputFieldValue,
            }
			const { data } = await axios.post(
				EMPLOYEE.GET_EMPLOYEE_LIST + PARAMS, PAYLOAD
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

// get Employee search list
const getCockpitCrewSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get Employee
            const PARAMS = `?page=${
                    searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
                }&size=${
                    searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize
                }`
            const PAYLOAD = {
                [searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
                    searchValue?.value ??
                    searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
            }
			const { data } = await axios.post(
				EMPLOYEE.GET_EMPLOYEE_LIST + 'get-cockpit' + PARAMS, PAYLOAD
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

// get Employee search list
const getCabinCrewSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoadingForCabin(true))
		try {
			// get Employee
            const PARAMS = `?page=${
                    searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
                }&size=${
                    searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize
                }`
            const PAYLOAD = {
                [searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
                    searchValue?.value ??
                    searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
            }
			const { data } = await axios.post(
				EMPLOYEE.GET_EMPLOYEE_LIST + 'get-cabin' + PARAMS, PAYLOAD
			)
			dispatch(
				setCabinCrewPagination({
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
			dispatch(setCabinCrewList(newList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoadingForCabin(false))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoadingForCabin(false))
		}
	}
}

// get user type list
const getUserTypeList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get user list
			const { data } = await axios.get(USER.GET_USER_LIST + '?userType=EMPLOYEE')
			dispatch(setSuccess(false))

			// set user to userlist
			const UserList = transformItemList(data?.model)
			dispatch(setUserTypeList(UserList))

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

// get Country list
const getCountryList = (params) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Country
			const { data } = await axios.post(LOCATION.GET_COUNTRY, null, { params })

			// set Country to CountryList
			const CountryList = transformItemList(data?.model)
			dispatch(setCountryList(CountryList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// get Area list
const getAreaList = (params) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Area
			const { data } = await axios.get(LOCATION.GET_AREA, {params});

			// set Area to AreaList
			const AreaList = transformItemList(data?.model)
			dispatch(setAreaList(AreaList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// add Employee
const addEmployee = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add Employee api call
			let { data } = await axios.post(EMPLOYEE.GET_EMPLOYEE_LIST, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added !!')
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

// edit Employee
const editEmployee = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit Employee api call
			let { data } = await axios.put(EMPLOYEE.GET_EMPLOYEE_LIST + params.id, params)

			showAlert('success', data?.message ?? 'Successfully Updated !!')
			dispatch(setSuccess(true))
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

// update Employee status
const deleteEmployee = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete Employee api call
			let { data } = await axios.patch(EMPLOYEE.GET_EMPLOYEE_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination?.currentPage - 1,
				pageSize: pagination?.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getEmployeeSearchList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Deleted !!')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// Get Employee Type
const getEmployeeTypeList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Country
			const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + 'type')

			// set Country to CountryList
			const EmployeeTypeList = transformItemList(data)
			dispatch(setEmployeeTypeList(EmployeeTypeList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// Get Employee Type
const getContactTypeList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Country
			const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + 'contract-type')

			// set Country to CountryList
			const ContactTypeList = transformItemList(data)
			dispatch(setContactTypeList(ContactTypeList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// export actions
export {
	getEmployeeList,
	addEmployee,
	editEmployee,
	deleteEmployee,
	getAreaList,
	getUserTypeList,
	getEmployeeSearchList,
	getCountryList,
    getEmployeeTypeList,
    getContactTypeList,
    getCabinCrewSearchList,
    getCockpitCrewSearchList
}
