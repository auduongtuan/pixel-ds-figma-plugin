import * as _ from "lodash"
import {truncateInit, truncateSetup} from "./command/truncateText"
import * as h from "./command/commandHelper"
import * as verticalDataValue from "./command/verticalDataValue_v2"
import * as gridHelper from "./command/gridHelper"
import * as tabBar from "./command/tabBar"
import * as avatar from "./command/avatar"
import toggleSensitiveMask from "./command/toggleSensitiveMask"
import textBoxTextAreaInt from "./command/textArea"
import multiSelect from "./command/multiSelect"
import * as codeHighlighter from "./command/codeHighlighter";
import test from "./command/test";
import pluginData from './command/pluginData'

const dsFonts = [
  {family: "Inter", style: "Regular"},
  {family: "Inter", style: "Medium"},
  {family: "Inter", style: "Semi Bold"},
  {family: "Inter", style: "Bold"},
  { family: "JetBrains Mono", style: "Regular" },
  {family: "Roboto", style: "Regular"}
]

const uiCommands = {
  "grid_helper": gridHelper,
  "vertical_data_value": verticalDataValue,
  "multiselect": multiSelect,
  "plugin_data": pluginData,
  "test": test,
  "codehighlighter": codeHighlighter.codeHighlighter,
}

const nonuiCommands = {
  "tabbar_init": tabBar.truncate,
  "name_avatar_init": avatar.nameInit,
  "truncate_init": truncateInit,
  "truncate_start_setup": truncateSetup,
  "truncate_end_setup": truncateSetup,
  "truncate_middle_setup": truncateSetup,
  "textbox_init": textBoxTextAreaInt,
  "toggle_sensitive_mask": toggleSensitiveMask,
  // grid
  "create_grid": gridHelper.createGrid,
  "update_grid": gridHelper.updateGrid,
  "grid_sort_by_column_asc": gridHelper.sortByColumnAsc,
  "grid_sort_by_column_desc": gridHelper.sortByColumnDesc,
  "grid_toggle_horizontal_scroll": gridHelper.toggleHorizontalScroll,
  "grid_toggle_vertical_scroll": gridHelper.toggleVerticalScroll,
  "codehighlighter_init": codeHighlighter.init,
}

figma.ui.onmessage = msg => {
  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if('onMessage' in value) value.onMessage(msg);
    }
  });
}

figma.on("selectionchange", async () => {
  // debug selection
  // console.log(h.selection(0).getSharedPluginData("aperia", "rawCharacters"));
  // console.log(figma.currentPage.selection);
  _.forOwn(uiCommands, async (value, key) => {
    if (figma.command == key) {
      if('onSelectionChange' in value) {
        value.onSelectionChange();
      }
    }
  });
});


figma.on("run", async ({ command, parameters }: RunEvent) => {
  await Promise.all(dsFonts.map((fontName: FontName) => figma.loadFontAsync(fontName)))

  _.forOwn(uiCommands, async (value, key) => {
    if (command == key) {
      // console.log(value.run);
      if('run' in value) value.run();
    }
  });
  _.forOwn(nonuiCommands, async (value, key) => {
    if (command == key) {
      await value();
      figma.closePlugin();
    }
  });

});

// figma.parameters.on('input', ({ parameters, key, query, result }: ParameterInputEvent) => {
//   switch (key) {
//     case 'truncate_type':
//       const truncateTypes = ['end', 'middle']
//       result.setSuggestions(truncateTypes.filter(s => s.includes(query)))
//       break

//     default:
//       return
//   }
// })