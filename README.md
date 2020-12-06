# Written Mongol Keyboard

## About this package
"written-mongol-keyboard" is a library that converts `alphabet character input` and `cyrillic character input` in textarea and input tags to ancient Mongolian characters.  

It also contains `builtInConversionView` and uses an open source dictionary. This will show you the closest word choice.

## Installation
```bash
yarn add written-mongol-keyboard
```

## How to Use
```typescript
import WrittenMongolKeyboard from 'written-mongol-keyboard'

const writtenMongolKeyboard = new WrittenMongolKeyboard(target, options)
```
```typescript
/**
 * constructor parameters
 */

// when target is not set, it works on all textarea and input elements
target?: HTMLInputElement | HTMLTextAreaElementoptional

options?: { hasBuiltInConversionView: boolean; maxConversions: number }
```

### Switcher
You can enable and disable the conversion by setting the switch property. Also you can toggle switch by typing `(cmd|ctrl) + w`. Everytime when you set this flag, onSwitch event will be triggered
```typescript
writtenMongolKeyboard.switch = true
```

### Change event
```typescript
writtenMongolKeyboard.onChange((change) => {
  // Do something
})
```

```typescript
// typeof change
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

```typescript
// typeof 'isOn' parameter
{
  switch: boolean
}
```

### Change the current word by one of conversion
This method can be called from onChange event etc if you needed. It will replace the current word by selected conversion word id. You may don't need it, if you use `builtInConversionView`
```typescript
writtenMongolKeyboard.selectConversion(id)
```