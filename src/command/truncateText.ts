import * as h from "./commandHelper"
import * as _ from "lodash";

const isTruncateInstance = (node: SceneNode): node is InstanceNode | FrameNode => {
	return h.isInstance(node, "Truncate") || node.getSharedPluginData("aperia", "truncate") == "1";
}
const isTruncateWrapper = (node: SceneNode): node is InstanceNode | FrameNode => {
	return node.getSharedPluginData("aperia", "truncate_wrapper") == "1";
}
const isTruncateContainer = (node: SceneNode): node is InstanceNode | FrameNode => {
	return node.getSharedPluginData("aperia", "truncate_container") == "1";
}
const isTruncateText = (node: SceneNode): node is TextNode => {
	return node.getSharedPluginData("aperia", "truncate_text") == "1";
}

export function truncateMiddle(filename: string, truncatedLength: number, keepLength = {start: 2, end: 5}) {
	// phan giu lai
	const keepEnd = filename.substring(filename.length - keepLength.end);
	const keepStart = filename.substring(0, keepLength.start);
	// con con lai
	const remainLength = truncatedLength - keepLength.start - keepLength.end;
	const remain = filename.substring(keepLength.start, filename.length - keepLength.end);
	// truncate phan con lai
	const sep = "...";
	const sepLength = sep.length,
        charsToShow = remainLength - sepLength,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);
	return keepStart + remain.substr(0, frontChars) + 
           sep + 
           remain.substr(remain.length - backChars) + keepEnd;

}

export function truncateEnd(text: string, truncatedLength: number) {
	const sep = "...";
	return text.substring(0, truncatedLength - sep.length) + sep;
}

export function truncateStart(text: string, truncatedLength: number) {
	const sep = "...";
	return sep+text.substring(text.length - truncatedLength - 1, text.length - 1);
}


export async function textNodeContainerTruncate(wrapper: FrameNode|InstanceNode|null = null, truncateFunction: Function = truncateEnd) {
	const textNodeWrapper = wrapper;
	const textNodeContainer = <FrameNode|InstanceNode|null>textNodeWrapper.findOne(node => isTruncateContainer(node));
	const textNode = <TextNode|null>textNodeWrapper.findOne(node => isTruncateText(node));
	if (!textNode || !textNodeContainer) return;
	await h.loadFontsAsync(textNode);
	let latestTruncated = textNode.getSharedPluginData("aperia", "lastest_truncated");
	let rawCharacters = textNode.getSharedPluginData("aperia", "raw_characters");
	// detech not truncated
	if (!rawCharacters || (latestTruncated && (latestTruncated != textNode.characters))) {
		rawCharacters = textNode.characters;
		textNode.setSharedPluginData("aperia", "raw_characters", rawCharacters);
	}
	else {
		// reset to raw characters
		textNode.characters = rawCharacters;
	}
	const getRealWidth = (container: SceneNode) => {
		if (!h.isFrame(container) && !h.isInstance(container)) return;
		return container.paddingLeft + container.paddingRight + _.sumBy(container.children.filter(node => node.visible == true), item => item.width) + (container.itemSpacing * (container.children.length-1));
	}
	console.log(textNodeWrapper.width, textNodeContainer.width, getRealWidth(textNodeContainer));
	const getWrapperWidth = (wrapper: FrameNode | InstanceNode) => {
		return wrapper.width - wrapper.paddingLeft - wrapper.paddingRight;
	}
	if(getWrapperWidth(textNodeWrapper) < getRealWidth(textNodeContainer)) {
		const ratio = getWrapperWidth(textNodeWrapper) / getRealWidth(textNodeContainer);
		const originalLength = textNode.characters.length;
		let truncatedLength = Math.ceil(originalLength * ratio);

		
		// test shrink
		let shrink = true;
		let tryShrinkLength = truncatedLength;
		while(shrink && tryShrinkLength > 0) {
			console.log(tryShrinkLength);
			textNode.characters = truncateFunction(rawCharacters, tryShrinkLength); //test
			console.log(getRealWidth(textNodeContainer), getWrapperWidth(textNodeWrapper));
			if (getRealWidth(textNodeContainer) <= getWrapperWidth(textNodeWrapper)) {
				shrink = false;
			}
			else {
				tryShrinkLength--;
			}
		}
		console.log('done test shrink');
		// test extend
		let extend = true;
		let tryExtendLength = tryShrinkLength;
		while(extend) {
			textNode.characters = truncateFunction(rawCharacters, tryExtendLength+1); //test
			if (getRealWidth(textNodeContainer) >= getWrapperWidth(textNodeWrapper)) {
				extend = false;
				// back to previous if overflow
				textNode.characters = truncateFunction(rawCharacters, tryExtendLength);
			}
			tryExtendLength++;
		}
		textNode.setSharedPluginData("aperia", "lastest_truncated", textNode.characters);
	}
}

