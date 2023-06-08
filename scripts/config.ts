import path from 'path'
import fs from 'fs'

const dirs = fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })

export default {
  entryList: dirs.filter(o => o.isDirectory()).map(o => o.name),
}
