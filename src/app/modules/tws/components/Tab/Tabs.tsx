import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import CheckList from '../../../../common/components/ui/CheckList'

interface Props {
  checkData: any
  handleCheckData: any
}



const ModalTabs: React.FC<React.PropsWithChildren<Props>> = ({checkData, handleCheckData}) => {
  return (
    <Tabs defaultActiveKey='column' transition={false} id='noanim-tab-example' className='mb-3'>
      <Tab eventKey='column' title='Columns'>
        <ul className='d-flex flex-wrap p-0'>
          {checkData &&
            checkData.map((check) => (
              <CheckList key={check.field} check={check} handleCheckData={handleCheckData} />
            ))}
        </ul>Select an marketSelect an market
      </Tab>
      <Tab eventKey='watchlist' title='Watch List'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </Tab>
      <Tab eventKey='watchlist' title='Watch List'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </Tab>
    </Tabs>
  )
}

export default ModalTabs
