// BASE URL
const BASE_URL = process.env.REACT_APP_BASE_URL
// const BASE_URL = `http://192.168.145.161:8080`

// release version
const RELEASE_VERSION = process.env.REACT_APP_RELEASE_VERSION

// AUTH API CONFIG
const AUTH = {
	SIGN_IN: BASE_URL + '/api/auth/signin',
	TOKEN_VERIFY: BASE_URL + '/api/auth/check-token',
}

// COMMON API CONFIG
const COMMON = {
	// FOR USER
	GET_USER: BASE_URL + '/api/user/',
	GET_USER_SEARCH: BASE_URL + '/api/user/search/',
	GET_USER_TYPE: BASE_URL + '/api/user-type/',
	RESET_PASS_REQ: BASE_URL + '/api/auth/forget_pass/',
	CHANGE_PASSWORD: BASE_URL + '/api/auth/change-pass/',
	RESET_USER_PASS: BASE_URL + '/api/user/reset',

	// FLIGHT MANAGEMENT
	GET_AIRCRAFT_TYPE: BASE_URL + '/api/aircraft-type/',
	GET_AIRCRAFT_TYPE_SEARCH_LIST: BASE_URL + '/api/aircraft-type/search',
	GET_AIRCRAFT: BASE_URL + '/api/aircraft',
	GET_FLIGHTINFO: BASE_URL + '/api/daily-flight-plan/',
	GET_FLIGHT_LOCATION: BASE_URL + '/api/flight-location/',
	GET_FLIGHT_GROUP: BASE_URL + '/api/flight-group/',
	GET_AIRPORT: BASE_URL + '/api/airport/',
	GET_AIRPORT_PAIR: BASE_URL + '/api/airport-pair/',
	GET_FLIGHT_SEASON: BASE_URL + '/api/flight-season/',
	GET_FLIGHT_SCHEDULE: BASE_URL + '/api/flight-schedule/',
	GET_FILTERED_SCHEDULE: BASE_URL + '/api/flight-schedule/get-schedule/',

	// ROLE MANAGEMENT
	GET_ROLE: BASE_URL + '/api/role/',
	DELETE_ROLE: BASE_URL + '/api/role/delete/',
	GET_USER_LIST_FOR_ROLE: BASE_URL + '/api/user/all',
	GET_ASSIGNED_ROLE_LIST: BASE_URL + '/api/user-permissions/search',
	ADD_ASSIGNED_ROLE: BASE_URL + '/api/user-permissions/',
	GET_ROLE_BASED_USER: BASE_URL + '/api/user-permissions/v2/search/',
	GET_APPROVAL_MENU_PAIR: BASE_URL + '/api/approval-pair/v1/',

	// RECENCY MANAGEMENT
	GET_RECENCY: BASE_URL + '/api/crew-recency/',
	GET_RECENCY_ASSIGN: BASE_URL + '/api/crew-recency-assignment/',
	GET_RECENCY_DASHBOARD: BASE_URL + '/api/recency-dashboard/',
	GET_EMPLOYEE_BY_AIRCRAFTTYPE: BASE_URL + '/api/employee/aircraft-type/',
	GET_CREW_RECENCY: BASE_URL + '/api/crew-recency/get-recency',
	GET_CREW_RECENCY_VALIDITY: BASE_URL + '/api/crew-recency/validity',

	// MODULE AND PERMISSION
	GET_ALL_MODULE: BASE_URL + '/api/user-module/all-module',
	GET_MODULE_BY_ID: BASE_URL + '/api/user-menu-permission/getAll/',
	ADD_MENU: BASE_URL + '/api/user-menu-permission/',
	GET_MENU_LIST: BASE_URL + '/api/menu/v1/approval/',

	// FOR EMPLOYEE MODULE
	GET_EMPLOYEE: BASE_URL + '/api/employee/',

	// CREW MANAGEMENT
	GET_FLIGHT_LIST_FOR_CREW_ASSIGN: BASE_URL + '/api/daily-flight-plan/v2/search/',
	GET_EMPLOYEE_LIST_FOR_CABIN_CREW: BASE_URL + '/api/assigned-cabin-crew/find-cabin-crew/',
	ADD_CABIN_CREW: BASE_URL + '/api/assigned-cabin-crew/',
	GET_ASSIGN_CABIN_CREW: BASE_URL + '/api/assigned-cabin-crew/search/',
	GET_AIRCRAFT_TYPE_CABIN_CREW: BASE_URL + '/api/aircraft-type/user-type/',
	GET_COCKPIT_CREW_LIST: BASE_URL + '/api/assign-cockpit-crew/available-cockpit-crew-List/',
	ADD_COCKPIT_CREW: BASE_URL + '/api/assign-cockpit-crew/create-list/',
	GET_FLYING_TIME: BASE_URL + '/api/flyingtime/',
	GET_COUNTRY: BASE_URL + '/api/country/',
	GET_AREA: BASE_URL + '/api/area/',
	GET_EMPLOYEE_LEAVE_LIST: BASE_URL + '/api/employee-leave/',
	ASSIGN_STAND_BY_CABIN_CREW: BASE_URL + '/api/stand-by-cabin-crew/validate-assign',
	ASSIGN_STAND_BY_COCKPIT_CREW: BASE_URL + '/api/stand-by-cockpit-crew/validate-assign',
	DOWNLOAD_FLYING_DASH: BASE_URL + '/api/dash/flying-time/xl',
	DOWNLOAD_CREWS_LEAVE_DASH: BASE_URL + '',
	CREWS_LEAVE_DASH: BASE_URL + '/api/employee-leave/summary',
	GET_EMPLOYEE_LIST_FOR_LEAVE: BASE_URL + '/api/employee/employee-leave',

	// VCC MANAMEMENT
	GET_DRIVER_LIST: BASE_URL + '/api/driver/',
	GET_VEHICLE_LIST: BASE_URL + '/api/vehicle/',
	GET_ROUTE_LIST: BASE_URL + '/api/route/',
	GET_RECEIVE_ASSIGN: BASE_URL + '/api/receive-assignment',
	GET_RECEIVE_ASSIGN_LIST: BASE_URL + '/api/receive-assignment/dashboard',
	GET_DROP_ASSIGN_LIST: BASE_URL + '/api/drop-assignment/dashboard',
	GET_DROP_ASSIGN: BASE_URL + '/api/drop-assignment',
	GET_TYPE: BASE_URL + '/api/vehicle/type',

	// JOURNEY LOG
	SAVE_JOURNEY_LOG: BASE_URL + '/api/journey-log',
	JOURNEY_LOG: BASE_URL + '/api/dash/journey-log',

	// FLIGHT AND EMPLOYEE DASHBOARD
	DASHBOARD: BASE_URL + '/api/dash',
	FLIGHT_STATUS: BASE_URL + '/api/dash/flight-status',
	ASSIGN_COCKPIT_CREW: BASE_URL + '/api/assign-cockpit-crew',

	// SIM TRAINING MANAGEMENT
	GET_CITY: BASE_URL + '/api/city/',
	GET_SIM_MODULE: BASE_URL + '/api/simmodule/',
	GET_TRAINER: BASE_URL + '/api/trainer/',
	GET_TRAINING_CENTER: BASE_URL + '/api/trainingcenter/',
	ADD_TRAINING_CENTER: BASE_URL + '/api/trainingcenter/',
	GET_SIMULATION_HISTORY: BASE_URL + '/api/simulation/',
	GET_SIM_PLAN: BASE_URL + '/api/simplan/',
	GET_APPROVAL_HISTORY: BASE_URL + '/api/approval-history',

	// LICENCE
	ADD_LICENCE: BASE_URL + '/api/license/',

	// VALIDATION
	ADD_VALIDATION: BASE_URL + '/api/licensevalidation/',
	GET_NINETY_DAYS_VALIDITY: BASE_URL + '/api/simplan/get90DaysValidity/',

	// CAAB
	ADD_CAAB: BASE_URL + '/api/caabcorresponding/',
	GET_LAST_PPC: BASE_URL + '/api/simplan/getLastPpc/',
	GET_STATUS: BASE_URL + '/api/caabcorresponding/active/',

	//SIM_DASHBOARD
	GET_SIM_DASHBOARD_DATA: BASE_URL + '/api/simplan/year-wise-dashboard',

	// EMPLOYEE GROUP
	GET_EMPLOYEE_GROUP: BASE_URL + '/api/simgroup/',

	// Leave Config
	GET_LEAVE_CONFIG: BASE_URL + '/api/leave-config/',
	// Leave Type
	GET_LEAVE_TYPE: BASE_URL + '/api/leave-type/',

	// EMPLOYEE DETAILS
	FLYING_DASH_DETAILS_API: BASE_URL + '/api/flyingtime/search',
	FLYING_DASH_DETAILS_MODAL_API: BASE_URL + '/api/flyingtime/v1/search',
}

