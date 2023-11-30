import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import comapreWithLodash from 'lodash';

// import components
import {
  CustomSelectWithSearch,
  CustomInput,
  CustomDatePicker,
  CustomMonthPicker,
  CustomSelectBox,
} from '../../commonComponents';
import SimplanTableTransfer from './SimplanTableTransfer';
import { Button, Form, Input, DatePicker, Badge, Space } from 'antd';

// import icons
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// import actions
import {
  editSimPlanList,
  addSimPlan,
  getEligibleEmployeeSim,
  setEligibleEmployeeForSim,
} from '../../../services/actions/SimTrainingManagementActions/simPlanAction';
import {
  getErrorMsg,
  showAlert,
} from '../../../services/actions/commonActions';
import { getAircraftTypeSearchList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction';
import { getCountrySearchList } from '../../../services/actions/CrewManagementActions/countryAction';
import { getCitySearchList } from '../../../services/actions/SimTrainingManagementActions/cityAction';
import { getTrainingCenterSearchList } from '../../../services/actions/SimTrainingManagementActions/trainingCenterAction';
import { getTrainerSearchList } from '../../../services/actions/SimTrainingManagementActions/trainerAction';

// flight info api config
import {
  SIM_TRAINING,
  PAGE_SIZE,
  DATE_FORMAT,
  YEAR_FORMAT,
} from '../../../config';

// add custom style for slot session block
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};

