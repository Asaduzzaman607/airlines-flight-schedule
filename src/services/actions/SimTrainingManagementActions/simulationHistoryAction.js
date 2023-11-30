import axios from 'axios'

// import api config
import { SIM_TRAINING } from '../../../config'

// import actions
import {
	setIsLoading,
	setSimulationHistoryList,
	setSuccess,
	setPagination,
	setSelectedMonth
} from '../../reducers/SimTrainingManagementReducers/simulationHistoryReducer'
import { getErrorMsg, showAlert } from '../commonActions'
import { setSimPlanHistoryRowData, setSimPlanRowData } from '../../reducers/SimTrainingManagementReducers/simPlanReducer'

// transform SimulationHistory list
const transformItemList = (items) => {
	// check if SimulationHistory is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get SimulationHistory search list
const getSimulationHistorySearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get SimulationHistory
			const PARAMS = `?page=${searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
				}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			
			dispatch(setSelectedMonth(searchValue.selectedMonth))
			const body = {
				monthYear: searchValue.selectedMonth,
		   }
		   
			const { data } = await axios.post(
				SIM_TRAINING.GET_SIM_MONTH_HISTORY+ PARAMS,body			
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
			dispatch(setSimulationHistoryList(newList))

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

// add new SimulationHistory
const addSimulationHistory = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add SimulationHistory api call
			const { data } = await axios.post(SIM_TRAINING.GET_SIMULATION_HISTORY, params)

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

// add new SimulationHistory
const addEmployessToSim = (simId, payload) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add Country api call
			const { data } = await axios.post(SIM_TRAINING.ADD_EMPLOYEES_TO_SIM + simId, payload)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// get employee list of sim History
const getEmployeeOfSimHistory = (simid) => {
	return async (dispatch) => {
		// set isLoading to true while fetching employee list of sim
		dispatch(setIsLoading(true))

		try {
			// get Country list
			const { data } = await axios.get(
				SIM_TRAINING.GET_SIMULATION_HISTORY + simid
			)
			dispatch(setSuccess(false))
			// set employee list of sim
			dispatch(
				setSimPlanHistoryRowData([data])
			)

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

// update employee list of sim History
const updateEmployeeOfSimHistory = (simid, payload) => {
	return async (dispatch) => {
		// set isLoading to true while fetching employee list of sim
		dispatch(setIsLoading(true))

		try {
			// get Country list
			const { data } = await axios.put(
				SIM_TRAINING.ADD_EMPLOYEES_FROM_SIM_HISTORY + simid, payload
			)
			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
			dispatch(setSuccess(true))

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

// get employee list of sim
const getEmployeeListOfSim = (simid) => {
	return async (dispatch) => {
		// set isLoading to true while fetching employee list of sim
		dispatch(setIsLoading(true))

		try {
			// get Country list
			const { data } = await axios.get(
				SIM_TRAINING.GET_EMPLOYEE_LIST + simid
			)
			dispatch(setSuccess(false))
			// set employee list of sim
			dispatch(
				setSimPlanRowData(data?.employees)
			)

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

// edit SimulationHistory
const editSimulationHistoryList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit SimulationHistory api call
			const { data } = await axios.put(
				SIM_TRAINING.GET_SIMULATION_HISTORY + params.id,
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

// update SimulationHistory status
const deleteSimulationHistory = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const params = {
				statusId: 0,
			}
			// delete SimulationHistory api call
			const { data } = await axios.patch(SIM_TRAINING.GET_SIMULATION_HISTORY + id, null, {
				params,
			})

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getSimulationHistorySearchList(pageWithSize))
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
	addSimulationHistory,
	editSimulationHistoryList,
	deleteSimulationHistory,
	getSimulationHistorySearchList,
	addEmployessToSim,
	getEmployeeListOfSim,
	getEmployeeOfSimHistory,
	updateEmployeeOfSimHistory
}