// MAP COMMON API CONIG
const API_MAP_CONFIG = {
	'/user-management/user-type': COMMON.GET_USER_TYPE,
	'/user-management/user': COMMON.GET_USER,
	'/role-management/roles': COMMON.GET_ROLE,
	'/configurations/aircraft-type': COMMON.GET_AIRCRAFT_TYPE,
	'/configurations/aircraft': COMMON.GET_AIRCRAFT,
	'/configurations/airport': COMMON.GET_AIRPORT,
	'/configurations/routes': COMMON.GET_AIRPORT_PAIR,
	'/configurations/employee-group': COMMON.GET_EMPLOYEE_GROUP,
	'/configurations/sim-module': COMMON.GET_SIM_MODULE,
	'/configurations/training-center': COMMON.GET_TRAINING_CENTER,
	'/configurations/trainer': COMMON.GET_TRAINER,
	'/flight-management/flight-info': COMMON.GET_FLIGHTINFO,
	'/flight-management/schedule': COMMON.GET_FLIGHT_SCHEDULE,
	'/flight-management/seasons': COMMON.GET_FLIGHT_SEASON,
	'/flight-management/journey-log': COMMON.JOURNEY_LOG,
	'/crew-management/rated-crews': COMMON.GET_EMPLOYEE,
	'/crew-management/flying-time': COMMON.GET_FLYING_TIME,
	'/crew-management/crew-leaves': COMMON.GET_EMPLOYEE_LEAVE_LIST,
	'/crew-recency/recency': COMMON.GET_RECENCY,
	'/crew-recency/assign': COMMON.GET_RECENCY_ASSIGN,
	'/crew-recency/dashboard': COMMON.GET_RECENCY_DASHBOARD,
	'/simulation-training/plan': COMMON.GET_SIM_PLAN,
	'/simulation-training/history': COMMON.GET_SIMULATION_HISTORY,
	'/simulation-training/dashboard': COMMON.GET_SIM_DASHBOARD_DATA,
}

