import { values } from "lodash";
import * as h from "./commandHelper";
const setPluginData = (key: string, value: any) => {
    h.selection().forEach(node => {
        node.setSharedPluginData('aperia', key, value);
    });
    figma.notify(`Set data successfully! ${key}: ${value.toString()}`);
}
const getPluginData = (key: string) => {
    let data = [];
    h.selection().forEach(node => {
        data.push(node.getSharedPluginData('aperia', key));
    });
    h.postData({values: data});
}
export const pluginData = {
    run: () => {
        figma.showUI(__html__, {title: "Aperia DS - Plugin Data Management", width: 400, height: 400});
        h.postData({type: "plugin_data"});
    },
    onMessage: (msg) => {
        if(msg.type == "set_plugin_data" && 'key' in msg && 'value' in msg) {
            setPluginData(msg.key, msg.value);
        }
        if(msg.type == "get_plugin_data" && 'key' in msg) {
            getPluginData(msg.key);
        }
    }
}
export default pluginData;