function SimPlanForm() {
  const [rowdata, setRowdata] = useState({});
  const [sortedEmployeeList] = useState([]);
  const [searchData, setSearchData] = useState(false);
  const [aircraftTypeIdData, setAircraftTypeIdData] = useState('');
  const [sortedCityList, setSortedCity] = useState([]);
  const [sortedTrainingcenter, setSortedTrainingcenter] = useState([]);

  // set transfer table key
  const [targetKeys, setTargetKeys] = useState([]);

  const { success, isLoading, eligibleEmployeeForSim } = useSelector((state) => state.simPlan);
  const { trainingCenterList, isLoading: isLoadingForTC } = useSelector(
    (state) => state.trainingCenter
  );
  const { isLoading: isLoadingForT } = useSelector((state) => state.trainer);
  const { isLoading: isLoadingForCity } = useSelector((state) => state.city);
  const { routePermissions } = useSelector((state) => state.auth);
  const { aircraftTypeList } = useSelector((state) => state.aircrafttype);
  const { countryList, isLoading: isLoadingForCountry } = useSelector((state) => state.country);

  // set eligible employee list
  const [allEmployeeList, setAllEmployeeList] = useState(eligibleEmployeeForSim);

  // destructure parent path name
  const { parent } = routePermissions;

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  // Save or Submit Handler
  const _onFinish = (values) => {
    const { depDate, arrDate } = values;
    const newSlotSessions = values?.slotSessions?.map((item) => ({
      session: item?.session,
      slotDate: item?.slotDate && item?.slotDate?.format(DATE_FORMAT),
    }));
    const transformedValues = {
      ...values,
      depDate: depDate && depDate?.format(DATE_FORMAT),
      arrDate: arrDate && arrDate?.format(DATE_FORMAT),
      slotSessions: newSlotSessions,
      employeesIds: targetKeys,
      aircraftTypeId: aircraftTypeIdData,
    };

    // dispatch to add and edit action
    if (id) {
      transformedValues.id = Number(id);
      let { ...getData } = rowdata;
      if (comapreWithLodash.isEqual(transformedValues, getData)) {
        // show success message
        showAlert('warning', 'No changes were made to the data.');
        return;
      }
      dispatch(editSimPlanList(transformedValues));
    } else {
      dispatch(addSimPlan(transformedValues));
    }
  };

  //reset form data
  const _onReset = () => {
    form.resetFields();
  };
  const onValueChangeHander = (changedValues, _) => {
    const _fetchData = async () => {
      try {
        const { data } = await axios.get(SIM_TRAINING.GET_CITY_BY_COUNTRY, {
          params: { countryId: changedValues?.countryId },
        });
        const dataList = data?.model?.length ? data?.model : [];
        setSortedCity(dataList);
      } catch (error) {
        form.setFieldsValue({
          cityId: undefined,
        });
        console.error(error);
        const errMsg = getErrorMsg(error);

        // show error msg
        showAlert('error', errMsg);
      }
    };

    if (changedValues?.countryId) {
      form.setFieldsValue({
        cityId: undefined,
      });
      _fetchData();
    }

    const _fetchTrainingcenterData = async () => {
      try {
        const { data } = await axios.get(
          SIM_TRAINING.GET_TRAINER_BY_TRAINING_CENTER,
          { params: { trainingCenterId: changedValues?.trainingCenterId } }
        );
        const dataList = data?.model?.length ? data?.model : [];
        setSortedTrainingcenter(dataList);
      } catch (error) {
        form.setFieldsValue({
          trainerId: undefined,
        });
        console.error(error);
        const errMsg = getErrorMsg(error);

        // show error msg
        showAlert('error', errMsg);
      }
    };
    if (changedValues?.trainingCenterId) {
      form.setFieldsValue({
        trainerId: undefined,
      });
      _fetchTrainingcenterData();
    }
  };
  // inutfield structure
  const addEditInfoFields = [
    {
      id: 1,
      field_name: 'Eligible Employee Details',
      field: [
        {
          id: 1,
          name: 'simModule',
          label: 'SIM Module',
          type: 'text',
          rules: [
            {
              required: true,
              message: 'SIM module is required.',
            },
          ],
        },
        {
          id: 2,
          name: 'countryId',
          label: 'Country',
          type: 'selectCountry',
        },
        {
          id: 3,
          name: 'cityId',
          label: 'City',
          type: 'selectCity',
        },
        {
          id: 4,
          name: 'trainingCenterId',
          label: 'Training Center',
          type: 'trainingCenterId',
        },
        {
          id: 5,
          name: 'trainerId',
          label: 'Trainer',
          type: 'trainerId',
        },
        {
          id: 6,
          name: 'depDate',
          label: 'Departure Date',
          type: 'date',
          rules: [
            {
              required: true,
              message: 'Departure Date is required.',
            },
          ],
        },
        {
          id: 7,
          name: 'arrDate',
          label: 'Arrival Date',
          type: 'date',
          rules: [
            {
              required: true,
              message: 'Arrival Date is required.',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      field_name: 'Status Info',
      field: [
        {
          id: 1,
          name: 'docRequest',
          label: 'Doc Request',
          type: 'select',
        },
        {
          id: 2,
          name: 'docSubmit',
          label: 'Doc Submit',
          type: 'select',
        },
        {
          id: 3,
          name: 'seatBlock',
          label: 'Seat Block',
          type: 'select',
        },
        {
          id: 4,
          name: 'gdBlock',
          label: 'GD Block',
          type: 'select',
        },
        {
          id: 5,
          name: 'hotelBook',
          label: 'Hotel Block',
          type: 'select',
        },
        {
          id: 6,
          name: 'occDacBkk',
          label: 'OCC (DAC-BKK)',
          type: 'select',
        },
        {
          id: 7,
          name: 'occBkkDac',
          label: 'OCC (BKK-DAC)',
          type: 'select',
        },
        {
          id: 8,
          name: 'fundRequisition',
          label: 'Fund Requisition',
          type: 'select',
        },
        {
          id: 9,
          name: 'fundReceive',
          label: 'Fund Receive',
          type: 'select_2',
        },
        {
          id: 10,
          name: 'docHandover',
          label: 'Doc Handover',
          type: 'select',
        },
        {
          id: 11,
          name: 'billReceive',
          label: 'Bill Receive',
          type: 'select_2',
        },
        {
          id: 12,
          name: 'adjustment',
          label: 'Adjustment',
          type: 'select',
        },
        {
          id: 13,
          name: 'lastPpcIrEndorsement',
          label: 'Last PPC & IR endorsement',
          type: 'select',
        },
        {
          id: 14,
          name: 'newPpcIrEndorsement',
          label: 'New PPC & IR endorsement',
          type: 'select',
        },
      ],
    },
  ];

  const yesNoType = [
    {
      id: 'YES',
      value: 'YES',
      name: 'YES',
    },
    {
      id: 'NOT_YET',
      value: 'NOT_YET',
      name: 'NOT YET',
    },
    {
      id: 'PERTIALLY_DONE',
      value: 'PERTIALLY_DONE',
      name: 'PERTIALLY DONE',
    },
  ];

  const doneType = [
    {
      id: 'DONE',
      value: 'DONE',
      name: 'DONE',
    },
    {
      id: 'PENDING',
      value: 'PENDING',
      name: 'PENDING',
    },
    {
      id: 'CHECKED',
      value: 'CHECKED',
      name: 'CHECKED',
    },
  ];

  const inputField = ({ type, label }) => {
    const _components = {
      text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
      date: (
        <CustomDatePicker
          disabledDate={(current) =>
            current && current < dayjs().startOf('day')
          }
          showTime={false}
          placeholder={`Select ${label}`}
        />
      ),
      employee_select_box: (
        <CustomSelectWithSearch
          itemList={sortedEmployeeList}
          label={'name'}
          dataIndex={'id'}
          mode={'multiple'}
          allowClear={true}
          placeholder={`Select ${label}`}
        />
      ),
      select_2: (
        <CustomSelectBox
          itemList={yesNoType}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
        />
      ),
      select: (
        <CustomSelectBox
          itemList={doneType}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
        />
      ),
      selectCountry: (
        <CustomSelectWithSearch
          itemList={countryList}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
          loading={isLoadingForCountry}
        />
      ),
      selectCity: (
        <CustomSelectWithSearch
          itemList={sortedCityList}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
          loading={isLoadingForCity}
        />
      ),
      trainingCenterId: (
        <CustomSelectWithSearch
          itemList={trainingCenterList}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
          loading={isLoadingForTC}
        />
      ),
      trainerId: (
        <CustomSelectWithSearch
          itemList={sortedTrainingcenter}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          allowClear={true}
          placeholder={`Select ${label}`}
          loading={isLoadingForT}
        />
      ),
    };
    return _components[type] || null;
  };

  useEffect(() => {
    // dispatch action for select box.
    dispatch(setEligibleEmployeeForSim([]));
    dispatch(getAircraftTypeSearchList(PAGE_SIZE));
    dispatch(getCountrySearchList(PAGE_SIZE));
    dispatch(getCitySearchList(PAGE_SIZE));
    dispatch(getTrainerSearchList(PAGE_SIZE));
    dispatch(getTrainingCenterSearchList(PAGE_SIZE));

    const _fetchData = async () => {
      try {
        const { data } = await axios.get(SIM_TRAINING.GET_SIM_PLAN + id);
        let newvalues = {
          ...data,
          depDate: data?.depDate && dayjs(data.depDate, DATE_FORMAT),
          arrDate: data?.arrDate && dayjs(data.arrDate, DATE_FORMAT),
          slotSessions:
            data?.slotSessionss?.length > 0 &&
            data.slotSessionss.map((item) => ({
              session: item?.session,
              slotDate: item?.slotDate && dayjs(item.slotDate),
            })),
        };
        onValueChangeHander({ countryId: data?.countryId, trainingCenterId: data?.trainingCenterId }, '');
        setAircraftTypeIdData(newvalues?.aircraftTypeId);
        setSearchData(true);

        setRowdata(data);

        // set selected employee
        setTargetKeys(data?.employeesIds?.length > 0 ? data.employeesIds : []);
        const selectedEmployeeInfo =
          data?.selectedEmployee?.length > 0 ? data.selectedEmployee : [];

        setAllEmployeeList(selectedEmployeeInfo);

        form1.setFieldsValue(newvalues);
      } catch (error) {
        console.error(error);
        const errMsg = getErrorMsg(error);
        // show error msg
        showAlert('error', errMsg);
      }
    };

    if (id) {
      _fetchData();
    }
  }, [dispatch, form1, id]);

  useEffect(() => {
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path
      success && navigate(parent);
    }
  }, [success, id, navigate, parent]);

  useEffect(() => {
    setAllEmployeeList(eligibleEmployeeForSim);
  }, [eligibleEmployeeForSim]);

  const defaultSlotSesion = [
    {
      key: 0,
      session: null,
      slotDate: null,
    },
  ];

  const _fetchEmployeeData = (values) => {
    const body = {
      aircraftTypeId: values?.aircraftTypeId,
      monthYear: values?.monthYear && values.monthYear.format(YEAR_FORMAT),
      isUpdate: id ? true : false,
    };
    setAircraftTypeIdData(body?.aircraftTypeId);
    dispatch(getEligibleEmployeeSim(body));
    setSearchData(true);
  };

  // first form -> Eligible Employee Search
  const searchForm = () => {
    const disabledDate = (current) => {
      if (current) {
        const currentMonth = dayjs();
        const selectedMonth = dayjs(current);
        return selectedMonth.isBefore(currentMonth, 'month');
      }
      return false;
    };
    return (
      <Badge.Ribbon text={'Eligible Employee Search'} placement="start">
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={_fetchEmployeeData}
          className={
            'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-2 mb-6'
          }
        >
          <Form.Item
            name="monthYear"
            label="Month"
            rules={[
              {
                required: true,
                message: 'Month is required',
              },
            ]}
          >
            <CustomMonthPicker
              showTime={false}
              disabledDate={disabledDate}
              placeholder={`Select Month`}
              format={YEAR_FORMAT}
            />
          </Form.Item>

          <Form.Item
            name="aircraftTypeId"
            label="AirCraft Type"
            rules={[
              {
                required: true,
                message: 'AirCraft Type is required.',
              },
            ]}
          >
            <CustomSelectBox
              itemList={aircraftTypeList}
              label={'name'}
              dataIndex={'id'}
              mode={'single'}
              allowClear={true}
              placeholder={`Enter AirCraft Type`}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType={'submit'} type={'primary'}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Badge.Ribbon>
    );
  };

  return (
    <div className={'bg-white py-3 rounded-md'}>
      <div className={'gap-5 sm:p-5'}>
        {searchForm()}
        {allEmployeeList?.length > 0 && (
          <SimplanTableTransfer
            dataSource={allEmployeeList}
            setTargetKeys={setTargetKeys}
            targetKeys={targetKeys}
          />
        )}
      </div>

      {searchData ? (
        <Form
          validateTrigger={'onChange'}
          form={form1}
          onFinish={_onFinish}
          scrollToFirstError
          layout={'vertical'}
          autoComplete={'off'}
          initialValues={{ slotSessions: defaultSlotSesion }}
          onValuesChange={onValueChangeHander}
        >
          <div className={'gap-5 sm:p-5'}>
            {addEditInfoFields?.map((field, index) => {
              return (
                <Badge.Ribbon text={field?.field_name} placement="start">
                  <div
                    className={
                      'p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'
                    }
                  >
                    <div
                      key={index}
                      className={'grid sm:grid-cols-2 lg:grid-cols-2 p-4 gap-5'}
                    >
                      {field?.field?.map((item) => {
                        if (item?.id) {
                          return (
                            <div key={item?.id}>
                              <Form.Item
                                key={item?.id}
                                name={item?.name}
                                label={item?.label}
                                rules={item?.rules}
                                dependencies={item?.dependencies ?? []}
                              >
                                {inputField(item)}
                              </Form.Item>
                            </div>
                          );
                        }
                      })}
                    </div>
                    {field?.field_name === 'Eligible Employee Details' && (
                      <div className={'sm:pl-5 pr-5'}>
                        <Form.List name="slotSessions">
                          {(fields, { add, remove }) => (
                            <>
                              {fields?.map(({ key, name, ...restField }) => (
                                <Space
                                  key={key}
                                  style={{
                                    marginBottom: 8,
                                  }}
                                  {...formItemLayout}
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'slotDate']}
                                    label="Slot Date"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Slot date is required.',
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      disabledDate={(current) =>
                                        current &&
                                        current < dayjs().startOf('day')
                                      }
                                      placeholder="Select slot date"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'session']}
                                    label="Session"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Session name is required.',
                                      },
                                    ]}
                                  >
                                    <Input
                                      type={'text'}
                                      placeholder="Enter session name"
                                    />
                                  </Form.Item>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      className="pr-5"
                                      onClick={() => remove(name)}
                                    />
                                  ) : null}
                                </Space>
                              ))}
                              <div>
                                <Form.Item>
                                  <Button
                                    className={'bg-cyan-400'}
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                  >
                                    Add More Slot Session
                                  </Button>
                                </Form.Item>
                              </div>
                            </>
                          )}
                        </Form.List>
                      </div>
                    )}
                  </div>
                </Badge.Ribbon>
              );
            })}
          </div>
          <Form.Item style={{ marginLeft: '17px' }}>
            <Button
              htmlType={'submit'}
              type={'primary'}
              loading={isLoading}
              style={{ margin: '5px' }}
            >
              {id ? 'Update' : 'Submit'}
            </Button>
            {!id && (
              <Button htmlType={'reset'} onClick={() => _onReset}>
                {'Reset'}
              </Button>
            )}
          </Form.Item>
        </Form>
      ) : null}
    </div>
  );
}

export default SimPlanForm;
