const chai = require('chai')
const expect = chai.expect
const ToyVDom = require('../src/vdom')
const jsdom = require('jsdom')
const { JSDOM } = jsdom


const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

describe("virutal dom test", function() {
    let el = new ToyVDom('div', { class: 'root', id: 'top'}, [
        new ToyVDom('p', { class: 'son'}, [
            '1'
        ]),
        new ToyVDom('div', { class: 'son'}, [
            new ToyVDom('p', { class: 'grandson '}, ['2'])
        ])
    ])
    describe("descendants counts test", function() {
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
        it("child of first son should have descendants of 1", function() {
            expect(childOfSecondSon.count).to.equal(1)
        })
    })
    describe("render test", function() {
        let realEl = el.render()
        let firstRealSom = realEl.firstElementChild
        it("root should be a div element", function() {
            expect(realEl.tagName).to.equal('DIV')
        })
        it("root should be have two elements", function() {
            expect(realEl.childElementCount).to.equal(2)
        })
        it("root should have class name root", function() {
            expect(realEl.className).to.equal('root')
        })
        it("root should have id equal top", function() {
            expect(realEl.id).to.equal('top')
        })
        it("firstRealSom should be p", function() {
            expect(firstRealSom.tagName).to.equal('P')
        })        
    })
})