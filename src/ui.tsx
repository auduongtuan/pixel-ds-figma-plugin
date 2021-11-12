import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
// import './ui.css'
// import { Disclosure, Tip, Title, Checkbox, Button } from "react-figma-plugin-ds";
import GridHelper from './ui/GridHelper';
import "react-figma-plugin-ds/figma-plugin-ds.css";
import "./ui/ui.scss";
import VerticalDataValue from './ui/VerticalDataValue';

const App = () => {
  const [data, setData] = useState<{[key: string]: any}>({type: undefined});

  useEffect(() => {
    window.onmessage = async (event) => {
      setData(data => {
        return {...data, ...event.data.pluginMessage}
      });
    }
    // return () => {
    //   cleanup
    // }
  }, []);
  
  const ui = () => {
    switch(data.type) {
      case "grid_helper":
        return <GridHelper data={data} />;
      case "vertical_data_value":
        return <VerticalDataValue data={data} />;
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

ReactDOM.render(<App />, document.getElementById('react-page'))