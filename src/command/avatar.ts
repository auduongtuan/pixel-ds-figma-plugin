import * as h from "./commandHelper"
export const avatarColors = ["SG", "JA", "SK", "LI", "PI", "OR", "PU", "MA"];

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
  

export const nameInit = () => {
    // console.log(figma.getLocalPaintStyles().filter(paint => paint.name == "Other/SG"));
    figma.currentPage.selection.forEach(selection => {
      if (selection.type == "FRAME" || selection.type == "INSTANCE") {
        const avatars = selection.findAll(node => h.isInstance(node) && h.isVariant(node, "Avatar", {"Type": "Name"}) && node.visible == true);
        avatars.forEach((avatar: InstanceNode) => {
          let avatarText = avatar.findChild(node => h.isText(node));
          const avatarBg = avatar.findChild(node => node.name == "Background");
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
          if(h.isText(avatarText) && textNode && (avatarBg.type == "FRAME" || avatarBg.type == "ELLIPSE")) {
            avatarText.characters = getAvatarText(textNode.characters);
            const hash = getHashNumberFromString(textNode.characters);
            const paints = figma.getLocalPaintStyles().filter(paint => paint.name == "Other/"+avatarColors[hash-1]);
  
            avatarBg.fillStyleId = paints[0].id;
          }
  
        });
      }
    });
    figma.closePlugin();
}