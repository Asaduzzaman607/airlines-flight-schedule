// import components
import CountryTableView from '../../../components/crewManagements/Location/Country/CountryTableView'
import CountryForm from '../../../components/crewManagements/Location/Country/CountryForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Country = () => ( <PageHeaderBlock Title={['Country']} TableView={CountryTableView} AddEditForm={CountryForm} /> )

export default Country