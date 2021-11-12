import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState } from 'react'
import { Disclosure, Tip, Title, Checkbox, Button } from "react-figma-plugin-ds";

export default (data) => {

  const [textbox, setTextbox] = useState<HTMLInputElement>();


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
    {(data.command) ? <>
    <h2>Rectangle Creator</h2>
    {data.command}
    Count: <div className="input">
      <input type="input" className="input__field" ref={countRef} />
    </div>
    <Button id="create" onClick={onCreate}>Create</Button>
    <Button isSecondary onClick={onCancel}>Cancel</Button>
    <Button isTertiary onClick={onCancel}>Cancel</Button>
    </> : "Loading test hay qua ne..."}
   
  </div>;

}