const gridWidth = 360;
const col = 2;
const gap = 16;
const spacing = 2;
const colWidth = (gridWidth+gap)/col-gap;
function isDataValue(item: SceneNode): item is InstanceNode {
	if(item.type == "INSTANCE" && item.mainComponent && item.mainComponent.parent && item.mainComponent.parent.name == "Vertical Data Value")
	{
		return true;
	}
	return false;
}

function dataValueLayout(items: SceneNode[], container: FrameNode | null = null) {
	items = items.sort((a, b) => {
		if (a.x == b.x) return a.y - b.y;
		return a.x - b.x;
	});
	items.forEach((item) => {
		if(isDataValue(item)) {
			item.resizeWithoutConstraints(colWidth, item.height);
		}
	});
	const totalHeight = items.reduce((sum, item) => sum + (isDataValue(item) ? item.height : 0), 0) + spacing*items.length - col*spacing;
	const avgHeight = Math.round(totalHeight/col);
	const frameX = items[0].x;
	const frameY = items[0].y;
	let frame: FrameNode;
	let parent;
	if (!container) {
        frame = figma.createFrame();
		frame.x = frameX;
        frame.y = frameY;
        frame.resizeWithoutConstraints(gridWidth, frame.height);
        frame.name = "Data Value";
		parent = (items[0] && items[0].parent) && items[0].parent;
		if(parent) parent.appendChild(frame);
	} else {
		frame = container;
		parent = container.parent;
	}

	let currentY = 0;
	let currentX = 0;
	let currentCol = 0;
	// let firstColumHeight = 0;
	let columnHeights:number[] = new Array(col).fill(0);
	items.forEach((item) => {
		if(isDataValue(item)) {
			frame.appendChild(item);
			item.x = currentX;
			item.y = currentY;
			columnHeights[currentCol] += item.height + spacing;
			// van chua lo avg height
			if (currentY+item.height <= avgHeight) {
				
				currentY += item.height + spacing;
				
			} 
			else {
				currentY = 0;
				currentX += item.width + gap;
				currentCol++;
			}
		}
	});
	const longestColumnHeight = columnHeights.reduce(function (p, v) {
		return ( p > v ? p : v );
	}) - spacing;
	frame.resizeWithoutConstraints(gridWidth, longestColumnHeight)
    figma.viewport.scrollAndZoomIntoView([frame]);
}

export default () => {
    const currentSelection = figma.currentPage.selection.slice();
    if(currentSelection.length > 1) {
        dataValueLayout(currentSelection);
    }
    if(currentSelection.length == 1 && currentSelection[0].type == "FRAME" && currentSelection[0].name == "Data Value") {
        dataValueLayout(currentSelection[0].findAll(item => isDataValue(item)), currentSelection[0]);
    }
}