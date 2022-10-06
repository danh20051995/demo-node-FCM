function copy(e) {
  let content = e
  if (e instanceof MouseEvent) {
    content = e.target.innerText
  } else if (e instanceof Element) {
    content = e.innerText
  } else {
    content = typeof e === 'string' ? e : JSON.stringify(e)
  }

  const el = document.createElement('textarea')
  el.value = content
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'

  const selected = document.getSelection().rangeCount > 0 // check if there is any content selected previously
    ? document.getSelection().getRangeAt(0) // store selection if found
    : false

  if (!navigator.clipboard) {
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  } else {
    navigator.clipboard.writeText(content)
      .then(() => alert('Copy to clipboard successfully!'))
      .catch((error) => console.log({ error }))
  }

  if (selected) {
    document.getSelection().removeAllRanges() // unselect everything on the HTML document
    document.getSelection().addRange(selected) // restore the original selection
  }
}

window.Utils = { copy }
