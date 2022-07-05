
// import 'prismjs/components/prism-clike';

// import 'prismjs/components/prism-java';
// import 'prismjs/components/prism-javascript';
import * as h from "./commandHelper";
import * as _ from "lodash";
import styles from "../data/pixelStyles";
export const init = () => {
  // const text = h.selection(0) as TextNode;
  // console.log(Prism);
  // console.log(text.characters);
  // console.log(Prism.tokenize(text.characters, Prism.languages.javascript));
}

export const run = () => {
  console.log('aaa');
  // figma.showUI(__html__, {title: "Aperia DS - Code Highlighter", width: 320, height: 480}) 
  // h.postData({type: "codehighlighter"});
}

const lightTokenColors = {
  "default": "Neutral/N90",
  "comment": "Neutral/N30",
  "prolog": "Neutral/N30",
  "doctype": "Neutral/N30",
  "cdata": "Neutral/N30",
  "punctuation": "Neutral/N40",
  "namespace": "Neutral/N60", // aware
  "property": "Purple/P60",
  "tag": "Purple/P60",
  "boolean": "Purple/P60",
  "number": "Purple/P60",
  "constant": "Purple/P60",
  "symbol": "Purple/P60",
  "deleted": "Purple/P60",
  "selector": "Green/G80",
  "attr-name": "Green/G80",
  "string": "Green/G80",
  "char": "Green/G80",
  "builtin": "Green/G80",
  "inserted": "Green/G80",
  "operator": "Yellow/Y70",
  "entity": "Yellow/Y70",
  "url": "Yellow/Y70",
  // "string": "Yellow/Y70",
  "atrule": "Blue/B50",
  "attr-value": "Blue/B50",
  "keyword": "Blue/B50",
  "function": "Blue/B90",
  "class-name": "Blue/B90",
  "regex": "Yellow/Y50",
  "important": "Yellow/Y50",
  "variable": "Yellow/Y50",
}

const darkTokenColors = {
  "default": "Neutral/N10",
  "comment": "Neutral/N50",
  "prolog": "Neutral/N50",
  "doctype": "Neutral/N50",
  "cdata": "Neutral/N50",
  "punctuation": "Neutral/N30",
  "namespace": "Neutral/N60", // aware
  "property": "Purple/P30",
  "tag": "Purple/P30",
  "boolean": "Purple/P30",
  "number": "Purple/P30",
  "constant": "Purple/P30",
  "symbol": "Purple/P30",
  "deleted": "Purple/P30",
  "selector": "Green/G30",
  "attr-name": "Green/G30",
  "string": "Green/G30",
  "char": "Green/G30",
  "builtin": "Green/G30",
  "inserted": "Green/G30",
  "operator": "Yellow/Y30",
  "entity": "Yellow/Y30",
  "url": "Yellow/Y30",
  // "string": "Yellow/Y30",
  "atrule": "Blue/B30",
  "attr-value": "Blue/B30",
  "keyword": "Blue/B30",
  "function": "Blue/B20",
  "class-name": "Blue/B20",
  "regex": "Yellow/Y30",
  "important": "Yellow/Y30",
  "variable": "Yellow/Y30",
}
export const codeHighlighter = {
  run: async () => {
    figma.showUI(__html__, {title: "Aperia DS - Code Highlighter", width: 320, height: 480}) 
    h.postData({type: "codehighlighter"});
    // console.log(figma.getLocalPaintStyles().map(paintStyle => {
    //   return `"${paintStyle.name}": "${paintStyle.key}"`;
    // }).join(",\n"));
    codeHighlighter.onSelectionChange();
  },
  onSelectionChange: async () => {
    const selection = h.selection(0);
    if(selection && selection.type == "INSTANCE")
    {
      const textNode = selection.findOne(node => node.type == "TEXT" && node.name == "Code") as TextNode;
      const theme = (selection.mainComponent.name.includes('Theme=Dark')) ? 'dark' : 'light';
      const language = selection.getSharedPluginData('aperia', 'language');
      h.postData({code: textNode.characters, theme, language});
    }
    if(selection && selection.type == "TEXT")
    {
      h.postData({code: selection.characters});
    }
  },
  onMessage: async (msg) => {
    if(msg.type == "codehighlighter_update") {
      let characters = '';
      function tokenRecursive(tokenStream) {
        tokenStream.forEach(token => {
          if(_.isString(token)) {
            characters += token;
          }
          else if ("content" in token) {
            if(_.isString(token.content))
            {
              characters += token.content;
            }
            else if (_.isArray(token.content))
            {
              tokenRecursive(token.content);
            }
          }
        })
      }
      tokenRecursive(msg.tokens);
      const selection = h.selection(0);
      let textNode: TextNode;
      let lineNumbersNode: TextNode;
      if(selection.type == "INSTANCE") {
       textNode = selection.findOne(node => node.type == "TEXT" && node.name == "Code") as TextNode;
       lineNumbersNode = selection.findOne(node => node.type == "TEXT" && node.name == "Line Numbers") as TextNode;
       selection.setSharedPluginData('aperia', 'language', msg.language);
      }
      else if (selection.type == "TEXT") {
        textNode = selection;
      }
      if(textNode.type == "TEXT")
      {
        textNode.characters = characters;
        lineNumbersNode.characters = Array.from({length: characters.split(/\r\n|\r|\n/).length}, (_, i) => i + 1).join("\n");
        let characterCount = 0;
        let imported: {[key:string]: PaintStyle} = {};
        async function importStyle(key: string) {
          if(key in imported) {
            return imported[key];
          }
          else {
            const paintStyle = await figma.importStyleByKeyAsync(styles[key]) as PaintStyle;
            if(paintStyle) {
              imported[key] = paintStyle;
              return paintStyle;
            }
            else {
              return null;
            }
          }
        }
        const themedTokenColors = (msg.theme == "dark") ? darkTokenColors : lightTokenColors;
        for(const token of msg.tokens) {
          let paintKey;
          if(_.isString(token)) {
            paintKey = themedTokenColors.default;
          }
          else if ("content" in token && "type" in token) {
            // const paintStyle = h.getLocalPaintStyle(token.type in themedTokenColors ? themedTokenColors[token.type] : "Neutral/N90");
            paintKey = token.type in themedTokenColors ? themedTokenColors[token.type] : themedTokenColors.default; 
          }
          const paintStyle = await importStyle(paintKey);
          console.log(imported);
          if(paintStyle) {
            textNode.setRangeFillStyleId(characterCount, characterCount + token.length, paintStyle.id);
          }
          characterCount = characterCount + token.length;
        };
      }
    }
  }
}