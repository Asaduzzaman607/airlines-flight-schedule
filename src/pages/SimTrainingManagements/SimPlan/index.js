// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import SimPlanForm from '../../../components/simTrainingManagements/SimPlanModule/SimPlanForm'
import SimPlanTableView from '../../../components/simTrainingManagements/SimPlanModule/SimPlanTableView'

const SimPlan = () => ( <PageHeaderBlock Title={['SIM Plan']} TableView={SimPlanTableView} AddEditForm={SimPlanForm} /> )

export default SimPlan