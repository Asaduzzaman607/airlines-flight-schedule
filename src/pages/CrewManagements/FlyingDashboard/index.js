import { useSelector } from 'react-redux'

// import components
import { PageHeaderBlockWithDownload } from '../../../components/commonComponents'
import FlyingTimeDashboard from '../../../components/crewManagements/FlyingTimeDashboard'

// import actions and reduers
import { downloadFile } from '../../../services/actions/FlightManagementActions/journeyLogAction'
import { setIsLoadingDashboard } from '../../../services/reducers/CrewManagementReducers/flyingTimeReducer'

// IMPORT CONFIG
import { FLYINGTIME } from '../../../config'

const FlyingDashboard= () => {
    // get state values from redux
    const { flyingDashboardDataList } = useSelector(state => state.flyingTime)
    
    const PAYLOAD = {
        TableData: flyingDashboardDataList,
        API: FLYINGTIME.DOWNLOAD_FLYING_DASH,
        loadingAction: setIsLoadingDashboard
    }
    
    return (
        <PageHeaderBlockWithDownload 
            Component={FlyingTimeDashboard}
            title={"Flying Time Dashboard"}
            Action={downloadFile}
            PAYLOAD={PAYLOAD}
        />
    )
}

export default FlyingDashboard