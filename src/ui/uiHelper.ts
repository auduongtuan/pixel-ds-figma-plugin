export const postData = (data: {[key: string]: any}) => {
    console.log(data);
    parent.postMessage({ pluginMessage: data }, '*')
}

export const getConfig = (id: string) => {
    const el = <HTMLInputElement>document.getElementById(id);
    if (el && el.value) {
        if(el.type == "number") return parseInt(el.value);
        if(el.type == "checkbox") return el.checked;
        return el.value;
    }
    return null;  
}

export const getConfigs = (ids: string[]) => {
    const configs = {};
    ids.forEach(id => {
        configs[id] = getConfig(id);
    });
    return configs;
}
