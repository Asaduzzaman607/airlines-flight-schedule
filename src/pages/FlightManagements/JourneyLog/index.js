import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import JourneyLogTableViewNew from '../../../components/flightManagements/JourneyLog/JourneyLogTableViewNew'
import { PageHeaderBlockWithDownload } from '../../../components/commonComponents'

// import actions and reduers
import { downloadFile } from '../../../services/actions/FlightManagementActions/journeyLogAction'
import { setIsLoading } from '../../../services/reducers/JourneyLog/journeyLogReducer'

// API Config
import { JOURNEYLOG } from '../../../config'

const JourneyLog = () => {
    const { JourneyLogList, search_date } = useSelector(state => state.journeyLog)

    const PAYLOAD = {
        TableData: JourneyLogList,
        fromDate: search_date?.fromDate ?? dayjs().format('YYYY-MM-DD'),
        toDate: search_date?.toDate ?? dayjs().format('YYYY-MM-DD'),
        from: "journey_log",
        API: JOURNEYLOG.DOWNLOAD_JOURNEY_LOG,
        loadingAction: setIsLoading
    }

    return (
        <PageHeaderBlockWithDownload
            Component={JourneyLogTableViewNew}
            title={"Journey Log"}
            Action={downloadFile}
            PAYLOAD={PAYLOAD}
        />
    )
}

export default JourneyLog