# Written Mongol Keyboard

"written-mongol-keyboard" is a library that converts `alphabet character input` and `cyrillic character input` in textarea (input) tags to traditional Mongolian scripts.  

It also has `builtInConversionView` and uses an open source dictionary. This will show you the closest conversion word choices.

## Installation
```bash
yarn add written-mongol-keyboard
```

## How to Use
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

## Limitations
- Works on only textarea and input tag elements. Content editable elements are not available.
- Only tested on Chrome Browser
