const chai = require('chai')
const expect = chai.expect
const reorder = require('../src/reorder')
const ToyVDom = require('../src/vdom')
const diff = require('../src/diff')
const patch = require('../src/patch')


const jsdom = require('jsdom')
const { JSDOM } = jsdom


const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document


describe("patch method test", function() {
    let oldNode = new ToyVDom('div', { class: 'root', id: 'top'}, [
        new ToyVDom('p', { class: 'son'}, [
            '1'
        ]),
        new ToyVDom('div', { class: 'son'}, [
            new ToyVDom('p', { class: 'grandson '}, ['2'])
        ])
    ])
    oldNode.countDescendants()
    let oldDom = oldNode.render()
    let newNode = new ToyVDom('div', { class: 'top', id: 'root'}, [
        new ToyVDom('div', { class: 'son', key: '234' }, [
            new ToyVDom('p', { class: 'grandson'}, ['2', '3'])
        ]),
        new ToyVDom('p', { class: 'son', key: '123' }, [
            '2'
        ]),
        new ToyVDom('p', { class: 'son' }, [
            '2', '6'
        ]),
    ])
    let patches = diff(oldNode, newNode)
    patch(oldDom, patches)
    describe("updated dom root id should be root", function() {
        expect(oldDom.id).to.equal('root')
    })
    describe("updated dom root class should be top", function() {
        expect(oldDom.className).to.equal('top')
    })
    describe("updated dom first child should be div", function() {
        expect(oldDom.firstElementChild.tagName).to.equal('DIV')
    })
    describe("updated dom first grand child should have two children", function() {
        expect(oldDom.firstElementChild.firstElementChild.childNodes.length).to.equal(2)
    })
    describe("updated last child should have two children", function() {
        expect(oldDom.lastElementChild.childNodes.length).to.equal(2)
    })
})