// USER API CONFIG
const USER = {
	GET_USER_LIST: COMMON.GET_USER,
	GET_USER_SEARCH: COMMON.GET_USER_SEARCH,
	ADD_USER: COMMON.GET_USER,
	RESET_PASS_REQ: COMMON.RESET_PASS_REQ,
	CHANGE_PASSWORD: COMMON.CHANGE_PASSWORD,
	RESET_USER_PASS: COMMON.RESET_USER_PASS,
}

// USER TYPE API CONFIG
const USER_TYPE = {
	GET_USER_TYPE: COMMON.GET_USER_TYPE,
}

// ROLE API CONFIG
const ROLE = {
	GET_ROLE: COMMON.GET_ROLE,
	ADD_ROLE: COMMON.GET_ROLE,
	DELETE_ROLE: COMMON.DELETE_ROLE,
	GET_ROLE_BASED_USER: COMMON.GET_ROLE_BASED_USER,
	GET_APPROVAL_MENU_PAIR: COMMON.GET_APPROVAL_MENU_PAIR,
}

// ROLE ASIGN API CONFIG
const ROLE_ASIGN = {
	GET_USER_LIST: COMMON.GET_USER_LIST_FOR_ROLE,
	GET_ASSIGNED_ROLE: COMMON.GET_ASSIGNED_ROLE_LIST,
	ADD_ROLE_ASIGN: COMMON.ADD_ASSIGNED_ROLE,
}

