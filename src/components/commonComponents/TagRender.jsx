 import React, { useMemo } from 'react';
 import { Tag } from 'antd';

 export const TagRender = (props) => {
    const { label, value, closable, onClose } = props;
   
    // set color
    const _setColor = [
        '#163554',
        '#4472c4',
        '#00b050',
        '#ed7d31',
        'rgb(17 78 135)',
        'rgb(0 47 0)',
        'rgb(21 119 119)',
        '#ffc000',
        '#ff00ff',
        '#70ad47',
        '#354d3b',
        'rgb(14 9 124)',
        'rgb(102 31 83)',
        '#7a827c',
    ];
   
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };


    const _getRandomColor = useMemo(() => {
        // generate a random index for _setColor
        const colorIndex = Math.floor(Math.random() * _setColor.length);
        return _setColor[colorIndex]
    },[label, value])

    
    return (
      <Tag
        color={_getRandomColor}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
};