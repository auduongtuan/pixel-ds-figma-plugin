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
        if (h.isInstance(selection)) {
            const ds = h.getDS(selection.mainComponent);
            console.log(ds);
            if (ds != 'pixel' && ds != 'bootstrap') return;
            const textNode = selection.findOne(node => node.type == "TEXT" && (node.name == "Text" || node.name == "Value")) as TextNode;
            const iconNode = selection.findOne(node => node.type == "INSTANCE" && node.name == "Icon") as InstanceNode | null;
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

            console.log(textNode);
            console.log(iconNode);
        }
        
    }
    notify.cancel();
}


export default toggleSensitiveMask;