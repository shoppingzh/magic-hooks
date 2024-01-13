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

## Roadmap

- core
  - useLoad 加载
  - useLoadList 加载列表(分页)
  - useAnchor 锚点
- chart
  - useChart 基础图表
  - usePie 饼图

