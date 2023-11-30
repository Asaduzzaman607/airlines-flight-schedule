import { useState, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'

// import actions
import { getOccFlights } from '../../services/actions/dashboardAction'

const useOccDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date).format('DD-MMM-YY'))
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOccFlights(_getParams()))
    }, [])

    // handle date on change
    const handleDateChange = useCallback((date, dateString) => {
        setSelectedDate(dateString)
    }, [])

    // handle on submit
    const handleSubmit = useCallback( () => {
        dispatch(getOccFlights(_getParams()))
    }, [selectedDate, dispatch])

    // create params for dispatch
    const _getParams = () => {
        return { fromDate: dayjs(selectedDate).format('YYYY-MM-DD')}
    }

    return {
        selectedDate, handleDateChange, handleSubmit
    }
}

export default useOccDashboard