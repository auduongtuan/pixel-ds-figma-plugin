
import * as h from "./commandHelper"
import * as _ from "lodash"
import { head, last } from "lodash";
import bootstrapStyles from "../data/bootstrapStyles";
const GRID_CELL = "Grid Cell";
const GRID_HEADING = "Grid Heading";

const SCROLLBAR_KEY = "1397f4918c6e823c4e6be01bfd846cd4c5952a3e";
interface Message {
  [key: string]: string
}

// Helpers

const isGrid = (node: BaseNode): node is FrameNode => {
  return h.isFrame(node) && node.getSharedPluginData('aperia', 'grid') == '1';
}
const isGridCol = (node: BaseNode): node is FrameNode => {
  return h.isFrame(node) && node.getSharedPluginData('aperia', 'grid_col') == '1';
}
const isGridBody = (node: BaseNode): node is FrameNode => {
  return h.isFrame(node) && node.getSharedPluginData('aperia', 'grid_body') == '1';
}
const isGridHead = (node: BaseNode): node is FrameNode => {
  return h.isFrame(node) && node.getSharedPluginData('aperia', 'grid_head') == '1';
}
const isGridCell = (node: BaseNode): node is InstanceNode => {
  return h.isVariant(node, GRID_CELL);
}
const isGridHeading = (node: BaseNode): node is InstanceNode => {
  return h.isVariant(node, GRID_HEADING);
}


const getCellValue = (cell: InstanceNode) => {
  const textNode = <TextNode>cell.findOne(node => node.type == "TEXT" && node.name == "Value");
  if(textNode) return textNode.characters;
  return null;
}

const getGridInfoFromSelection = (selected: SceneNode) => {
  let grid: FrameNode | null;
  let headings = [];
  let selectionType: "grid" | "cell";
  if (selected) {
    if (selected.type == "FRAME" && selected.findAll(node => h.isVariant(node, GRID_CELL)).length > 0)
    {
      grid = selected;
      selectionType = "grid";
    } 

    if (h.isVariant(selected, "Grid Cell"))
    {
      if (selected.parent.type == "FRAME") grid = selected.parent;
      selectionType = "cell";
    } 

    if (grid) {
      headings = grid.findChildren(node => h.isVariant(node, GRID_HEADING)).map((node: InstanceNode) => {
        const value = node.findOne(node => h.isText(node));
        if (value && h.isText(value)) return value.characters;
      });
      return {
        grid: grid,
        headings: headings,
        selectionType: selectionType
      }
    }
  }
  return null;
}

// Functions