// AIRCRAFT API CONFIG
const AIRCRAFT = {
	GET_AIRCRAFT_LIST: COMMON.GET_AIRCRAFT,
	ADD_AIRCRAFT: COMMON.GET_AIRCRAFT,
}

// AIRCRAFT TYPE API CONFIG
const AIRCRAFT_TYPE = {
	GET_AIRCRAFT_TYPE_LIST: COMMON.GET_AIRCRAFT_TYPE,
	GET_AIRCRAFT_TYPE_SEARCH: COMMON.GET_AIRCRAFT_TYPE_SEARCH_LIST,
	ADD_AIRCRAFT_TYPE: COMMON.GET_AIRCRAFT_TYPE,
}

// FLIGHT GROUP API CONFIG
const FLIGHTGROUP = {
	GET_FLIGHTGROUP_LIST: COMMON.GET_FLIGHT_GROUP,
	ADD_FLIGHTGROUP: COMMON.GET_FLIGHT_GROUP,
}

// FLIGHT LOCATION API CONFIG
const FLIGHTLOCATION = {
	GET_FLIGHTLOCATION_LIST: COMMON.GET_FLIGHT_LOCATION,
	ADD_FLIGHTLOCATION: COMMON.GET_FLIGHT_LOCATION,
}

// FLIGHT INFO API CONFIG
const FLIGHTINFO = {
	GET_FLIGHTINFO_LIST: COMMON.GET_FLIGHTINFO,
	ADD_FLIGHTINFO: COMMON.GET_FLIGHTINFO,
	DAILY_FLIGHTS: COMMON.GET_FLIGHTINFO + 'flights',
	ASSIGNED_FLIGHTS: COMMON.GET_FLIGHTINFO + 'assigned-flights',
	GET_AIRCRAFT_TYPE: COMMON.GET_AIRCRAFT_TYPE,
	GET_AIRCRAFT_LIST: COMMON.GET_AIRCRAFT + '/',
	ASSIGN_DAILY_FLIGHTS: COMMON.GET_FLIGHTINFO + 'assign',
	GET_ASSIGNED_FLIGHTS: COMMON.GET_FLIGHTINFO + 'assigned-flights',
}

// FLIGHT INFO API CONFIG
const FLIGHT_SCHEDULE = {
	GET_FLIGHT_SCHEDULE_LIST: COMMON.GET_FLIGHT_SCHEDULE,
	ADD_FLIGHT_SCHEDULE: COMMON.GET_FLIGHT_SCHEDULE,
	GET_FILTERED_SCHEDULE: COMMON.GET_FILTERED_SCHEDULE,
	GET_AIRCRAFT_TYPE: COMMON.GET_AIRCRAFT_TYPE,
	GET_AIRCRAFT_LIST: COMMON.GET_AIRPORT_PAIR + 'search',
	GET_FLIGHT_SEASON_LIST: COMMON.GET_FLIGHT_SEASON,
	ADD_MULTI_FLIGHT_SCHEDULE: COMMON.GET_FLIGHT_SCHEDULE + 'v2',
	UPDATE_MULTI_FLIGHT_SCHEDULE: COMMON.GET_FLIGHT_SCHEDULE + 'v2',
	GET_FLIGHT_DETAILS: COMMON.GET_FLIGHT_SCHEDULE + 'v2/flight-details',
}

// FLIGHT INFO API CONFIG
const FLIGHTSEASON = {
	GET_FLIGHT_SEASON_LIST: COMMON.GET_FLIGHT_SEASON,
	ADD_FLIGHT_SEASON: COMMON.GET_FLIGHT_SEASON,
	GET_FLIGHT_SEASON: COMMON.GET_FLIGHT_SEASON + 'search',
}

// AIRPORT API CONFIG
const AIRPORT = {
	GET_AIRPORT_LIST: COMMON.GET_AIRPORT,
	ADD_AIRPORT: COMMON.GET_AIRPORT,
}

