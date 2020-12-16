# Written Mongol Keyboard  
"written-mongol-keyboard" is a library that converts `alphabet character input` and `cyrillic character input` in textarea (input) tags to traditional Mongolian script.  

![image](https://raw.githubusercontent.com/sura0111/writtenMongolianKeyboard/main/image.png)

It also has `builtInConversionView` and uses an open source dictionary. This will show you the closest conversion word choices.

## Installation
```bash
yarn add written-mongol-keyboard
```

## How to Use
- For textarea and input elements

```typescript
import WrittenMongolKeyboard from 'written-mongol-keyboard'

const writtenMongolKeyboard = new WrittenMongolKeyboard(target, options)
```
**target**  
- `target` is optional, and if it is not set, it works on all textarea and input elements  

**options**  
- `hasBuiltInConversionView` option is optional and the default value is `true`
- `maxConversion` option is optional and the default value is `8`

```typescript
target?: HTMLInputElement | HTMLTextAreaElement
options?: { hasBuiltInConversionView?: boolean; maxConversions?: number }
```
- For contenteditable elements


```typescript
import { WrittenMongolForContentEditable } from 'written-mongol-keyboard'

const editor = new WrittenMongolForContentEditable('#writtenMongolEditor')
```


### Switcher
You can enable and disable the conversion by setting the switch property. Also you can toggle switch by typing `(cmd|ctrl) + m`. Everytime when you set this flag, onSwitch event will be triggered
```typescript
writtenMongolKeyboard.switch = true
```

### Change Event  
```typescript
writtenMongolKeyboard.onChange((change) => {
  // Do something
})
```
Type of 'change' parameter
```typescript
// textarea
{
  selectedWord: string
  selectedWordBeforeConversion: string
  wordBeforeSelectedWord: string
  element: HTMLInputElement | HTMLTextAreaElement | null
  conversions: WrittenMongol.DictionaryList
  conversionId: number
  coordinate: {
    left: number
    top: number
  }
  caret: {
    start: number
    end: number
  }
}

// contenteditable
TODO
```

### Switch event
```typescript
writtenMongolKeyboard.onSwitch((isOn) => {
  // Do something
})
```
typeof 'isOn' parameter
```typescript
isOn: boolean
```

### Change the current word by one of the conversion
This method can be called from onChange event etc if you needed. It will replace the current word by selected conversion word id. You may don't need it, if you use `builtInConversionView`
```typescript
writtenMongolKeyboard.selectConversion(id)
```

## Key mapping
### Alphabet to Mongolian Traditional
| key | value |
| ------------- | ----- |
|a|`ᠠ`|
|b|`ᠪ`|
|c|`ᠴ`|
|d|`ᠳ`|
|e|`ᠡ`|
|f|`ᠹ`|
|g|`ᠭ`|
|h|`ᠬ`|
|i|`ᠢ`|
|j|`ᠵ`|
|k|`ᠺ`|
|l|`ᠯ`|
|m|`ᠮ`|
|n|`ᠨ`|
|o|`ᠣ`|
|p|`ᠫ`|
|r|`ᠷ`|
|s|`ᠰ`|
|t|`ᠲ`|
|u|`ᠤ`|
|v|`ᠸ`|
|w|`᠎᠊`|
|x|`ᠱ`|
|y|`ᠶ`|
|z|`ᠵ`|
|shift |`᠊`|
|shifta|`᠎᠊ᠠ`|
|shiftc|`ᠼ`|
|shiftd|`᠊ᠳ`|
|shifte|`᠎᠊ᠡ`|
|shifti|`᠊ᠢ`|
|shiftn|`ᠩ`|
|shifto|`ᠥ`|
|shiftt|`᠊ᠲ`|
|shiftu|`ᠦ`|
|shiftz|`ᠽ`|

### Mongolian Cyrillic to Mongolian Traditional
| key | value |
| --------- | ----- |
|а|`ᠠ`|
|б|`ᠪ`|
|в|`ᠸ`|
|г|`ᠭ`|
|д|`ᠳ`|
|е|`ᠶᠡ`|
|ё|`ᠶᠣ`|
|ж|`ᠵ`|
|з|`ᠵ`|
|и|`ᠢ`|
|й|`ᠢ`|
|к|`ᠺ`|
|л|`ᠯ`|
|м|`ᠮ`|
|н|`ᠨ`|
|о|`ᠣ`|
|ө|`ᠥ`|
|п|`ᠨ`|
|р|`ᠷ`|
|с|`ᠰ`|
|т|`ᠲ`|
|у|`ᠤ`|
|ү|`ᠦ`|
|ф|`ᠹ`|
|х|`ᠬ`|
|ц|`ᠴ`|
|ч|`ᠴ`|
|ш|`ᠱ`|
|щ|`ᠱ`|
|ъ|`ᠢ`|
|ы|`ᠢ`|
|ь|`ᠢ`|
|э|`ᠡ`|
|ю|`ᠶᠦ`|
|я|`ᠶᠠ`|
|shiftа|`᠎᠊ᠠ`|
|shiftд|`᠊ᠳ`|
|shiftц|`ᠼ`|
|shiftз|`ᠽ`|
|shiftи|`᠊ᠢ`|
|shiftн|`ᠩ`|
|shiftо|`᠊ᠣ`|
|shiftө|`᠊ᠥ`|
|shiftт|`᠊ᠲ`|
|shiftу|`᠊ᠤ`|
|shiftү|`᠊ᠦ`|
|shiftэ|`᠎᠊ᠡ`|


## Limitations
- Only tested on Chrome Browser
