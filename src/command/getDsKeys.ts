const getDsKeys = async () => {
  let styles = {};
  let components = {};
  figma.getLocalPaintStyles().forEach(style => {
    styles[style.name] = style.key;
  });
  const componentNodes = figma.root.findAll(node => {
    if(node.type == 'COMPONENT_SET') {
      return true;
      // don't get the variants
    } else if (node.type == 'COMPONENT' && node.parent.type != 'COMPONENT_SET') {
      return true;
    }
  }) as (ComponentNode | ComponentSetNode)[];
  componentNodes.forEach(node => {
    components[node.name] = {key: node.key, type: node.type};
  })
  console.log(JSON.stringify(components));
  console.log(JSON.stringify(styles));
}

export default getDsKeys;