// AIRPORT PAIR API CONFIG
const AIRPORT_PAIR = {
	GET_AIRPORT_PAIR_LIST: COMMON.GET_AIRPORT_PAIR,
	ADD_AIRPORT_PAIR: COMMON.GET_AIRPORT_PAIR,
}

// RECENCY API CONFIG
const RECENCY = {
	GET_RECENCY_LIST: COMMON.GET_RECENCY,
	ADD_RECENCY: COMMON.GET_RECENCY,
	RECENCY_ASSIGNMENT: COMMON.GET_RECENCY_ASSIGN,
	RECENCY_DASHBOARD: COMMON.GET_RECENCY_DASHBOARD,
	GET_EMPLOYEE_BY_AIRCRAFTTYPE: COMMON.GET_EMPLOYEE_BY_AIRCRAFTTYPE,
	GET_CREW_RECENCY: COMMON.GET_CREW_RECENCY,
	GET_CREW_RECENCY_VALIDITY: COMMON.GET_CREW_RECENCY_VALIDITY,
}

// MENU API CONFIG
const MENU = {
	GET_MODULE: COMMON.GET_ALL_MODULE,
	GET_MODULE_BY_ID: COMMON.GET_MODULE_BY_ID,
	ADD_MODULE: COMMON.ADD_MENU,
	GET_MENU_LIST: COMMON.GET_MENU_LIST,
}

// EMPLOYEE AND EMPLOYEE LEAVE API CONFIG
const EMPLOYEE = {
	GET_EMPLOYEE_LIST: COMMON.GET_EMPLOYEE,
	GET_EMPLOYEE_LEAVE_LIST: COMMON.GET_EMPLOYEE_LEAVE_LIST,
	GET_LEAVE_LIST: BASE_URL + '/api/leave-type',
	SEARCH_EMPLOYEE: COMMON.GET_EMPLOYEE + 'search',
	GET_EMPLOYEE_LIST_FOR_LEAVE: COMMON.GET_EMPLOYEE_LIST_FOR_LEAVE,
}

// FLYINGTIME API CONFIG
const FLYINGTIME = {
	GET_FLYINGTIME: COMMON.GET_FLYING_TIME,
	GET_FLYINGTIME_DASHBOARD: COMMON.GET_FLYING_TIME + 'employees-flying-time/search',
	DOWNLOAD_FLYING_DASH: COMMON.DOWNLOAD_FLYING_DASH,
}

// FLYINGTIME API CONFIG
const CREWS_LEAVE = {
	GET_CREWS_LEAVE_DASH: COMMON.CREWS_LEAVE_DASH,
	DOWNLOAD_CREWS_LEAVE_DASH: COMMON.DOWNLOAD_CREWS_LEAVE_DASH,
}

// ALL LOCATION API CONFIG
const LOCATION = {
	GET_COUNTRY: COMMON.GET_COUNTRY,
	GET_AREA: COMMON.GET_AREA,
	GET_CITY: COMMON.GET_CITY,
}

// CREW_ASSIGN API CONFIG
const CREW_ASSIGN = {
	GET_FLIGHT_FOR_CREW: COMMON.GET_FLIGHT_LIST_FOR_CREW_ASSIGN,
	GET_EMPLOYEE_FOR_CABIN_CREW: COMMON.GET_EMPLOYEE_LIST_FOR_CABIN_CREW,
	ADD_CABIN_CREW: COMMON.ADD_CABIN_CREW,
	GET_ASSIGN_CABIN_CREW: COMMON.GET_ASSIGN_CABIN_CREW,
	GET_AIRCRAFT_TYPE_CABIN_CREW: COMMON.GET_AIRCRAFT_TYPE_CABIN_CREW,
	GET_COCKPIT_CREW_ASSIGN_LIST: COMMON.GET_COCKPIT_CREW_LIST,
	ADD_COCKPIT_CREW: COMMON.ADD_COCKPIT_CREW,
}

