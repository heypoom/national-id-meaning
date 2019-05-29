import * as fs from 'fs'

import {Location} from './src/app/viewer'
import {ThailandDatabase} from './src/dataset/raw-database'

const maps: {[code: number]: Location} = {}

for (let location of ThailandDatabase) {
  if (maps[location.amphoe_code]) continue

  maps[location.amphoe_code] = {
    province: location.province,
    province_code: location.province_code,
    amphoe: location.amphoe,
    amphoe_code: location.amphoe_code,
    zipcode: location.zipcode,
  }
}

const list = Object.values(maps)

console.log(list.length)

fs.writeFileSync(`./list.json`, JSON.stringify(list))
