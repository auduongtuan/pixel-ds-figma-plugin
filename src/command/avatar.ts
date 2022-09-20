import * as h from "./commandHelper"
import pixelStyles from '../data/pixelStyles';
import bootstrapStyles from '../data/pixelStyles';
const pixelAvatarColors = ["Other/SG", "Other/JA", "Other/SK", "Other/LI", "Other/PI", "Other/OR", "Other/PU", "Other/MA"];
const bootstrapAvatarColors = ["Avatar/Cyan", "Avatar/Lime", "Avatar/Deep Sky", "Avatar/Khaki", "Avatar/Deep Pink", "Avatar/Yellow", "Avatar/Dark Purple", "Avatar/Magenta"]

function getAvatarText(value: string){
    if (!value) return;
    const stringArr = value.trim().split(' ');
    const len = stringArr.length;
    let result = stringArr[0].slice(0, 1);
    if (len > 1) result += stringArr[len - 1].slice(0, 1) || '';
    return result;
  };
  
// Get Color From Name Avatar
function getHashNumberFromString(str: string) {
  var hash = 1;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = (Math.abs(hash) % 8) + 1;
  return hash;
};

const getStyleKeys = () => {
  console.log(bootstrapAvatarColors.map(color => figma.getLocalPaintStyles().filter(paint => paint.name == color)[0].key));
  // console.log(bootstrapAvatarColors.map(color => figma.getLocalPaintStyles().filter(paint => paint.name == color));
}

export const nameInit = async () => {
    // getStyleKeys();
    for(const selection of h.selection()) {
      if (selection.type == "FRAME" || selection.type == "INSTANCE") {
        const avatars = <InstanceNode[]>selection.findAll(node => h.isInstance(node) && h.isVariant(node, "Avatar", {"Type": "Name"}) && node.visible == true);
        console.log(avatars);
        for(const avatar of avatars) {
          let avatarColors = pixelAvatarColors;
          let avatarColorKeys = pixelAvatarColors.map(colorName => pixelStyles[colorName]);
          const isBootstrap = h.getComponent(avatar).getSharedPluginData('aperia', 'ds') == 'bootstrap';
          if(isBootstrap) {
            avatarColors = bootstrapAvatarColors;
            avatarColorKeys = bootstrapAvatarColors.map(colorName => bootstrapStyles[colorName]);
          }
          let avatarText = avatar.findChild(node => h.isText(node));
          // const avatarBg = avatar.findChild(node => node.name == "Background");
          let textNode: TextNode;
          let parentNode = avatar.parent;
          let found = false;
          let i = 0;
          while(i < 2 && !found && parentNode.type != "PAGE") {
            const textN = parentNode.findOne(node => h.isText(node) && node.id != avatarText.id && node.visible == true);
            if (textN && h.isText(textN)) {
              textNode = textN;
              found = true;
            }
            i++;
          }
          // (avatarBg.type == "FRAME" || avatarBg.type == "ELLIPSE")

          if(h.isText(avatarText) && textNode) {
      			await h.loadFontsAsync(avatarText);
            avatarText.characters = getAvatarText(textNode.characters);
            const hash = isBootstrap ? getHashNumberFromString(getAvatarText(textNode.characters)) : getHashNumberFromString(textNode.characters);
            // const paints = figma.getLocalPaintStyles().filter(paint => paint.name == avatarColors[hash-1]);
            // avatar.fillStyleId = paints[0].id;
            const paint = await figma.importStyleByKeyAsync(avatarColorKeys[hash-1]);
            if (paint) avatar.fillStyleId = paint.id;
          }
  
        };
      }
    };
    figma.closePlugin();
}