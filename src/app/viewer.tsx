import * as React from 'react'
import {useState} from 'react'
import MaskedInput from 'react-text-mask'
import styled from '@emotion/styled'

import {Card} from '../ui/Card'

import countriesData from '../dataset/countries'
import {isJSXNamespacedName} from '@babel/types'
import {personTypes} from '../dataset/person-types'

const nationalIDMask = [
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
]

const NumberInput = styled(MaskedInput)`
  border: none;
  background: #fff;

  box-shadow: 0 6px 8px rgba(102, 119, 136, 0.03),
    0 1px 2px rgba(102, 119, 136, 0.3);
  font-size: 2em;
  outline: none;

  padding: 0.3em 0.5em;
  text-align: center;
  border-bottom: 2px solid #1abc9c;

  color: #333;
  font-weight: bold;
  font-family: 'FuraCode Nerd Font', 'Fira Mono', 'Sukhumvit Set', 'Kanit', sans-serif;
`

interface ProvinceData {
  code: number,
  thName: string,
  enName: string
}

const getProvinceFromCode = (code: number): ProvinceData =>
  countriesData.find(x => x.code === code)

const MeaningCard = styled(Card)`
  text-align: left;
  margin: 2.5em 2em 0 2em;
  max-width: 800px;
`

const Clickable = styled.span`
  text-decoration: underline;
  color: #16a085;
  cursor: pointer;
`

const Highlight  = styled.span`
  color: #16a085;
`

const PersonTypeDesc = styled.div`
  color: #555;
  margin-top: 5px;
  margin-bottom: 30px;
`

const Code = styled.span`
  color: #555;
  font-size: 0.85em;
`

// หลักที่ 1 หมายถึงประเภทของบุคคล
// หลักที่ 2 และ 3 หมายถึงจังหวัดภูมิลำเนา
// หลักที่ 4 และ 5 หมายถึง รหัสเขต หรืออำเภอ
// หลักที่ 6 -10 หมายถึง กลุ่มบุคคล ตามประเภทจากหลักแรก หรือเลขเล่มของสูติบัตรซึ่งหมายถึงเลขประจำตัวในทะเบียนบ้านที่ทางเขต หรืออำเภอออกให้ และจะถูกนำมาวางไว้ในบัตรประจำตัวประชาชนกลุ่มหลักดังกล่าว
// หลักที่ 11-12 หมายถึงลำดับที่ของบุคคลในแต่ละกลุ่มประเภท เป็นการจัดลำดับว่าเราเป็นคนที่เท่าไรในกลุ่มของบุคคลประเภทนั้นๆ
// หลักที่ 13 หลักสุดท้าย หมายถึงตัวเลขสำหรับตรวจสอบความถูกต้องของเลขทั้ง 12 หลักแรกอีกที

function getPersonInfoFromNationalID(id: string) {
  const typeCode = Number(id[0])
  const typeDesc = personTypes[typeCode] || 'ไม่พบข้อมูลประเภทบุคคล'

  const provinceCode = Number(id.slice(1, 3))
  const province = getProvinceFromCode(provinceCode)

  return {typeCode, typeDesc, province}
}

function ProvinceView({province}: {province: ProvinceData}) {
  if (!province) return null

  return (
    <h2 title={province.enName}>
      หลักที่ 2-3 <Code>(เลข {province.code})</Code>: เกิดที่จังหวัด{province.thName}
    </h2>
  )
}

export function Meaning({text}: {text: string}) {
  if (!text) return null

  const [showTypeDesc, setShowTypeDesc] = useState(true)

  const toggleShowTypeDesc = () => setShowTypeDesc(!showTypeDesc)

  const id = text.replace(/[-_]/g, '')
  const {typeCode, typeDesc, province} = getPersonInfoFromNationalID(id)

  return (
    <MeaningCard>
      <h2
        title={typeDesc}
        onClick={toggleShowTypeDesc}>
        หลักที่ 1: <Clickable>บุคคลประเภทที่ {typeCode}</Clickable>
      </h2>

      {showTypeDesc && <PersonTypeDesc>{typeDesc}</PersonTypeDesc>}

      <ProvinceView province={province} />
    </MeaningCard>
  )
}

export function Viewer() {
  const [id, setID] = useState('')

  return (
    <div>
      <NumberInput
        mask={nationalIDMask}
        value={id}
        onChange={e => setID(e.target.value)}
        placeholder="1-2345-67890-12"
      />

      <Meaning text={id} />
    </div>
  )
}
