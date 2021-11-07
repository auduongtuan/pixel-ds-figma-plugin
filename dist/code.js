/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shallowEqual": () => (/* binding */ shallowEqual),
/* harmony export */   "switchVariant": () => (/* binding */ switchVariant)
/* harmony export */ });
function shallowEqual(object1, object2) {
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
function switchVariant(instance, changedVariantProperties) {
    if (instance.mainComponent.parent) {
        const switchedComponent = instance.mainComponent.parent.findChild(node => {
            return node.type == "COMPONENT" && shallowEqual(node.variantProperties, Object.assign(Object.assign({}, instance.mainComponent.variantProperties), changedVariantProperties));
        });
        if (switchedComponent && switchedComponent.type == "COMPONENT")
            instance.swapComponent(switchedComponent);
    }
}


/***/ }),

/***/ "./src/truncateText.ts":
/*!*****************************!*\
  !*** ./src/truncateText.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function truncateFileName(filename, truncatedLength) {
    const keepStartLength = 5;
    const keepEndLength = 5;
    const keepEnd = filename.substring(filename.length - keepEndLength);
    const keepStart = filename.substring(0, keepStartLength);
    const remainLength = truncatedLength - keepStartLength - keepEndLength;
    const remain = filename.substring(keepStartLength, filename.length - keepEndLength);
    const sep = "...";
    const sepLength = sep.length, charsToShow = remainLength - sepLength, frontChars = Math.ceil(charsToShow / 2), backChars = Math.floor(charsToShow / 2);
    return keepStart + remain.substr(0, frontChars) +
        sep +
        remain.substr(remain.length - backChars) + keepEnd;
}
const textNodeTruncate = (fileName) => {
    const fileNameWrapper = fileName.parent;
    if (fileNameWrapper && fileNameWrapper.type == "FRAME") {
        if (fileNameWrapper.width < fileName.width) {
            const ratio = fileNameWrapper.width / fileName.width;
            const originalLength = fileName.characters.length;
            let truncatedLength = Math.ceil(originalLength * ratio);
            let rawCharacters = fileName.getSharedPluginData("aperia", "rawCharacters");
            if (!rawCharacters) {
                rawCharacters = fileName.characters;
                fileName.setSharedPluginData("aperia", "rawCharacters", rawCharacters);
                fileName.setSharedPluginData("aperia", "truncated", "1");
            }
            let shrink = true;
            let tryShrinkLenth = truncatedLength;
            while (shrink) {
                fileName.characters = truncateFileName(rawCharacters, tryShrinkLenth);
                if (fileName.width <= fileNameWrapper.width) {
                    shrink = false;
                }
                else {
                    tryShrinkLenth--;
                }
            }
            let extend = true;
            let tryExtendLenth = tryShrinkLenth;
            while (extend) {
                fileName.characters = truncateFileName(rawCharacters, tryExtendLenth + 1);
                if (fileName.width >= fileNameWrapper.width) {
                    extend = false;
                    fileName.characters = truncateFileName(rawCharacters, tryExtendLenth);
                }
                tryExtendLenth++;
            }
        }
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((currentSelection) => {
    if (currentSelection) {
        currentSelection.forEach(selectedNode => {
            if (selectedNode.type == "INSTANCE") {
                const fileNames = selectedNode.findAll((node) => node.name == "File Name" && node.type == "TEXT");
                fileNames.forEach((fileName) => {
                    textNodeTruncate(fileName);
                });
            }
        });
    }
});


/***/ }),