const selectSameColumnCells = (msg: Message) => {
  const includeHeading = msg.includeHeading || false;
  console.log(includeHeading);
  const selected = h.selection(0);
  let grid: FrameNode;
  if (h.isVariant(selected, "Grid Cell"))
  {
    const colFrame = selected.parent;
    if (colFrame.type == "FRAME") {
      let newSelection = colFrame.findChildren(node =>
        h.isVariant(node, GRID_CELL)
      );
      grid = <FrameNode>selected.parent.parent.parent;
      if (includeHeading) {
        newSelection = _.union(
          newSelection,
          grid.findAll(node =>
            h.isVariant(node, GRID_HEADING) &&
            (colFrame.x - 2 <= node.x) && (node.x <= colFrame.x + 2)
          )
        );
      }
      figma.currentPage.selection = newSelection;
      // figma.currentPage.selection = grid.findAll(node =>
      //   node.type == "INSTANCE" &&
      //   (h.isVariant(node, GRID_CELL) || (includeHeading && h.isVariant(node, GRID_HEADING))) &&
      //   (selected.x - 2 <= node.x) && (node.x <= selected.x + 2));
    }
  } 
}
const selectSameRowCells = (msg: Message) => {
  const selected = h.selection(0);
  let grid: FrameNode;
  if (h.isVariant(selected, GRID_CELL) || h.isVariant(selected, GRID_HEADING))
  {
    const type = h.isVariant(selected, GRID_CELL) ? GRID_CELL : GRID_HEADING;
    if (selected.parent.type == "FRAME") {
      grid = <FrameNode>selected.parent.parent.parent;
      figma.currentPage.selection = grid.findAll(node =>
        h.isVariant(node, type) &&
        (selected.y - 2 <= node.y) && (node.y <= selected.y + 2))
    }
  } 
}
const sortGrid = (msg: Message) => {
  const girdInfo = getGridInfoFromSelection(h.selection(0));
  if (girdInfo.grid) {
    const cells = <InstanceNode[]>girdInfo.grid.findChildren(node => h.isVariant(node, GRID_CELL));
    console.log(_.groupBy(cells, (cell) => cell.x));

  }
}
export const createGrid = async (msg?: Message) => {
  // let gridCells = []; // including Headings
  if (h.selection().length == 0) return;
  let gridCells = h.selection().filter(node => h.isVariant(node, "Grid Cell"));
  console.log(gridCells);
  let gridHeadings = h.selection().filter(node => h.isVariant(node, "Grid Heading"));
  let gridCellsAndHeadings = h.selection().filter(node => h.isVariant(node, "Grid Cell") || h.isVariant(node, "Grid Heading"));
  if (gridHeadings.length < 0) return;
  const gridFrame = figma.createFrame();
  gridFrame.layoutMode = "VERTICAL";
  gridFrame.primaryAxisSizingMode = "AUTO";
  gridFrame.counterAxisSizingMode = "FIXED";
  // BODY
  const gridBodyFrame = figma.createFrame();
  gridBodyFrame.name = "Grid Body"
  gridBodyFrame.layoutMode = "HORIZONTAL";
  gridBodyFrame.primaryAxisSizingMode = "FIXED";
  gridBodyFrame.counterAxisSizingMode = "AUTO";
  gridBodyFrame.layoutAlign = "STRETCH";
  gridBodyFrame.setSharedPluginData('aperia', 'grid_body', '1');

  // gridBodyFrame.layoutGrow = 1;
  // HEAD
  const gridHeadFrame = figma.createFrame();
  gridHeadFrame.name = "Grid Head";
  gridHeadFrame.layoutMode = "HORIZONTAL";
  gridHeadFrame.primaryAxisSizingMode = "FIXED";
  gridHeadFrame.counterAxisSizingMode = "AUTO";
  gridHeadFrame.layoutAlign = "STRETCH";
  gridHeadFrame.setSharedPluginData('aperia', 'grid_head', '1');


  // gridBodyFrame.layoutGrow = 0;

  const firstHeading = <InstanceNode>_.orderBy(gridHeadings, ['x', 'y'])[0];
  const firstCell = <InstanceNode>_.orderBy(gridCells, ['x', 'y'])[0];
  const widestCell = <InstanceNode>_.orderBy(gridCellsAndHeadings, ['width'], 'desc')[0];
  console.log(widestCell.width);
  const groupedCols = _.groupBy(gridCells, node => node.x);
  const groupedRows = _.groupBy(gridCells, node => node.y);

  gridFrame.resizeWithoutConstraints(_.sumBy(groupedRows[firstCell.y], 'width'), gridFrame.height);

  // style grid frame
  gridFrame.x = firstHeading.x;
  gridFrame.y = firstHeading.y;
  gridFrame.setSharedPluginData('aperia', 'grid', '1');
  gridFrame.setSharedPluginData('aperia', 'ds', 'bootstrap');
  gridFrame.setRelaunchData({"update_grid": "Update Grid"});
  gridFrame.name = 'Grid';
  gridFrame.cornerRadius = 8;
  const style = h.getLocalPaintStyle('Light/L04') || await figma.importStyleByKeyAsync(bootstrapStyles['Light/L04']);
  console.log(style);
  gridFrame.strokeStyleId = style.id;
  gridFrame.strokeWeight = 1;

  _.forEach(gridHeadings, (heading, key) => {
    gridHeadFrame.appendChild(heading);
  });

  _.forOwn(groupedCols, (colItems, key) => {
    const colFrame = figma.createFrame();
    colFrame.name = 'Grid Col';
    console.log(colFrame);
    colFrame.setSharedPluginData('aperia', 'grid_col', '1');
    colFrame.resizeWithoutConstraints(colItems[0].width, colFrame.height);
    colFrame.layoutMode = "VERTICAL";
    colFrame.primaryAxisSizingMode = "AUTO";
    colFrame.counterAxisSizingMode = "FIXED";
    colItems.forEach(cell => colFrame.appendChild(cell));
    gridBodyFrame.appendChild(colFrame);
  });

  gridFrame.appendChild(gridHeadFrame);
  gridFrame.appendChild(gridBodyFrame);
  figma.currentPage.appendChild(gridFrame);

}

