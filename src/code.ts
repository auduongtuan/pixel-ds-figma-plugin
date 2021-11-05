import truncateText from "./truncateText"
import verticalDataValueLayout from "./verticalDataValueLayout"
figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    const nodes = []

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle()
      rect.x = i * 150
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }

    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }

  figma.closePlugin()
}

const dsFonts = [
  {family: "Inter", style: "Regular"},
  {family: "Inter", style: "Medium"},
  {family: "Inter", style: "Semi Bold"},
  {family: "Inter", style: "Bold"},
]


figma.on("run", async () => {
  await Promise.all(dsFonts.map((fontName: FontName) => figma.loadFontAsync(fontName)))
  if (figma.command == "truncate_text") {
    truncateText(figma.currentPage.selection)
    figma.closePlugin()
  }
  if (figma.command == "vertical_data_value_layout") {
    verticalDataValueLayout();
    figma.closePlugin()
  }
  if (figma.command == "show_UI") {
    figma.showUI(__html__) 
  }

})
