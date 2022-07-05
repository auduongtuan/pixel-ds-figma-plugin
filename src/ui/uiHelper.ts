export const postData = (data: {[key: string]: any}) => {
    parent.postMessage({ pluginMessage: data }, '*')
}

export const getInput = (id: string) => {
    const el = <HTMLInputElement>document.getElementById(id);
    if (el && el.value) {
        if(el.type == "number") return parseInt(el.value);
        if(el.type == "checkbox") return el.checked;
        return el.value;
    }
    return '';
}

export const setInput = (id: string, value: string | number | boolean) => {
    const el = <HTMLInputElement>document.getElementById(id);
    if (el) {
        if(el.type == "checkbox") {
            el.checked = Boolean(value);
        } 
        else {
            if(typeof value != undefined) {
                el.value = value.toString();
            }
        }
    }
}

export const getInputs = (ids: string[]) => {
    const configs = {};
    ids.forEach(id => {
        configs[id] = getInput(id);
    });
    return configs;
}
