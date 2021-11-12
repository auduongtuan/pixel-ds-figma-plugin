import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Disclosure, Tip, Title, Checkbox, Button, Input, Label } from "react-figma-plugin-ds";
import * as ui from "./uiHelper";
import {Grid, Field} from "./uiComponents";

const VerticalDataValue = ({data}) => {
 
    return (
        <div className="p-16">
            <Grid>
                
                <Field label="Container Width" id="containerWidth" defaultValue="720" type="number" />
                <Field label="Number of columns" id="cols" defaultValue="2" type="number" />
                <Field label="Gap" id="gap" defaultValue="16" type="number" />
                <Field label="Spacing" id="spacing" defaultValue="2" type="number" />
            
            </Grid>
            
            <div className="mt-24"><Button onClick={() => 
                ui.postData({"type": "layout", "configs": ui.getConfigs(["containerWidth", "cols", "gap", "spacing"])})
            }>Layout</Button></div>

        </div>
    )
}
export default VerticalDataValue;