// VCC API CONFIG
const VCC = {
	GET_DRIVER_LIST: COMMON.GET_DRIVER_LIST,
	GET_VEHICLE_LIST: COMMON.GET_VEHICLE_LIST,
	GET_ROUTE_LIST: COMMON.GET_ROUTE_LIST,
	GET_RECEIVE_ASSIGN_LIST: COMMON.GET_RECEIVE_ASSIGN_LIST,
	GET_RECEIVE_ASSIGN: COMMON.GET_RECEIVE_ASSIGN,
	GET_DROP_ASSIGN: COMMON.GET_DROP_ASSIGN,
	GET_DROP_ASSIGN_LIST: COMMON.GET_DROP_ASSIGN_LIST,
	GET_TYPE: COMMON.GET_TYPE,
}

// DASHBOARD API CONFIG
const DASHBOARD = {
	GET_EMPLOYEE_WITH_FLIGHTS: COMMON.DASHBOARD,
	GET_OCC_FLIGHTS: COMMON.DASHBOARD + '/occ',
	DOWNLOAD_OCC_DAILY_PLAN: COMMON.DASHBOARD + '/occ/doc',
	GET_FLIGHT_ROLE_LIST: COMMON.ASSIGN_COCKPIT_CREW + '/flight-sorted-list/',
	SAVE_FLIGHT_TO_EMPLOYEE_DASH: COMMON.ASSIGN_COCKPIT_CREW + '/create-list',
	VALIDATE_ASSIGN_CREW: COMMON.ASSIGN_COCKPIT_CREW + '/validate-assigning/',
	ASSIGN_COCKPIT_CREW: COMMON.ASSIGN_COCKPIT_CREW,
	GET_CABIN_CREW_FLIGHTS: BASE_URL + '/api/cabin_crew_dashboard',
	GET_ASSIGNED_CABIN_CREW: BASE_URL + '/api/assigned-cabin-crew/flight-sorted-list/',
	SAVE_ASSIGNED_CABIN_CREW: BASE_URL + '/api/assigned-cabin-crew/assign-flights',
	ASSIGN_STAND_BY_CABIN_CREW: COMMON.ASSIGN_STAND_BY_CABIN_CREW,
	ASSIGN_STAND_BY_COCKPIT_CREW: COMMON.ASSIGN_STAND_BY_COCKPIT_CREW,
}

// JOURNEYLOG API CONFIG
const JOURNEYLOG = {
	GET_JOURNEY_LOG: COMMON.JOURNEY_LOG,
	SAVE_JOURNEY_LOG: COMMON.SAVE_JOURNEY_LOG,
	DOWNLOAD_JOURNEY_LOG: COMMON.JOURNEY_LOG + '/xl',
}

// FLIGHT STATUS API CONFIG
const FLIGHTSTATUS = {
	GET_FLIGHT_STATUS: COMMON.FLIGHT_STATUS,
	SAVE_FLIGHT_STATUS: COMMON.SAVE_JOURNEY_LOG,
	DOWNLOAD_FLIGHT_STATUS: COMMON.FLIGHT_STATUS + '/xl',
}

