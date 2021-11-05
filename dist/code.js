/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
const gridWidth = 360;
const col = 2;
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
        frame.name = "Data Value";
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
        figma.showUI(__html__);
    }
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7Ozs7Ozs7VUM1RUY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDMEM7QUFDc0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBLDRCQUE0Qix3QkFBd0Isc0JBQXNCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sbUNBQW1DO0FBQ3pDLE1BQU0sa0NBQWtDO0FBQ3hDLE1BQU0scUNBQXFDO0FBQzNDLE1BQU0sZ0NBQWdDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx5REFBWTtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9FQUF1QjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1BpeGVsLURTLy4vc3JjL3RydW5jYXRlVGV4dC50cyIsIndlYnBhY2s6Ly9QaXhlbC1EUy8uL3NyYy92ZXJ0aWNhbERhdGFWYWx1ZUxheW91dC50cyIsIndlYnBhY2s6Ly9QaXhlbC1EUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9QaXhlbC1EUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUGl4ZWwtRFMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaXhlbC1EUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1BpeGVsLURTLy4vc3JjL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdHJ1bmNhdGVGaWxlTmFtZShmaWxlbmFtZSwgdHJ1bmNhdGVkTGVuZ3RoKSB7XG4gICAgY29uc3Qga2VlcFN0YXJ0TGVuZ3RoID0gNTtcbiAgICBjb25zdCBrZWVwRW5kTGVuZ3RoID0gNTtcbiAgICBjb25zdCBrZWVwRW5kID0gZmlsZW5hbWUuc3Vic3RyaW5nKGZpbGVuYW1lLmxlbmd0aCAtIGtlZXBFbmRMZW5ndGgpO1xuICAgIGNvbnN0IGtlZXBTdGFydCA9IGZpbGVuYW1lLnN1YnN0cmluZygwLCBrZWVwU3RhcnRMZW5ndGgpO1xuICAgIGNvbnN0IHJlbWFpbkxlbmd0aCA9IHRydW5jYXRlZExlbmd0aCAtIGtlZXBTdGFydExlbmd0aCAtIGtlZXBFbmRMZW5ndGg7XG4gICAgY29uc3QgcmVtYWluID0gZmlsZW5hbWUuc3Vic3RyaW5nKGtlZXBTdGFydExlbmd0aCwgZmlsZW5hbWUubGVuZ3RoIC0ga2VlcEVuZExlbmd0aCk7XG4gICAgY29uc3Qgc2VwID0gXCIuLi5cIjtcbiAgICBjb25zdCBzZXBMZW5ndGggPSBzZXAubGVuZ3RoLCBjaGFyc1RvU2hvdyA9IHJlbWFpbkxlbmd0aCAtIHNlcExlbmd0aCwgZnJvbnRDaGFycyA9IE1hdGguY2VpbChjaGFyc1RvU2hvdyAvIDIpLCBiYWNrQ2hhcnMgPSBNYXRoLmZsb29yKGNoYXJzVG9TaG93IC8gMik7XG4gICAgcmV0dXJuIGtlZXBTdGFydCArIHJlbWFpbi5zdWJzdHIoMCwgZnJvbnRDaGFycykgK1xuICAgICAgICBzZXAgK1xuICAgICAgICByZW1haW4uc3Vic3RyKHJlbWFpbi5sZW5ndGggLSBiYWNrQ2hhcnMpICsga2VlcEVuZDtcbn1cbmNvbnN0IHRleHROb2RlVHJ1bmNhdGUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICBjb25zdCBmaWxlTmFtZVdyYXBwZXIgPSBmaWxlTmFtZS5wYXJlbnQ7XG4gICAgaWYgKGZpbGVOYW1lV3JhcHBlciAmJiBmaWxlTmFtZVdyYXBwZXIudHlwZSA9PSBcIkZSQU1FXCIpIHtcbiAgICAgICAgaWYgKGZpbGVOYW1lV3JhcHBlci53aWR0aCA8IGZpbGVOYW1lLndpZHRoKSB7XG4gICAgICAgICAgICBjb25zdCByYXRpbyA9IGZpbGVOYW1lV3JhcHBlci53aWR0aCAvIGZpbGVOYW1lLndpZHRoO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxMZW5ndGggPSBmaWxlTmFtZS5jaGFyYWN0ZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCB0cnVuY2F0ZWRMZW5ndGggPSBNYXRoLmNlaWwob3JpZ2luYWxMZW5ndGggKiByYXRpbyk7XG4gICAgICAgICAgICBsZXQgcmF3Q2hhcmFjdGVycyA9IGZpbGVOYW1lLmdldFNoYXJlZFBsdWdpbkRhdGEoXCJhcGVyaWFcIiwgXCJyYXdDaGFyYWN0ZXJzXCIpO1xuICAgICAgICAgICAgaWYgKCFyYXdDaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICAgICAgcmF3Q2hhcmFjdGVycyA9IGZpbGVOYW1lLmNoYXJhY3RlcnM7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUuc2V0U2hhcmVkUGx1Z2luRGF0YShcImFwZXJpYVwiLCBcInJhd0NoYXJhY3RlcnNcIiwgcmF3Q2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUuc2V0U2hhcmVkUGx1Z2luRGF0YShcImFwZXJpYVwiLCBcInRydW5jYXRlZFwiLCBcIjFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc2hyaW5rID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCB0cnlTaHJpbmtMZW50aCA9IHRydW5jYXRlZExlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChzaHJpbmspIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZS5jaGFyYWN0ZXJzID0gdHJ1bmNhdGVGaWxlTmFtZShyYXdDaGFyYWN0ZXJzLCB0cnlTaHJpbmtMZW50aCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLndpZHRoIDw9IGZpbGVOYW1lV3JhcHBlci53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBzaHJpbmsgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeVNocmlua0xlbnRoLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGV4dGVuZCA9IHRydWU7XG4gICAgICAgICAgICBsZXQgdHJ5RXh0ZW5kTGVudGggPSB0cnlTaHJpbmtMZW50aDtcbiAgICAgICAgICAgIHdoaWxlIChleHRlbmQpIHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZS5jaGFyYWN0ZXJzID0gdHJ1bmNhdGVGaWxlTmFtZShyYXdDaGFyYWN0ZXJzLCB0cnlFeHRlbmRMZW50aCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS53aWR0aCA+PSBmaWxlTmFtZVdyYXBwZXIud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lLmNoYXJhY3RlcnMgPSB0cnVuY2F0ZUZpbGVOYW1lKHJhd0NoYXJhY3RlcnMsIHRyeUV4dGVuZExlbnRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5RXh0ZW5kTGVudGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCAoY3VycmVudFNlbGVjdGlvbikgPT4ge1xuICAgIGlmIChjdXJyZW50U2VsZWN0aW9uKSB7XG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZE5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZS50eXBlID09IFwiSU5TVEFOQ0VcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lcyA9IHNlbGVjdGVkTm9kZS5maW5kQWxsKChub2RlKSA9PiBub2RlLm5hbWUgPT0gXCJGaWxlIE5hbWVcIiAmJiBub2RlLnR5cGUgPT0gXCJURVhUXCIpO1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lcy5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0Tm9kZVRydW5jYXRlKGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsImNvbnN0IGdyaWRXaWR0aCA9IDM2MDtcbmNvbnN0IGNvbCA9IDI7XG5jb25zdCBnYXAgPSAxNjtcbmNvbnN0IHNwYWNpbmcgPSAyO1xuY29uc3QgY29sV2lkdGggPSAoZ3JpZFdpZHRoICsgZ2FwKSAvIGNvbCAtIGdhcDtcbmZ1bmN0aW9uIGlzRGF0YVZhbHVlKGl0ZW0pIHtcbiAgICBpZiAoaXRlbS50eXBlID09IFwiSU5TVEFOQ0VcIiAmJiBpdGVtLm1haW5Db21wb25lbnQgJiYgaXRlbS5tYWluQ29tcG9uZW50LnBhcmVudCAmJiBpdGVtLm1haW5Db21wb25lbnQucGFyZW50Lm5hbWUgPT0gXCJWZXJ0aWNhbCBEYXRhIFZhbHVlXCIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGRhdGFWYWx1ZUxheW91dChpdGVtcywgY29udGFpbmVyID0gbnVsbCkge1xuICAgIGl0ZW1zID0gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS54ID09IGIueClcbiAgICAgICAgICAgIHJldHVybiBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgfSk7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXNEYXRhVmFsdWUoaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0ucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKGNvbFdpZHRoLCBpdGVtLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0b3RhbEhlaWdodCA9IGl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyAoaXNEYXRhVmFsdWUoaXRlbSkgPyBpdGVtLmhlaWdodCA6IDApLCAwKSArIHNwYWNpbmcgKiBpdGVtcy5sZW5ndGggLSBjb2wgKiBzcGFjaW5nO1xuICAgIGNvbnN0IGF2Z0hlaWdodCA9IE1hdGgucm91bmQodG90YWxIZWlnaHQgLyBjb2wpO1xuICAgIGNvbnN0IGZyYW1lWCA9IGl0ZW1zWzBdLng7XG4gICAgY29uc3QgZnJhbWVZID0gaXRlbXNbMF0ueTtcbiAgICBsZXQgZnJhbWU7XG4gICAgbGV0IHBhcmVudDtcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGZyYW1lLnggPSBmcmFtZVg7XG4gICAgICAgIGZyYW1lLnkgPSBmcmFtZVk7XG4gICAgICAgIGZyYW1lLnJlc2l6ZVdpdGhvdXRDb25zdHJhaW50cyhncmlkV2lkdGgsIGZyYW1lLmhlaWdodCk7XG4gICAgICAgIGZyYW1lLm5hbWUgPSBcIkRhdGEgVmFsdWVcIjtcbiAgICAgICAgcGFyZW50ID0gKGl0ZW1zWzBdICYmIGl0ZW1zWzBdLnBhcmVudCkgJiYgaXRlbXNbMF0ucGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZyYW1lID0gY29udGFpbmVyO1xuICAgICAgICBwYXJlbnQgPSBjb250YWluZXIucGFyZW50O1xuICAgIH1cbiAgICBsZXQgY3VycmVudFkgPSAwO1xuICAgIGxldCBjdXJyZW50WCA9IDA7XG4gICAgbGV0IGN1cnJlbnRDb2wgPSAwO1xuICAgIGxldCBjb2x1bW5IZWlnaHRzID0gbmV3IEFycmF5KGNvbCkuZmlsbCgwKTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpc0RhdGFWYWx1ZShpdGVtKSkge1xuICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICBpdGVtLnggPSBjdXJyZW50WDtcbiAgICAgICAgICAgIGl0ZW0ueSA9IGN1cnJlbnRZO1xuICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjdXJyZW50Q29sXSArPSBpdGVtLmhlaWdodCArIHNwYWNpbmc7XG4gICAgICAgICAgICBpZiAoY3VycmVudFkgKyBpdGVtLmhlaWdodCA8PSBhdmdIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50WSArPSBpdGVtLmhlaWdodCArIHNwYWNpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50WSA9IDA7XG4gICAgICAgICAgICAgICAgY3VycmVudFggKz0gaXRlbS53aWR0aCArIGdhcDtcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBsb25nZXN0Q29sdW1uSGVpZ2h0ID0gY29sdW1uSGVpZ2h0cy5yZWR1Y2UoZnVuY3Rpb24gKHAsIHYpIHtcbiAgICAgICAgcmV0dXJuIChwID4gdiA/IHAgOiB2KTtcbiAgICB9KSAtIHNwYWNpbmc7XG4gICAgZnJhbWUucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKGdyaWRXaWR0aCwgbG9uZ2VzdENvbHVtbkhlaWdodCk7XG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xufVxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uc2xpY2UoKTtcbiAgICBpZiAoY3VycmVudFNlbGVjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGFWYWx1ZUxheW91dChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRTZWxlY3Rpb24ubGVuZ3RoID09IDEgJiYgY3VycmVudFNlbGVjdGlvblswXS50eXBlID09IFwiRlJBTUVcIiAmJiBjdXJyZW50U2VsZWN0aW9uWzBdLm5hbWUgPT0gXCJEYXRhIFZhbHVlXCIpIHtcbiAgICAgICAgZGF0YVZhbHVlTGF5b3V0KGN1cnJlbnRTZWxlY3Rpb25bMF0uZmluZEFsbChpdGVtID0+IGlzRGF0YVZhbHVlKGl0ZW0pKSwgY3VycmVudFNlbGVjdGlvblswXSk7XG4gICAgfVxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgdHJ1bmNhdGVUZXh0IGZyb20gXCIuL3RydW5jYXRlVGV4dFwiO1xuaW1wb3J0IHZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0IGZyb20gXCIuL3ZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0XCI7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1yZWN0YW5nbGVzJykge1xuICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICByZWN0LnggPSBpICogMTUwO1xuICAgICAgICAgICAgcmVjdC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDEsIGc6IDAuNSwgYjogMCB9IH1dO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHJlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXMpO1xuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufTtcbmNvbnN0IGRzRm9udHMgPSBbXG4gICAgeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiUmVndWxhclwiIH0sXG4gICAgeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiTWVkaXVtXCIgfSxcbiAgICB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJTZW1pIEJvbGRcIiB9LFxuICAgIHsgZmFtaWx5OiBcIkludGVyXCIsIHN0eWxlOiBcIkJvbGRcIiB9LFxuXTtcbmZpZ21hLm9uKFwicnVuXCIsICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIHlpZWxkIFByb21pc2UuYWxsKGRzRm9udHMubWFwKChmb250TmFtZSkgPT4gZmlnbWEubG9hZEZvbnRBc3luYyhmb250TmFtZSkpKTtcbiAgICBpZiAoZmlnbWEuY29tbWFuZCA9PSBcInRydW5jYXRlX3RleHRcIikge1xuICAgICAgICB0cnVuY2F0ZVRleHQoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG4gICAgaWYgKGZpZ21hLmNvbW1hbmQgPT0gXCJ2ZXJ0aWNhbF9kYXRhX3ZhbHVlX2xheW91dFwiKSB7XG4gICAgICAgIHZlcnRpY2FsRGF0YVZhbHVlTGF5b3V0KCk7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGlmIChmaWdtYS5jb21tYW5kID09IFwic2hvd19VSVwiKSB7XG4gICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG4gICAgfVxufSkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9