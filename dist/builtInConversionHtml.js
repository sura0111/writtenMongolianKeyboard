"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (data) => {
    const left = `${data.coordinate.left + 15}px`;
    const top = `${data.coordinate.top}px`;
    const canDisplay = data.conversions.length > 0;
    const conversions = data.conversions
        .map(({ written, cyrillic }, id) => {
        return `<div
  data-id="${id}"
  class="writtenMongolKeyboardConversions_item ${data.conversionId === id ? 'writtenMongolConversionActive' : ''}"
>
  ${written !== null && written !== void 0 ? written : ''}
  <span class="writtenMongolKeyboardConversions_itemDescription"> ${cyrillic !== null && cyrillic !== void 0 ? cyrillic : ''}</span>
</div>
    `;
    })
        .join('');
    return `
<div class="writtenMongolKeyboardConversions" style="left: ${left}; top: ${top}; display: ${canDisplay ? 'block' : 'none'}">
  ${conversions}
</div>`;
};
//# sourceMappingURL=builtInConversionHtml.js.map