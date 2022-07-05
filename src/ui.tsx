import * as React from 'react'
import {render} from 'react-dom'
import { useState, useEffect } from 'react'

import "react-figma-plugin-ds/figma-plugin-ds.css";
import "./ui/ui.scss";
import GridHelper from './ui/GridHelper';
import VerticalDataValue from './ui/VerticalDataValue';
import PluginData from './ui/PluginData';
import MultiSelect from './ui/MultiSelect';
import CodeHighlighter from './ui/CodeHighlighter';


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

render(<App />, document.getElementById('react-page'))