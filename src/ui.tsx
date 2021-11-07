import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
// import './ui.css'
import { Disclosure, Tip, Title, Checkbox, Button } from "react-figma-plugin-ds";
import "react-figma-plugin-ds/figma-plugin-ds.css";
// declare function require(path: string): any

const App = () => {
  const [textbox, setTextbox] = useState<HTMLInputElement>();
  const [command, setCommand] = useState();

  useEffect(() => {
    window.onmessage = async (event) => {
      setCommand(event.data.pluginMessage.command);
    }
    // return () => {
    //   cleanup
    // }
  }, [])

  const countRef = (element: HTMLInputElement) => {
    if (element) element.value = '5'
    setTextbox(element)
  }

  const onCreate = () => {
    const count = parseInt(textbox.value, 10)
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  
  return <div>
    {/* <img src={require('./logo.svg')} /> */}
    {(command) ? <>
    <h2>Rectangle Creator</h2>
    {command}
    Count: <div className="input">
      <input type="input" className="input__field" ref={countRef} />
    </div>
    <Button id="create" onClick={onCreate}>Create</Button>
    <Button isSecondary onClick={onCancel}>Cancel</Button>
    <Button isTertiary onClick={onCancel}>Cancel</Button>
    </> : "Loading test hay qua ne..."}
    {/* <button className='button button--tertiary' onClick={this.onCancel}>Test</button> */}
  </div>;
}

ReactDOM.render(<App />, document.getElementById('react-page'))