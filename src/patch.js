/**
 * virtual possible mutations 
 */
const REPLACE = 0
const PROPS   = 1
const TEXT    = 2
const REORDER = 3

/**
 * patch methods to update patches to real dom
 * @param  { DOM Object } realDom
 * @param  { Object } patches
 */
function patch (realDom, patches) {
    let walker = {uid: 0}
    dfsTravel(realDom, walker, patches)
}

/**
 * deep first travel real dom
 * @param  { DOM Object } realDom
 * @param  { Object } Waler for hold uid
 * @param  { Object } patches
 */
function dfsTravel(realDom, walker, patches) {
    let currentPatches = patches[walker.uid]

    let len = realDom.childNodes
        ? realDom.childNodes.length
        : 0
    for (let i = 0; i < len; i++) {
        let child = realDom.childNodes[i]
        walker.uid++
        dfsTravel(child, walker, patches)
    }
    // apply patches in dfs
    if (currentPatches) {
        updatePatches(realDom, currentPatches)
    }
}

/**
 * update patches to the real dom
 * @param  { DOM Object } realDom
 * @param  { Array } currentPatches
 */
function updatePatches(realDom, currentPatches) {
    currentPatches.forEach(currentPatch => {
        switch (currentPatch.type) {
            case REPLACE:
                let newNode = (typeof currentPatch.node === 'string')
                    ? document.createTextNode(currentPatch.node)
                    : currentPatch.node.render()
                realDom.parentNode.replaceChild(newNode, realDom)
                break
            case REORDER:
                reorderChildren(realDom, currentPatch.moves)
                break
            case PROPS:
                setProps(realDom, currentPatch.props)
                break
            case TEXT:
                realDom.textContent = currentPatch.content
                break
            default:
                throw new Error('Unknown patch type ' + currentPatch.type)
        }        
    })
}

function setAttr (realDom, key, value) {
    switch (key) {
      case 'style':
        realDom.style.cssText = value
        break
      case 'value':
        var tagName = realDom.tagName || ''
        tagName = tagName.toLowerCase()
        if ( tagName === 'input' || tagName === 'textarea') {
            realDom.value = value
        } else {
          // if it is not a input or textarea, use `setAttribute` to set
          realDom.setAttribute(key, value)
        }
        break
      default:
        realDom.setAttribute(key, value)
        break
    }
  }

function setProps(realDom, props) {
    for (var key in props) {
        if (props[key] === void 0) {
            realDom.removeAttribute(key)
        } else {
            let value = props[key]
            setAttr(realDom, key, value)
        }
    }
}

function reorderChildren(realDom, moves) {
    let maps = {}

    realDom.childNodes.forEach(node => {
        if (node.nodeType === 1) {
            let key = node.getAttribute('key')
            if (key) {
                maps[key] = node
            }
        }
    })

    moves.forEach(move => {
        let index = move.index
        if (move.type === 0) { // remove item
            if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
                node.removeChild(node.childNodes[index])
            }
            staticNodeList.splice(index, 1)
        } else if (move.type === 1) { // insert item
            var insertNode = maps[move.item.key]
                ? maps[move.item.key].cloneNode(true) // reuse old item
                : (typeof move.item === 'object')
                    ? move.item.render()
                    : document.createTextNode(move.item)
            staticNodeList.splice(index, 0, insertNode)
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
    })
  }