import { FiCheck, FiX, FiCornerUpLeft, FiChevronsRight, FiRepeat } from "react-icons/fi";

const blotterIconRendered = (params) => {
    if(params.value === 'Rejected') {
      return <FiCornerUpLeft style={{ fontWeight: "bolder", fontSize: '18px', color: '#FFF', backgroundColor:"#FD7272" }}/>
    } 
    else if(params.value === 'Replaced') {
      return <FiRepeat style={{ fontWeight: "bolder", fontSize: '18px', color: '#FFF', backgroundColor:"#FD7272" }}/>
    } 
    else if(params.value === 'Filled') {
      return <FiCheck style={{ fontWeight: '900', fontSize: '18px', color: '#FFF', backgroundColor: '#55E6C1' }}/>
    } 
    else if(params.value === 'Expired') {
      return <FiX style={{ fontWeight: '900', fontSize: '18px', color: '#FFF', backgroundColor: 'orange' }}/>
    }
    else if(params.value === 'Partially filled') {
      return <FiCheck style={{ fontWeight: '900', fontSize: '18px', color: '#FFF', backgroundColor: '#9AECDB' }}/>
    }
    else if(params.value === 'New') {
      return <FiChevronsRight style={{ fontWeight: '900', fontSize: '18px', color: '#FFF', backgroundColor: '#54a0ff' }}/>
    }
    else {
      return 
    }
  };

  export default blotterIconRendered;