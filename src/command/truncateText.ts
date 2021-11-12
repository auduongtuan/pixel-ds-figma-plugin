export function truncateMiddle(filename: string, truncatedLength: number, keepLength = {start: 5, end: 5}) {
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

export function textNodeTruncate(textNode: TextNode, truncateFunction: Function = truncateEnd) {
	const textNodeWrapper = textNode.parent;
	if (textNodeWrapper && textNodeWrapper.type == "FRAME" || textNodeWrapper.type == "INSTANCE") {
		let latestTruncated = textNode.getSharedPluginData("aperia", "latestTruncated");
		let rawCharacters = textNode.getSharedPluginData("aperia", "rawCharacters");
		// detech not truncated
		if (!rawCharacters || (latestTruncated && (latestTruncated != textNode.characters))) {
			rawCharacters = textNode.characters;
			textNode.setSharedPluginData("aperia", "rawCharacters", rawCharacters);
		}
		else {
			// reset to raw characters
			textNode.characters = rawCharacters;
		}
		if(textNodeWrapper.width < textNode.width) {
			const ratio = textNodeWrapper.width / textNode.width;
			const originalLength = textNode.characters.length;
			let truncatedLength = Math.ceil(originalLength * ratio);

			
			// test shrink
			let shrink = true;
			let tryShrinkLenth = truncatedLength;
			while(shrink) {
				textNode.characters = truncateFunction(rawCharacters, tryShrinkLenth); //test
				if (textNode.width <= textNodeWrapper.width) {
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
				if (textNode.width >= textNodeWrapper.width) {
					extend = false;
					// back to previous if overflow
					textNode.characters = truncateFunction(rawCharacters, tryExtendLenth);
				}
				tryExtendLenth++;
			}
			textNode.setSharedPluginData("aperia", "latestTruncated", textNode.characters);
		}
	}
}

export const fileNameTruncate = () => {
    if(figma.currentPage.selection) {
        figma.currentPage.selection.forEach(selectedNode => {
            if(selectedNode.type == "INSTANCE") {
                const fileNames = selectedNode.findAll((node: SceneNode) => node.name == "File Name" && node.type == "TEXT");
                fileNames.forEach((fileName: TextNode) => {
                    textNodeTruncate(fileName, truncateMiddle);
                });
            }
        });
    } 
}

export const truncateInit = () => {
	const isTruncateInstance = (node: SceneNode) => {
		return node.type == "INSTANCE" && node.mainComponent.name == "Truncate";
	}
	if(figma.currentPage.selection) {
        figma.currentPage.selection.forEach(selectedNode => {
            if(selectedNode.type == "INSTANCE" || selectedNode.type == "FRAME" || selectedNode.type == "GROUP" || selectedNode.type == "COMPONENT") {
                const truncateInstances = selectedNode.findAll((node: SceneNode) => isTruncateInstance(node));
                truncateInstances.forEach((truncateInstance: InstanceNode) => {
					const textNode = truncateInstance.findOne((node) => node.type == "TEXT");
                    if (textNode && textNode.type == "TEXT") textNodeTruncate(textNode, truncateEnd);
                });
            }
        });
    } 
}