import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import components
import {
  SearchBlock,
  TableAction,
  ScrollTableBlock,
} from '../../commonComponents';
import { RenderApprovalStatus } from '../../commonComponents/RenderStatus';
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction';

// import page size
import { PAGE_SIZE } from '../../../config';

// import react icon
import { HiOutlineArrowRight } from 'react-icons/hi';

// import actions
import {
  deleteFlightSchedule,
  getFlightScheduleSearchList,
} from '../../../services/actions/FlightManagementActions/flightScheduleAction';

const TableView = () => {
  // get flight schedule state values from redux
  const { isLoading, flightScheduleList, pagination } = useSelector((state) => state.flightSchedule);
  const { aircraftTypeList } = useSelector((state) => state.aircrafttype);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch this action for aircraft list.
    dispatch(getAircraftTypeList(PAGE_SIZE));
  }, []);

  const items = {
    aircraftTypeName: aircraftTypeList,
  };

  const columns = [
    {
      title: 'Season Name',
      dataIndex: 'seasonName',
      key: 'seasonName',
      fixed: 'left',
      width: 230,
      render: (text) => (
        <span className={'text-blue-500'}>
          <div> {text?.length >= 1 && text?.[0]}</div>
          <div className={'flex items-center space-x-1'}>
            <span>{text?.length >= 2 && text?.[1]}</span>
            <HiOutlineArrowRight />
            <span>{text?.length >= 3 && text?.[2]}</span>
          </div>
        </span>
      ),
    },
    {
      title: 'Flight No',
      dataIndex: 'flightNo',
      key: 'flightNo',
      width: 140,
    },
    {
      title: 'Aircraft Type Name',
      dataIndex: 'aircraftTypeName',
      key: 'aircraftTypeName',
      width: 150,
    },
    {
      title: 'Flight Time',
      dataIndex: 'time',
      key: 'time',
      width: 140,
    },
    {
      title: 'Selected Days/Dates',
      dataIndex: 'selectedDays',
      key: 'selectedDays',
      width: 160,
      render: (text) => <span className={''}>{text?.join(', ')}</span>,
    },
    {
      title: 'Airport Pair Leg',
      dataIndex: 'airportPairLeg',
      key: 'airportPairLeg',
      width: 160,
    },
    {
      title: 'Flight Type',
      dataIndex: 'flightType',
      key: 'flightType',
      width: 120,
    },
    {
      title: 'Approval Status',
      dataIndex: 'approvalResponse',
      key: 'approvalResponse',
      width: 155,
      render: (item) => <RenderApprovalStatus text={item?.approvalStatus} />,
    },
    {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (record) => (
        <TableAction
          rowInfo={record}
          deleteAction={deleteFlightSchedule}
          pagination={pagination}
          getTableDataAction={getFlightScheduleSearchList}
        />
      ),
    },
  ];

  // column list for search
  const searchableColumnLists = [
    {
      id: 0,
      label: 'Season Name',
      value: 'seasonName',
    },
    {
      id: 1,
      label: 'Flight No',
      value: 'flightName',
    },
    {
      id: 2,
      label: 'Leg',
      value: 'leg',
    },
    {
      id: 3,
      label: 'Aircraft Type',
      value: 'aircraftTypeName',
    },
  ];

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock
        action={getFlightScheduleSearchList}
        searchableColumnLists={searchableColumnLists}
        items={items}
      />
      <ScrollTableBlock
        action={getFlightScheduleSearchList}
        columns={columns}
        dataList={flightScheduleList}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TableView;
