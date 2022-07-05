import { Component } from "react"
import {postData, swapVariant} from "./commandHelper"

function isDataValue(item: SceneNode): item is InstanceNode {
	if(item.type == "INSTANCE" && item.mainComponent && item.mainComponent.parent && item.mainComponent.parent.name == "Vertical Data Value")
	{
		return true
	}
	return false
}

function dataValueLayout(items: SceneNode[], container: FrameNode | null = null, configs = {containerWidth: 720, cols: 2, gap: 16, spacing: 2}) {
	console.log(configs);
	const {containerWidth, cols, gap, spacing} = configs;
	const colWidth = (containerWidth+gap)/cols-gap;

	items = items.sort((a, b) => {
		// sort default by y, and when x
		if (a.x == b.x) return a.y - b.y;
		return a.x - b.x;
	});
	items.forEach((item) => {
		if(isDataValue(item)) {
			item.resizeWithoutConstraints(colWidth, item.height);
			if (colWidth * 1/3 <= 128) {
				swapVariant(item, {"Min-width Label": "True"})
			} else {
				swapVariant(item, {"Min-width Label": "False"})
			}
		}
	});
	const totalHeight = items.reduce((sum, item) => sum + (isDataValue(item) ? item.height : 0), 0) + spacing*items.length - cols*spacing;
	const avgHeight = Math.round(totalHeight/cols);
	const frameX = items[0].x;
	const frameY = items[0].y;
	let frame: FrameNode;
	let parent;
	if (!container) {
        frame = figma.createFrame();
		frame.x = frameX;
        frame.y = frameY;
        frame.resizeWithoutConstraints(containerWidth, frame.height);
		frame.layoutMode = "HORIZONTAL";
		frame.primaryAxisSizingMode = "FIXED";
		frame.counterAxisSizingMode = "AUTO";
		frame.itemSpacing = 0;
		frame.layoutAlign = "STRETCH"
		frame.primaryAxisAlignItems = "MIN";
        frame.name = "Vertical Data Value";
		parent = (items[0] && items[0].parent) && items[0].parent;
		if(parent) parent.appendChild(frame);
	} else {
		frame = container;
		parent = container.parent;
	}
	// but a column in frame for auto layout
	const createColFrame = (colIndex: number) => {
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
		return colFrame;
	}
	let colFrames = Array(cols).fill(null).map((col, i) => createColFrame(i));
	console.log(colFrames);
	// old code
	// let currentY = 0;
	// let currentX = 0;
	// let currentCol = 0;
	// // let firstColumHeight = 0;
	// let columnHeights:number[] = new Array(cols).fill(0);
	// items.forEach((item) => {
	// 	if(isDataValue(item)) {
	// 		frame.appendChild(item);
	// 		item.x = currentX;
	// 		item.y = currentY;
	// 		columnHeights[currentCol] += item.height + spacing;
	// 		// van chua lo avg height
	// 		if (currentY+item.height <= avgHeight) {
				
	// 			currentY += item.height + spacing;
				
	// 		} 
	// 		else {
	// 			currentY = 0;
	// 			currentX += item.width + gap;
	// 			currentCol++;
	// 		}
	// 	}
	// });

	let currentY = 0;
	let currentX = 0;
	let currentCol = 0;
	// let firstColumHeight = 0;
	let columnHeights:number[] = new Array(cols).fill(0);
	items.forEach((item) => {
		if(isDataValue(item)) {
			item.layoutAlign = "STRETCH";

			colFrames[currentCol].appendChild(item);
			// item.x = currentX;
			// item.y = currentY;
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
	frame.resizeWithoutConstraints(containerWidth, longestColumnHeight)
    // figma.viewport.scrollAndZoomIntoView([frame]);
}

export const onSelectionChange = () => {

}

export const onMessage = (msg) => {
	// layout function
	if (msg.type == "layout") {
		console.log(msg.configs);
		const currentSelection = figma.currentPage.selection.slice();
		if(currentSelection.length > 1) {
			dataValueLayout(currentSelection, null, msg.configs);
		}
		if(currentSelection.length == 1 && currentSelection[0].type == "FRAME" && currentSelection[0].name == "Vertical Data Value") {
			dataValueLayout(currentSelection[0].findAll(item => isDataValue(item)), currentSelection[0], msg.configs);
		}
	}
}

export const run = () => {
	figma.showUI(__html__, {title: "Aperia DS - Vertical Data Value", width: 320, height: 240}) 
    postData({type: "vertical_data_value"});
}
