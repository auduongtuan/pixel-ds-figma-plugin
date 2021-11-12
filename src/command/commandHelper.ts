
import * as _ from "lodash";

export const switchVariant = (instance: InstanceNode, changedVariantProperties: { [key:string]: string} ) => {
	if (instance.mainComponent.parent) {
		const switchedComponent = instance.mainComponent.parent.findChild(node => {
			return node.type == "COMPONENT" && _.isEqual(node.variantProperties, {...instance.mainComponent.variantProperties, ...changedVariantProperties})
		});
		if (!switchedComponent) {
			console.log("Not found");
		}
		if (switchedComponent && switchedComponent.type == "COMPONENT" && instance.mainComponent.id != switchedComponent.id) {
			console.log(switchedComponent);
			instance.swapComponent(switchedComponent)
		}
	}
}

export const isVariant = (node: SceneNode, componentName: string, variantProperties: {[key: string]: string} = {}): node is InstanceNode => {
	return node.type == "INSTANCE" && node.mainComponent.parent.name == componentName && _.isMatch(node.mainComponent.variantProperties, variantProperties);
}


export function selection(): SceneNode[];
export function selection(index: number): SceneNode | undefined;
export function selection(index?: number) {
	const s = figma.currentPage.selection;
	if (typeof index != undefined) {
		if (s.length > 0 && s[index]) return s[index];
		return undefined;
	}
	console.log("undefined");
	return s;
}



export const postData = (data: {[key: string]: any}) => {
	if (figma.ui) figma.ui.postMessage(data);
}

export const isText = (node: BaseNode): node is TextNode => {
	return node && node.type == "TEXT"
}

export const isInstance = (node: BaseNode): node is InstanceNode => {
	return node && node.type == "INSTANCE"
}
