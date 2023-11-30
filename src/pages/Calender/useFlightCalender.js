import {useCallback, useEffect, useState} from "react";
import {Form} from "antd";
import API from "../../services/api";

const convertFlightsToKeyValues = (data) => {
    const res = {};
    data?.forEach(obj => {
        for (const prop in obj) {
            res[prop] = obj[prop];
        }
    })

    return res;
}

export default function useFlightCalender() {
    const [flights, setFlights] = useState([]);
    const [employees, setEmployees] = useState({});
    const [dates, setDates] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [searchForm] = Form.useForm();
    const dateRange = Form.useWatch('dateRange', searchForm);
    const searchDate = (dateRange && dateRange.length > 0) ? dateRange[0] : null;

    const setSearchValues = useCallback((data) => {
        setDates([...data?.dates])
        const employees = convertFlightsToKeyValues([...data?.employees]);
        setEmployees(employees);
        setFlights([...data.flights])
    }, [])

    const fetchFlightsData = useCallback(async () => {
        // if (!searchDate) return;

        if (!dateRange || dateRange.length < 2) return;

        try {
            const res = await API.post('daily-flight-plan/v2/dash/search', {
                fromDate: dateRange[0].format('YYYY-MM-DD'),
                toDate: dateRange[1].format('YYYY-MM-DD'),
            })

            setSearchValues(res.data);

        } catch (err) {
            console.error(err)
        }

    }, [dateRange])

    useEffect(() => {
        (async () => {
            await fetchFlightsData();
        })();
    }, [fetchFlightsData])

    return {
        flights, employees, dates, searchDate, searchForm, submitting
    }
}