// SIM TRAINING API CONFIG
const SIM_TRAINING = {
	GET_CITY: COMMON.GET_CITY,
	GET_CITY_BY_COUNTRY: COMMON.GET_CITY + 'find-by-country',
	GET_SIM_MODULE: COMMON.GET_SIM_MODULE,
	GET_TRAINER: COMMON.GET_TRAINER,
	GET_TRAINING_CENTER: COMMON.GET_TRAINING_CENTER,
	ADD_TRAINING_CENTER: COMMON.ADD_TRAINING_CENTER,
	GET_SIMULATION_HISTORY: COMMON.GET_SIMULATION_HISTORY,
	GET_SIM_PLAN: COMMON.GET_SIM_PLAN,
	SIM_PLAN_ARROVED: COMMON.GET_SIM_PLAN + 'approved',
	SIM_PLAN_REJECTED: COMMON.GET_SIM_PLAN + 'rejected',
	SIM_PLAN_REVIEW: COMMON.GET_SIM_PLAN + 'review',
	SIM_PLAN_REVIEW_REQUEST: COMMON.GET_SIM_PLAN + 'review-request',
	CANCEL_FLIGHT_ITEM: BASE_URL + '/api/daily-flight-plan/cancel',
	GET_APPROVAL_HISTORY: COMMON.GET_APPROVAL_HISTORY,
	GET_EMPLOYEE_GROUP: COMMON.GET_EMPLOYEE_GROUP,
	GET_EMPLOYEE_GROUP_BYAIRCRAFT_TYPE: COMMON.GET_EMPLOYEE_GROUP + 'aircraft-type/',
	GET_EMPLOYEE_BY_EMPLOYEE_GROUP: COMMON.GET_SIM_PLAN + 'eligible-crew-sim',
	GET_EMPLOYEE_LIST: BASE_URL + '/api/simplan/employee-sim/',
	ADD_EMPLOYEES_TO_SIM: BASE_URL + '/api/simulation/create-list-sim/',
	ADD_EMPLOYEES_FROM_SIM_HISTORY: BASE_URL + '/api/simulation/',
	GET_TRAINER_BY_TRAINING_CENTER: BASE_URL + '/api/trainer/find-by-trainingcenter/',
	GET_SIM_MONTH_HISTORY: BASE_URL + '/api/simplan/month-group',
}

// LICENCE API CONFIG
const LICENCE = {
	ADD_LICENCE: COMMON.ADD_LICENCE,
	GET_LICENCE_LIST: COMMON.GET_LICENCE_LIST,

	ADD_LICENCE_VALIDATION: COMMON.ADD_VALIDATION,

	ADD_CAAB: COMMON.ADD_CAAB,

	STATUS: COMMON.STATUS,
	GET_STATUS: COMMON.GET_STATUS,
	GET_LAST_PPC: COMMON.GET_LAST_PPC,
	GET_NINETY_DAYS_VALIDITY: COMMON.GET_NINETY_DAYS_VALIDITY,
}

const SIM_DASHBOARD = {
	GET_SIM_DASHBOARD_DATA: COMMON.GET_SIM_DASHBOARD_DATA,
}

const LEAVE_CONFIG = {
	GET_LEAVE_CONFIG: COMMON.GET_LEAVE_CONFIG,
}
const LEAVE_TYPE = {
	GET_LEAVE_TYPE: COMMON.GET_LEAVE_TYPE,
}

const NOTIFICATION_ENDPOINT = BASE_URL + '/notifications/from-pilot'

// DETAILS DASHBOARD
const DETAILS_DASHBOARD = {
	GET_FLYING_DASH_DETAILS: COMMON.FLYING_DASH_DETAILS_API,
	GET_FLYING_DASH_MODAL_DETAILS: COMMON.FLYING_DASH_DETAILS_MODAL_API,
}

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm'
const YEAR_FORMAT = 'MMMM YYYY'

const PAGE_SIZE = {
	page: 0,
	pageSize: 500,
}
// export API configs
export {
	AIRCRAFT,
	AIRCRAFT_TYPE,
	AIRPORT,
	AIRPORT_PAIR,
	API_MAP_CONFIG,
	AUTH,
	BASE_URL,
	CREW_ASSIGN,
	DASHBOARD,
	DATE_FORMAT,
	YEAR_FORMAT,
	EMPLOYEE,
	FLIGHTGROUP,
	FLIGHTINFO,
	FLIGHTLOCATION,
	FLIGHTSEASON,
	FLIGHTSTATUS,
	FLIGHT_SCHEDULE,
	FLYINGTIME,
	JOURNEYLOG,
	LEAVE_CONFIG,
	LEAVE_TYPE,
	LICENCE,
	LOCATION,
	MENU,
	NOTIFICATION_ENDPOINT,
	RECENCY,
	RELEASE_VERSION,
	ROLE,
	ROLE_ASIGN,
	SIM_DASHBOARD,
	SIM_TRAINING,
	TIME_FORMAT,
	USER,
	USER_TYPE,
	VCC,
	PAGE_SIZE,
	CREWS_LEAVE,
	DETAILS_DASHBOARD,
}
