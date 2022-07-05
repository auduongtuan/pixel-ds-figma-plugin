import * as React from 'react';
import * as ui from "./uiHelper";
import {Field} from "./uiComponents";

const PluginData = ({data}) => {
  return <div className="p-16">
    <Field label="Key" id="key" />
    <Field label="Value" id="value" type="textarea" rows={3} className="mt-16" />
    <div className="mt-8">
    <div className="flex" style={{"--gap": "8px"} as React.CSSProperties}>
    <button className="button button--primary" onClick={() => {
      const key = ui.getInput("key"); 
      if(key) ui.postData({type: "get_plugin_data", key: key})
    }}>Get Data</button>
    {data.values && console.log(data.values)}
    <button className="button button--primary" onClick={() => {
      const value = ui.getInput("value");
      const key = ui.getInput("key"); 
      if (key) {
        ui.postData({
          type: "set_plugin_data",
          key: key,
          value: value
        });
      }
      
    }}>Set Data</button>
    </div>
    {data.values && <p className="mt-8">{data.values.join(', ')}</p>}
    </div>
</div>;
}
export default PluginData;