module.exports = class ToyVDom {
    constructor(tagName, props, children) {
      this.tagName = tagName
      this.props = props
      this.children = children
    }
    render () {
      // create dom by tag mane
      let el = document.createElement(this.tagName)
      let props = this.props
  
      for (let propName in props) {
        // set dom attribute
        let propValue = props[propName]
        el.setAttribute(propName, propValue)
      }
  
      let children = this.children || []
  
      children.forEach(function (child) {
        let childEl = (child instanceof ToyVDom) // check child is instance of createElement
          ? child.render()
          : document.createTextNode(child)
        el.appendChild(childEl)
      })
      return el
    }
  }