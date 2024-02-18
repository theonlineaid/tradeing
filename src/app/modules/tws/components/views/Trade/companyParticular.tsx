import React, { useContext, useEffect, useRef } from 'react'
import _ from 'lodash'
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '#store/index';

const CompanyParticular = (props) => {


  const {buySell} = useSelector((state: RootState) => state)
  const data = buySell?.modalData
  console.log(data)
  return (
    <>
      <ListGroup>
        <ListGroup.Item>
          <Row>
            <Col xs={3}>Name: &nbsp; {data?.short_name}</Col>
            <Col xs={3}>Ticker: &nbsp; 1STPRIMFMF.XDSE</Col>
            <Col xs={3}>Currency: &nbsp; BDT</Col>
            <Col xs={3}>Lot Size: &nbsp; 1</Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col xs={3}>Last: &nbsp; 0.0</Col>
            <Col xs={3}>Nett: &nbsp; -</Col>
            <Col xs={3}>Day%: &nbsp; -</Col>
            <Col xs={3}>Vol: &nbsp; 0</Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col xs={3}>Open: &nbsp; 0.0</Col>
            <Col xs={3}>High: &nbsp; -</Col>
            <Col xs={3}>Low: &nbsp; -</Col>
            <Col xs={3}>Close: &nbsp; 0</Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col xs={3}>OpenVol: &nbsp; 0.0</Col>
            <Col xs={3}>Floor: &nbsp; -</Col>
            <Col xs={3}>Ceiling: &nbsp; -</Col>
            <Col xs={3}>VWAP: &nbsp; 0</Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col xs={3}>Board: &nbsp; 0.0</Col>
            <Col xs={3}>Sector: &nbsp; -</Col>
            <Col xs={3}>Listed Shares: &nbsp; -</Col>
            <Col xs={3}>PVWAP: &nbsp; -</Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </>
  )
}

export default React.memo(CompanyParticular)
