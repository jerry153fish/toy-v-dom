
/**
 * reorder new children and get mutations
 * @param  { Array } oldChildren
 * @param  { Array } newChildren
 * @return { 
 *              reorderedNewChildre,
 *              moves
 *          }
 */
function reorderChildren (oldChildren, newChildren) {
    let flatNewChildren = flatChildrenArray(newChildren)
    let flatOldChildren = flatChildrenArray(oldChildren)
    let moves = []
    let reorderedNewChildren = generateReOrderNewChildren(oldChildren, newChildren, flatNewChildren)
    let formatedRecordNewChildren = clearRecorderNewChildrenAndRecordRemove(reorderedNewChildren, moves)
    generateInsertMoveMutations(formatedRecordNewChildren, newChildren, flatOldChildren, moves)

    return {
        moves: moves,
        reorderedNewChildren: reorderedNewChildren
    }
}
/**
 * generate re-order new children
 * @param  { Array } oldChildren
 * @param  { Array } newChildren
 * @param  { Object } flatNewChildren
 * @return { Object} reorderedNewChildren
 */
function generateReOrderNewChildren (oldChildren, newChildren, flatNewChildren) {
    let i = 0
    let reorderedNewChildren = []
    let newKeyHashMap = flatNewChildren.keyHashMap
    let noKeyItems = flatNewChildren.noKeyItems
    let noKeyIndex = 0
    while (i < oldChildren.length) {
        item = oldChildren[i]
        itemKey = getKey(item)
        if (itemKey) {
          if (!newKeyHashMap.hasOwnProperty(itemKey)) {
            reorderedNewChildren.push(null)
          } else {
            let newItemIndex = newKeyHashMap[itemKey]
            reorderedNewChildren.push(newChildren[newItemIndex])
          }
        } else {
          let noKeyItem = noKeyItems[noKeyIndex++]
          reorderedNewChildren.push(noKeyItem || null)
        }
        i++
    }
    return reorderedNewChildren
}
// clear reorder new children and record remove mutations
function clearRecorderNewChildrenAndRecordRemove (reorderedNewChildren, moves) {
    let i = 0
    let formatedRecordNChildren = [...reorderedNewChildren]
    while (i < formatedRecordNChildren.length) {
      if (formatedRecordNChildren[i] === null) {
        recordRemove(i, moves)
        removeArrayByIndex(formatedRecordNChildren, i)
      } else {
        i++
      }
    }
    return formatedRecordNChildren
}

/**
 * compare formated reordered new children with new children
 * record insert, move mutations
 * @param  { Array } formatedRecordNChildren
 * @param  { Array } newChildren
 * @param  { Array } moves
 */

 function generateInsertMoveMutations (formatedRecordNChildren, newChildren, flatOldChildren, moves) {
    let j = i = 0
    let oldKeyHashMap = flatOldChildren.keyHashMap
    while (i < newChildren.length) {
      item = newChildren[i]
      itemKey = getKey(item)
  
      let formatedRecorderedItem = formatedRecordNChildren[j]
      let formatedRecorderedItemKey = getKey(formatedRecorderedItem)
  
      if (formatedRecorderedItem) {
        if (itemKey === formatedRecorderedItemKey) {
          j++
        } else {
          // new item, recorder insert
          if (!oldKeyHashMap.hasOwnProperty(itemKey)) {
            recordInsert(i, item, moves)
          } else {
            // remove formatedrecorder array if next one is equal to new children
            let nextformatedRecorderedItemKey = getKey(formatedRecordNChildren[j + 1])
            if (nextformatedRecorderedItemKey === itemKey) {
              recordRemove(i, moves)
              removeArrayByIndex(formatedRecordNChildren, j)
              j++ // after removing, current j is right, just jump to next one
            } else {
              // else insert item
              recordInsert(i, item, moves)
            }
          }
        }
      } else {
        recordInsert(i, item, moves)
      }
      i++
    }
 }

/**
 * flat child array to hashmap with key in props
 * item without key will be returned as an array
 * @param  { Array } children
 * @return { 
 *  keyHashMap: {}
 *  noKeysItem: []
 * }
 */
function flatChildrenArray(children) {
    let keyHashMap = {}
    let noKeyItems = []
    for (let i = 0, len = children.length; i < len; i++) {
        let item = children[i]
        let itemKey = getKey(item)
        if (itemKey) {
            // key -- array index hash map
            keyHashMap[itemKey] = i
        } else {
            noKeyItems.push(item)
        }
    }
    return {
        keyHashMap: keyHashMap,
        noKeyItems: noKeyItems
    }
}
// get key from props
function getKey (vdom) {
    if (!vdom) return void 0
    let props = vdom.props
    if (props) {
        return props.key
    } else {
        return void 0
    }
}
// record remove mutation type : 0
function recordRemove(index, moves) {
    var move = { index: index, type: 0 }
    return moves.push(move)
}
// record insert mutation type: 1
function recordInsert(index, item, moves) {
    var move = { index: index, item: item, type: 1 }
    return moves.push(move)
}
// splice arr by index
function removeArrayByIndex(arr, index) {
    arr.splice(index, 1)
}


module.exports = {
    flatChildrenArray: flatChildrenArray,
    generateReOrderNewChildren: generateReOrderNewChildren,
    clearRecorderNewChildrenAndRecordRemove: clearRecorderNewChildrenAndRecordRemove,
    generateInsertMoveMutations: generateInsertMoveMutations,
    reorderChildren: reorderChildren
}