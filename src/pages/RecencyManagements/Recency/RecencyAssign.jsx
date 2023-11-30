// import components
import RecencyAssignTableView from '../../../components/recencyManagements/RecencyAssign/RecencyAssignTableView'
import RecencyAssignForm from '../../../components/recencyManagements/RecencyAssign/RecencyAssignForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const RecencyAssign = () => <PageHeaderBlock Title={['Recency Assign List']} TableView={RecencyAssignTableView} AddEditForm={RecencyAssignForm} />

export default RecencyAssign