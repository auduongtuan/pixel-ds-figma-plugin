import * as h from "./commandHelper";
export const getLastLine = async (textNode: TextNode) => {
  await h.loadFontsAsync(textNode);
  const textNodeClone = textNode.clone();
  let oCharacters = textNode.characters;
  let characters = textNode.characters;
  let beginHeight = textNode.height;
  let whileContinue = true;
  let cutPosition = characters.length - 1;
  textNodeClone.characters = "T";
  let lineHeight = textNodeClone.height;
  // if only 1 line
  if (textNode.height == lineHeight) return oCharacters;
  // get cut position
  while (whileContinue) {
      // giam 1 ki tu
      characters = characters.slice(0, -1);
      cutPosition--;
      textNodeClone.characters = characters;
      // console.log(characters, characters.slice(-1));
      if (textNodeClone.height != beginHeight) {
          whileContinue = false;
      }
  }
  let heightWithoutLastLine = textNodeClone.height;
  let nextWordIndex: number = cutPosition;
  for (; nextWordIndex > 0; nextWordIndex--) {
      if(oCharacters[nextWordIndex] == " ") {
          break;
      }
  }
  // console.log(nextWordIndex);
  // console.log(oCharacters.substring(nextWordIndex));

  let lastLine = oCharacters.substring(nextWordIndex).trimStart();
  textNodeClone.characters = lastLine;

  if (textNodeClone.height > lineHeight)
  {
      return oCharacters.substring(cutPosition+1);
  }
  else {
      return lastLine;
  }

  // console.log(cutPosition);
  // let words = oCharacters.split(" ");
  // if (words.length > 1) {
  //     let foundWord = null;
  //     let pass = 0;
  //     for(let i = 0; i < words.length; i++) {
  //         pass += words[i].length + 1;
  //         if (pass > cutPosition + 1) {
  //             foundWord = words[i];
  //             console.log(foundWord);
  //             break;
  //         }
  //     };
  //     return foundWord;
  // } else {
  //     return null;
  // }
}
const textBoxTextAreaInt = async () => {
  for(const selection of h.selection()) {
      if (selection.type == "FRAME" || selection.type == "INSTANCE") {
          const valueNode = <TextNode | null>selection.findOne(node => node.type == "TEXT" && node.name == "Value");
          const lastLineNode = <TextNode | null>selection.findOne(node => node.type == "TEXT" && node.name == "Last Line");
          // console.log(getLastLine(valueNode));
          await h.loadFontsAsync(lastLineNode);
          lastLineNode.characters = await getLastLine(valueNode);
      }
  }
  figma.closePlugin();
}
export default textBoxTextAreaInt;