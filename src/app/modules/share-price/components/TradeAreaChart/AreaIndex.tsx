import React from 'react'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import Chart from './Chart'
import {getData} from './utils'

class AreaIndex extends React.Component<{}, {data: any}> {
  componentDidMount() {
    getData().then((data) => {
      this.setState({data: data})
    })
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>
    }

    if (this.state?.data.length) {
      return (
        <>
          <div className='area-chart d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <label htmlFor='exampleFormControlInput1' className='form-label me-3'>
                Select
              </label>
              <select className='form-select' aria-label='Default select example'>
                <option defaultValue={'select'}>Select One</option>
                <option value={'1'}>DSEX</option>
                <option value={'2'}>DSES</option>
                <option value={'3'}>CDSET</option>
              </select>
            </div>
            <ul className='area-chart-list-option'>
              <li>6759.98</li>
              <li className='text-danger'>-47.54</li>
              <li className='text-danger'>-0.28%</li>
            </ul>
          </div>
          <TypeChooser>{(type) => <Chart type={type} data={this.state?.data} />}</TypeChooser>
        </>
      )
    }
  }
}
export default AreaIndex
