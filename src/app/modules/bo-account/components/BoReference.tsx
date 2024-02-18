/**
 * Project   : Benemoy Securities Web Application
 * Details   : BO Reference - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 29-11-2022
 */

/* eslint-disable react-hooks/rules-of-hooks */
import Select from 'react-select'
import {useLayoutEffect, useState} from 'react'
import {boAcReference} from '../../auth/core/_requests'
import dataFormateForSelect from '../../../helpers/data-formate-for-select'

export default function BoReference({
  handleChangeTrackId,
}: {
  handleChangeTrackId: (id: string) => void
}) {
  // * States
  const [boTrackId, setBoTrackId] = useState<string>('')
  const [allBoTractData, setAllBoTractData] = useState<{value: string; label: string}[]>([])

  // * Actions
  const fetchData = async () => {
    try {
      let track_id = localStorage.getItem('bo_track_id')

      if (track_id) {
        setBoTrackId(track_id)
      } else {
        localStorage.removeItem('bo_track_id')
        setBoTrackId('')
      }

      const getData = await boAcReference()
      if (getData.data.status === 200) {
        let _data: any = await dataFormateForSelect(getData.data.data, 'bo_track_id', 'bo_track_id')

        _data.push({value: '', label: 'Create New Bo Account'})
        setAllBoTractData(_data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const reference = async (e: any) => {
    localStorage.setItem('bo_track_id', e.value)

    if (e.value) {
      handleChangeTrackId(e.value)
    } else {
      localStorage.removeItem('bo_track_id')
      handleChangeTrackId('')
    }
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='card mb-3'>
      <div className='card-body d-flex align-items-center p-8'>
        <div className='col-md-3'>
          <h6 className='mb-2 ms-2'>Select Incomplete BO Account</h6>
        </div>
        <div className='col-md-9'>
          {allBoTractData.length ? (
            <Select
              options={allBoTractData}
              className='custom_required'
              onChange={(e) => reference(e)}
              placeholder={boTrackId ? boTrackId : 'Select BO Reference'}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
