import { useState, memo } from 'react';
import dayjs from 'dayjs'

// import components
import { InputNumber, TimePicker, Select, Input } from 'antd';

const EditableCell = memo(({ value, onSave, type, success }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // save handler
  const handleSave = () => {
    setEditing(false);
    onSave(inputValue);
  };

  // The handleCancel function is triggered when the user clicks outside the input element or presses the escape key while editing.
  const handleCancel = () => {
    setEditing(false);
    setInputValue(value);
    setEditing(true);
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue ? newValue : value);
  };

  const handleInputBlur = () => {
    handleSave();
  };

  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSave();
    }
  };

  const renderInput = () => {
    if (type === 'number') {
      return (
        <InputNumber
          value={(inputValue === 'N/A') ? null : inputValue}
          onChange={handleInputChange}
          min={0}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      );
    } else if (type === 'date') {
      return (
        <TimePicker
          value={inputValue === 'N/A' ? null : dayjs(inputValue, 'HH:mm')}
          format="HHmm"
          onChange={(newValue) => handleInputChange(newValue.format('HH:mm'))}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
          allowClear={false}
        />
      );
    } else if(type === 'select') {
        return (
            <Select 
                value={inputValue === 'N/A' ? null : inputValue}
                onChange={(event) => handleInputChange(event)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                placeholder={'Please select any one.'}
                style={{ width: '100%' }}
            >
                <Select.Option value={'P1'}> P1 </Select.Option>
                <Select.Option value={'P2'}> P2 </Select.Option>
            </Select>
        );
    } else if(type === 'text') {
        return (
            <Input
                value={(inputValue === 'N/A') ? null : inputValue}
                placeholder={'Please input here.'}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
            />
        );
    }
  };

  if (editing) {
    return renderInput();
  }
    
  return (
    <div
      className={"editable-cell-value-wrap"}
      onClick={() => setEditing(true)}
    >
      { success ? inputValue : value }
    </div>
  );
});

export default EditableCell;
