import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { Button, Form } from 'antd'
import { CustomInput, CustomSelectBox, CustomDatePicker, CustomSelectWithSearch } from '../../../commonComponents'

// import action
import { addTrainer, editTrainerList } from '../../../../services/actions/SimTrainingManagementActions/trainerAction'
import { getErrorMsg, showAlert } from '../../../../services/actions/commonActions'
import { getCountrySearchList } from '../../../../services/actions/CrewManagementActions/countryAction'
import { getTrainingCenterSearchList } from '../../../../services/actions/SimTrainingManagementActions/trainingCenterAction'

// import api config
import { SIM_TRAINING, DATE_FORMAT, PAGE_SIZE } from '../../../../config'


function SimModuleForm() {
    const [rowdata,setRowdata] = useState({})

    const { success, isLoading } = useSelector(state => state.trainer)
    const { trainingCenterList } = useSelector(state => state.trainingCenter)
    const { countryList } = useSelector(state => state.country)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // save or submit handler
    const _onFinish = values => {
        const transformedValues = {
            ...values,
            dob: values?.dob && values?.dob?.format(DATE_FORMAT),
            licenseExpiredDate: values?.licenseExpiredDate && values?.licenseExpiredDate?.format(DATE_FORMAT),
            caabValidity: values?.caabValidity && values?.caabValidity?.format(DATE_FORMAT)    
        }
        // dispatch to add and edit action
        if(id) {
            transformedValues.id = Number(id)
            let { ...extractRowData } = rowdata
            if(comapreWithLodash.isEqual(transformedValues, extractRowData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent)
            } 

            dispatch(editTrainerList(transformedValues))
        } else {
            dispatch(addTrainer(transformedValues))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = ({ type, label }) => {
        const _components = {
            text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
 
            date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
            trainingCenter: (
                <CustomSelectWithSearch
                    itemList={trainingCenterList} 
                    label={'name'} 
                    dataIndex={'key'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}   
                    allowClear={true}             
                />
            ),
            selectCountry: (
                <CustomSelectWithSearch
                    itemList={countryList} 
                    label={'name'} 
                    dataIndex={'key'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}   
                    allowClear={true}             
                />
            )
        }
        
        return _components[type] || null
    }

    useEffect(() => {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [ success ])

    useEffect(()=> {
        dispatch(getCountrySearchList( PAGE_SIZE ));
        dispatch(getTrainingCenterSearchList( PAGE_SIZE ));
        
        // fetch row data
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(SIM_TRAINING.GET_TRAINER + id)

                let newvalues = {
                    ...data,
                    dob: data?.dob && dayjs(data?.dob, DATE_FORMAT),
                    licenseExpiredDate: data?.licenseExpiredDate && dayjs(data?.licenseExpiredDate, DATE_FORMAT),
                    caabValidity: data?.caabValidity && dayjs(data?.caabValidity, DATE_FORMAT)        
                }

                setRowdata(data)
                form.setFieldsValue(newvalues)
               
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) {
            _fetchData()
        }
    }, [])

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
            <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                {
                    addEditInfoFields?.map(field => (
                        <Form.Item
                            key={field?.id}
                            name={field?.name}
                            label={field?.label}
                            rules={field?.rules}
                            dependencies={field?.dependencies ?? []}
                        >
                            { inputField(field) }
                        </Form.Item>
                    ))
                }
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
                <Button 
                    htmlType={'submit'} 
                    type={'primary'} 
                    loading={ isLoading } 
                    style={{ margin: '5px' }}
                >
                    { id ? 'Update' : 'Submit' }
                </Button>
                {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{ 'Reset' }</Button>}
            </Form.Item>
            </Form>
        </div>
    )
}

export default SimModuleForm

// initial input field and value
const addEditInfoFields = [
    {
        id: 1,
        name: 'trainingCenterId',
        label: 'Training Center Name',
        type: 'trainingCenter',
        rules: [
            {
                type: 'text',
                message: 'Training Center Name is not valid',
            },
            {
                required: true,
                message: 'Training Center Name is required.',
            },
        ],
    },
    {
        id: 2,
        name: 'name',
        label: 'Trainer Name',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'Trainer Name is not valid',
            },
            {
                required: true,
                message: 'Trainer name is required.',
            },
        ],
    },
    {
        id: 3,
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        rules: [
            {
                type: 'text',
                message: 'Date of Birth is not valid',
            },
            {
                required: true,
                message: 'Date of Birth is required.',
            },
        ],
    },
    {
        id: 4,
        name: 'countryId',
        label: 'Country',
        type: 'selectCountry',
        rules: [
            {
                type: 'select',
                message: 'Country is not valid',
            },
            {
                required: true,
                message: 'Country is required.',
            },
        ],
    },
    {
        id: 5,
        name: 'licenseNo',
        label: 'License No',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'License No is not valid',
            },
            {
                required: true,
                message: 'License No is required.',
            },
        ],
    },
    {
        id: 6,
        name: 'licenseAuthorizedBy',
        label: 'License Authorized By',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'License Authorized By is not valid',
            },
            {
                required: true,
                message: 'License Authorized By is required.',
            },
        ],
    },
    {
        id: 7,
        name: 'licenseExpiredDate',
        label: 'License Expired Date',
        type: 'date',
        rules: [
            {
                type: 'date',
                message: 'License Expired Date is not valid',
            },
            {
                required: true,
                message: 'License Expired Date is required.',
            },
        ],
    },
    {
        id: 8,
        name: 'caabValidity',
        label: 'CAAB Validity',
        type: 'date',
        rules: [
            {
                type: 'date',
                message: 'CAAB Validity is not valid',
            },
            {
                required: true,
                message: 'CAAB Validity is required.',
            },
        ],
    },
]