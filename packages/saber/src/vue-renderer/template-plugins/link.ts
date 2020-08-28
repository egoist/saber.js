import { PostHTML } from 'posthtml'

const getAttribute = (attrs: PostHTML.NodeAttributes, name: string) => {
  if (attrs[name] !== undefined) {
    return { value: attrs[name], isStatic: true }
  }

  return {
    value: attrs[`:${name}`] || attrs[`v-bind:${name}`],
    isStatic: false
  }
}

const removeAttribute = (attrs: PostHTML.NodeAttributes, name: string) => {
  delete attrs[name]
  delete attrs[`:${name}`]
  delete attrs[`v-bind:${name}`]
}

export default ({ openLinkInNewTab = true } = {}) => (
  tree: PostHTML.NodeAPI
) => {
  tree.walk(node => {
    if (!node.attrs) return node

    if ('saber-ignore' in node.attrs) {
      delete node.attrs['saber-ignore']
      return node
    }

    const href = getAttribute(node.attrs, 'href')

    if (node.tag === 'a' && href.value) {
      node.tag = 'saber-link'
      if (href.isStatic) {
        node.attrs.to = href.value
      } else {
        node.attrs[':to'] = href.value
      }

      removeAttribute(node.attrs, 'href')

      if (
        openLinkInNewTab === false &&
        getAttribute(node.attrs, 'openLinkInNewTab').value === undefined
      ) {
        node.attrs[':openLinkInNewTab'] = JSON.stringify(openLinkInNewTab)
      }
    }

    return node
  })
}
