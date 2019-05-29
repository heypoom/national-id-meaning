import * as React from 'react'
import {useState} from 'react'
import MaskedInput from 'react-text-mask'
import styled from '@emotion/styled'

import {Card} from '../ui/Card'

import {personTypes} from '../dataset/person-types'
import {ThailandDatabase} from '../dataset/raw-database'

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
  font-family: 'FuraCode Nerd Font', 'Fira Mono', 'Sukhumvit Set', 'Kanit',
    sans-serif;
`

export interface Location {
  amphoe: string
  province: string
  zipcode: number
  amphoe_code: number
  province_code: number
}

function getProvinceFromCode(code: number): string {
  const location = ThailandDatabase.find(x => x.province_code === code)
  if (!location) return ''

  return location.province
}

function getAmphoeFromCode(code: number): string {
  const location = ThailandDatabase.find(x => x.amphoe_code === code)
  if (!location) return ''

  return location.amphoe
}

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

const Highlight = styled.span`
  color: #16a085;
`

const PersonTypeDesc = styled.div`
  color: #555;
  margin-bottom: 10px;
`

const Code = styled.span`
  color: #555;
  font-size: 0.85em;
`

function validateThaiCitizenID(id: string) {
  if (id.length != 13 || id.charAt(0).match(/[09]/)) return false

  let sum = 0

  for (let i = 0; i < 12; i++) {
    sum += Number(id.charAt(i)) * (13 - i)
  }

  if ((11 - (sum % 11)) % 10 != Number(id.charAt(12))) return false

  return true
}

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

  const amphoeCode = Number(id.slice(1, 5))
  const amphoe = getAmphoeFromCode(amphoeCode)

  const birthNumber = Number(id.slice(6, 10))
  const personOrder = Number(id.slice(11, 12))

  const isValid = validateThaiCitizenID(id)

  return {
    typeCode,
    typeDesc,
    provinceCode,
    province,
    amphoeCode,
    amphoe,
    birthNumber,
    personOrder,
    isValid,
  }
}

const Title = styled.h2`
  margin: 0.5em 0;
`

function ProvinceView({code, province}: {code: number; province: string}) {
  if (!province) return null

  return (
    <Title>
      หลักที่ 2-3 <Code>(เลข {code})</Code>: เกิดที่จังหวัด{province}
    </Title>
  )
}

function AmphoeView({code, amphoe}: {code: number; amphoe: string}) {
  if (!amphoe) return null

  const isBangkok = String(code).indexOf('10') === 0
  const districtPrefix = isBangkok ? 'เขต' : 'อำเภอ'

  return (
    <Title>
      หลักที่ 2-5 <Code>(เลข {code})</Code>: เกิดที่{districtPrefix}
      {amphoe}
    </Title>
  )
}

function ValidityView({last, isValid}: {last: string; isValid: boolean}) {
  if (!last) return null

  return (
    <Title style={{color: isValid ? '#16a085' : '#e74c3c'}}>
      หลักที่ 13 <Code style={{color: 'inherit'}}>(เลข {last})</Code>:
      เลขบัตรประจำตัว
      {isValid ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}
    </Title>
  )
}

export function Meaning({text}: {text: string}) {
  if (!text) return null

  const [showTypeDesc, setShowTypeDesc] = useState(true)

  const toggleShowTypeDesc = () => setShowTypeDesc(!showTypeDesc)

  const id = text.replace(/[-_]/g, '')
  const {
    typeCode,
    typeDesc,
    province,
    provinceCode,
    amphoe,
    amphoeCode,
    isValid,
  } = getPersonInfoFromNationalID(id)

  return (
    <MeaningCard>
      <Title title={typeDesc} onClick={toggleShowTypeDesc}>
        หลักที่ 1: <Clickable>บุคคลประเภทที่ {typeCode}</Clickable>
      </Title>

      {showTypeDesc && <PersonTypeDesc>{typeDesc}</PersonTypeDesc>}

      <ProvinceView code={provinceCode} province={province} />

      <AmphoeView code={amphoeCode} amphoe={amphoe} />

      <ValidityView last={id[12]} isValid={isValid} />
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
        placeholder="1-2345-67890-12-3"
      />

      <Meaning text={id} />
    </div>
  )
}
