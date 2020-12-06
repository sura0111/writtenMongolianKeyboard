export default (data: WrittenMongol.Keyboard.Type.State): string => {
  const left = `${data.coordinate.left + 15}px`
  const top = `${data.coordinate.top}px`
  const canDisplay = data.conversions.length > 0

  const conversions = data.conversions
    .map(({ written, cyrillic }, id) => {
      return `<div
  data-id="${id}"
  class="writtenMongolKeyboardConversions_item ${data.conversionId === id ? 'writtenMongolConversionActive' : ''}"
>
  ${written ?? ''}
  <span class="writtenMongolKeyboardConversions_itemDescription"> ${cyrillic ?? ''}</span>
</div>
    `
    })
    .join('')

  return `
<div class="writtenMongolKeyboardConversions" style="left: ${left}; top: ${top}; display: ${
    canDisplay ? 'block' : 'none'
  }">
  ${conversions}
</div>`
}
