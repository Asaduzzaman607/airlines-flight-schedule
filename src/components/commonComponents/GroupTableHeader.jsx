const customStyle={
   background: '#01bcd4', 
   padding:"5px", 
   color:"#fff" 
}
function GroupTableHeader ({ title, style=customStyle }) {
  
   return <div style={style}>{title}</div>
  }

  export default GroupTableHeader