import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Disclosure, Tip, Title, Checkbox, Button } from "react-figma-plugin-ds";
import * as ui from "./uiHelper";

const GridHelper = ({data}) => {
    const [includeHeading, setIncludeHeading] = React.useState(false);
    const selectInSameColumn = () => {
        ui.postData({type: "select_same_column_cells", includeHeading: includeHeading})
    }
    const selectInSameRow = () => {
        ui.postData({type: "select_same_row_cells"})
    }
    return (
        <div className="p-16">
        <h2 className="mt-0">Grid Helper</h2>
        {
            (data.isGrid || data.isGridCell) ? 
        <p>{data.gridName && `Grid name: ${data.gridName}`}<br />{data.isGrid && "Grid selected"}{data.isGridCell && "Grid cell selected"}</p>
        : <p>Please select Grid frame or Grid Cell instance.</p>
        }
        {/* {data.headings && <ul>{data.headings.map((heading: string, i: number) => <li key={i}>{heading}</li>)}</ul>} */}
        <h4 className="mt-24 mb-0">Row/Column Helper</h4>
        <div className="mt-0">
        <Checkbox className="m-0 p-0" label="Include heading" onChange={value => setIncludeHeading(value)}></Checkbox>
        </div>
        <div className="mt-8">
        <Button isSecondary onClick={selectInSameColumn}>Select same column</Button>
        </div>
        <div className="mt-8">
        <Button isSecondary onClick={selectInSameRow}>Select same row</Button>
        </div>

        <h4 className="mt-24 mb-0">Grid Options</h4>
        <div className="mt-0">
        <Checkbox className="m-0 p-0" label="Show Pagination" onChange={value => ui.postData({type:"toggle_grid_pagination", showPagination: value})}></Checkbox>
        </div>
        <div className="mt-0">
        <Checkbox className="m-0 p-0" label="Show Horizontal Scroll"></Checkbox>
        </div>
        <div className="mt-0">
        <Checkbox className="m-0 p-0" label="Show Vertical Scroll"></Checkbox>
        </div>
      
        </div>
    )
}
export default GridHelper;