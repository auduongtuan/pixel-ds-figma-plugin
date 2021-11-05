import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import './ui.css'

import 'figma-plugin-ds/dist/figma-plugin-ds.css'

// declare function require(path: string): any

class App extends React.Component {
  textbox: HTMLInputElement

  countRef = (element: HTMLInputElement) => {
    if (element) element.value = '5'
    this.textbox = element
  }

  onCreate = () => {
    const count = parseInt(this.textbox.value, 10)
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
  }

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  render() {
    return <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creator</h2>
      Count: <div className="input">
        <input type="input" className="input__field" ref={this.countRef} />
      </div>
      <button className='button button--primary' id="create" onClick={this.onCreate}>Create</button>
      <button className='button button--secondary' onClick={this.onCancel}>Cancel</button>
      {/* <button className='button button--tertiary' onClick={this.onCancel}>Test</button> */}
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))