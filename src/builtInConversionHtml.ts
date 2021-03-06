import { ConversionViewParameter } from '@/definitions'

export default ({ coordinate, conversions, conversionId }: ConversionViewParameter): string => {
  const left = `${coordinate.left + 15}px`
  const top = `${coordinate.top}px`
  const canDisplay = conversions.length > 0

  const conversionElement = conversions
    .map(({ traditional, cyrillic }, id) => {
      return `<div data-id="${id}" class="writtenMongolKeyboardConversions_item ${
        conversionId === id ? 'writtenMongolConversionActive' : ''
      }">
  ${traditional ?? ''}
  <span class="writtenMongolKeyboardConversions_itemDescription"> ${cyrillic ?? ''}</span>
</div>
    `
    })
    .join('')

  return `
<div class="writtenMongolKeyboardConversions" style="left: ${left}; top: ${top}; display: ${
    canDisplay ? 'block' : 'none'
  }">
  ${conversionElement}
</div>`
}
