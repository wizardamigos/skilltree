const skilltree = require('../')
const bel = require('bel')
const csjs = require('csjs-inject')

document.title = 'play skilltree'

const style = document.createElement('style')
style.textContent = [
  '*, *:before, *:after { box-sizing: inherit; }',
  'body { margin: 0; height: 100vh; min-height: 100vh; }',
].join('\n')
document.head.appendChild(style)

setTimeout(async () => {
  // const element = await skilltree(dag_data)
  const element = await skilltree()
  const { innerHeight, innerWidht } = window
  const scale = innerHeight / (1.5*480)
  const id = setInterval(() => {
    var svg = element.children[0]
    if (!svg) return
    svg.style.transform = `scale(${scale})`
    clearInterval(id)
  })
  document.body.appendChild(bel`<div class=${css.skilltreepage}>
    <h1 class=${css.title}> solidity skilltree </h1>
    ${element}
  </div>`)
}, 0)
const css = csjs`
.skilltreepage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  color: white;
  background-color: #21252b;
  margin: 0;
}
.title {
  color: white;
  background-color: rgba(30, 30, 30, 0.6);
  font-size: 50px;
  font-family: mono;
  font-weight: 900;
  padding: 10px;
}
`
const dag_data = [
  {
    id: '0',
    title: 'Solidity',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '1',
    parentIds: ['0'],
    title: 'Variables',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '2',
    parentIds: ['0'],
    title: 'Events',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '3',
    parentIds: ['2'],
    title: 'Mappings',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '4',
    parentIds: ['2'],
    title: 'Types',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '5',
    parentIds: ['2'],
    title: 'Modifiers',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '6',
    parentIds: ['9'],
    title: 'Imports',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '7',
    parentIds: ['3'],
    title: 'Source File',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '8',
    parentIds: ['3'],
    title: 'Remix',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '9',
    parentIds: ['8'],
    title: 'Deploying',
    url: 'https://play.ethereum.org/play-workshop/',
  },
  {
    id: '10',
    parentIds: ['9'],
    title: 'Networks',
    url: 'https://play.ethereum.org/play-workshop/',
  },
]
