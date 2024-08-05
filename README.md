# 🧙 magic-hooks

魔法hooks。一行代码，解决你的业务问题！

## 安装

```bash [pnpm]
pnpm i magic-hooks
# yarn add magic-hooks
# npm i magic-hooks
```

## 使用

```ts
import useLoad from 'magic-hooks/useLoad'

const { result, load } = useLoad(() => Promise.resolve([1, 2, 3]))

load()
```