/***/ "./src/verticalDataValueLayout.ts":
/*!****************************************!*\
  !*** ./src/verticalDataValueLayout.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");

const gridWidth = 720;
const col = 1;
const gap = 16;
const spacing = 2;
const colWidth = (gridWidth + gap) / col - gap;
function isDataValue(item) {
    if (item.type == "INSTANCE" && item.mainComponent && item.mainComponent.parent && item.mainComponent.parent.name == "Vertical Data Value") {
        return true;
    }
    return false;
}
function dataValueLayout(items, container = null) {
    items = items.sort((a, b) => {
        if (a.x == b.x)
            return a.y - b.y;
        return a.x - b.x;
    });
    items.forEach((item) => {
        if (isDataValue(item)) {
            item.resizeWithoutConstraints(colWidth, item.height);
            if (colWidth * 1 / 3 <= 128) {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.switchVariant)(item, { "Min-width Label": "True" });
            }
            else {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.switchVariant)(item, { "Min-width Label": "False" });
            }
        }
    });
    const totalHeight = items.reduce((sum, item) => sum + (isDataValue(item) ? item.height : 0), 0) + spacing * items.length - col * spacing;
    const avgHeight = Math.round(totalHeight / col);
    const frameX = items[0].x;
    const frameY = items[0].y;
    let frame;
    let parent;
    if (!container) {
        frame = figma.createFrame();
        frame.x = frameX;
        frame.y = frameY;
        frame.resizeWithoutConstraints(gridWidth, frame.height);
        frame.name = "Vertical Data Value";
        parent = (items[0] && items[0].parent) && items[0].parent;
        if (parent)
            parent.appendChild(frame);
    }
    else {
        frame = container;
        parent = container.parent;
    }
    let currentY = 0;
    let currentX = 0;
    let currentCol = 0;
    let columnHeights = new Array(col).fill(0);
    items.forEach((item) => {
        if (isDataValue(item)) {
            frame.appendChild(item);
            item.x = currentX;
            item.y = currentY;
            columnHeights[currentCol] += item.height + spacing;
            if (currentY + item.height <= avgHeight) {
                currentY += item.height + spacing;
            }
            else {
                currentY = 0;
                currentX += item.width + gap;
                currentCol++;
            }
        }
    });
    const longestColumnHeight = columnHeights.reduce(function (p, v) {
        return (p > v ? p : v);
    }) - spacing;
    frame.resizeWithoutConstraints(gridWidth, longestColumnHeight);
    figma.viewport.scrollAndZoomIntoView([frame]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
    const currentSelection = figma.currentPage.selection.slice();
    if (currentSelection.length > 1) {
        dataValueLayout(currentSelection);
    }
    if (currentSelection.length == 1 && currentSelection[0].type == "FRAME" && currentSelection[0].name == "Data Value") {
        dataValueLayout(currentSelection[0].findAll(item => isDataValue(item)), currentSelection[0]);
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _truncateText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./truncateText */ "./src/truncateText.ts");
/* harmony import */ var _verticalDataValueLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./verticalDataValueLayout */ "./src/verticalDataValueLayout.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


