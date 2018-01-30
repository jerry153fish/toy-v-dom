const chai = require('chai')
const expect = chai.expect
const reorder = require('../src/reorder')
const ToyVDom = require('../src/vdom')

describe("reorder test", function() {
    const flatChildrenArray = reorder.flatChildrenArray
    const generateReOrderNewChildren = reorder.generateReOrderNewChildren
    const clearRecorderNewChildrenAndRecordRemove = reorder.clearRecorderNewChildrenAndRecordRemove
    const generateInsertMoveMutations = reorder.generateInsertMoveMutations
    const reorderChildren = reorder.reorderChildren
    let testChild1 = [new ToyVDom('p', {key: 1}),new ToyVDom('p', {key: 5}), new ToyVDom('p', {key: 9}), 'aa',new ToyVDom('p', {class: 'aa'})]
    let flatChild1 = flatChildrenArray(testChild1)
    let moves = []
    let testChild2 = [new ToyVDom('p', {key: 5}), new ToyVDom('p', {key: 1}), new ToyVDom('p', {key: 11}), new ToyVDom('p', {class: 'aa'}), 'aa']
    let flatChild2 = flatChildrenArray(testChild2)
    let reorderTestChild2 = generateReOrderNewChildren(testChild1, testChild2, flatChild2)

    describe("flatChildrenArray test", function() {
        let flatChild1IndexHashMap = flatChild1.keyHashMap
        let flatChild1NoKeyItems = flatChild1.noKeyItems
        it("flatChild1IndexHashMap should be right", function() {
            expect(flatChild1IndexHashMap).to.have.property('1', 0)
            expect(flatChild1IndexHashMap).to.have.property('5', 1)
            expect(flatChild1IndexHashMap).to.have.property('9', 2)
        })
        it("flatChild1NoKeyItems should be right", function() {
            expect(flatChild1NoKeyItems).to.include('aa')
            expect(flatChild1NoKeyItems).to.deep.include(new ToyVDom('p', {class: 'aa'}))
        })
    })
    describe("generateReOrderNewChildren test", function() {
        it("reorderTestChild2 should be array and have lenght 5", function() {
            expect(reorderTestChild2).to.be.an('array').that.have.length(5)
        })

        it("reorderTestChild2[0] should be ToyVDom with key 1", function() {
            expect(reorderTestChild2[0]).to.deep.equal(new ToyVDom('p', {key: 1}))
        })

        it("reorderTestChild2[4] should equal aa", function() {
            expect(reorderTestChild2[4]).to.deep.equal('aa')
        })
    })
    describe("clearRecorderNewChildrenAndRecordRemove", function() {
        let moves = []
        let formatedRecorder = clearRecorderNewChildrenAndRecordRemove(reorderTestChild2, moves)
        it("formatedRecorder should be an array with length 4", function() {
            expect(formatedRecorder).to.be.an('array').that.have.length(4)
        })
        it("moves should be an array with length 1", function() {
            console.log(moves)
            expect(moves).to.be.an('array').that.have.length(1)
        })
    })

    describe("clearRecorderNewChildrenAndRecordRemove", function() {
        let formatedRecorder = clearRecorderNewChildrenAndRecordRemove(reorderTestChild2, moves)
        generateInsertMoveMutations(formatedRecorder, testChild2, flatChild1, moves)
        it("moves should be an array with length 4", function() {
            expect(moves).to.be.an('array').that.have.length(4)
        })
        it("fist move should be delete third dom", function() {
            expect(moves[0]).to.deep.equal({index:2, type: 0})
        })
        it("second move should be delete first dom", function() {
            expect(moves[1]).to.deep.equal({index:0, type: 0})
        })
        it("thirld move should be insert", function() {
            expect(moves[2]).to.have.property('type', 1)
        })
    })

    describe("clearRecorderNewChildrenAndRecordRemove", function() {
        let results = reorderChildren(testChild1, testChild2)
        let moves1 = results.moves
        it("moves should be an array with length 4", function() {
            expect(moves1).to.be.an('array').that.have.length(4)
        })
        it("fist move should be delete third dom", function() {
            expect(moves1[0]).to.deep.equal({index:2, type: 0})
        })
        it("second move should be delete first dom", function() {
            expect(moves1[1]).to.deep.equal({index:0, type: 0})
        })
        it("thirld move should be insert", function() {
            expect(moves1[2]).to.have.property('type', 1)
        })
    })
})