// import reducers
import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import notificationReducer from './notificationReducer'
import {
	areaReducer,
	countryReducer,
	employeeReducer,
	employeeLeaveReducer,
	flyingTimeReducer,
	crewAssignReducer,
    cabinCrewListReducer,
    crewsLeaveDashReducer
} from './CrewManagementReducers'
import {
	recencyAssignReducer,
	recencyDashboardReducer,
	recencyReducer,
} from './RecencyManagementReducers'
import {
	driverReducer,
	dropAssignReducer,
	receiveAssignReducer,
	routeReducer,
	vehicleReducer,
} from './VehicleManagementReducers'
import { userReducer, userTypeReducer } from './UserManagementReduers'
import { roleReducer, approvalConfigReducer } from './RoleManagementReducers'
import {
	flightGroupReducer,
	flightInfoReducer,
	flightLocationReducer,
	flightScheduleReducer,
	flightSeasonReducer,
	aircraftReducer,
	aircraftTypeReducer,
	airportPairReducer,
	airportReducer,
	flightStatusReducer,
	leaveTypeReducer,
	leaveConfigReducer
} from './FlightManagementReducers'
import { journeyLogReducer } from './JourneyLog'
import {
	cityReducer,
	simModuleReducer,
	trainerReducer,
	trainingCenterReducer,
	simulationHistoryReducer,
	licenceReducer,
	simPlanReducer,
	validationReducer,
	caabReducer,
	simDashboardReducer,
	employeeGroupReducer,
} from './SimTrainingManagementReducers'
import aircraftAssignReducer from './aircraftAssignReducer'
import cabinCrewDashboardReducer from './cabinCrewDashboardReducer'

// export reducers
export {
	authReducer,
	userReducer,
	aircraftReducer,
	aircraftTypeReducer,
	flightGroupReducer,
	flightLocationReducer,
	flightInfoReducer,
	airportReducer,
	roleReducer,
	recencyReducer,
	recencyAssignReducer,
	employeeReducer,
	crewAssignReducer,
	driverReducer,
	vehicleReducer,
	routeReducer,
	receiveAssignReducer,
	dropAssignReducer,
	airportPairReducer,
	dashboardReducer,
	flyingTimeReducer,
	flightSeasonReducer,
	flightScheduleReducer,
	recencyDashboardReducer,
	countryReducer,
	areaReducer,
	employeeLeaveReducer,
	userTypeReducer,
	aircraftAssignReducer,
	journeyLogReducer,
	flightStatusReducer,
	cityReducer,
	simModuleReducer,
	trainerReducer,
	trainingCenterReducer,
	simulationHistoryReducer,
	licenceReducer,
	simPlanReducer,
	validationReducer,
	caabReducer,
	simDashboardReducer,
	approvalConfigReducer,
	employeeGroupReducer,
	cabinCrewDashboardReducer,
	leaveTypeReducer,
	leaveConfigReducer,
    cabinCrewListReducer,
    notificationReducer,
    crewsLeaveDashReducer
}
