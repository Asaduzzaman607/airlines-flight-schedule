import styled from "styled-components";

const CalenderTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
  //table-layout: fixed;
  
  thead {
    position: sticky;
    top: 0;
    background-color: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
    z-index: 10;
  }


  tr>th:first-child,tr>td:first-child {
    position: sticky;
    left: 0;
    background-color: #fff;
    z-index: 5;
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  }

  thead th:not(:first-child) {
    min-width:150px;
    max-width:150px
  }

  th:first-child {
    min-width:200px;
  }
  
  th {
    border: 1px solid #efefef;
    width: 100px;
  }

  td {
    border: 1px solid #efefef;
  }
`


export default CalenderTable;
