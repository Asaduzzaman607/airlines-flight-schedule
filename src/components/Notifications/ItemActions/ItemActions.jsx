import styled from "styled-components";

import { PulsatingDot } from "./PulsatingDot";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
  
  const Wrapper = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `;
  
  const Button = styled.button`
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
  `;
  
  function ItemActions({ notification, markAsRead, remove }) {
    return (
      <Wrapper>
        {notification.read ? (
          <CheckOutlined style={{color: 'green', fontSize: '15px', paddingBottom: '5px'}} />
        ) : (
          <Button
            title="Mark as read"
            onClick={(event) => {
              markAsRead(notification.id);
              event.stopPropagation()
            }}
          >
            <PulsatingDot />
          </Button>
        )}
        <Button onClick={() => remove(notification.id)} title="Archive">
          <DeleteOutlined style={{color: '#666', fontSize: '15px', marginTop: '8px'}} />
        </Button>
      </Wrapper>
    );
  }
  
  export { ItemActions };
  