export async function textNodeTruncate(textNode: TextNode, truncateFunction: Function = truncateEnd) {
	const textNodeWrapper = textNode.parent;
	if (textNodeWrapper && textNodeWrapper.type == "FRAME" || textNodeWrapper.type == "INSTANCE") {
		let latestTruncated = textNode.getSharedPluginData("aperia", "lastest_truncated");
		let rawCharacters = textNode.getSharedPluginData("aperia", "raw_characters");
		// detech not truncated
		if (!rawCharacters || (latestTruncated && (latestTruncated != textNode.characters))) {
			rawCharacters = textNode.characters;
			textNode.setSharedPluginData("aperia", "raw_characters", rawCharacters);
		}
		else {
			// reset to raw characters
			textNode.characters = rawCharacters;
		}
		const textNodeWrapperInnerWidth = textNodeWrapper.width - textNodeWrapper.paddingLeft - textNodeWrapper.paddingRight;
		if(textNodeWrapperInnerWidth < textNode.width) {
			const ratio = textNodeWrapperInnerWidth / textNode.width;
			const originalLength = textNode.characters.length;
			let truncatedLength = Math.ceil(originalLength * ratio);

			
			// test shrink
			let shrink = true;
			let tryShrinkLenth = truncatedLength;
			while(shrink) {
				textNode.characters = truncateFunction(rawCharacters, tryShrinkLenth); //test
				if (textNode.width <= textNodeWrapperInnerWidth) {
					shrink = false;
				}
				else {
					tryShrinkLenth--;
				}
			}
			// test extend
			let extend = true;
			let tryExtendLenth = tryShrinkLenth;
			while(extend) {
				textNode.characters = truncateFunction(rawCharacters, tryExtendLenth+1); //test
				if (textNode.width >= textNodeWrapperInnerWidth) {
					extend = false;
					// back to previous if overflow
					textNode.characters = truncateFunction(rawCharacters, tryExtendLenth);
				}
				tryExtendLenth++;
			}
			textNode.setSharedPluginData("aperia", "lastest_truncated", textNode.characters);
		}
	}
}

export const truncateInit = async () => {
	console.log('test');
	const truncateWrapperInit = async (truncateWrapper: InstanceNode | FrameNode) => {
		if (truncateWrapper) {
			const truncateType = truncateWrapper.getSharedPluginData("aperia", "truncate_position");
			if (truncateType == "middle") {
				console.log('is truncate wrapper middle type');
				await textNodeContainerTruncate(truncateWrapper, truncateMiddle);		
			} else if (truncateType == "start") {
				await textNodeContainerTruncate(truncateWrapper, truncateStart);		
			} else {
				await textNodeContainerTruncate(truncateWrapper, truncateEnd);
			}
		}
	}
	const truncateInstanceInit = async (truncateInstance: InstanceNode | FrameNode) => {
		const textNode = <TextNode | null>truncateInstance.findOne((node) => node.type == "TEXT");
		if (textNode) {
			await h.loadFontsAsync(textNode);
			const truncateType = truncateInstance.getSharedPluginData("aperia", "truncate_position");
			if (truncateType == "middle") {
				textNodeTruncate(textNode, truncateMiddle);		
			} else if (truncateType == "start") {
				textNodeTruncate(textNode, truncateStart);		
			} else {
				textNodeTruncate(textNode, truncateEnd);
			}
		}
	}
	for(const selectedNode of h.selection()) {
		if(isTruncateInstance(selectedNode)) {
			await truncateInstanceInit(selectedNode);
		}
		else if(isTruncateWrapper(selectedNode)) {
			await truncateWrapperInit(selectedNode);
		}
		if(h.isContainer(selectedNode)) {
			const truncateInstances = <InstanceNode[]>selectedNode.findAll(isTruncateInstance);
			// normal truncate instance
			for(const truncateInstance of truncateInstances) {
				await truncateInstanceInit(truncateInstance);
			}
			// truncate by wrapper
			console.log('finding truncate wrappers');

			const truncateWrappers = <InstanceNode[]|FrameNode[]>selectedNode.findAll(isTruncateWrapper);
			for(const truncateWrapper of truncateWrappers) {
				console.log('aa');
				await truncateWrapperInit(truncateWrapper);
			}
		}
	};
}

export const truncateSetup = async () => {
	let error = 0;
	for(const selectedNode of h.selection()) {
		if(h.isFrame(selectedNode) || h.isInstance(selectedNode) || selectedNode.type == "COMPONENT") {
			if (selectedNode.clipsContent == true) {
				const textNode = <TextNode | null>selectedNode.findChild((node) => node.type == "TEXT");
				if (textNode && textNode.textAutoResize == "WIDTH_AND_HEIGHT") {
					selectedNode.setSharedPluginData("aperia", "truncate", "1");
					selectedNode.setRelaunchData({"truncate_init": ""})
					if (figma.command == "truncate_middle_setup") {
						selectedNode.setSharedPluginData("aperia", "truncate_position", "middle");
					}
					else if (figma.command == "truncate_start_setup") {
						selectedNode.setSharedPluginData("aperia", "truncate_position", "start");
					} 
					await h.loadFontsAsync(textNode);
					if (figma.command == "truncate_start_setup") {
						textNode.textAlignHorizontal = "RIGHT";
						textNode.constraints = {horizontal: "MAX", vertical: "MIN"};
					}
					else {
						textNode.textAlignHorizontal = "LEFT";
						textNode.constraints = {horizontal: "MIN", vertical: "MIN"};
					}
				} else {
					error = 1;
				}
			}
			else {
				error = 2;
			}
			
		} else {
			error = 3;
		}
	}
	const messages = ['✅ Set to be truncated successfully!', "❌ No suitable text node in frame.", "❌ Node is not set to clip content.", "❌ Node is not a frame or an instance."];
	figma.notify(messages[error]);
}