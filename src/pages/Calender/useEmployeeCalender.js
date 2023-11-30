import {useCallback, useEffect, useMemo, useState} from "react";
import {Form} from "antd";
import API from "../../services/api";
import dayjs from "dayjs";
import {CABIN_CREW, CABIN_CREW_TYPES, COCKPIT_CREW, COCKPIT_CREW_TYPES, CREW_TYPES_MAP} from "./constants";
import {showAlert} from "../../services/actions/commonActions";
import useUserTypes from "./useUserTypes";

const cabinCrewTypes = [
    CABIN_CREW_TYPES.PURSER,
    CABIN_CREW_TYPES.JUNIOR_PURSER,
    CABIN_CREW_TYPES.GENERAL_CREW
]

const cockpitCrewTypes = [
    COCKPIT_CREW_TYPES.CAPTAIN,
    COCKPIT_CREW_TYPES.FIRST_OFFICER
]

export default function useEmployeeCalender() {
    const [isEdit, setIsEdit] = useState(false);
    const [flightList, setFlightList] = useState([]);
    const [flights, setFlights] = useState({});
    const [employees, setEmployees] = useState([]);
    const [dates, setDates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { userTypes } = useUserTypes();

    const [ modalForm ] = Form.useForm();
    const [ searchForm ] = Form.useForm();

    const date = Form.useWatch('date', modalForm);
    const crewType = Form.useWatch('crewType', searchForm);
    const dateRange = Form.useWatch('dateRange', searchForm);
    const aircraftTypeId = Form.useWatch('aircraftTypeId', modalForm);
    const searchDate = (dateRange && dateRange.length > 0) ? dateRange[0] : null;

    useEffect(() => {
        if (!isModalOpen) {
            modalForm.setFieldsValue({crewType: null})
        }
    }, [isModalOpen])

    const crewTypeOptions = useMemo(() => {
        if (String(crewType) === CABIN_CREW) {
            return cabinCrewTypes.map((type) => ({
                value: type,
                label: CREW_TYPES_MAP[type]
            }))
        }

        if (String(crewType) === COCKPIT_CREW) {
            return cockpitCrewTypes.map((type) => ({
                value: type,
                label: CREW_TYPES_MAP[type]
            }))
        }
    }, [crewType])


    const fetchFlightsForDate = async ({flightDate, employeeId, flightId, aircraftTypeId}) => {
        if (!flightDate || !employeeId || !aircraftTypeId) return;
        const res = await API.post('/daily-flight-plan/search', {
            flightDate,
            employeeId,
            aircraftTypeId
        })

        const list = res.data.model?.map(flight => ({label: flight.flightNo, value: flight.id}))
        setFlightList(list);
        modalForm?.setFieldsValue({flightId})
    }

    useEffect(() => {
        const data = modalForm.getFieldsValue(true);
        const {employeeId, flightId} = data;
        if (!date) return;

        (async () => {
            setFlightList([]);
            await fetchFlightsForDate({flightDate: date.format("YYYY-MM-DD"), employeeId, flightId, aircraftTypeId});
        })();

    }, [date, aircraftTypeId])

    const handleEdit = (date, flight, employee) => async (e) => {
        e.stopPropagation();
        setIsModalOpen(prev => true);
        const dayjsDate = dayjs(date, "YYYY-MM-DD");
        const { aircraftTypeId, crewType } = flight;

        await fetchFlightsForDate({flightDate: date, employeeId: employee.id, flightId: flight.id, aircraftTypeId});
        modalForm?.setFieldsValue({
            date: dayjsDate,
            flightId: flight.id,
            employeeId: employee.id,
            assignId: flight.assignId,
            newFlightId: flight.id,
            crewType,
            aircraftTypeId
        })
    }

    const types = useMemo(() => {
        if (String(crewType) === CABIN_CREW) {
            return cabinCrewTypes
        } else if (String(crewType) === COCKPIT_CREW) {
            return cockpitCrewTypes;
        }

        return [];
    }, [crewType]);

    const handleAddNew = (date, employee) => () => {
        const dayjsDate = dayjs(date, "YYYY-MM-DD");
        modalForm?.setFieldsValue({date: dayjsDate, flightId: null, employeeId: employee.id, newFlightId: null, aircraftTypeId: null})
        setIsModalOpen(true);
    }

    const convertFlightsToKeyValues = (flights) => {
        const res = {};
        flights?.forEach(flight => {
            for (const prop in flight) {
                res[prop] = flight[prop];
            }
        })

        return res;
    }

    const setSearchValues = useCallback((res) => {
        setDates([...res.data?.dates])
        setEmployees([...res.data?.employees])
        setFlights(convertFlightsToKeyValues([...res.data?.flights]))
    }, [])

    const fetchSearchData = useCallback(async () => {

        if (!crewType) return;

        if (!dateRange || dateRange.length < 2) return;

        try {
            setSubmitting(true);

            const res = await API.post('daily-flight-plan/dash/search', {
                fromDate: dateRange[0].format('YYYY-MM-DD'),
                toDate: dateRange[1].format('YYYY-MM-DD'),
                crewType: crewType
            });

            setSearchValues(res);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }

    }, [dateRange, crewType])

    useEffect(() => {
        (async () => {
            await fetchSearchData();
        })();
    }, [fetchSearchData])

    const submitFlightAssign = async () => {
        const values = modalForm.getFieldsValue(true);
        const {
            assignId: assignedCockpitCrewId,
            employeeId,
            newFlightId: dailyFlightPlanId,
            flightId,
            crewType: _role
        } = values;

        try {
            setSubmitting(true);

            if (String(crewType) === COCKPIT_CREW && !flightId) {
                await API.post('assign-cockpit-crew', {
                    dailyFlightPlanId,
                    employeeId,
                    cockpitCrewType: _role
                });
            } else if (String(crewType) === CABIN_CREW && !flightId) {
                await API.post('assigned-cabin-crew/assign-flight', {
                    employeeId,
                    dailyFlightPlanId,
                    cabinCrewType: _role
                })
            } else if (String(crewType) === COCKPIT_CREW) {
                await API.post('assign-cockpit-crew', {
                    assignedCockpitCrewId,
                    dailyFlightPlanId,
                    employeeId,
                    cockpitCrewType: _role
                });
            } else if (String(crewType) === CABIN_CREW) {
                await API.post('assigned-cabin-crew/assign-flight', {
                    employeeId,
                    dailyFlightPlanId,
                    previousFlightPlanId: flightId,
                    cabinCrewType: _role
                })
            }

            await fetchSearchData();
            setIsModalOpen(false);
            showAlert("success", "Success!")

        } catch (err) {
            showAlert("error", "Something went wrong!")
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return {
        isEdit,
        setIsEdit,
        flightList,
        setFlightList,
        modalForm,
        searchForm,
        flights,
        setFlights,
        employees,
        setEmployees,
        dates,
        setDates,
        isModalOpen,
        setIsModalOpen,
        submitting,
        setSubmitting,
        searchDate,
        crewType,
        handleEdit,
        types,
        handleAddNew,
        fetchSearchData,
        submitFlightAssign,
        onFinishFailed,
        userTypes,
        crewTypeOptions
    }
}