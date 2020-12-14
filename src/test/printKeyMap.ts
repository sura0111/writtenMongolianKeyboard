import { KEY_MAP } from '@/database'

console.log(
  Object.entries(KEY_MAP)
    .map(([key, value]) => `|${key}|\`${value}\`|`)
    .join('\n'),
)
