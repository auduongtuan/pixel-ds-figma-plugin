
import * as h from "./commandHelper"

const GRID_CELL = "Grid Cell";
const GRID_HEADING = "Grid Heading";

export const onMessage = (msg: {[key: string]: string}) => {

  if (msg.type == "select_same_column_cells") {
    const includeHeading = msg.includeHeading || false;
    console.log(includeHeading);
    const selected = h.selection(0);
    let grid: FrameNode;
    if (h.isVariant(selected, "Grid Cell"))
    {
      if (selected.parent.type == "FRAME") {
        grid = selected.parent;
        figma.currentPage.selection = grid.findAll(node =>
          node.type == "INSTANCE" &&
          (h.isVariant(node, GRID_CELL) || (includeHeading && h.isVariant(node, GRID_HEADING))) &&
          (selected.x - 2 <= node.x) && (node.x <= selected.x + 2));
      }
    } 
  }
  if (msg.type == "select_same_row_cells") {
    const selected = h.selection(0);
    let grid: FrameNode;
    if (h.isVariant(selected, "Grid Cell"))
    {
      if (selected.parent.type == "FRAME") {
        grid = selected.parent;
        figma.currentPage.selection = grid.findAll(node =>
          node.type == "INSTANCE" &&
          h.isVariant(node, GRID_CELL) &&
          (selected.y - 2 <= node.y) && (node.y <= selected.y + 2));
      }
    } 
  }
  if (msg.type == "toggle_grid_pagination") {
    
  }
}

export const onSelectionChange = () => {

    const selected = h.selection(0);
    h.postData({isGrid: false, isGridCell: false})
    if(selected) {
      
   
      let grid: FrameNode;
      if (selected.type == "FRAME" && selected.findChildren(node => h.isVariant(node, GRID_CELL)).length > 0)
      {
        grid = selected;
        h.postData({isGrid: true});
      } 
  
      if (h.isVariant(selected, "Grid Cell"))
      {
        if (selected.parent.type == "FRAME") grid = selected.parent;
        h.postData({isGridCell: true});
      } 
  
      if (grid) {
        h.postData({gridName: grid.name});
        
        const headings = grid.findChildren(node => h.isVariant(node, GRID_HEADING)).map((node: InstanceNode) => {
          const value = node.findOne(node => h.isText(node));
          if (value && h.isText(value)) return value.characters;
        });
        h.postData({headings: headings});
      }
  
    }
  
  }

  export const run = () => {
    figma.showUI(__html__, {title: "Pixel DS - Grid", width: 320, height: 400}) 
    h.postData({type: "grid_helper"});
    onSelectionChange(); 
  }