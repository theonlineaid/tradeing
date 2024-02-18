import {Chart} from 'react-google-charts'

export const data = [
  ['Task', 'Hours per Day'],
  ['Gain', 11],
  ['Loss', 2],
]

// export const options = {
//   title: "My Daily Activities",
// };

function PieChart() {
  return (
    <Chart
      className='pie-chart'
      chartType='PieChart'
      data={data}
      // options={options}
      width={'100%'}
      height={'300px'}
      
    />
  )
}
export default PieChart
