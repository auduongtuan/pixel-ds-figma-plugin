import * as h from "./commandHelper";
export const multiSelectInt = async (values: string[]) => {
  const notify = figma.notify("Working on it...", {timeout: Infinity});
  for(const selection of h.selection()) {
      if(h.isInstance(selection, "Multi Select") || h.isInstance(selection, "Multi Select - Tag Style")) {
          const inputContent = <FrameNode>selection.findOne(node => node.type == "FRAME" && node.name == "Input Content");
          const inputContentWidth = inputContent.width;
          const placeholderText = <FrameNode>selection.findOne(node => node.type == "TEXT" && node.name == "Placeholder");
          const valueLines = <FrameNode[]>selection.findAll(node => node.type == "FRAME" && node.name == "Value Line");
          const lastValueLine = <FrameNode>selection.findOne(node => node.type == "FRAME" && node.name == "Last Value Line + Pointer");
          // const lastValueLineItems = <FrameNode>lastValueLine.findOne(node => node.name == "Items");
          // max chip per value line 
          const maxChipsPerLine = 10;
          // load font
          // sample
          const sampleChip = <InstanceNode|null>selection.findOne(node => node.type == "INSTANCE" && node.name == "Small Chip");
          if (!sampleChip) {
              console.log("sample chip not found");
              return;
          }
          const sampleText = <TextNode>sampleChip.findOne(node => node.type == "TEXT" && node.name == "Value");
          console.log(values);

          await h.loadFontsAsync(sampleText);

          // Chip helper
          const showChip = (chipNode: InstanceNode, textValue: string) => {
              if(chipNode) {
                  chipNode.visible = true;
                  const text = <TextNode>chipNode.findOne(node => node.type == "TEXT" && node.name == "Value");
                  text.characters = textValue;
              }
          }
          const getChip = (line: FrameNode, index: number): InstanceNode | null => {
              const chips = <InstanceNode[] | null>line.findAll(node => node.type == "INSTANCE" && node.name == "Small Chip");
              if (chips.length > 0 && chips[index]) return chips[index];
              return null;
          }
          const resetChip = (chipNode: InstanceNode) => {
              const text = <TextNode>chipNode.findOne(node => node.type == "TEXT" && node.name == "Value");
              text.characters = "Value";
              chipNode.visible = false;
          }
          const resetChipsInLine = (valueLine: FrameNode) => {
              const chips = <InstanceNode[] | null>valueLine.findAll(node => node.type == "INSTANCE" && node.name == "Small Chip");
              if(chips) chips.forEach(resetChip);
          }
          // test dom
          let currentLine = -1;
          let currentChip = 0;
          let dividedValues: Array<string>[] = [];
          // reset toan bo value
          valueLines.forEach(line => {
              resetChipsInLine(line);
              line.visible = false
          });
          resetChipsInLine(lastValueLine);
          const addNewLine = () => {
              currentLine++;
              currentChip = 0;
              valueLines[currentLine].visible = true;
              resetChipsInLine(valueLines[currentLine]);
              dividedValues.push([]);
          }
          const addNewChip = (value: string) => {
              dividedValues[dividedValues.length - 1].push(value);
              const currentChipNode = getChip(valueLines[currentLine], currentChip);
              showChip(currentChipNode, value);
              return currentChipNode;
          }
          
          values.forEach((value, i) => {
              if (i == 0 || currentChip == maxChipsPerLine) addNewLine();
              const currentChipNode = addNewChip(value);
              // if bigger -> move to nextLine
              if (valueLines[currentLine].width > inputContentWidth) {
                  console.log("vuot qua", value);
                  if (currentLine < valueLines.length-1) {
                      // vuot qua -> xoa hien tai
                      resetChip(currentChipNode);
                      // them line moi va add vao line moi
                      addNewLine();
                      addNewChip(value);
                  }
              } 
              currentChip++;
              
              // last value check
              if (i == values.length - 1) {
                  if (valueLines[currentLine].width + placeholderText.width <= inputContentWidth) {
                      resetChipsInLine(valueLines[currentLine]);
                      valueLines[currentLine].visible = false;
                      dividedValues[dividedValues.length - 1].forEach((value, i) => {
                          showChip(getChip(lastValueLine, i), value);
                      });
                  }
              }
          });

      }
  }
  notify.cancel();
}
export const multiSelect = {
  run: () => {
      figma.showUI(__html__, {title: "Aperia DS - Multi Select", width: 400, height: 160});
      h.postData({type: "multiselect"});
      multiSelect.onSelectionChange();
  },
  onMessage: (msg) => {
      if (msg.type == "multiselect_update" && typeof msg.values != "undefined") {
          multiSelectInt(msg.values);
          // h.postData({values: values});
      }
  },
  onSelectionChange: () => {
      const selection = h.selection(0);
      // if (selection.type == "INSTANCE") console.log(selection.mainComponent);
      if (h.isInstance(selection, "Multi Select") || h.isInstance(selection, "Multi Select - Tag Style")) {
          // let test =  <InstanceNode[] | null>selection.findAll(node => {
          //     if(node.type == "INSTANCE") console.log(node.mainComponent);
          //     return node.type == "INSTANCE" && node.mainComponent.parent.name == "Small Chip"
          // });
          // console.log(test);
          h.postData({values: multiSelect.getValue(selection)});
      } else {
          h.postData({values: []});
      }
  },
  getValue: (instance: InstanceNode) => {
      const chips = <InstanceNode[] | null>instance.findAll(node => node.type == "INSTANCE" && node.name == "Small Chip" && node.visible == true && node.parent.type == "FRAME" && node.parent.visible == true);
      // const chips = <InstanceNode[] | null>instance.findAll(node => node.type == "INSTANCE" && node.mainComponent.key == "be448740c0bea40c519c7eab7d85d44a9249db8b");
      let values: string[] = [];
      console.log(chips);
      chips.forEach(chip => {
          const text = <TextNode | null>chip.findOne(node => h.isText(node));
          if (text) values.push(text.characters);
      });
      return values;
  }
}
export const multiSelectIntOld = async (values: string[]) => {
  const OutputTest = <FrameNode>figma.currentPage.findOne(node => node.type == "FRAME" && node.name == "Output Test");
  for(const selection of h.selection()) {
      if(h.isInstance(selection, "Multi Select")) {
          // const values = ["Test 1", "Test thu 2", "Test 3", "Test 4", "Test 5", "Test thu lan nay", "Them mot lan", "Just a test"];
          const typing = "Value";
          // dom
          const inputContent = <FrameNode>selection.findOne(node => node.type == "FRAME" && node.name == "Input Content");
          const inputContentWidth = inputContent.width;
          console.log(inputContentWidth);
          const placeholderText = <FrameNode>selection.findOne(node => node.type == "TEXT" && node.name == "Placeholder");
          console.log(placeholderText);
          const valueLines = <FrameNode[]>selection.findAll(node => node.type == "FRAME" && node.name == "Value Line");
          const lastValueLine = <FrameNode>selection.findOne(node => node.type == "FRAME" && node.name == "Last Value Line + Pointer");
          // const lastValueLineItems = <FrameNode>lastValueLine.findOne(node => node.name == "Items");
          // max chip per value line 
          const maxChipPerLine = 6;
          // load font
          const text = <TextNode>selection.findOne(node => node.type == "TEXT" && node.name == "Value");
          await h.loadFontsAsync(text);

          const showChip = (chipNode: InstanceNode, textValue: string) => {
              if(chipNode) {
                  console.log(chipNode);
                  chipNode.visible = true;
                  const text = <TextNode>chipNode.findOne(node => node.type == "TEXT" && node.name == "Value");
                  text.characters = textValue;
              }
          }
          const getChip = (line: FrameNode, index: number): InstanceNode | null => {
              const chips = <InstanceNode[] | null>line.findAll(node => h.isInstance(node, "Small Chip"));
              if (chips.length > 0 && chips[index]) return chips[index];
              return null;
          }
          const resetChips = (chips: InstanceNode[]) => {
              chips.forEach(chipNode => {
                  const text = <TextNode>chipNode.findOne(node => node.type == "TEXT" && node.name == "Value");
                  text.characters = "Value";
                  chipNode.visible = false;
              });
          };
          // test dom
          const blankValueLine = valueLines[0].clone();
          blankValueLine.visible = true;
          const blankValueLineChips = <InstanceNode[]>blankValueLine.findAll(node => h.isInstance(node, "Small Chip"));
          resetChips(blankValueLineChips);

          let valueLineClone = blankValueLine.clone();
        
          let currentChip = 0;
          let lineDividedValues: string[][] = [];
          let currentLine = [];
        
          const resetChipsInLine = (valueLine: FrameNode) => {
              const chips = <InstanceNode[] | null>valueLine.findAll(node => h.isInstance(node, "Small Chip"));
              if(chips) resetChips(chips);
          };
          values.forEach((value, i) => {
              showChip(getChip(valueLineClone, currentChip), value);
              // if bigger -> move to nextLine
              if (valueLineClone.width > inputContentWidth - 4) {
                  lineDividedValues.push(currentLine);
                  // reset current linez
                  currentLine = [];
                  currentLine.push(value);
                  valueLineClone = blankValueLine.clone();
                  showChip(getChip(valueLineClone, 0), value);
                  currentChip = 1;
              } else {
                  currentLine.push(value);
                  currentChip++;
              }
              if (i == values.length - 1) {
                  lineDividedValues.push(currentLine);
              }
          });
          valueLines.forEach(line => line.visible = false);

          lineDividedValues.forEach((line, i) => {
              if(i != lineDividedValues.length - 1) 
              {
                  valueLines[i].visible = true;
                  const chips = <InstanceNode[]>valueLines[i].findAll(node => h.isInstance(node, "Small Chip"));
                  resetChips(chips);
                  line.forEach((item, j) => {
                      showChip(chips[j], item);
                  });
              } else {
                  const lastLineChips = <InstanceNode[]>lastValueLine.findAll(node => h.isInstance(node, "Small Chip"));
                  resetChips(lastLineChips);
                  line.forEach((item, j) => {
                      showChip(lastLineChips[j], item);
                  });
              }
          });
      }
  }
}
export default multiSelect;