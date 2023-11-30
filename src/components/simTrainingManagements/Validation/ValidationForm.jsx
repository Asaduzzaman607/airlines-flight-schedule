import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import comapreWithLodash from 'lodash';

// import components
import { Button, Form, Badge } from 'antd';
import {
  CustomInput,
  CustomDatePicker,
  CustomSelectBox,
  CustomSelectWithSearch,
} from '../../commonComponents';

// import actions
import {
  addValidation,
  editValidationList
} from '../../../services/actions/SimTrainingManagementActions/validationAction';
import {
  getErrorMsg,
  showAlert,
} from '../../../services/actions/commonActions';
import { getEmployeeSearchList } from '../../../services/actions/CrewManagementActions/employeeAction';

// import reducers
import { setValidationList } from '../../../services/reducers/SimTrainingManagementReducers/validationReducer';

// licence api config
import { LICENCE, DATE_FORMAT, TIME_FORMAT } from '../../../config';

function AddEditForm() {
  const [rowdata, setRowdata] = useState({});
  const [remarks, setRemarks] = useState('');

  const { employeeList } = useSelector((state) => state.employee);
  const foreignEmployees = employeeList.filter((employee) => employee.isForeign === true);


  const { success, isLoading } = useSelector((state) => state.validation);
  const { routePermissions } = useSelector((state) => state.auth);

  // destructure parent path name
  const { parent } = routePermissions;

  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // get input field value from Form
  const employeeId = Form.useWatch('employeeId', form);
  const airLawResultType = Form.useWatch('airLawResultType', form);
  const oralResultType = Form.useWatch('oralResultType', form);
  const oralLetterActionType = Form.useWatch('oralLetterActionType', form);
  const authNocLetterActionType = Form.useWatch('authNocLetterActionType', form);
  const nocActionType = Form.useWatch('nocActionType', form);
  const medicalLetterActionType = Form.useWatch('medicalLetterActionType',form);
  const ninetyDaysCurrencyValid = Form.useWatch('ninetyDaysCurrencyValid',form);
  const selectedEmployee = foreignEmployees.find(employee => employee.id === employeeId);
  const idNo = selectedEmployee ? selectedEmployee.licenceNumber : '';
  
  useEffect(() => {
    // dispatch this action for select box.
    let pageWithSize = { page: 0, pageSize: 500 };
    dispatch(getEmployeeSearchList(pageWithSize));
  }, [employeeId]);

  // Save or Submit Handler
  const _onFinish = (values) => {
   
    const transformedValues = {
      ...values,
      authNocLetterActionDate:values?.authNocLetterActionDate && values.authNocLetterActionDate.format(DATE_FORMAT),
      bdMedicalValidDate:values?.bdMedicalValidDate && values.bdMedicalValidDate.format(DATE_FORMAT),
      fullValFromDate:values?.fullValFromDate && values.fullValFromDate.format(DATE_FORMAT),
      fullValIssueDate: values?.fullValIssueDate && values.fullValIssueDate.format(DATE_FORMAT),
      fullValToDate:values?.fullValToDate && values.fullValToDate.format(DATE_FORMAT),
      licenceMedicalValidDate:values?.licenceMedicalValidDate && values.licenceMedicalValidDate.format(DATE_FORMAT),
      medicalLetterActionDate: values?.medicalLetterActionDate && values.medicalLetterActionDate.format(DATE_FORMAT),
      nocIssueDate: values?.nocIssueDate && values.nocIssueDate.format(DATE_FORMAT),
      oralLetterActionDate: values?.oralLetterActionDate && values.oralLetterActionDate.format(DATE_FORMAT),
      resValFromDate: values?.resValFromDate && values.resValFromDate.format(DATE_FORMAT),
      resValIssueDate: values?.resValIssueDate && values.resValIssueDate.format(DATE_FORMAT),
      resValToDate: values?.resValToDate && values.resValToDate.format(DATE_FORMAT),
      visaExpiredDate: values?.visaExpiredDate && values.visaExpiredDate.format(DATE_FORMAT),
      workPermitExpiredDate: values?.workPermitExpiredDate && values.workPermitExpiredDate.format(DATE_FORMAT),
      ninetyDaysCurrencyValid: ninetyDaysCurrencyValid,
      airLawResultDate:values?.airLawResultDate && values.airLawResultDate.format(DATE_FORMAT),
      oralResultDate:values?.oralResultDate && values.oralResultDate.format(DATE_FORMAT),
      remarks: remarks,
    };

    if (id) {
      transformedValues.id = Number(id);
      if (comapreWithLodash.isEqual(transformedValues)) {
        // show success message
        showAlert('success', 'Successfully Updated.');
        return navigate(parent);
      }
      dispatch(editValidationList(transformedValues));
    } else {
      dispatch(addValidation(transformedValues));
    }
  };

  const _fetchNinetyDays = async () => {
    try {
      const { data } = await axios.get(LICENCE.GET_NINETY_DAYS_VALIDITY + employeeId);

      form.setFieldValue("ninetyDaysCurrencyValid", data?.ninetyDaysCurrencyValid);

    } catch (error) {
      console.error(error);

      const errMsg = getErrorMsg(error);

      // show error msg
      showAlert('error', errMsg);
    }
  };

  useEffect(() => {
    !id && dispatch(setValidationList([]));

    // dispatch this action for select box.
    let pageWithSize = { page: 0, pageSize: 500 };
    dispatch(getEmployeeSearchList(pageWithSize));

    const _fetchData = async () => {
      try {
        const { data } = await axios.get(LICENCE.ADD_LICENCE_VALIDATION + id);
        let newvalues = {
          ...data,
          airLawResultDate:data?.airLawResultDate && dayjs(data.airLawResultDate, TIME_FORMAT),
          authNocLetterActionDate: data?.authNocLetterActionDate && dayjs(data.authNocLetterActionDate, TIME_FORMAT),
          bdMedicalValidDate: data?.bdMedicalValidDate && dayjs(data.bdMedicalValidDate, TIME_FORMAT),
          fullValFromDate: data?.fullValFromDate && dayjs(data.fullValFromDate, TIME_FORMAT),
          fullValIssueDate: data?.fullValIssueDate && dayjs(data.fullValIssueDate, TIME_FORMAT),
          fullValToDate: data?.fullValToDate && dayjs(data.fullValToDate, TIME_FORMAT),
          licenceMedicalValidDate: data?.licenceMedicalValidDate && dayjs(data.licenceMedicalValidDate, TIME_FORMAT),
          medicalLetterActionDate: data?.medicalLetterActionDate && dayjs(data.medicalLetterActionDate, TIME_FORMAT),
          nocIssueDate: data?.nocIssueDate && dayjs(data.nocIssueDate, TIME_FORMAT),
          oralLetterActionDate: data?.oralLetterActionDate && dayjs(data.oralLetterActionDate, TIME_FORMAT),
          resValFromDate: data?.resValFromDate && dayjs(data.resValFromDate, TIME_FORMAT),
          resValIssueDate: data?.resValIssueDate && dayjs(data.resValIssueDate, TIME_FORMAT),
          resValToDate: data?.resValToDate && dayjs(data.resValToDate, TIME_FORMAT),
          visaExpiredDate: data?.visaExpiredDate && dayjs(data.visaExpiredDate, TIME_FORMAT),
          workPermitExpiredDate: data?.workPermitExpiredDate && dayjs(data.workPermitExpiredDate, TIME_FORMAT),
          oralResultDate:data?.oralResultDate && dayjs(data.oralResultDate, TIME_FORMAT),
          ninetyDaysCurrencyValid:data?.ninetyDaysCurrencyValid
        };
        setRowdata(data);
        setRemarks(data?.remarks);
        form.setFieldsValue(newvalues, remarks);
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
    if (employeeId) {
      _fetchNinetyDays();
    }
    
  }, [employeeId]);
  useEffect(() => {
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path
      success && navigate(parent);
    }
  }, [success]);

  //reset form data
  const _onReset = () => {
    form.resetFields();
  };

  const addEditInfoFields = [
    {
      id: 1,
      field_name: 'General',
      field: [
        {
          id: 1,
          name: 'employeeId',
          label: 'Name of Pilots',
          type: 'employeeId',
          rules: [
            {
              required: true,
              message: 'Select Name Of Pilots.',
            },
          ],
        },
        {
            id:employeeId && !id ? 2 : "",
            name: employeeId  && !id ? 'idNo' : "",
            type: 'licenceNo'
          },
      ],
    },
    {
      id: 2,
      field_name: 'Authentication & NOC Info',
      field: [
        {
          id: 1,
          name: 'authNocLetterActionType',
          label: 'Authentication & NOC Letter Action',
          type: 'pilotType',
          rules: [
            {
              required: true,
              message: 'Select Authentication & NOC Letter Action.',
            },
          ],
        },
        {
          id: authNocLetterActionType === 'APPROVED' ? 2 : '',
          name: 'authNocLetterActionDate',
          label: 'Authentication & NOC Action Date',
          type: 'date',
          rules: [
            {
              required: authNocLetterActionType === 'APPROVED',
              message: 'Select Authentication & NOC Action Date.',
            },
          ],
        },
      ],
    },
    {
      id: 3,
      field_name: 'NOC Info',
      field: [
        {
          id: 1,
          name: 'nocActionType',
          label: 'NOC Action',
          type: 'nocType',
          rules: [
            {
              required: true,
              message: 'Select NOC Action Type.',
            },
          ],
        },
        {
          id: nocActionType === 'APPROVED' ? 2 : '',
          name: 'nocIssueDate',
          label: 'NOC Issue Date',
          type: 'date',
          rules: [
            {
              required: nocActionType === 'APPROVED',
              message: 'Select NOC Issue Date.',
            },
          ],
        },
      ],
    },
    {
      id: 4,
      field_name: 'Medical Letter',
      field: [
        {
          id: 1,
          name: 'medicalLetterActionType',
          label: 'Medical Letter Action',
          type: 'medicalLetterActionType',
          rules: [
            {
              required: true,
              message: 'Select Medical Letter Action.',
            },
          ],
        },
        {
          id: medicalLetterActionType === 'APPROVED' ? 2 : '',
          name: 'medicalLetterActionDate',
          label: 'Medical Letter Action Date',
          type: 'date',
          rules: [
            {
              required: medicalLetterActionType === 'APPROVED',
              message: 'Select Medical Letter Action Date.',
            },
          ],
        },
      ],
    },
    {
      id: 5,
      field_name: 'Oral letter',
      field: [
        {
          id: 1,
          name: 'oralLetterActionType',
          label: 'Oral Letter Action',
          type: 'oralLetterActionType',
          rules: [
            {
              required: true,
              message: 'Select Oral Letter Action.',
            },
          ],
        },
        {
          id: oralLetterActionType === 'APPROVED' ? 2 : '',
          name: 'oralLetterActionDate',
          label: 'Oral Letter Action Date',
          type: 'date',
          rules: [
            {
              required: oralLetterActionType === 'APPROVED',
              message: 'Select Oral Letter Action Date.',
            },
          ],
        },
      ],
    },
    {
      id: 6,
      field_name: 'Air Law',
      field: [
        {
          id: 1,
          name: 'airLawResultType',
          label: 'Air Law',
          type: 'airLawResultType',
          rules: [
            {
              required: true,
              message: 'Select Air Law.',
            },
          ],
        },
        {
          id: airLawResultType === 'PASSED' ? 2 : null,
          name: 'airLawResultDate',
          label: 'Air Law Passed Date',
          type: 'date',
          rules: [
            {
              required: airLawResultType === 'PASSED',
              message: 'Select Air Law Passed Date.',
            },
          ],
        },
        {
          id: airLawResultType === 'FAILED' ? 2 : null,
          name: 'airLawResultDate',
          label: 'Air Law Failed Date',
          type: 'date',
          rules: [
            {
              required: airLawResultType === 'FAILED',
              message: 'Select Air Law Failed Date.',
            },
          ],
        },
        {
          id: 3,
          name: 'oralResultType',
          label: 'Oral Test',
          type: 'oralResultType',
          rules: [
            {
              required: true,
              message: 'Select Oral Test.',
            },
          ],
        },
        {
          id: oralResultType === 'PASSED' ? 4 : null,
          name: 'oralResultDate',
          label: 'Oral Test Passed Date',
          type: 'date',
          rules: [
            {
              required: oralResultType === 'PASSED',
              message: 'Select Oral Test Passed Date.',
            },
          ],
        },
        {
          id: oralResultType === 'FAILED' ? 4 : null,
          name: 'oralResultDate',
          label: 'Oral Test Failed Date',
          type: 'date',
          rules: [
            {
              required: oralResultType === 'FAILED',
              message: 'Select Oral Test Failed Date.',
            },
          ],
        },
        {
          id: employeeId ? 5 :"",
          name: employeeId ? 'ninetyDaysCurrencyValid' : "",
          type: 'ninetyDaysCurrencyValid',
        },
      ],
    },
    {
      id: 3,
      field_name: 'Medical',
      field: [
        {
          id: 1,
          name: 'licenceMedicalValidDate',
          label: 'Licence Medical Validity Date',
          type: 'date',
          rules: [
            {
              required: true,
              message: 'Select Licence Medical Validity Date.',
            },
          ],
        },
        {
          id: 2,
          name: 'bdMedicalValidDate',
          label: 'Bangladeshi Medical Validity Date',
          type: 'date',
        },
      ],
    },
    {
      id: 4,
      field_name: 'Visa & Work Permit',
      field: [
        {
          id: 1,
          name: 'visaExpiredDate',
          label: 'Visa Expired Date',
          type: 'date',
          rules: [
            {
              required: true,
              message: 'Select Visa Expired Date.',
            },
          ],
        },
        {
          id: 2,
          name: 'workPermitExpiredDate',
          label: 'Work Permit Expired Date',
          type: 'date',
          rules: [
            {
              required: true,
              message: 'Select Work Permit Expired Date.',
            },
          ],
        },
      ],
    },
    {
      id: 6,
      field_name: 'Restricted Validation',
      field: [
        {
          id: 1,
          name: 'resValIssueDate',
          label: 'Issue Date',
          type: 'date',
        },
        {
          id: 2,
          name: 'resValFromDate',
          label: 'From',
          type: 'date',
        },
        {
          id: 3,
          name: 'resValToDate',
          label: 'To',
          type: 'date',
        },
      ],
    },
    {
      id: 7,
      field_name: 'Full Validation',
      field: [
        {
          id: 1,
          name: 'fullValIssueDate',
          label: 'Issue Date',
          type: 'date',
        },
        {
          id: 2,
          name: 'fullValFromDate',
          label: 'From',
          type: 'date',
        },
        {
          id: 3,
          name: 'fullValToDate',
          label: 'To',
          type: 'date',
        },
      ],
    },
  ];

  const doneData = [
    {
      id: 1,
      value: 'APPROVED',
    },
    {
      id: 2,
      value: 'PENDING',
    },
  ];

  const airLawResult = [
    {
      id: 1,
      value: 'FAILED',
    },
    {
      id: 2,
      value: 'PASSED',
    },
    {
      id: 3,
      value: 'PENDING',
    },
  ];

  const Items = ({ title, id }) => {
    const getColorStyle = () => {
      return id === 'YES' ? { color: 'green' } : { color: 'red' }  ;
    };
 
    return  (
        <div className={'row mt-9 ml-4'}>
          <div className={'col-md-4'}>
            <b> {title} </b>
            <span style={getColorStyle()}>: { id ? id : ""} </span>
          </div>
        </div>
      );
  };

  const inputField = ({ type, label }) => {
    const components = {
      text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
      date: (
        <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />
      ),
      licenceNo: (
                <div className={'row mt-9 ml-4'}>
                  <div className={'col-md-4'}>
                    <b> Licence No </b>
                    <span>: { idNo ? idNo : ""} </span>
                  </div>
                </div>
                ),
      caab: (
        <CustomSelectBox
          itemList={doneData}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      ninetyDaysCurrencyValid: (
        <Items title={'90 Days Currency Valid'} id={ninetyDaysCurrencyValid}  />
      ),
      airLawResultType: (
        <CustomSelectBox
          itemList={airLawResult}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      oralResultType: (
        <CustomSelectBox
          itemList={airLawResult}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      pilotType: (
        <CustomSelectBox
          itemList={doneData}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      nocType: (
        <CustomSelectBox
          itemList={doneData}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      oralLetterActionType: (
        <CustomSelectBox
          itemList={doneData}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      medicalLetterActionType: (
        <CustomSelectBox
          itemList={doneData}
          label={'name'}
          dataIndex={'value'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
      employeeId: (
        <CustomSelectWithSearch
          itemList={foreignEmployees}
          label={'name'}
          dataIndex={'id'}
          mode={'single'}
          placeholder={`Select ${label}`}
          allowClear={true}
        />
      ),
    };
    return components[type] || null;
  };

  return (
    <div className={'bg-white py-3 rounded-md'}>
      <Form
        validateTrigger={'onChange'}
        form={form}
        onFinish={_onFinish}
        scrollToFirstError
        layout={'vertical'}
        autoComplete={'off'}
      >
        <div className={'gap-5 sm:p-5'}>
          {addEditInfoFields?.length > 0 &&
            addEditInfoFields?.map((field, index) => {
              return (
                field?.id && (
                  <Badge.Ribbon text={field?.field_name} placement="start">
                    <div
                      key={index}
                      className={
                        'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'
                      }
                    >
                      {field?.field.map((item) => {
                        if (item?.id) {
                          return (
                            <>
                              <Form.Item
                                key={item?.id}
                                name={item?.name ?? 'N/A'}
                                label={item?.label}
                                rules={item?.rules}
                                dependencies={item?.dependencies ?? []}
                              >
                                {inputField(item)}
                              </Form.Item>
                            </>
                          );
                        }
                      })}
                    </div>
                  </Badge.Ribbon>
                )
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
            <Button htmlType={'reset'} onClick={_onReset}>
              {'Reset'}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddEditForm;
