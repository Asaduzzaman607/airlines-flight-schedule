import { useState } from 'react'
import { Space, Input } from 'antd'
const { Search } = Input

export default function IndivisualSearchBlock({ dataList, setDataList }) {
    const [initialDataList, setInitialDataList] = useState(dataList);

    // search hanlder
    const onSearch = (value) => {
        if (value.target.value.trim()) {
            const filteredList = initialDataList.filter(item => {
                let sortedList = item.employeeId.toString().slice(0, value.target.value?.length) == value.target.value;
                if(sortedList) return item;
            });

            // sort by employeeId in ascending order
            filteredList.sort((a, b) => a.employeeId - b.employeeId); 
            setDataList(filteredList);
        } else {
            setDataList(initialDataList);
        }
        
    };
      
    return (
        <div>
            <Space>
                <Search 
                    placeholder="Search by id" 
                    onChange={onSearch}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }} 
                    enterButton 
                    style={{
                        width: 200,
                    }}
                />
            </Space>
        </div>
    )
}
