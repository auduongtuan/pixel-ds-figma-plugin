import { Component } from "react"
import {postData, swapVariant, selection} from "./commandHelper"

const ruleComponent = <ComponentNode>figma.getNodeById("256:4701");

function isDataValue(item: SceneNode): item is InstanceNode {
	if(item.type == "INSTANCE" && item.mainComponent && item.mainComponent.parent && item.mainComponent.parent.name == "Vertical Data Value")
	{
		return true
	}
	return false
}

function isDataValueContainer(node: BaseNode): node is FrameNode {
	return node.type == "FRAME" && (node.name == "Vertical Data Value" || node.getSharedPluginData("aperia", "vertical_data_value") == "1")
}
function isDataValueColumn(node: BaseNode): node is FrameNode {
	return node.type == "FRAME" && (node.name.split(" ")[0] == "Column")
}
function dataValueLayout(items: SceneNode[], container: FrameNode | null = null, configs = {containerWidth: 720, cols: 2, gap: 16, spacing: 2}) {


	const {containerWidth, cols, gap, spacing} = configs;
	const colWidth = (containerWidth+gap)/cols-gap;

	items = items.sort((a, b) => {
		// sort default by y, and when x
		if (a.x == b.x) return a.y - b.y;
		return a.x - b.x;
	});

	items.forEach((item, i) => {
		if(isDataValue(item)) {
			item.resizeWithoutConstraints(colWidth, item.height);
			// item.layoutAlign = "STRETCH";
			if (colWidth * 1/3 <= 128) {
				swapVariant(item, {"Min-width Label": "True"})
			} else {
				swapVariant(item, {"Min-width Label": "False"})
			}
            figma.currentPage.appendChild(item);
		}
	});
	const totalHeight = items.reduce((sum, item) => sum + (isDataValue(item) ? item.height : 0), 0) + spacing*items.length - cols*spacing;
	const avgHeight = Math.round(totalHeight/cols);
	const frameX = items[0].x;
	const frameY = items[0].y;
	let frame: FrameNode;
    let parent = (items[0] && items[0].parent) && items[0].parent;

	if (!container) {
        frame = figma.createFrame();
		frame.x = frameX;
        frame.y = frameY;
		if(parent) parent.appendChild(frame);
	} else {
		frame = container;
		parent = container.parent;
	}
    // setup frame layout
	frame.resizeWithoutConstraints(containerWidth, frame.height);
    frame.layoutMode = "HORIZONTAL";
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = 0;
    frame.layoutAlign = "STRETCH"
    frame.primaryAxisAlignItems = "MIN";
    frame.name = "Vertical Data Value";
	// but a column in frame for auto layout
	const createColFrame = (colIndex: number, cols: number) => {
		const colFrame = figma.createFrame();
		// colFrame.x = colIndex * (colWidth + gap);
		colFrame.x = 0;
        colFrame.y = 0;
        colFrame.resizeWithoutConstraints(colWidth, colFrame.height);
		colFrame.name = `Column ${colIndex + 1}`;
		colFrame.layoutMode = "VERTICAL";
		colFrame.primaryAxisSizingMode = "AUTO";
		colFrame.counterAxisSizingMode = "FIXED";
		colFrame.itemSpacing = spacing;
		colFrame.layoutGrow = 1;
        
		// colFrame.layoutAlign = "STRETCH"
		frame.appendChild(colFrame);
        if (colIndex != cols - 1) {
            const colRule = ruleComponent.createInstance();
            colRule.counterAxisSizingMode = 'AUTO';
            colRule.layoutAlign = "STRETCH";
            frame.appendChild(colRule);
        }
		return colFrame;
	}
	let colFrames = Array(cols).fill(null).map((col, i) => createColFrame(i, cols));
	let remainHeight = totalHeight;

	
	let currentY = 0;
	// let currentX = 0;
	let currentCol = 0;
	// let firstColumHeight = 0;
	// let columnHeights:number[] = new Array(cols).fill(0);
	items.forEach((item) => {
		if(isDataValue(item)) {
			// van chua vuot qua avg height hoac dang la cot cuoi cung
			let remainCols = (cols-(currentCol+1));
			let dontBreak = false;
			if (remainCols != 0 && remainHeight/remainCols > avgHeight) {
				console.log(remainHeight/remainCols);
				dontBreak = true;
			}
			// is last col
			if (currentCol == cols - 1) dontBreak = true;
	
			if (currentY+item.height+spacing <= avgHeight || dontBreak) {
				currentY += item.height + spacing;
			} 
			else {
				currentY = 0;
				// currentX += item.width + gap;
				currentCol++;
			}
			if(colFrames[currentCol]) {
				colFrames[currentCol].appendChild(item);
				// columnHeights[currentCol] += item.height + spacing;
				remainHeight -= item.height + spacing;
			}
		}
	});

    frame.setSharedPluginData("aperia", "vertical_data_value", "1");
    // figma.viewport.scrollAndZoomIntoView([frame]);
}

export const onSelectionChange = () => {

}
const unGroupFrame = async (frame: FrameNode) => {
	frame.layoutMode = "NONE";
	frame.children.forEach(node => {
		if (node.type == "INSTANCE" && node.mainComponent.id == ruleComponent.id) node.remove();
		if (node.type == "FRAME" && node.layoutMode == "VERTICAL") {
			node.layoutMode = "NONE"
			let i = 0;
			node.children.forEach((child: SceneNode) => {
				frame.appendChild(child);
				child.x = node.x;
				// if (i == node.children.length - 1) node.remove();
				// i++;
			});
			node.remove();
		}
	});
}
export const onMessage = async (msg) => {
	// layout function
	if (msg.type == "layout") {
		const currentSelection = selection();
		if(currentSelection.length > 1 && isDataValue(currentSelection[0])) {
			dataValueLayout(currentSelection, null, msg.configs);
		}
	
		if(currentSelection.length == 1) {
			let frame: FrameNode | null = null;
			if (isDataValueContainer(currentSelection[0])) {
				frame = currentSelection[0]
			}
			if (isDataValue(currentSelection[0]) && isDataValueContainer(currentSelection[0].parent.parent)) {
				frame = currentSelection[0].parent.parent;
			}
			if (isDataValueColumn(currentSelection[0]) && isDataValueContainer(currentSelection[0].parent)) {
				frame = currentSelection[0].parent;
			}
            // ungroup all
			if (frame) {
				await unGroupFrame(frame);
				dataValueLayout(frame.findAll(item => isDataValue(item)), frame, msg.configs);
			}
            
		}
	}
}

export const run = () => {
	figma.showUI(__html__, {title: "Aperia DS - Vertical Data Value", width: 320, height: 240}) 
    postData({type: "vertical_data_value"});
}
