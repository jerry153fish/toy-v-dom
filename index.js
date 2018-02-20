const ToyVDom = require('./src/vdom')
const diff = require('./src/diff')
const patch = require('./src/patch')

module.exports = {
    ToyVDom: ToyVDom,
    diff: diff,
    patch: patch
}