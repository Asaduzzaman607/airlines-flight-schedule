import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload as newUpload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import axios from 'axios'

// import componets
import { CustomSelectWithSearch, TagRender } from '../../../commonComponents'
import { Button, Form, Input, Select, DatePicker, Badge, Upload, Space, Image } from 'antd'
import { useAwsFileUploader } from '../../../customHooks'

// import image
import defaultImage from '../../../../assets/images/default_pilot.jpg'

// import icon
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'

// import action
import { addTrainingCenter, editTrainingCenterList } from '../../../../services/actions/SimTrainingManagementActions/trainingCenterAction'
import { getErrorMsg, showAlert } from '../../../../services/actions/commonActions'
import { getCountrySearchList } from '../../../../services/actions/CrewManagementActions/countryAction'
import { getAircraftTypeSearchList } from '../../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import api config
import { SIM_TRAINING } from '../../../../config'
import dayjs from 'dayjs'

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

function TrainingCenterForm() {
    const { 
        selectedFile, 
        objectUrl, 
        progress, 
        handleChange, 
        beforeUpload, 
        onRemoveFileUploadHandler,
    } = useAwsFileUploader()

    const [sortedCityList, setSortedCity] = useState([]);
    const [rowdata, setRowdata] = useState({})

    // For multiple file upload
    const [Multipleprogress, setMultipleProgress] = useState([]);
    const [multipleSelectedFile, setMultipleSelectedFile] = useState([]);
    const [multipleObjectUrl, setMultipleObjectUrl] = useState([]);

    const { success, isLoading } = useSelector(state => state.trainingCenter)
    const { countryList } = useSelector(state => state.country)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const certificates = Form.useWatch('certificates', form)

    // save or submit handler
    const _onFinish = values => {
        const newMultipleObjectUrl = multipleObjectUrl?.filter((item) => (item));
        const newCertificates = certificates?.map( (item, key) => ({
            certificateNo: item.certificateNo,
            certificateValidity: item.certificateValidity?.format( 'YYYY-MM-DD' ),
            serialNo: item.serialNo,
            qualificationLevel: item.qualificationLevel,
            documentNameCer: item.documentNameCer,
            documentPathCer: newMultipleObjectUrl?.[key] ?? rowdata?.certificates?.[key]?.documentPath,
        }))

        // dispatch to add and edit action
        const transformedValues = {
            ...values,
            certificates: [...newCertificates],
            atoCertificateValidity: values?.atoCertificateValidity?.format('YYYY-MM-DD'),
            caabValidity: values?.caabValidity?.format('YYYY-MM-DD'),
            documentPath: objectUrl ? objectUrl : rowdata?.documentPath 
        }
        
        if(id) {
            transformedValues.id = Number(id)
            dispatch(editTrainingCenterList(transformedValues))
        } else {
            dispatch(addTrainingCenter(transformedValues))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    // onChange handler for multiple file uploader
    const handleChangeMultipleFile = (info, key) => {
        const { fileList } = info;
        
        // Update the fileList for the specific key
        setMultipleSelectedFile((prev) => {
            const updatedItems = [...prev];
            updatedItems[key] = fileList?.length ? fileList?.[0] : fileList;
            return updatedItems;
        })
    }; 

    // Multiple file remove handler
    const onRemoveMultipleFileUploadHandler = (key) => {
        setMultipleProgress((prev) => {
            const updatedItems = [...prev];
            updatedItems[key] = 0;
            return updatedItems;
        })
        setMultipleObjectUrl((prev) => {
            const updatedItems = [...prev];
            updatedItems[key] = '';
            return updatedItems;
        })
        setMultipleSelectedFile((prev) => {
            const updatedItems = [...prev];
            updatedItems[key] = '';
            return updatedItems;
        })
    }

    // Multiple file upload handler
    const uploadMultiple = async (file, key) => {
        const moduleName = "flight"
        const target = { 
            Bucket: "flightschedulebucket", 
            Key: moduleName + "/" + file?.name, 
            Body: file, 
            ContentType: file?.type
        };

        const awsClient = new S3Client({
            region: "ap-southeast-1",
            credentials: {
                accessKeyId: "AKIARL5XEC3YR25DTX4O",
                secretAccessKey: "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",
            },
            
        })

        try {
            const parallelUploads3 = new newUpload({
                client: awsClient,
                params: target,
                leavePartsOnError: false, // optional manually handle dropped parts
            });

            parallelUploads3.on("httpUploadProgress", (Multipleprogress) => {
                setMultipleProgress((prev) => {
                    const updatedItems = [...prev];
                    updatedItems[key] = Math.round((Multipleprogress.loaded / Multipleprogress.total) * 100);
                    return updatedItems;
                })
            });

            const res = await parallelUploads3.done();

            setMultipleObjectUrl((prev) => {
                const updatedItems = [...prev];
                updatedItems[key] = res.Location;
                return updatedItems;
            })

        } catch (error) {
            console.error(error);
            const errMsg = getErrorMsg(error)

            // show error msg
            showAlert('error', errMsg)
        }
    };

    const beforeUploadMultiple = (file, key) => {
        // Add the file to the multipleSelectedFile state array
        setMultipleSelectedFile((prev) => {
            const updatedItems = [...prev];
            updatedItems[key] = file;
            return updatedItems;
        }); 

        uploadMultiple(file, key); // Handle the uploadMultiple directly when a file is selected
        return false; // Prevent the default uploadMultiple behavior
    };

    // File upload button
    const uploadButton = (
        <div>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </div>
    );

    // Multiple File upload button
    const MultipleUploadButton = (
        id && rowdata?.profileUrl ? (
            <Image
                width={100}
                height={100}
                src={(!rowdata?.profileUrl || rowdata?.profileUrl === 'N/A') ? defaultImage : rowdata?.profileUrl}
                preview={false}
            />
        ) : (
            <div>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </div>
        )
    );

    const inputField = ( { type, label } ) => {
        const _components = {
            text: <Input type={'text'} placeholder={`Enter ${label}`}/>,
            textarea: <Input.TextArea type={'text'} placeholder={`Enter ${label}`} />,
            date: <DatePicker style={{width: '100%'}}/>,
            selectCountry: (
                <CustomSelectWithSearch 
                    itemList={countryList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    tagRender={null}
                    placeholder={`Select ${label}`}
                />
            ),
            selectCity: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Select City"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={sortedCityList.map(item => ({label: item?.name, value: item?.id}))}
                />
            ),
            aircraftTypesIds: (
                <CustomSelectWithSearch 
                    itemList={aircraftTypeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'multiple'}
                    tagRender={TagRender}
                    placeholder={`Select ${label}`}
                />
            ),
            documentPath: (
                <div className={'flex'}>
                    <div className={'w-[50%]'}>
                        <Upload
                            accept={["image/jpeg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                            name={'file'}
                            fileList={selectedFile}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            onRemove={onRemoveFileUploadHandler}
                        >
                            {selectedFile.length >= 1 ? null : uploadButton}
                        </Upload>
                    </div>
                    <div className={'w-[50%] text-green-400 p-1 pl-2'}>
                        File Upload Progress is <span className={'text-green-900 font-bold'}> {progress}% </span>
                        { ((objectUrl && progress === 100) || rowdata?.documentPath) && <div><a href={objectUrl ? objectUrl : rowdata?.documentPath} target="_blank">View Selected File</a></div> }
                    </div>
                </div>
            ),
        }
        
        return _components[type] || null
    }

    useEffect(() => {
        // For add and edit form , If api response has successfully done then re-direct to parent path 
        success && navigate(parent)
    }, [ success ])

    useEffect(()=> {
        dispatch(getCountrySearchList({ page: 0, pageSize: 100 }));
        dispatch(getAircraftTypeSearchList({ page: 0, pageSize: 200 }));
        
        // fetch row data
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(SIM_TRAINING.GET_TRAINING_CENTER + id)

                const newvalues = {
                    ...data,
                    documentPath: data?.documentPath,
                    atoCertificateValidity: data?.atoCertificateValidity && dayjs(data.atoCertificateValidity),
                    caabValidity: data?.caabValidity && dayjs(data.caabValidity),
                    certificates: data?.certificates?.map( item => ({
                        ...item,
                        documentNameCer: item?.documentName,
                        fileCer: item?.documentPath,
                        certificateValidity: item?.certificateValidity && dayjs( item.certificateValidity ),
                    }) )
                }
                onValueChangeHander({ countryId: data.countryId })
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

    const onValueChangeHander = (changedValues) => {
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(SIM_TRAINING.GET_CITY_BY_COUNTRY,  { params: {countryId: changedValues?.countryId} })
                const dataList = data?.model?.length ? data.model : []
                setSortedCity(dataList)
            } catch (error) {
                form.setFieldsValue({
                    cityId: undefined
                })
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(changedValues?.countryId) {
            form.setFieldsValue({
                cityId: undefined
            })
            _fetchData()
        }
    } 
    
    const defaultSlotSesion = [
        {
            key: 0,
            certificateNo: null,
            serialNo: null,
            qualificationLevel: null,
            documentNameCer: null,
            fileCer: null,
            certificateValidity: null,
        }
    ]
    
    return (
        <div className={'bg-white py-3 rounded-md'}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
                initialValues={ { certificates: defaultSlotSesion } }
                onValuesChange={onValueChangeHander}
            >
            <div className={'gap-5 sm:p-5 sm:pt-2'}>
                {
                    addEditInfoFields?.map((field, index) => {
                        return (
                            <div >
                                <Badge.Ribbon text={field.field_name} placement='start' color="magenta">
                                    <div key={index} className={' grid sm:grid-cols-3 lg:grid-cols-2 border-solid border-2 border-gray-200 rounded-lg  shadow-md gap-5 sm:p-5 mb-5'}>
                                        { field.field.map(item => item.id && (
                                            <div key={item.id} className={'pt-5'}>
                                                <Form.Item
                                                    key={item.id}
                                                    name={item.name}
                                                    label={item.label}
                                                    rules={item.rules}
                                                    dependencies={item.dependencies ?? []}
                                                >
                                                    {inputField(item)}
                                                </Form.Item>
                                            </div>
                                        )) }
                                    </div>
                                </Badge.Ribbon>
                                {
                                    <Form.List name="certificates">
                                        { ( fields, { add, remove } ) => (
                                            <>
                                                { fields.map( ( { key, name, ...restField }, index ) => (
                                                <Badge.Ribbon text={`Multiple Certificate block ${index + 1}`} placement='start' color="volcano">
                                                    <Space
                                                        key={ key }
                                                        style={ {
                                                            marginBottom: 8,
                                                        } }
                                                        {...formItemLayout}
                                                        className={'grid sm:grid-cols-2 lg:grid-cols-4 bg-[#C9EEFF] p-2 border border-blue-400 shadow-md rounded-md w-full pt-10'}
                                                    >
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'certificateNo' ] }
                                                            label="Certificate No."
                                                            rules={ [
                                                                {
                                                                    required: true,
                                                                    message: 'Certificate No is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <Input type={'text'} placeholder="Enter certificate no" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'certificateValidity' ] }
                                                            label="Certificate Validity"
                                                            rules={ [
                                                                {
                                                                    required: true,
                                                                    message: 'Certificate validity is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <DatePicker style={{width: '100%'}} placeholder='Select certificate validity date'/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'serialNo' ] }
                                                            label="Serial No."
                                                            rules={ [
                                                                {
                                                                    required: true,
                                                                    message: 'Serial No is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <Input type={'text'} placeholder="Enter serial no" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'qualificationLevel' ] }
                                                            label="Qualification Level"
                                                            rules={ [
                                                                {
                                                                    required: true,
                                                                    message: 'Qualification level is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <Input type={'text'} placeholder="Enter qualification level" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'documentNameCer' ] }
                                                            label="Document Name"
                                                            rules={ [
                                                                {
                                                                    required: true,
                                                                    message: 'Document name is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <Input type={'text'} placeholder="Enter document name" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                            name={ [ name, 'fileCer' ] }
                                                            label="Choose Certificate"
                                                            rules={ [
                                                                {
                                                                    required: false,
                                                                    message: 'Certificates is required.',
                                                                },
                                                            ] }
                                                        >
                                                            <>
                                                                <Upload
                                                                    accept={['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                                                    name={'file'}
                                                                    fileList={(multipleSelectedFile?.[key] && multipleObjectUrl?.[key]) ? [multipleSelectedFile[key]] : []}
                                                                    onChange={(info) => handleChangeMultipleFile(info, key)}
                                                                    beforeUpload={(file) => beforeUploadMultiple(file, key)}
                                                                    onRemove={() => onRemoveMultipleFileUploadHandler(key)}
                                                                >
                                                                    {(multipleObjectUrl?.[key]) ? null : MultipleUploadButton}
                                                                </Upload>
                                                            </>
                                                        </Form.Item>
                                                        <Form.Item
                                                            { ...restField }
                                                        >
                                                            <div className={'text-green-400 mt-5'}>
                                                                File Upload Progress is <span className={'text-green-900 font-bold'}> {Multipleprogress?.[key] ? Multipleprogress?.[key] + '%' : '0%'}</span>
                                                                { ((multipleObjectUrl?.[key] && Multipleprogress?.[key] === 100) || rowdata?.certificates?.[key]?.documentPath) && 
                                                                    <div>
                                                                        <a href={multipleObjectUrl?.[key] ? multipleObjectUrl?.[key] : rowdata?.certificates?.[key]?.documentPath} target="_blank">
                                                                            View Selected File
                                                                        </a>
                                                                    </div> 
                                                                }
                                                            </div>
                                                        </Form.Item>
                                                        { fields.length > 1 ? 
                                                            <MinusCircleOutlined 
                                                                className={'text-red-600'} 
                                                                onClick={ () => {
                                                                    remove( name )
                                                                    setMultipleSelectedFile((prev) => {
                                                                        const updatedItems = [...prev];
                                                                        updatedItems[key] = '';
                                                                        return updatedItems;
                                                                    })
                                                                    setMultipleObjectUrl((prev) => {
                                                                        const updatedItems = [...prev];
                                                                        updatedItems[key] = '';
                                                                        return updatedItems;
                                                                    })
                                                                }}
                                                            /> : null 
                                                        }
                                                    </Space>
                                                    </Badge.Ribbon>
                                                ) ) }
                                                <div className={'mt-2 float-right'}>
                                                    <Form.Item>
                                                        <Button 
                                                            type={'primary'} 
                                                            onClick={ () => add() } 
                                                            block
                                                            icon={ <PlusOutlined/> }
                                                        >
                                                            Add More
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            </>
                                        ) }
                                    </Form.List>
                                }
                            </div>
                            
                            
                        )
                    })
                }
                </div>
            <Form.Item style={{marginLeft: '17px', marginTop: '15px'}}>
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

export default TrainingCenterForm

// initial input field and value
const addEditInfoFields = [
    {
        field_name: 'Training Center Info',
        field: [
            {
                id: 1,
                name: 'name',
                label: 'Training Center Name',
                type: 'text',
                rules: [
                    {
                        type: 'text',
                        message: 'The input is not valid',
                    },
                    {
                        required: true,
                        message: 'Training Center Name is required.',
                    },
                ],
            },
            {
                id: 11,
                name: 'shortName',
                label: 'Training Center Short Name',
                type: 'text',
                rules: [
                    {
                        type: 'text',
                        message: 'The input is not valid',
                    },
                    {
                        required: false,
                        message: 'Training Center Short Name is required.',
                    },
                ],
            },
            {
                id: 2,
                name: 'aircraftTypesIds',
                label: 'Aircraft Type',
                type: 'aircraftTypesIds',
                rules: [
                    {
                        type: 'select',
                        message: 'The input is not valid name',
                    },
                    {
                        required: true,
                        message: 'Aircraft Types is required.',
                    },
                ],
            },
            {
                id: 3,
                name: 'atoCertificateNo',
                label: 'ATO Certificate No',
                type: 'text',
                rules: [
                    {
                        type: 'text',
                        message: 'The input is not valid name',
                    },
                    {
                        required: true,
                        message: 'ATO Certificate No is required.',
                    },
                ],
            },
            {
                id: 4,
                name: 'atoCertificateValidity',
                label: 'ATO Certificate Validity',
                type: 'date',
                rules: [
                    {
                        type: 'date',
                        message: 'The input is not valid name',
                    },
                    {
                        required: false,
                        message: 'ATO Certificate Validity is required.',
                    },
                ],
            },
            {
                id: 5,
                name: 'caabValidity',
                label: 'CAAB Validity',
                type: 'date',
                rules: [
                    {
                        type: 'date',
                        message: 'The input is not valid name',
                    },
                    {
                        required: true,
                        message: 'CAAB Validity is required.',
                    },
                ],
            },
            {
                id: 6,
                name: 'countryId',
                label: 'Country',
                type: 'selectCountry',
                rules: [
                    {
                        type: 'select',
                        message: 'The input is not valid',
                    },
                    {
                        required: true,
                        message: 'Country is required.',
                    },
                ],
            },
            {
                id: 7,
                name: 'cityId',
                label: 'City',
                type: 'selectCity',
                rules: [
                    {
                        type: 'select',
                        message: 'The input is not valid',
                    },
                    {
                        required: true,
                        message: 'City is required.',
                    },
                ],
            },
            {
                id: 9,
                name: 'documentName',
                label: 'Document Name',
                type: 'text',
                rules: [
                    {
                        type: 'text',
                        message: 'The input is not valid',
                    },
                    {
                        required: true,
                        message: 'Document name is required.',
                    },
                ],
            },
            {
                id: 10,
                name: 'documentPath',
                label: 'Upload File',
                type: 'documentPath',
                rules: [
                    {
                        type: 'file',
                        message: 'The input is not valid',
                    },
                    {
                        required: false,
                        message: 'Please select a file.',
                    },
                ],
            },
            {
                id: 8,
                name: 'remarks',
                label: 'Remarks',
                type: 'textarea',
                rules: [
                    {
                        type: 'textarea',
                        message: 'The input is not valid',
                    },
                    {
                        required: false,
                        message: 'Remarks is required.',
                    },
                ],
            },
        ]
    },
]