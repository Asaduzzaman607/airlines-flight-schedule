import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import compareUsingLodash from 'lodash';

// import actions
import {
  addFlightInfo,
  editFlightInfoList,
} from '../../../services/actions/FlightManagementActions/flightInfoAction';
import { getAircraftSearchList } from '../../../services/actions/FlightManagementActions/aircraftAction';
import { getAirportPairSearchList } from '../../../services/actions/FlightManagementActions/airportPairAction';
import { getAircraftTypeSearchList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction';

// import reducers
import { setAircraftList } from '../../../services/reducers/FlightManagementReducers/aircraftReducer';
import { setAirportPairList } from '../../../services/reducers/FlightManagementReducers/airportPairReducer';

// flight info api config
import { FLIGHTINFO, PAGE_SIZE } from '../../../config';

// import Form component
import { Form } from 'antd';
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';

const useFlightInfoAddEditForm = () => {
  const [rowdata, setRowdata] = useState({});
  const [emptyValueOnField, setEmptyValueOnField] = useState(false);

  const { routePermissions } = useSelector((state) => state.auth);
  const { success, isLoadingAddUser } = useSelector(
    (state) => state.flightinfo
  );

  // destructure parent path name
  const { parent } = routePermissions;

  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scheduleName = Form.useWatch('scheduleName', form);

  // initial input fields and values
  const addEditInfoFields = [
    {
      field_name: 'Flight Season Info',
      field: [
        {
          id: id ? 1 : null,
          name: 'scheduleName',
          label: 'Flight Schedule',
          type: 'flightSchedule',
        },
        {
          id: 2,
          name: 'flightDate',
          label: 'Flight Date',
          type: 'flightdate',
          rules: [
            {
              type: 'date',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select flight date.',
            },
          ],
        },
      ],
    },
    {
      field_name: 'Flight Info',
      field: [
        {
          id: 15,
          name: 'aircraftTypeId',
          label: 'Aircraft Type',
          type: 'aircraftTypeSelectBox',
          rules: [
            {
              required: true,
              message: 'Please select aircraft type.',
            },
          ],
        },
        {
          id: 1,
          name: 'aircraftId',
          label: 'Aircraft',
          type: 'aircraft',
          rules: [
            {
              type: 'select',
              message: 'The input is not valid',
            },
            {
              required: false,
              message: 'Please select aircraft.',
            },
          ],
        },
        {
            id: 11,
            name: 'airportPairId',
            label: 'Airport Pair',
            type: 'airportPairId',
            rules: [
              {
                type: 'select',
                message: 'The input is not valid',
              },
              {
                required: true,
                message: 'Please select airport pair.',
              },
            ],
        },
        {
          id: 2,
          name: 'flightNo',
          label: 'Flight No',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'The input is not valid username',
            },
            {
              required: true,
              message: 'Please input flight no.',
            },
          ],
        },
        {
          id: 3,
          name: 'standardDepartureTime',
          label: 'Standard Departure Time',
          type: 'timePicker',
          rules: [
            {
              type: 'date',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select standard departure time.',
            },
          ],
        },
        {
          id: 14,
          name: 'standardArrivalTime',
          label: 'Standard Arrival Time',
          type: 'timePicker',
          rules: [
            {
              type: 'date',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select standard arrival time.',
            },
          ],
        },
        {
          id: 8,
          name: 'flightType',
          label: 'Flight Type',
          type: 'flighttype',
          rules: [
            {
              type: 'select',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select flight type.',
            },
          ],
        },
        {
          id: id ? 13 : null,
          name: 'flightStatus',
          label: 'Flight Status',
          type: 'flightStatus',
          rules: [
            {
              type: 'text',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select flight status.',
            },
          ],
        },
      ],
    },
  ];

  // handle on reset form state
  const handleOnReset = () => {
    form.resetFields();
  };

  // handle on finish or submit form;
  // for both add and update actions
  const handleOnFinish = (values) => {
    // destructured individual value from values
    const {
      standardDepartureTime,
      standardArrivalTime,
      flightDate,
      actualDepartureTime,
      actualArrivalTime,
    } = values;

    // transform values for post data
    const transformedValues = {
      ...values,
      flightDate: flightDate?.format('YYYY-MM-DD'),
      standardDepartureTime: standardDepartureTime?.format('HH:mm'),
      standardArrivalTime: standardArrivalTime?.format('HH:mm'),
      actualDepartureTime: actualDepartureTime?.format('HH:mm'),
      actualArrivalTime: actualArrivalTime?.format('HH:mm'),
    };

    // check standardDepartureTime and standardArrivalTime
    if(transformedValues.standardArrivalTime <= transformedValues.standardDepartureTime) {
        showAlert('warning',`This flight's arrival time will be the next day.`)
    }

    // dispatch to add and edit action
    if (id) {
      transformedValues.id = Number(id);
      if (compareUsingLodash.isEqual(transformedValues, rowdata))
        return navigate(parent);
      dispatch(editFlightInfoList(transformedValues));
    } else {
      dispatch(addFlightInfo(transformedValues));
    }
  };

  useEffect(() => {
    dispatch(getAircraftTypeSearchList(PAGE_SIZE));
    dispatch(setAircraftList([]))
    dispatch(setAirportPairList([]))

    const _fetchData = async () => {
        try {
          const response = await axios.get(FLIGHTINFO.GET_FLIGHTINFO_LIST + id);
          const newValues = {
            ...response.data,
            flightDate: dayjs(response?.data?.flightDate),
            standardDepartureTime: dayjs(
              response?.data?.standardDepartureTime,
              'HH:mm'
            ),
            standardArrivalTime: dayjs(
              response?.data?.standardArrivalTime,
              'HH:mm'
            ),
            actualDepartureTime: dayjs(
              response?.data?.actualDepartureTime,
              'HH:mm'
            ),
            actualArrivalTime: dayjs(response?.data?.actualArrivalTime, 'HH:mm'),
          };
          setRowdata(response.data);
          setEmptyValueOnField(true)
          onValuesChangeHandler({ aircraftTypeId: response?.data?.aircraftTypeId })
          form.setFieldsValue(newValues);
        } catch (error) {
            console.error(error);

            const errMsg = getErrorMsg(error) 
                
            // show error msg
            showAlert('error', errMsg)
        }
      };
      if (id) {
        _fetchData();
      }
  }, []);

  useEffect(() => {
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path
      success && navigate(parent);
    }
  }, [success]);

  const onValuesChangeHandler = (changedValues) => {
    const _fetchAircrftData = async () => {
        try {
            const pageWithSize = {
                value: changedValues?.aircraftTypeId,
                columnName: 'aircraftTypeId',
                page: 0, 
                pageSize: 500,
            }
            dispatch(getAircraftSearchList(pageWithSize));
            dispatch(getAirportPairSearchList(pageWithSize));
        } catch (error) {
            console.error(error);
            const errMsg = getErrorMsg(error)

            // show error msg
            showAlert('error', errMsg)
        }

        setEmptyValueOnField(false)
    }

    if(changedValues?.aircraftTypeId) {
        !emptyValueOnField && form.setFieldsValue({
            aircraftId: undefined,
            airportPairId: undefined
        });
        _fetchAircrftData()
    }
  }

  return {
    addEditInfoFields,
    handleOnFinish,
    handleOnReset,
    onValuesChangeHandler,
    isLoadingAddUser,
    form,
    id,
    scheduleName,
  };
};

export default useFlightInfoAddEditForm;
