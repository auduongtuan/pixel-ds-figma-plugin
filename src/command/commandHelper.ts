import * as _ from "lodash";
import bootstrapComponents from "../data/bootstrapComponents";

export const getVariantInSet = (componentSet: ComponentSetNode, variantProperties: { [key:string]: string}):ComponentNode|null => {
	const component = <ComponentNode|null>componentSet.findChild(node => {
		return node.type == "COMPONENT" && _.isEqual(node.variantProperties, {...componentSet.defaultVariant.variantProperties, ...variantProperties});
	});
	if (component) return component;
	return null;
}	

export const swapVariant = (instance: InstanceNode, changedVariantProperties: { [key:string]: string} ) => {
	if (instance.mainComponent.parent) {
		const swapedComponent = instance.mainComponent.parent.findChild(node => {
			return node.type == "COMPONENT" && _.isEqual(node.variantProperties, {...instance.mainComponent.variantProperties, ...changedVariantProperties})
		});
		if (!swapedComponent) {
			console.log("component not found");
		}
		if (swapedComponent && swapedComponent.type == "COMPONENT" && instance.mainComponent.id != swapedComponent.id) {
			instance.swapComponent(swapedComponent)
		}
	}
}

export const isVariant = (node: BaseNode, componentName: string, variantProperties: {[key: string]: string} = {}): node is InstanceNode => {
	return node.type == "INSTANCE" && node.mainComponent.parent && node.mainComponent.parent.type == "COMPONENT_SET" && node.mainComponent.parent.name == componentName && _.isMatch(node.mainComponent.variantProperties, variantProperties);
}
// return main component if not variant, return parent of main component if is variant
export const getComponent = (node: InstanceNode): ComponentNode | ComponentSetNode => {
	if (node.mainComponent.parent && node.mainComponent.parent.type == "COMPONENT_SET") return node.mainComponent.parent;
	return node.mainComponent;
}

export const getDS = (node: SceneNode): 'bootstrap' | 'pixel' | string => {
	return node.getSharedPluginData('aperia', 'ds');
}

export const isDS = (node: SceneNode, name: 'bootstrap' | 'pixel') => {
	return getDS(node) == name;
}

export function selection(): SceneNode[];
export function selection(index: number): SceneNode | undefined;
export function selection(index?: number) {
	const s = figma.currentPage.selection.slice();
	if (typeof index !== 'undefined') {
		if (s.length > 0 && s[index]) return s[index];
		return undefined;
	} else {
		return s;
	}

}



export const postData = (data: {[key: string]: any}) => {
	if (figma.ui) figma.ui.postMessage(data);
}

export const isText = (node: BaseNode): node is TextNode => {
	return node && node.type == "TEXT"
}

export const isFrame = (node: BaseNode): node is FrameNode => {
	return node && node.type == "FRAME"
}


export const isInstance = (node: BaseNode, componentName: string | null = null): node is InstanceNode => {
	if (componentName && bootstrapComponents[componentName])
	{
		return node && node.type == "INSTANCE" && node.mainComponent.key == bootstrapComponents[componentName];
	}
	if (componentName) {
		return node && node.type == "INSTANCE" && ((node.mainComponent && node.mainComponent.name == componentName) || (node.mainComponent.parent && node.mainComponent.parent.name == componentName));
	}
	else {
		return node && node.type == "INSTANCE"
	}
}

type ContainerNode = InstanceNode | FrameNode | GroupNode | ComponentNode;
export const isContainer = (node:BaseNode): node is ContainerNode  => {
	return node.type == "INSTANCE" || node.type == "FRAME" || node.type == "GROUP" || node.type == "COMPONENT";
}

export const findContainer = (parentContainer: ContainerNode, containerName: string) : ContainerNode | null => {
	return <ContainerNode | null>parentContainer.findOne(node => isContainer(node) && node.name == containerName);
}

export const loadFontsAsync = async (node: TextNode) => {
	const fonts = node.getRangeAllFontNames(0, node.characters.length);
	for (const font of fonts) {
		await figma.loadFontAsync(font);
	}
}
export const getLocalPaintStyle = (name: string) => {
	return figma.getLocalPaintStyles().filter(paint => paint.name == name)[0];
}