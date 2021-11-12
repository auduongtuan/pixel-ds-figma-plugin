import * as _ from "lodash"
import {fileNameTruncate, truncateInit} from "./command/truncateText"
import * as h from "./command/commandHelper"
import * as verticalDataValue from "./command/verticalDataValue_v2"
import * as gridHelper from "./command/gridHelper"
import * as tabBar from "./command/tabBar"
import * as avatar from "./command/avatar"


const dsFonts = [
  {family: "Inter", style: "Regular"},
  {family: "Inter", style: "Medium"},
  {family: "Inter", style: "Semi Bold"},
  {family: "Inter", style: "Bold"},
]

const uiCommands = {
  "grid_helper": gridHelper,
  "vertical_data_value": verticalDataValue,
}

const nonuiCommands = {
  "tabbar_init": tabBar.truncate,
  "name_avatar_init": avatar.nameInit,
  "filename_truncate": fileNameTruncate,
  "truncate_init": truncateInit
}

figma.ui.onmessage = msg => {
  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if(value.onMessage) value.onMessage(msg);
    }
  });
}

figma.on("selectionchange", () => {
  // debug selection
  console.log(h.selection(0).getSharedPluginData("aperia", "rawCharacters"));
  console.log(figma.currentPage.selection);
  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if(value.onSelectionChange) value.onSelectionChange();
    }
  });
});


figma.on("run", async () => {
  await Promise.all(dsFonts.map((fontName: FontName) => figma.loadFontAsync(fontName)))

  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if(value.run) value.run();
    }
  });
  _.forOwn(nonuiCommands, (value, key) => {
    if (figma.command == key) {
      value();
      figma.closePlugin();
    }
  });

});