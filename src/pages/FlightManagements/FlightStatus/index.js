import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import FlightStatusTableView from '../../../components/flightManagements/FlightStatus/FlightStatusTableView'
import { PageHeaderBlockWithDownload } from '../../../components/commonComponents'

// import actions and reduers
import { downloadFile } from '../../../services/actions/FlightManagementActions/journeyLogAction'
import { setIsLoading } from '../../../services/reducers/FlightManagementReducers/flightStatusReducer'

// API Config
import { FLIGHTSTATUS } from '../../../config'

const FlightStatus = () => {
    const { FlightStatusList, search_date } = useSelector(state => state.flightStatus)
    const PAYLOAD = {
        TableData: FlightStatusList,
        fromDate: search_date?.fromDate ?? dayjs().format('YYYY-MM-DD'),
        toDate: search_date?.toDate ?? dayjs().format('YYYY-MM-DD'),
        from: "flight_status",
        API: FLIGHTSTATUS.DOWNLOAD_FLIGHT_STATUS,
        loadingAction: setIsLoading,
    }

    return (
        <PageHeaderBlockWithDownload
            Component={FlightStatusTableView}
            title={"Flight Status"}
            Action={downloadFile}
            PAYLOAD={PAYLOAD}
        />
    )
}

export default FlightStatus