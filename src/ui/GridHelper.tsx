import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Disclosure, Tip, Title, Checkbox, Button } from "react-figma-plugin-ds";
import {MenuItem} from "./uiComponents";
import * as ui from "./uiHelper";

const GridHelper = ({data}) => {
    const [includeHeading, setIncludeHeading] = React.useState(false);

    return (
        <div className="p-16">
        {data.isGrid && <p>Grid selected</p>}
        {data.isGridCol && <p>Grid Col selected</p>}
        {data.isGridCell && <p>Grid Cell selected</p>}
        {data.isGridHeading && <p>Grid Heading selected</p>}

        {!data.isGrid && !data.isGridCol && !data.isGridCell && !data.isGridHeading && <p>Please select Grid elements.</p>}
        
        <h4 className="mt-24 mb-8">Grid</h4>
        <MenuItem onClick={() => ui.postData({type: "create_grid"})}>Create gird</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "update_grid"})}>Update gird</MenuItem>
        
        <h4 className="mt-24 mb-8">Row and Column</h4>
        <MenuItem onClick={() => ui.postData({type: "sort_by_column_asc"})}>Sort gird by this column (ascending)</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "sort_by_column_desc"})}>Sort gird by this column (descending)</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "select_same_column_cells", includeHeading: false})}>Select same column</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "select_same_column_cells", includeHeading: true})}>Select same column (include heading)</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "select_same_row_cells"})}>Select same row</MenuItem>

        <h4 className="mt-24 mb-8">Grid Options</h4>
        {/* <MenuItem onClick={() => ui.postData({type: "toggle_grid_pagination"})}>Toggle grid pagination</MenuItem> */}
        <MenuItem onClick={() => ui.postData({type: "toggle_horizontal_scroll"})}>Toggle horizontal scrollbar</MenuItem>
        <MenuItem onClick={() => ui.postData({type: "toggle_vertical_scroll"})}>Toggle vertical scrollbar</MenuItem>  
        </div>
    )
}
export default GridHelper;