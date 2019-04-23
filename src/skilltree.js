const skilltree = require('skilltree.js')
const bel = require('bel')
const csjs = require('csjs-inject')
const registry = require('url-registry')

const crawler = require('crawl-workshops')

var db

module.exports = playSkilltrees

async function playSkilltrees (data /*array of workshop URLs*/) {
  try {
    db = await getDB()
    const _data = data || await db.list()
    const dag = typeof _data[0] === 'string' ?
      await crawler(_data /* @NOTE array of workshop URLs */)
      : _data
    return bel`<div class=${css.skilltree}>${skilltree(dag)}</div>`
  } catch (e) {
    throw new Error('something went wrong')
  }
}
const getDB = async () => db || await registry(`r70vo-1554993396`, () => true)
const css = csjs`
.skilltree {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}`
