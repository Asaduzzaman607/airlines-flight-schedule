import React from 'react'
import { Table } from 'antd'

export default function DetailsModalTableView ({ tableInfo }) {

    // fake data
    const data = {
        user_info: { 
          name: 'A',
          email: 'A@gmail.com',
          id: 1,
          profile: '#'
        },
        card_info: [{}],
        table_info: [
          {
            title: 'Role 1',
            columns: [
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
              },
              {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
              },
            ],
            dataSource: [
              {
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
              },
              {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
              },
            ]
          },
          {
            title: 'Role 2',
            columns: [
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
              },
              {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
              },
            ],
            dataSource: [
              {
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
              },
              {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
              },
              {
                key: '3',
                name: 'John',
                age: 432,
                address: '10 Downing Street',
              },
              {
                key: '4',
                name: 'John',
                age: 424,
                address: '10 Downing Street',
              },
              {
                key: '5',
                name: 'John',
                age: 452,
                address: '10 Downing Street',
              },
              {
                key: '6',
                name: 'John',
                age: 462,
                address: '10 Downing Street',
              },
              {
                key: '7',
                name: 'John',
                age: 472,
                address: '10 Downing Street',
              },
              {
                key: '8',
                name: 'John',
                age: 482,
                address: '10 Downing Street',
              },
              {
                key: '9',
                name: 'John',
                age: 492,
                address: '10 Downing Street',
              },
              {
                key: '10',
                name: 'John',
                age: 4102,
                address: '10 Downing Street',
              },
              {
                key: '11',
                name: 'John',
                age: 4112,
                address: '10 Downing Street',
              },
              {
                key: '12',
                name: 'John',
                age: 412,
                address: '10 Downing Street',
              },
            ]
          },
        ]
    }
        
  return (
    <div>
        {
            tableInfo?.length > 0 && tableInfo.map((item, index) => (
                <div key={index} className={'mt-4 bg-[#eceff0] border-solid border-2 border-gray-200 rounded-lg'}>
                    <div className={'p-4 bg-black rounded-t-lg text-white uppercase font-bold'}>{ item?.title }</div>
                    <div className={''}>
                        <Table 
                            columns={item.columns} 
                            dataSource={item.dataSource} 
                            pagination={{
                                position: ['bottomCenter'],
                                pageSizeOptions: false
                            }}
                            size={'small'}
                        />
                    </div>
                </div>
            ))
        }
    </div>
  )
}
