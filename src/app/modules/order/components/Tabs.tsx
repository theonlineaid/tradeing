/* eslint-disable react-hooks/rules-of-hooks */
import { useLayoutEffect, useState } from "react"

export default function Tabs() {

  let Name = ['DP & BO type' , 'Basic Info' , 'Other Info' , 'Address' , 'Bank Details' , 'Nominees' , 'Upload' , 'Finish']
  let Routes = ['create' , 'basic' , 'other-info' , 'address' , 'bank-details' , 'nominees' , 'upload' , 'finish']

  let page = 4

  return (
    <div className="d-flex flex-row bd-highlight mb-3">
        {Name.map((record,key) => (
          key <= page
            ? (
              <div className="p-2 bd-highlight activeTab" key={key}>
                <h5>{ key + 1 }</h5>
                <p>{record}</p>
              </div>
            )
            : (
              <div className="p-2 bd-highlight" key={key}>
                <h5>{ key + 1 }</h5>
                <p>{record}</p>
              </div>
            )
        ))}
    </div>
  )
}
