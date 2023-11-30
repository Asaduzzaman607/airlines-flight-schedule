// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import SimModuleForm from '../../../components/simTrainingManagements/Configurations/SimModule/SimModuleForm'
import SimModuleTableView from '../../../components/simTrainingManagements/Configurations/SimModule/SimModuleTableView'

const SimModule = () => ( <PageHeaderBlock Title={['SIM Module']} TableView={SimModuleTableView} AddEditForm={SimModuleForm} /> )

export default SimModule