figma.ui.onmessage = msg => {
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    figma.closePlugin();
};
const dsFonts = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
];
figma.on("run", () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(dsFonts.map((fontName) => figma.loadFontAsync(fontName)));
    if (figma.command == "truncate_text") {
        (0,_truncateText__WEBPACK_IMPORTED_MODULE_0__["default"])(figma.currentPage.selection);
        figma.closePlugin();
    }
    if (figma.command == "vertical_data_value_layout") {
        (0,_verticalDataValueLayout__WEBPACK_IMPORTED_MODULE_1__["default"])();
        figma.closePlugin();
    }
    if (figma.command == "show_UI") {
        figma.showUI(__html__, { title: "Pixel DS Plugin", width: 400, height: 600 });
    }
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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IjpbIndlYnBhY2s6Ly9waXhlbC1kcy1maWdtYS8uL3NyYy9oZWxwZXJzLnRzIiwid2VicGFjazovL3BpeGVsLWRzLWZpZ21hLy4vc3JjL3RydW5jYXRlVGV4dC50cyIsIndlYnBhY2s6Ly9waXhlbC1kcy1maWdtYS8uL3NyYy92ZXJ0aWNhbERhdGFWYWx1ZUxheW91dC50cyIsIndlYnBhY2s6Ly9waXhlbC1kcy1maWdtYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9waXhlbC1kcy1maWdtYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGl4ZWwtZHMtZmlnbWEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9waXhlbC1kcy1maWdtYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BpeGVsLWRzLWZpZ21hLy4vc3JjL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3dFcXVhbChvYmplY3QxLCBvYmplY3QyKSB7XG4gICAgY29uc3Qga2V5czEgPSBPYmplY3Qua2V5cyhvYmplY3QxKTtcbiAgICBjb25zdCBrZXlzMiA9IE9iamVjdC5rZXlzKG9iamVjdDIpO1xuICAgIGlmIChrZXlzMS5sZW5ndGggIT09IGtleXMyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAobGV0IGtleSBvZiBrZXlzMSkge1xuICAgICAgICBpZiAob2JqZWN0MVtrZXldICE9PSBvYmplY3QyW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hWYXJpYW50KGluc3RhbmNlLCBjaGFuZ2VkVmFyaWFudFByb3BlcnRpZXMpIHtcbiAgICBpZiAoaW5zdGFuY2UubWFpbkNvbXBvbmVudC5wYXJlbnQpIHtcbiAgICAgICAgY29uc3Qgc3dpdGNoZWRDb21wb25lbnQgPSBpbnN0YW5jZS5tYWluQ29tcG9uZW50LnBhcmVudC5maW5kQ2hpbGQobm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09IFwiQ09NUE9ORU5UXCIgJiYgc2hhbGxvd0VxdWFsKG5vZGUudmFyaWFudFByb3BlcnRpZXMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaW5zdGFuY2UubWFpbkNvbXBvbmVudC52YXJpYW50UHJvcGVydGllcyksIGNoYW5nZWRWYXJpYW50UHJvcGVydGllcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN3aXRjaGVkQ29tcG9uZW50ICYmIHN3aXRjaGVkQ29tcG9uZW50LnR5cGUgPT0gXCJDT01QT05FTlRcIilcbiAgICAgICAgICAgIGluc3RhbmNlLnN3YXBDb21wb25lbnQoc3dpdGNoZWRDb21wb25lbnQpO1xuICAgIH1cbn1cbiIsImZ1bmN0aW9uIHRydW5jYXRlRmlsZU5hbWUoZmlsZW5hbWUsIHRydW5jYXRlZExlbmd0aCkge1xuICAgIGNvbnN0IGtlZXBTdGFydExlbmd0aCA9IDU7XG4gICAgY29uc3Qga2VlcEVuZExlbmd0aCA9IDU7XG4gICAgY29uc3Qga2VlcEVuZCA9IGZpbGVuYW1lLnN1YnN0cmluZyhmaWxlbmFtZS5sZW5ndGggLSBrZWVwRW5kTGVuZ3RoKTtcbiAgICBjb25zdCBrZWVwU3RhcnQgPSBmaWxlbmFtZS5zdWJzdHJpbmcoMCwga2VlcFN0YXJ0TGVuZ3RoKTtcbiAgICBjb25zdCByZW1haW5MZW5ndGggPSB0cnVuY2F0ZWRMZW5ndGggLSBrZWVwU3RhcnRMZW5ndGggLSBrZWVwRW5kTGVuZ3RoO1xuICAgIGNvbnN0IHJlbWFpbiA9IGZpbGVuYW1lLnN1YnN0cmluZyhrZWVwU3RhcnRMZW5ndGgsIGZpbGVuYW1lLmxlbmd0aCAtIGtlZXBFbmRMZW5ndGgpO1xuICAgIGNvbnN0IHNlcCA9IFwiLi4uXCI7XG4gICAgY29uc3Qgc2VwTGVuZ3RoID0gc2VwLmxlbmd0aCwgY2hhcnNUb1Nob3cgPSByZW1haW5MZW5ndGggLSBzZXBMZW5ndGgsIGZyb250Q2hhcnMgPSBNYXRoLmNlaWwoY2hhcnNUb1Nob3cgLyAyKSwgYmFja0NoYXJzID0gTWF0aC5mbG9vcihjaGFyc1RvU2hvdyAvIDIpO1xuICAgIHJldHVybiBrZWVwU3RhcnQgKyByZW1haW4uc3Vic3RyKDAsIGZyb250Q2hhcnMpICtcbiAgICAgICAgc2VwICtcbiAgICAgICAgcmVtYWluLnN1YnN0cihyZW1haW4ubGVuZ3RoIC0gYmFja0NoYXJzKSArIGtlZXBFbmQ7XG59XG5jb25zdCB0ZXh0Tm9kZVRydW5jYXRlID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgY29uc3QgZmlsZU5hbWVXcmFwcGVyID0gZmlsZU5hbWUucGFyZW50O1xuICAgIGlmIChmaWxlTmFtZVdyYXBwZXIgJiYgZmlsZU5hbWVXcmFwcGVyLnR5cGUgPT0gXCJGUkFNRVwiKSB7XG4gICAgICAgIGlmIChmaWxlTmFtZVdyYXBwZXIud2lkdGggPCBmaWxlTmFtZS53aWR0aCkge1xuICAgICAgICAgICAgY29uc3QgcmF0aW8gPSBmaWxlTmFtZVdyYXBwZXIud2lkdGggLyBmaWxlTmFtZS53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsTGVuZ3RoID0gZmlsZU5hbWUuY2hhcmFjdGVycy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgdHJ1bmNhdGVkTGVuZ3RoID0gTWF0aC5jZWlsKG9yaWdpbmFsTGVuZ3RoICogcmF0aW8pO1xuICAgICAgICAgICAgbGV0IHJhd0NoYXJhY3RlcnMgPSBmaWxlTmFtZS5nZXRTaGFyZWRQbHVnaW5EYXRhKFwiYXBlcmlhXCIsIFwicmF3Q2hhcmFjdGVyc1wiKTtcbiAgICAgICAgICAgIGlmICghcmF3Q2hhcmFjdGVycykge1xuICAgICAgICAgICAgICAgIHJhd0NoYXJhY3RlcnMgPSBmaWxlTmFtZS5jaGFyYWN0ZXJzO1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lLnNldFNoYXJlZFBsdWdpbkRhdGEoXCJhcGVyaWFcIiwgXCJyYXdDaGFyYWN0ZXJzXCIsIHJhd0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lLnNldFNoYXJlZFBsdWdpbkRhdGEoXCJhcGVyaWFcIiwgXCJ0cnVuY2F0ZWRcIiwgXCIxXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNocmluayA9IHRydWU7XG4gICAgICAgICAgICBsZXQgdHJ5U2hyaW5rTGVudGggPSB0cnVuY2F0ZWRMZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoc2hyaW5rKSB7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUuY2hhcmFjdGVycyA9IHRydW5jYXRlRmlsZU5hbWUocmF3Q2hhcmFjdGVycywgdHJ5U2hyaW5rTGVudGgpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS53aWR0aCA8PSBmaWxlTmFtZVdyYXBwZXIud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hyaW5rID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cnlTaHJpbmtMZW50aC0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBleHRlbmQgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IHRyeUV4dGVuZExlbnRoID0gdHJ5U2hyaW5rTGVudGg7XG4gICAgICAgICAgICB3aGlsZSAoZXh0ZW5kKSB7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUuY2hhcmFjdGVycyA9IHRydW5jYXRlRmlsZU5hbWUocmF3Q2hhcmFjdGVycywgdHJ5RXh0ZW5kTGVudGggKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUud2lkdGggPj0gZmlsZU5hbWVXcmFwcGVyLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZS5jaGFyYWN0ZXJzID0gdHJ1bmNhdGVGaWxlTmFtZShyYXdDaGFyYWN0ZXJzLCB0cnlFeHRlbmRMZW50aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeUV4dGVuZExlbnRoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgKGN1cnJlbnRTZWxlY3Rpb24pID0+IHtcbiAgICBpZiAoY3VycmVudFNlbGVjdGlvbikge1xuICAgICAgICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goc2VsZWN0ZWROb2RlID0+IHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGUudHlwZSA9PSBcIklOU1RBTkNFXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZXMgPSBzZWxlY3RlZE5vZGUuZmluZEFsbCgobm9kZSkgPT4gbm9kZS5uYW1lID09IFwiRmlsZSBOYW1lXCIgJiYgbm9kZS50eXBlID09IFwiVEVYVFwiKTtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZXMuZm9yRWFjaCgoZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGVUcnVuY2F0ZShmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBzd2l0Y2hWYXJpYW50IH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuY29uc3QgZ3JpZFdpZHRoID0gNzIwO1xuY29uc3QgY29sID0gMTtcbmNvbnN0IGdhcCA9IDE2O1xuY29uc3Qgc3BhY2luZyA9IDI7XG5jb25zdCBjb2xXaWR0aCA9IChncmlkV2lkdGggKyBnYXApIC8gY29sIC0gZ2FwO1xuZnVuY3Rpb24gaXNEYXRhVmFsdWUoaXRlbSkge1xuICAgIGlmIChpdGVtLnR5cGUgPT0gXCJJTlNUQU5DRVwiICYmIGl0ZW0ubWFpbkNvbXBvbmVudCAmJiBpdGVtLm1haW5Db21wb25lbnQucGFyZW50ICYmIGl0ZW0ubWFpbkNvbXBvbmVudC5wYXJlbnQubmFtZSA9PSBcIlZlcnRpY2FsIERhdGEgVmFsdWVcIikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZGF0YVZhbHVlTGF5b3V0KGl0ZW1zLCBjb250YWluZXIgPSBudWxsKSB7XG4gICAgaXRlbXMgPSBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnggPT0gYi54KVxuICAgICAgICAgICAgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICB9KTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpc0RhdGFWYWx1ZShpdGVtKSkge1xuICAgICAgICAgICAgaXRlbS5yZXNpemVXaXRob3V0Q29uc3RyYWludHMoY29sV2lkdGgsIGl0ZW0uaGVpZ2h0KTtcbiAgICAgICAgICAgIGlmIChjb2xXaWR0aCAqIDEgLyAzIDw9IDEyOCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaFZhcmlhbnQoaXRlbSwgeyBcIk1pbi13aWR0aCBMYWJlbFwiOiBcIlRydWVcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaFZhcmlhbnQoaXRlbSwgeyBcIk1pbi13aWR0aCBMYWJlbFwiOiBcIkZhbHNlXCIgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0b3RhbEhlaWdodCA9IGl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyAoaXNEYXRhVmFsdWUoaXRlbSkgPyBpdGVtLmhlaWdodCA6IDApLCAwKSArIHNwYWNpbmcgKiBpdGVtcy5sZW5ndGggLSBjb2wgKiBzcGFjaW5nO1xuICAgIGNvbnN0IGF2Z0hlaWdodCA9IE1hdGgucm91bmQodG90YWxIZWlnaHQgLyBjb2wpO1xuICAgIGNvbnN0IGZyYW1lWCA9IGl0ZW1zWzBdLng7XG4gICAgY29uc3QgZnJhbWVZID0gaXRlbXNbMF0ueTtcbiAgICBsZXQgZnJhbWU7XG4gICAgbGV0IHBhcmVudDtcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGZyYW1lLnggPSBmcmFtZVg7XG4gICAgICAgIGZyYW1lLnkgPSBmcmFtZVk7XG4gICAgICAgIGZyYW1lLnJlc2l6ZVdpdGhvdXRDb25zdHJhaW50cyhncmlkV2lkdGgsIGZyYW1lLmhlaWdodCk7XG4gICAgICAgIGZyYW1lLm5hbWUgPSBcIlZlcnRpY2FsIERhdGEgVmFsdWVcIjtcbiAgICAgICAgcGFyZW50ID0gKGl0ZW1zWzBdICYmIGl0ZW1zWzBdLnBhcmVudCkgJiYgaXRlbXNbMF0ucGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZyYW1lID0gY29udGFpbmVyO1xuICAgICAgICBwYXJlbnQgPSBjb250YWluZXIucGFyZW50O1xuICAgIH1cbiAgICBsZXQgY3VycmVudFkgPSAwO1xuICAgIGxldCBjdXJyZW50WCA9IDA7XG4gICAgbGV0IGN1cnJlbnRDb2wgPSAwO1xuICAgIGxldCBjb2x1bW5IZWlnaHRzID0gbmV3IEFycmF5KGNvbCkuZmlsbCgwKTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpc0RhdGFWYWx1ZShpdGVtKSkge1xuICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICBpdGVtLnggPSBjdXJyZW50WDtcbiAgICAgICAgICAgIGl0ZW0ueSA9IGN1cnJlbnRZO1xuICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjdXJyZW50Q29sXSArPSBpdGVtLmhlaWdodCArIHNwYWNpbmc7XG4gICAgICAgICAgICBpZiAoY3VycmVudFkgKyBpdGVtLmhlaWdodCA8PSBhdmdIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50WSArPSBpdGVtLmhlaWdodCArIHNwYWNpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50WSA9IDA7XG4gICAgICAgICAgICAgICAgY3VycmVudFggKz0gaXRlbS53aWR0aCArIGdhcDtcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBsb25nZXN0Q29sdW1uSGVpZ2h0ID0gY29sdW1uSGVpZ2h0cy5yZWR1Y2UoZnVuY3Rpb24gKHAsIHYpIHtcbiAgICAgICAgcmV0dXJuIChwID4gdiA/IHAgOiB2KTtcbiAgICB9KSAtIHNwYWNpbmc7XG4gICAgZnJhbWUucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKGdyaWRXaWR0aCwgbG9uZ2VzdENvbHVtbkhlaWdodCk7XG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xufVxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uc2xpY2UoKTtcbiAgICBpZiAoY3VycmVudFNlbGVjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGFWYWx1ZUxheW91dChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRTZWxlY3Rpb24ubGVuZ3RoID09IDEgJiYgY3VycmVudFNlbGVjdGlvblswXS50eXBlID09IFwiRlJBTUVcIiAmJiBjdXJyZW50U2VsZWN0aW9uWzBdLm5hbWUgPT0gXCJEYXRhIFZhbHVlXCIpIHtcbiAgICAgICAgZGF0YVZhbHVlTGF5b3V0KGN1cnJlbnRTZWxlY3Rpb25bMF0uZmluZEFsbChpdGVtID0+IGlzRGF0YVZhbHVlKGl0ZW0pKSwgY3VycmVudFNlbGVjdGlvblswXSk7XG4gICAgfVxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgdHJ1bmNhdGVUZXh0IGZyb20gXCIuL3RydW5jYXRlVGV4dFwiO1xuaW1wb3J0IHZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0IGZyb20gXCIuL3ZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0XCI7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1yZWN0YW5nbGVzJykge1xuICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICByZWN0LnggPSBpICogMTUwO1xuICAgICAgICAgICAgcmVjdC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDEsIGc6IDAuNSwgYjogMCB9IH1dO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHJlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXMpO1xuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufTtcbmNvbnN0IGRzRm9udHMgPSBbXG4gICAgeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiUmVndWxhclwiIH0sXG4gICAgeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiTWVkaXVtXCIgfSxcbiAgICB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJTZW1pIEJvbGRcIiB9LFxuICAgIHsgZmFtaWx5OiBcIkludGVyXCIsIHN0eWxlOiBcIkJvbGRcIiB9LFxuXTtcbmZpZ21hLm9uKFwicnVuXCIsICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIHlpZWxkIFByb21pc2UuYWxsKGRzRm9udHMubWFwKChmb250TmFtZSkgPT4gZmlnbWEubG9hZEZvbnRBc3luYyhmb250TmFtZSkpKTtcbiAgICBpZiAoZmlnbWEuY29tbWFuZCA9PSBcInRydW5jYXRlX3RleHRcIikge1xuICAgICAgICB0cnVuY2F0ZVRleHQoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG4gICAgaWYgKGZpZ21hLmNvbW1hbmQgPT0gXCJ2ZXJ0aWNhbF9kYXRhX3ZhbHVlX2xheW91dFwiKSB7XG4gICAgICAgIHZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0KCk7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGlmIChmaWdtYS5jb21tYW5kID09IFwic2hvd19VSVwiKSB7XG4gICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB0aXRsZTogXCJQaXhlbCBEUyBQbHVnaW5cIiwgd2lkdGg6IDQwMCwgaGVpZ2h0OiA2MDAgfSk7XG4gICAgfVxufSkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9