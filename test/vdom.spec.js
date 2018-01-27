const chai = require('chai')
const expect = chai.expect
const ToyVDom = require('../src/vdom')
require('jsdom-global')()

describe("virutal dom test", function() {
    let el = new ToyVDom('div', { class: 'root', id: 'top'}, [
        new ToyVDom('p', { class: 'son'}, [
            '1'
        ]),
        new ToyVDom('div', { class: 'son'}, [
            new ToyVDom('p', { class: 'grandson '}, ['2'])
        ])
    ])
    describe("set descendants for every node", function() {
        el.countDescendants()
        let firstSon = el.children[0]
        let secondSon = el.children[1]
        let childOfFisrtSon = firstSon.children[0]
        let childOfSecondSon = secondSon.children[0]
        it("root should have descendants of 5", function() {
            expect(el.count).to.equal(5)
        })
        it("first son should have descendants of 1", function() {

            expect(firstSon.count).to.equal(1)
        })

        it("first son should have descendants of 2", function() {
            expect(secondSon.count).to.equal(2)
        })
        it("child of first son should have descendants of 1", function() {
            expect(childOfSecondSon.count).to.equal(1)
        })
    })
})