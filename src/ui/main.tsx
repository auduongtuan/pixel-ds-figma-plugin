import * as React from 'react'
import {render} from 'react-dom'
import { useState, useEffect } from 'react'

import "react-figma-plugin-ds/figma-plugin-ds.css";
import "./ui.scss";
import GridHelper from './GridHelper';
import VerticalDataValue from './VerticalDataValue';
import PluginData from './PluginData';
import MultiSelect from './MultiSelect';
import CodeHighlighter from './CodeHighlighter';


const App = () => {
  const [data, setData] = useState<{[key: string]: any}>({type: undefined});

  useEffect(() => {
    window.onmessage = async (event) => {
      setData(data => {
        return {...data, ...event.data.pluginMessage}
      });
    }
  }, []);
  
  const ui = () => {
    switch(data.type) {
      case "grid_helper":
        return <GridHelper data={data} />;
      case "vertical_data_value":
        return <VerticalDataValue data={data} />;
      case "multiselect":
        return <MultiSelect data={data} />;
      case "plugin_data":
        return <PluginData data={data} />;
      case "codehighlighter":
        return <CodeHighlighter data={data} />;
      default:
        return <p>Loading...</p>
    }
  }
  return (
    <>
    {ui()}
    </>
  );

}

render(<App />, document.getElementById('root'))