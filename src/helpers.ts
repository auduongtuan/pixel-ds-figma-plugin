
export function shallowEqual(object1: {[key: string]: any}, object2: {[key: string]: any}) {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) {
	  return false;
	}
	for (let key of keys1) {
	  if (object1[key] !== object2[key]) {
		return false;
	  }
	}
	return true;
}

export function switchVariant(instance: InstanceNode, changedVariantProperties: { [key:string]: string} ) {
	if (instance.mainComponent.parent) {
		const switchedComponent = instance.mainComponent.parent.findChild(node => {
			return node.type == "COMPONENT" && shallowEqual(node.variantProperties, {...instance.mainComponent.variantProperties, ...changedVariantProperties})
		});
		if (switchedComponent && switchedComponent.type == "COMPONENT") instance.swapComponent(switchedComponent)
	}
}