const updateGridFrame = (gridFrame: BaseNode, resize = true, zebra = true) => {
  if(!isGrid(gridFrame)) return;
  // console.log(gridFrame.name);
  const gridBodyFrame = <FrameNode|null>gridFrame.findChild(node => isGridBody(node));
  if (!gridBodyFrame) return;

  const colFrames = <FrameNode[]>gridBodyFrame.findChildren(node => isGridCol(node));
  if (resize) {
     // resize by highest cel in a col
    let highest:{[key:number]:number} = {};
    colFrames.forEach((colFrame, i) => {
      // cell: cell or heading
      colFrame.children.forEach((cell:InstanceNode, j) =>{
        cell.primaryAxisSizingMode = "AUTO";
        if(!(j in highest) || highest[j] < cell.height) highest[j] = cell.height;
      });
    });
    // resize
    colFrames.forEach((colFrame, i) => {
      // cell: cell or heading
      colFrame.children.forEach((cell:InstanceNode, j) => {
        const previousPrimaryAxisSizingMode = cell.primaryAxisSizingMode;
        cell.primaryAxisSizingMode = "FIXED";
        cell.resize(cell.width, highest[j]);
        // setTimeout(() => cell.primaryAxisSizingMode = previousPrimaryAxisSizingMode, 10);
      });
    });
  }
  if (zebra) {
     // Zebra fix
    if (h.isDS(gridFrame, 'bootstrap')) {
      colFrames.forEach((colFrame, i) => {
        // cell: cell or heading
        colFrame.children.forEach((cell:InstanceNode, j) =>{
          // le
          if (j % 2 == 0) {
            h.swapVariant(cell, {"Odd": "True"})
          } else {
            h.swapVariant(cell, {"Odd": "False"})
          }
        });
      });
    }
  }
 
}
export const updateGrid = async (msg?: Message) => {
  for(const gridFrame of h.selection()) {
    updateGridFrame(gridFrame);
  }
}
export const toggleHorizontalScroll = async (msg?: Message) => {
  const selected = h.selection(0);
  if (h.isInstance(selected)) console.log(selected.mainComponent.parent);
  for(const gridFrame of h.selection()) {
    if(isGrid(gridFrame)) {
      const Scrollbar = await figma.importComponentSetByKeyAsync("d392f1c57f57b8776e6d4262e7132542791c77e8");
      // const Scrollbar = <ComponentSetNode>figma.getNodeById("306:2651");
   
      const gridBodyFrame = <FrameNode|null>gridFrame.findChild(node => isGridBody(node));
      const checkScrollBar = gridFrame.findChild(node => h.isVariant(node, Scrollbar.name, {"Type": "Horizontal"}));
      // if it is already a vertical scrollbar
      const checkVerticalScrollBar = (gridBodyFrame) ? gridBodyFrame.findChild(node => h.isVariant(node, Scrollbar.name, {"Type": "Vertical"})) : null;
      const HorizontalScrollBar = h.getVariantInSet(Scrollbar, {"Type": "Horizontal","Corner":(checkVerticalScrollBar)?'True':'False'});

      if(HorizontalScrollBar) {
        if (!checkScrollBar) {
          const instance = HorizontalScrollBar.createInstance();
          instance.layoutAlign = "STRETCH";
          gridFrame.appendChild(instance);
        } else {
          checkScrollBar.remove();
        }
      }

      
    }
  }
}
export const toggleVerticalScroll = async (msg?: Message) => {
  const selected = h.selection(0);
  if (h.isInstance(selected)) console.log(selected.mainComponent.parent);
  for(const gridFrame of h.selection()) {
    if(isGrid(gridFrame)) {
      const Scrollbar = await figma.importComponentSetByKeyAsync("d392f1c57f57b8776e6d4262e7132542791c77e8");

      // const Scrollbar = <ComponentSetNode>figma.getNodeById("306:2651");
      const VerticalScrollBar = h.getVariantInSet(Scrollbar, {"Type": "Vertical"});
      if(VerticalScrollBar) {
        const gridBodyFrame = <FrameNode|null>gridFrame.findChild(node => isGridBody(node));
        if (!gridBodyFrame) return;
        const checkScrollBar = gridBodyFrame.findChild(node => h.isVariant(node, Scrollbar.name, {"Type": "Vertical"}));
        const checkHorizontalScrollBar = <InstanceNode|null>gridFrame.findChild(node => h.isVariant(node, Scrollbar.name, {"Type": "Horizontal"}));
        const gridHeadings = <InstanceNode[]>gridFrame.findAll(node => h.isVariant(node, "Grid Heading"));
        const lastHeadingInner = <FrameNode|null>gridHeadings[gridHeadings.length-1].findChild(node => h.isFrame(node) && node.layoutMode == "HORIZONTAL");

        const colFrames = <FrameNode[]>gridBodyFrame.findChildren(node => isGridCol(node));
        const lastColFrame = colFrames[colFrames.length-1];
        if (!lastColFrame) return;
        if (!checkScrollBar) {
          const instance = VerticalScrollBar.createInstance();
          instance.layoutAlign = "STRETCH";
          lastColFrame.resize(lastColFrame.width-instance.width,lastColFrame.height);
          gridBodyFrame.appendChild(instance);
          if (checkHorizontalScrollBar) h.swapVariant(checkHorizontalScrollBar, {"Corner": "True"});
          if (lastHeadingInner) lastHeadingInner.paddingRight += VerticalScrollBar.width;
        } else {
          lastColFrame.resize(lastColFrame.width+checkScrollBar.width,lastColFrame.height);
          checkScrollBar.remove();
          if (checkHorizontalScrollBar) h.swapVariant(checkHorizontalScrollBar, {"Corner": "False"});
          if (lastHeadingInner) lastHeadingInner.paddingRight -= VerticalScrollBar.width;
        }
       
      }
    }
  }
}
const getCellValues = (cells: InstanceNode[]) => {
  return cells.map(cell => {
    const TextLayer = <TextNode|null>cell.findOne(node => h.isText(node) && node.name == "Text");
    if (TextLayer) return TextLayer.characters;
    return '';
  });
}
const handleSortByColumn = (currentColFrame: BaseNode, desc = false) => {
  if (!isGridCol(currentColFrame)) return;
  const currentColCells = <InstanceNode[]>currentColFrame.findChildren(node => isGridCell(node));
  const currentColCellValues = getCellValues(currentColCells);
  console.log(currentColCellValues);
  const gridFrame = currentColFrame.parent.parent;
  if(!isGrid(gridFrame)) return;
  const gridBodyFrame = <FrameNode|null>gridFrame.findChild(node => isGridBody(node));
  if (!gridBodyFrame) return;
  const colFrames = <FrameNode[]>gridBodyFrame.findChildren(node => isGridCol(node)); 
  colFrames.forEach((colFrame, i) => {
    const colCells = [...colFrame.children];
    const sortedCells = <InstanceNode[]>colCells.sort((cell1, cell2) => {
      const cell1Value = currentColCellValues[colCells.indexOf(cell1)];
      const cell2Value = currentColCellValues[colCells.indexOf(cell2)];
      return desc ? cell2Value.localeCompare(cell1Value) : cell1Value.localeCompare(cell2Value);
    });
    sortedCells.forEach(cell => colFrame.appendChild(cell));
    updateGridFrame(gridFrame, false);
    // console.log(getCellValues(sortedCells));
    // console.log(colCells);
  });
}
export const sortByColumnAsc = async (msg?: Message) => {
  const loading = figma.notify('Sorting...', {timeout: Infinity});
  for(const selected of h.selection()) {
    let currentColFrame:BaseNode = selected;
    if (isGridCell(selected)) {
      currentColFrame = selected.parent;
    } 
    handleSortByColumn(currentColFrame);
  }
  loading.cancel();
  figma.notify('Grid sorted successfully!');
}
export const sortByColumnDesc = async (msg?: Message) => {
  const loading = figma.notify('Sorting...', {timeout: Infinity});
  for(const selected of h.selection()) {
    let currentColFrame:BaseNode = selected;
    if (isGridCell(selected)) {
      currentColFrame = selected.parent;
    } 
    handleSortByColumn(currentColFrame, true);
  }
  loading.cancel();
  figma.notify('Grid sorted successfully!');
}
export const onMessage = async (msg: Message) => {
  const handle = {
    select_same_column_cells: selectSameColumnCells,
    select_same_row_cells: selectSameRowCells,
    sort_grid: sortGrid,
    create_grid: createGrid,
    update_grid: updateGrid,
    toggle_horizontal_scroll: toggleHorizontalScroll,
    toggle_vertical_scroll: toggleVerticalScroll,
    sort_by_column_asc: sortByColumnAsc,
    sort_by_column_desc: sortByColumnDesc,
  }
  if (msg.type in handle) handle[msg.type](msg);
}



