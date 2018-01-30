/**
 * virtual possible mutations 
 */
const REPLACE = 0
const PROPS   = 1
const TEXT    = 2
const REORDER = 3

/**
 * dfsTravel Travel virtual node 
 * @param  { Object } oldVDom
 * @param  { Object } newVDom
 */

function diff (oldTree, newTree) {
    let uid   = 0 // uid for identify the node
    let patches = {} 
    dfsTravel(oldTree, newTree, uid, patches)
    return patches
}

/**
 * dfsTravel Travel virtual node 
 * @param  { Object } oldVDom
 * @param  { Object } newVDom
 * @param  { Number } uid   - current old virtual dom unique id dfs position
 * @param  { Object } patches - map of patches
 */

function dfsTravel (oldVDom, newVDom, uid, patches) {
  let currentPatch = []

  // old virtual dom is removed
  if (newVDom === null || newVDom === undefined) {
    // no actions needed 
  } else if (isString(oldVDom) && isString(newVDom)) {
    // text virtual dom
    if (oldVDom !== newVDom) currentPatch.push({ type: TEXT, content: newVDom })
  } else if (
    // props diff
    oldVDom.tagName === newVDom.tagName &&
    oldVDom.key     === newVDom.key // key from should from props which identify the dom which different from uid
  ) {
    let propsPatches = diffProps(oldVDom, newVDom)
    if (propsPatches) {
      currentPatch.push({ type: PROPS, props: propsPatches })
    }
    // compare the child array
    diffChildren(oldVDom.children, newVDom.children, uid, patches)
  }
  else {
    currentPatch.push({ type: REPLACE, node: newVDom})
  }

  if (currentPatch.length > 0) {
    patches[uid] = currentPatch
  }
} 
// check is string
function isString (value) {
  if (typeof value === 'string' || value instanceof String) {
    return true
  }
  return false
}

/**
 * diff with children array
 * @param  { Object } oldVDom
 * @param  { Object } newVDom
 * @param  { Number } uid   - father virtual dom unique id dfs position
 * @param  { Object } patches - map of patches
 * @param  { Array } currentPatch - array of patches contains mutations
 */
function diffChildren (oldChildren, newChildren, puid, patches, currentPatch) {
  let leftNode = null
  let currentNodeIndex = puid
  oldChildren.forEach(function (child, i) {
    let newChild = newChildren[i]
    currentNodeIndex = reproducdUUID(leftNode, puid) 
    dfsTravel(child, newChild, currentNodeIndex, patches) // dfs children array node
    leftNode = child
  })
}

/**
 * reproduce uid based on left node and parent uid
 * @param  { Object } leftNode
 * @param  { Number } uid   - father virtual dom unique id dfs position
 */
function reproducdUUID (leftNode, puid) {
  return (leftNode && leftNode.count) ? puid + leftNode.count + 1 : puid + 1 
}

// diff Attributes function
function diffProps (oldVDom, newVDom) {
  let count    = 0
  let oldProps = oldVDom.props
  let newProps = newVDom.props

  let key, value
  let propsPatches = {}

  // check every attribute 
  for (key in oldProps) {
    value = oldProps[key]
    // props been removed then = undefined
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }
  // new props
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = value
    }
  }

  if (count === 0) {
    return null
  }

  return propsPatches
}

module.exports = diff