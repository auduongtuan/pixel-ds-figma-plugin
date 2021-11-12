import * as h from "./commandHelper";
import {truncateEnd, textNodeTruncate} from "./truncateText"
export const truncate = () => {
    const selection = h.selection(0);
    if(selection.type == "FRAME" || selection.type == "INSTANCE") {
      const tabListContainer = selection.findOne(node => node.type == "FRAME" && node.name == "Tab Container");
      const tabList = selection.findOne(node => node.type == "FRAME" && node.name == "Tabs");
      const nextChevron = selection.findOne(node => node.type == "FRAME" && node.name == "Next Chevron");
      const prevChevron = selection.findOne(node => node.type == "FRAME" && node.name == "Prev Chevron");
      if (tabListContainer.type == "FRAME" && tabList.type == "FRAME") {
        if(tabList.width > tabListContainer.width) {
          nextChevron.visible = true;
        }
        else {
          nextChevron.visible = false;
        }
      }
      const tabs = selection.findAll(node => h.isInstance(node) && h.isVariant(node, "Tab Bar/Tab") && node.visible == true);
      tabs.forEach(tab => {
        // switch to Max-width
        if (h.isInstance(tab)) {
          // reset
          h.switchVariant(tab, {"Min-width": "False", "Max-width": "False"});
          if(tab.width <= 120) {
            h.switchVariant(tab, {"Min-width": "True"});
          }
          else if(tab.width >= 280) {
            h.switchVariant(tab, {"Max-width": "True"});
            const tabName = tab.findOne(node => node.type == "TEXT" && node.name == "Name");
            if (tabName && h.isText(tabName)) textNodeTruncate(tabName, truncateEnd);
          }
        }
      });
    }
    figma.closePlugin()
}