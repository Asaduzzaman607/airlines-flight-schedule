import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents';
import { IconHandler } from '../../commonComponents/CommonItems';

// import icons
import { GiCommercialAirplane } from 'react-icons/gi';

// import actions
import {
  deleteAircraft,
  getAircraftSearchList,
} from '../../../services/actions/FlightManagementActions/aircraftAction';
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction';

// import page size
import { PAGE_SIZE } from '../../../config';

const TableView = () => {
  // get aircraft state values from redux
  const { isLoading, aircraftList, pagination } = useSelector((state) => state.aircraft);
  const { aircraftTypeList } = useSelector((state) => state.aircrafttype);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch this action for aircraft list.
    dispatch(getAircraftTypeList(PAGE_SIZE));
  }, []);

  const items = {
    aircraftTypeName: aircraftTypeList,
  };

  // column list for search
  const searchableColumnLists = [
    {
      id: 0,
      label: 'Aircraft Name',
      value: 'aircraftName',
    },
    {
      id: 1,
      label: 'Aircraft Type',
      value: 'aircraftTypeName',
    },
    {
      id: 2,
      label: 'Registration No',
      value: 'registrationNo',
    },
  ];

  const columns = [
    {
      title: 'Aircraft Name',
      dataIndex: 'name',
      key: 'name',
      render: (item) => <IconHandler item={item} ICON={GiCommercialAirplane} />,
    },
    {
      title: 'Aircraft Type',
      dataIndex: 'aircraftTypeName',
      key: 'aircraftTypeName',
    },
    {
      title: 'Registration No.',
      dataIndex: 'registrationNo',
      key: 'registrationNo',
    },
    {
      title: 'Manufacture Serial No.',
      dataIndex: 'manufactureSerialNo',
      key: 'manufactureSerialNo',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record) => (
        <TableAction
          rowInfo={record}
          deleteAction={deleteAircraft}
          pagination={pagination}
        />
      ),
    },
  ];

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock
        action={getAircraftSearchList}
        searchableColumnLists={searchableColumnLists}
        items={items}
      />
      <TableBlock
        action={getAircraftSearchList}
        columns={columns}
        dataList={aircraftList}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TableView;
