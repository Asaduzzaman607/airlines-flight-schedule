import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../../commonComponents'
import { IconHandler } from '../../../commonComponents/CommonItems'

// import icons
import { BsFlagFill } from 'react-icons/bs'

// import redux actions
import { deleteCountry, getCountrySearchList } from '../../../../services/actions/CrewManagementActions/countryAction'

const CountryTableView = () => {
    // get country state values from redux
    const { isLoading, countryList, pagination } = useSelector(state => state.country)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Country Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Country Code',
            value: 'code'
        }
    ]

    const columns = [
        {
            title: 'Country Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={BsFlagFill}/>
        },
        {
            title: 'Country Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteCountry } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getCountrySearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getCountrySearchList}
                columns={columns}
                dataList={countryList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default CountryTableView