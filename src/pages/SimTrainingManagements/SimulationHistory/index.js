// import components
import { PageHeaderOnlyTitle } from '../../../components/commonComponents'
import SimulationHistoryTableView from '../../../components/simTrainingManagements/SimTrainingHistory/SimulationHistoryTableView'

const SimulationHistory = () => (
    <PageHeaderOnlyTitle
        title="SIM Month History" 
        Component={SimulationHistoryTableView}
    />
)

export default SimulationHistory