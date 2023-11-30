// import components
import RecencyTableView from '../../../components/recencyManagements/Recency/RecencyTableView'
import RecencyForm from '../../../components/recencyManagements/Recency/RecencyForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Recency = () => <PageHeaderBlock Title={['Recency List']} TableView={RecencyTableView} AddEditForm={RecencyForm} />

export default Recency