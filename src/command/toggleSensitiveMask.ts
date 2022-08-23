// import { add, values } from "lodash";
import * as h from "./commandHelper";
// import {truncateEnd, textNodeTruncate} from "./truncateText"
const toggleSensitiveMask = async () => {
    const notify = figma.notify('Working...', {timeout: Infinity});
    const iconKeys = {
        "pixel" : {
            on: "9a00cbf1de61f7838eb07ee6ebccb71f6691ba44",
            off: "7fdda01a3ce9b782d199b6489dec59faf63ceffa",
        },
        "bootstrap": {
            on: "60612484bc12a882c71c70e5091351aed97a3c03",
            off: "22e6645ce2098bfe460595d5b3d7b88095cc0cf4"
        }
      
    }
  
    for(const selection of h.selection()) {
        if (h.isFrame(selection) || h.isInstance(selection)) {
            let valueNodes = selection.findAll(node => h.getData(node, 'sensitive') == '1');
            if(h.getData(selection, 'sensitive') == '1') valueNodes = [selection];
            for(const valueNode of valueNodes) {
                if (!h.isFrame(valueNode) && !h.isInstance(valueNode)) return;
                const ds = h.getDS(valueNode);
                console.log(ds);
                if (ds != 'pixel' && ds != 'bootstrap') return;
                const textNode = valueNode.findOne(node => node.type == "TEXT" && (node.name == "Text" || node.name == "Value")) as TextNode;
                const iconNode = valueNode.findOne(node => node.type == "INSTANCE" && node.name == "Icon") as InstanceNode | null;
                await h.loadFontsAsync(textNode);
             
                const isMasked = /•( ?)+/.test(textNode.characters);
                if (iconNode) {
                    if(isMasked) {
                        const offIcon = await figma.importComponentByKeyAsync(iconKeys[ds].off);
                        if(offIcon) iconNode.swapComponent(offIcon);
                    } else {
                        const onIcon = await figma.importComponentByKeyAsync(iconKeys[ds].on);
                        if(onIcon) iconNode.swapComponent(onIcon);
                    }
                }
                let rawContent = textNode.getSharedPluginData("aperia", "raw_content") || "Value";
                if (!isMasked) {
                    rawContent = textNode.characters;
                    textNode.setSharedPluginData("aperia", "raw_content", textNode.characters);
                }
                if(isMasked) {
                    textNode.characters = rawContent;
                } else {
                    textNode.setSharedPluginData("aperia", "raw_content", rawContent);
                    textNode.characters = Array(rawContent.length).fill('•').join(' ');
                }
            }
           
        }
        
    }
    notify.cancel();
}


export default toggleSensitiveMask;