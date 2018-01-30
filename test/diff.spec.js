const chai = require('chai')
const expect = chai.expect
const ToyVDom = require('../src/vdom')
const diff = require('../src/diff')

describe("diff method test", function() {
    describe("single node diff", function() {
        let oldNode = new ToyVDom('div', { class: 'root', id: 'top'}, ['1'])
        oldNode.countDescendants()
        it("should return replace mutation in uid 0", function() {
            let newNode = new ToyVDom('p')
            let patches = diff(oldNode, newNode)
            expect(patches[0]).to.be.an('array')
            expect(patches[0][0]).to.have.property('type', 0)
        })
        it("should return prps mutation in uid 0", function() {
            let newNode = new ToyVDom('div', {class: 'keke'})
            let patches = diff(oldNode, newNode)
            // console.log(patches)
            expect(patches[0]).to.be.an('array')
            expect(patches[0][0]).to.have.property('type', 1)
        })
        it("should return text mutation in uid 1", function() {
            let newNode = new ToyVDom('div', { class: 'root', id: 'top'}, ['2'])
            let patches = diff(oldNode, newNode)
            // console.log(patches)
            expect(patches[1]).to.be.an('array')
            expect(patches[1][0]).to.have.property('type', 2 )
        })
    })
})