import { useSelector } from 'react-redux'

// import components
import { PageHeaderBlockWithDownload } from '../../../components/commonComponents'
import CrewsLeaveDashboard from '../../../components/crewManagements/CrewsLeaveDashboard'

// import actions and reduers
import { downloadFile } from '../../../services/actions/FlightManagementActions/journeyLogAction'
import { setIsLoadingDashboard } from '../../../services/reducers/CrewManagementReducers/flyingTimeReducer'

// IMPORT CONFIG
import { CREWS_LEAVE } from '../../../config'

const CrewsLeaveDashView= () => {
    // get state values from redux
    const { crewsLeaveDashDataList } = useSelector(state => state.crewsLeaveDash)
    
    const PAYLOAD = {
        TableData: null,
        API: CREWS_LEAVE.DOWNLOAD_CREWS_LEAVE_DASH,
        loadingAction: setIsLoadingDashboard
    }
    
    return (
        <PageHeaderBlockWithDownload 
            Component={CrewsLeaveDashboard}
            title={"Crews Leave Dashboard"}
            Action={downloadFile}
            PAYLOAD={PAYLOAD}
        />
    )
}

export default CrewsLeaveDashView