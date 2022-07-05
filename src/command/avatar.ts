import * as h from "./commandHelper"
const pixelAvatarColors = ["Other/SG", "Other/JA", "Other/SK", "Other/LI", "Other/PI", "Other/OR", "Other/PU", "Other/MA"];
const pixelAvatarColorKeys = ["3fe72f84d6d515e7c57569c92effa8ce24a5e462", "42064bf9e2d928800a4b0aaa56309c97f15a8ce0", "307ec63e9bd5811efa2e80c0dbe4776d01ad96cc", "851e8e551ca3b971ac4235ea35a43654c63c910a", "555999d443437b311ce84084660ccd67f9124e6d", "bb5cecf593da74d2ea2616ee02f26416ef548cbb", "fa41d27ce7052942c9f7e16a3b14972d656aac36", "71175dd85b6e5e0e19a5bb43e7ded2ab3fa8d7bb"];
const bootstrapAvatarColors = ["Avatar/Cyan", "Avatar/Lime", "Avatar/Deep Sky", "Avatar/Khaki", "Avatar/Deep Pink", "Avatar/Yellow", "Avatar/Dark Purple", "Avatar/Magenta"]
const bootstrapAvatarKeys = ["771ae563542465723a375fdbd1d1f72b9d32d91c", "b8ca8470dfa57a846b6129df49698123a595970f", "52be48abf8b9aa5d7fcba52e87c6f7410e1f5332", "9f504e9592eb6150641e6e1286dbedba2e5b2056", "0ace9f258ea7ac47c95559104625c54eb94e5a69", "94a5a2a2ff0e6bf4e67b7f5966c5582028de25fb", "ed4732f529c1f712ebb4199adeab1a74f75c1376", "df6cfd0ecb1132cd9092e62447bd446ed300586c"];

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
          let avatarColorKeys = pixelAvatarColorKeys;
          const isBootstrap = h.getComponent(avatar).getSharedPluginData('aperia', 'ds') == 'bootstrap';
          if(isBootstrap) {
            avatarColors = bootstrapAvatarColors;
            avatarColorKeys = bootstrapAvatarKeys;
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