export const onSelectionChange = () => {

  // const selected = h.selection(0);
  // h.postData({isGrid: false, isGridCell: false});
  // const gridInfo = getGridInfoFromSelection(selected);
  // if(gridInfo) {
  //   if (gridInfo.selectionType == "cell") h.postData({isGridCell: true});
  //   if (gridInfo.selectionType == "grid") h.postData({isGrid: true});
  //   h.postData({
  //     gridName: gridInfo.grid.name,
  //     headings: gridInfo.headings
  //   });
  // }
  const selected = h.selection(0);
  h.postData({isGrid: false, isGridCell: false, isGridCol: false, isGridHeading: false});
  // const gridInfo = getGridInfoFromSelection(selected);
  if (selected) {
    if (selected.getSharedPluginData('aperia', 'grid') == '1') h.postData({isGrid: true});
    if (selected.getSharedPluginData('aperia', 'grid_col') == '1') h.postData({isGridCol: true});
    if (h.isVariant(selected, GRID_CELL)) h.postData({isGridCell: true});
    if (h.isVariant(selected, GRID_HEADING)) h.postData({isGridHeading: true});
  }

  // if(gridInfo) {
  //   if (gridInfo.selectionType == "cell") h.postData({isGridCell: true});
  //   if (gridInfo.selectionType == "grid") h.postData({isGrid: true});
  //   h.postData({
  //     gridName: gridInfo.grid.name,
  //     headings: gridInfo.headings
  //   });
  // }
}

export const run = () => {
  figma.showUI(__html__, {title: "Aperia DS - Grid", width: 320, height: 480}) 
  h.postData({type: "grid_helper"});
  onSelectionChange(); 
}