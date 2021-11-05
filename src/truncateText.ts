function truncateFileName(filename, truncatedLength) {
	const keepStartLength = 5;
	const keepEndLength = 5;
	// phan giu lai
	const keepEnd = filename.substring(filename.length - keepEndLength);
  const keepStart = filename.substring(0, keepStartLength);
	// con con lai
	const remainLength = truncatedLength - keepStartLength - keepEndLength;
	const remain = filename.substring(keepStartLength, filename.length - keepEndLength);
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

const textNodeTruncate = (fileName: TextNode) => {
	const fileNameWrapper = fileName.parent;
	if (fileNameWrapper && fileNameWrapper.type == "FRAME") {
		if(fileNameWrapper.width < fileName.width) {
			const ratio = fileNameWrapper.width / fileName.width;
			const originalLength = fileName.characters.length;
			let truncatedLength = Math.ceil(originalLength * ratio);
			let rawCharacters = fileName.getSharedPluginData("aperia", "rawCharacters");
			if (!rawCharacters) {
				rawCharacters = fileName.characters;
				fileName.setSharedPluginData("aperia", "rawCharacters", rawCharacters);
				fileName.setSharedPluginData("aperia", "truncated", "1");
			}
	

			// test shrink
			let shrink = true;
			let tryShrinkLenth = truncatedLength;
			while(shrink) {
				fileName.characters = truncateFileName(rawCharacters, tryShrinkLenth); //test
				if (fileName.width <= fileNameWrapper.width) {
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
				fileName.characters = truncateFileName(rawCharacters, tryExtendLenth+1); //test
				if (fileName.width >= fileNameWrapper.width) {
					extend = false;
					// back to previous if overflow
					fileName.characters = truncateFileName(rawCharacters, tryExtendLenth);
				}
				tryExtendLenth++;
			}
		}
	}
}

export default (currentSelection) => {
    if(currentSelection) {
        currentSelection.forEach(selectedNode => {
            if(selectedNode.type == "INSTANCE") {
                const fileNames = selectedNode.findAll((node: SceneNode) => node.name == "File Name" && node.type == "TEXT");
                fileNames.forEach((fileName: TextNode) => {
                    textNodeTruncate(fileName);
                });
            }
        });
    } 
}