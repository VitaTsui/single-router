const path = require('path')
const fs = require('fs')
const fileSave = require('file-save')

const dir = process.argv[2]
const dirPath = path.resolve(__dirname, `../${dir}`)

const typing = path.resolve(__dirname, '../src/typing.d.ts')
fs.readFile(typing, 'utf-8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const _filePath = `${dirPath}/typing.d.ts`
  fileSave(_filePath).write(data, 'utf-8')
})
