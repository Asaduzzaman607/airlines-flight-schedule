import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Checkbox, Badge } from 'antd'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { CustomInput, CompairArray, CustomDatePicker } from '../../commonComponents'
import dayjs from 'dayjs'
import axios from 'axios'
// import action
import { addDriver, editDriver } from '../../../services/actions/VehicleManagementActions/driverAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import role config
import { VCC ,DATE_FORMAT } from '../../../config'


function DriverForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { success, isLoadingAddUser } = useSelector(state => state.driver)
  const { routePermissions } = useSelector(state => state.auth)
  const [rowdata, setRowdata] = useState({})
  const [checked, setChecked] = useState(false);

  // destructure parent path name 
  const { parent } = routePermissions

  const _onFinish = values => {
    const chk = values?.checked;

    const bodyInfo = {
      ...values,
      presentAddress: {
        addressLine1: values?.address1,
        addressLine2: values?.address2,
        district: values?.district,
        thana: values?.thana,
        division: values?.division,
        postCode: values?.postcode
      },
      permanentAddress: {
        addressLine1: chk ? values?.address1 : values?.permanentAddress1,
        addressLine2: chk ? values?.address2 : values?.permanentAddress2,
        district: chk ? values?.district : values?.permanentDistrict,
        thana: chk ? values?.thana : values?.permanentThana,
        division: chk ? values?.thana : values?.permanentDivision,
        postCode: chk ? values?.postcode : values?.permanentPostCode,
      },
      checked:checked,
      drivingLicenceValidity:values?.drivingLicenceValidity?.format(DATE_FORMAT),
    }

    // dispatch to add and edit action
    if (id) {
      bodyInfo.id = Number(id)
      if (CompairArray(bodyInfo, rowdata)) {
        // show success message
        showAlert('success', 'Successfully Updated.')
        return navigate(parent);
      }
      dispatch(editDriver(bodyInfo))
    } else {
      dispatch(addDriver(bodyInfo))
    }
  }

  const toggleDisable = (e) => {
    setChecked(e.target.checked);
    form.setFieldValue("checked", e.target.checked)
  };

  //reset form data
  const _onReset = () => {
    form.resetFields()
  }

  // Handle input field
  const inputField = ({ type, label }) => {
    const _components = {
      text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
      date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`}/>,
      phone:
        <CustomInput
          type={'text'}
          placeholder={`Enter ${label}`}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />,
      chk:
        <Checkbox checked={checked} defaultValue={checked} onChange={toggleDisable} type={'checkbox'} style={{width:'100%'}}> Same as Present Address </Checkbox>
    }
    return _components[type] || null;
  }

  const addEditInfoFeilds = [
    {
      id: 1,
      field_name: 'General',
      field: [
        {
          id: 1,
          name: 'name',
          label: 'Driver Name',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Driver name is not valid',
            },
            {
              required: true,
              message: 'Driver name is required.',
            }
          ]
        },
        {
          id: 2,
          name: 'phone',
          label: 'Phone No',
          type: 'phone',
          rules: [
            {
              type: 'text',
              message: 'Phone No is not valid',
            },
            {
              required: true,
              message: 'Phone No is required.',
            }
          ]
        },
        {
          id: 3,
          name: 'drivingLicenceNumber',
          label: 'Driving Licence Number',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Driving Licence Number is not valid',
            },
            {
              required: true,
              message: 'Driving Licence Number is required.',
            }
          ]
        },
        {
          id: 4,
          name: 'drivingLicenceValidity',
          label: 'Driving Licence Validity',
          type: 'date',
          rules: [
            {
              type: 'date',
              message: 'Driving Licence Validity is not valid',
            },
            {
              required: true,
              message: 'Driving Licence Validity is required.',
            }
          ]
        }
      ]
    },
    {
      id: 2,
      field_name: 'Present Address',
      field: [
        {
          id: 1,
          name: 'address1',
          label: 'Address Line 1',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Address 1 is not valid',
            },
            {
              required: true,
              message: 'Address 1 is required.',
            }
          ]
        },
        {
          id: 2,
          name: 'address2',
          label: 'Address Line 2',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Address 2 is not valid',
            }
          ]
        },
        {
          id:3,
          name: 'thana',
          label: 'Thana',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Thana is not valid',
            },
            {
              required: true,
              message: 'Thana is required.',
            }
          ]
        },
        {
          id: 4,
          name: 'district',
          label: 'District',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'District is not valid',
            },
            {
              required: true,
              message: 'District is required.',
            }
          ]
        },
        {
          id: 5,
          name: 'division',
          label: 'Division',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Division is not valid',
            },
            {
              required: true,
              message: 'Division is required.',
            }
          ]
        },
        {
          id: 6,
          name: 'postcode',
          label: 'Post Code',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Post Code is not valid',
            },
            {
              required: true,
              message: 'Post Code is required.',
            }
          ]
        },
      ]
    },
    {
      id: 3,
      field_name: 'Permanent Address',
      field: [
        {
          id: 1,
          name: 'checked',
          label: '',
          type: 'chk',

        },
        {
          id: !checked ? 2 : null,
          name: 'permanentAddress1',
          label: 'Address Line 1',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Address Line 1 is not valid',
            },
            {
              required: !checked ? true : false,
              message: 'Address Line 1 is required.',
            },
          ],
        },
        {
          id:  !checked ? 3 : null,
          name: 'permanentAddress2',
          label: 'Address Line 2',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Address Line 2 is not valid',
            }
          ]
        },
     
        {
          id: !checked ? 4 : null,
          name: 'permanentThana',
          label: 'Thana',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Thana is not valid',
            },
            {
              required: !checked ? true : false,
              message: 'Thana is required.',
            },
          ],
        },
        {
          id:  !checked ? 5 : null,
          name: 'permanentDistrict',
          label: 'District',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'District is not valid',
            },
            {
              required: !checked ? true : false,
              message: 'District is required.',
            },
          ],
        },
        {
          id:  !checked ? 6 : null,
          name: 'permanentDivision',
          label: 'Division',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Division is not valid',
            },
            {
              required: !checked ? true : false,
              message: 'Division is required.',
            },
          ],
        },
        {
          id:!checked ? 7 : null,
          name: 'permanentPostCode',
          label: 'Post Code',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'Post Code is not valid',
            },
            {
              required: !checked ? true : false,
              message: 'Post Code is required.',
            },
          ],
        }
      ]
    }
  ]

  useEffect(() => {

    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path 
      success && navigate(parent)
    }
  }, [success])

  useEffect(() => {
    const _fetchData = async () => {
      try {
        const { data } = await axios.get(VCC.GET_DRIVER_LIST + id)

        const dataList = data?.length ? data : []
        setRowdata(data)

        //set row value
        let newvalues = {
          ...data,
          address1: data?.presentAddress.addressLine1,
          address2: data?.presentAddress.addressLine2,
          district: data?.presentAddress.district,
          thana: data?.presentAddress.thana,
          division: data?.presentAddress.division,
          postcode: data?.presentAddress.postCode,
          permanentAddress1: data?.presentAddress.addressLine1,
          permanentAddress2: data?.presentAddress.addressLine2,
          permanentDistrict: data?.presentAddress.district,
          permanentThana: data?.presentAddress.thana,
          permanentDivision: data?.presentAddress.division,
          permanentPostCode: data?.presentAddress.postCode,
          drivingLicenceValidity:data?.drivingLicenceValidity && dayjs(data?.drivingLicenceValidity, DATE_FORMAT)
        }
        form.setFieldsValue(newvalues);

        if (form.getFieldValue("checked") === true) {
          setChecked(true)
        }
      } catch (error) {

        console.error(error);
        const errMsg = getErrorMsg(error)

        // show error msg
        showAlert('error', errMsg)
      }
    }

    if (id) {
      _fetchData()
    }

  }, [id])

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
          {
            addEditInfoFeilds?.length > 0 &&
            addEditInfoFeilds?.map((field, index) => {
              return (
                field?.id &&
                <Badge.Ribbon text={field.field_name} placement='start'>
                  <div key={index} className={`grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6`}>
                    {field?.field.map(item => {
                      if (item?.id) {
                        return (               
                            <Form.Item
                              key={item?.id}
                              name={item?.name ?? 'N/A'}
                              label={item?.label}
                              rules={item?.rules}
                              dependencies={item?.dependencies ?? []}
                            >
                              {inputField(item)}                     
                            </Form.Item>
                        )
                      }

                    })}
                  </div>
                </Badge.Ribbon>
              )
            })
          }
        </div>
        <Form.Item style={{ marginLeft: '17px' }}>
          <Button
            htmlType={'submit'}
            type={'primary'}
            loading={isLoadingAddUser}
            style={{ margin: '5px' }}
          >
            {id ? 'Update' : 'Submit'}
          </Button>
          {
            !id &&
            <Button
              htmlType={'reset'}
              onClick={() => _onReset}
            >
              {'Reset'}
            </Button>
          }
        </Form.Item>
      </Form>
    </div>
  )
}

export default DriverForm

