import { CustomInput, CustomInputNumber, CustomDatePicker, CustomTimePicker, CustomSelectBox } from '../commonComponents'

// table's filter component based on type
const InputFieldFilter = (header, type, commonSelectOptions , ...rest) => {

    const _components = {
        //for email and text type
        text: <CustomInput
            value={header.column.getFilterValue() ?? ''}
            onChange={(e) => {
                header.column.setFilterValue(e.target.value || undefined)
            }}
            type={type}
        />,
        number: <CustomInputNumber
            value={header.column.getFilterValue() ?? ''}
            onChange={(e) => {
                header.column.setFilterValue(e.target.value || undefined)
            }}
            type={'number'}
        />,
        date: <CustomDatePicker
            defaultValue={null}
            onChange={(date, dateString) => {
                header.column.setFilterValue(dateString || undefined)
            }}
            style={{ width: '100%' }}
        />,
        datewithtime: <CustomTimePicker
            value={header.column.getFilterValue() ?? ''}
            onChange={(date, dateString) => {
                header.column.setFilterValue(dateString || undefined)
            }}
            showTime
            style={{ width: '100%' }}
        />,
        commonSelect: (
            <CustomSelectBox
                itemList={commonSelectOptions ?? []}
                label={'name'}             
                mode={'single'}
                allowClear
                showSearch
                style={{
                    width: '100%',
                }}
                value={header.column.getFilterValue() ?? ''}
                dataIndex={'value'}
                onChange={(value) => {
                    header.column.setFilterValue(value || undefined)
                }}
            />
        ),
        ...rest
    }

    return _components[type] || null;
};

export default InputFieldFilter;