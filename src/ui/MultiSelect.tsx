import * as React from 'react';
import * as ui from "./uiHelper";
import {Field} from "./uiComponents";


const MultiSelect = ({data}) => {
  React.useEffect(() => {
    console.log(data);
    ui.setInput("multiselect_values", (data.values && data.values.length > 0) ? data.values.join(', ') : '');
  }, [data])
  return <div className="p-16">
    <textarea id="multiselect_values" className="textarea" rows={5}>
    
    </textarea>
    <div className="mt-8">
    <button className="button button--primary" onClick={() => {
      const values = ui.getInput("multiselect_values").toString().split(",").map(value => value.trim());
      if (values.length > 0) 
      {
        // console.log(values);
        ui.postData({
          type: "multiselect_update",
          values: values
        });
        // ui.setConfig("multiselect_values", "");
      }
    }}>Update</button>

    </div>
  </div>;
}

export default MultiSelect;