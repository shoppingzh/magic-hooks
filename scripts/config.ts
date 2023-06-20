import path from 'path'
import fs from 'fs'

const dirs = fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })

const devList = [
  'useLoadList'
]

export default {
  entryList: dirs.filter(o => o.isDirectory() && !/^_/.test(o.name) && devList.indexOf(o.name) < 0).map(o => o.name),
}
