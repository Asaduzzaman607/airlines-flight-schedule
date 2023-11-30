import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import dayjs from 'dayjs'

// import components
import {
  SingleItemView,
  CustomDatePicker,
  ScrollTableBlock,
  ValueTag
} from '../../commonComponents';
import { Button, Form, Tag } from 'antd';

// import react icon
import { HiOutlineArrowRight } from 'react-icons/hi';

// import redux actions
import { getSimulationHistorySearchList } from '../../../services/actions/SimTrainingManagementActions/simulationHistoryAction';
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// licence api config
import { YEAR_FORMAT } from '../../../config'

const SimulationHistoryTableView = () => {
  // get SimModule state values from redux
  const { isLoading, simulationHistoryList, pagination, selectedMonth} = useSelector((state) => state.simulationHistory);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const defaultMonth=dayjs(selectedMonth,YEAR_FORMAT)

  useEffect(() => {
    dispatch(
      getSimulationHistorySearchList({
        monthYear: 'January 2023',
        selectedMonth: 'January 2023',
      })
    );
  }, []);

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <SingleItemView item={text} />,
    },
    {
      title: 'LPC',
      dataIndex: 'lastLpc',
      key: 'lastLpc',
      render:  (lastLpc) => lastLpc?.lpcDate ?? "N/A",
    },
    {
      title: 'LPC Validity',
      dataIndex: 'lastLpc',
      key: 'lastLpc',
      render: (lastLpc) => lastLpc?.lpcValidity ?? "N/A",
    },
    {
      title: 'OPC',
      dataIndex: 'lastOpc',
      key: 'lastOpc',
      render: (lastOpc) => lastOpc?.opcDate ?? "N/A",
    }
  ];

  const _selectMonthTypeHandler = (values) => {
    const _fetchData = async () => {
      try {
        dispatch(
          getSimulationHistorySearchList({
            monthYear: values?.selectedMonth && values.selectedMonth.format(YEAR_FORMAT),
            selectedMonth:
              values?.selectedMonth && values.selectedMonth.format(YEAR_FORMAT),
          })
        );
      } catch (error) {
          console.error(error);
          const errMsg = getErrorMsg(error)
          // show error msg
          showAlert('error', errMsg)
      }
  }

  if (values) {
      _fetchData()
  }
 
  };

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <Form
        form={form}
        name="horizontal_login"
        layout="inline"
        onFinish={_selectMonthTypeHandler}
        className={'mb-4'}
      >
        <Form.Item
          name="selectedMonth"
          rules={[
            {
              required: true,
              message: 'Selected Month is required',
            },
          ]}
        >
          <CustomDatePicker
            picker="month"
            showTime={false}
            placeholder={`Select Month`}
            format="MMMM YYYY"
            defaultValue={defaultMonth}
            />
        </Form.Item>

        <Form.Item>
          <Button htmlType={'submit'} type={'primary'}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <ScrollTableBlock
        columns={columns}
        dataList={simulationHistoryList}
        pagination={pagination}
        isLoading={isLoading}
        actionable={false}
      />
    </div>
  );
};

export default SimulationHistoryTableView;
