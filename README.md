![build](https://travis-ci.org/jerry153fish/toy-v-dom.svg?branch=master)

Simple virtual Dom Implementation In ES6 for tutorial purpose. Check the [development journal](https://jerry153fish.github.io/2017/09/15/implemnt-virtual-dom-in-es6.html)


### Install

```sh

npm install toy-v-dom

```

### Usage

```js

import { ToyVDom, diff, patch } from 'toy-v-dom'

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

```