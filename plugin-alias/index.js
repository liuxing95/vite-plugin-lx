// alias 插件主要使用的是 resolvedId 路径解析 hook
function matches(pattern, importee) {
  if (pattern instanceof RegExp) {
    return pattern.test(importee);
  }
  if (importee.length < pattern.length) {
    return false;
  }
  if (importee === pattern) {
    return true;
  }
  // eslint-disable-next-line prefer-template
  return importee.startsWith(pattern + '/');
}

function resolveCustomResolver(
  customResolver
) {
  if (customResolver) {
    if (typeof customResolver === 'function') {
      return customResolver;
    }
    if (typeof customResolver.resolveId === 'function') {
      return customResolver.resolveId;
    }
  }
  return null;
}

function getEntries({ entries, customResolver}) {
  if (!entries) {
    return []
  }
  const resolverFunctionFromOptions = resolveCustomResolver(customResolver);

  if (Array.isArray(entries)) {
    return entries.map((entry) => {
      return {
        find: entry.find,
        replacement: entry.replacement,
        resolverFunction: resolveCustomResolver(entry.customResolver) || resolverFunctionFromOptions
      }
    })
  }
  return Object.entries(entries).map(([key, value]) => {
    return { find: key, replacement: value, resolverFunction: resolverFunctionFromOptions };
  });
}

export default function alias(options) {
  // 获取entries 配置
  const entries = getEntries(options);
  if (entries.length === 0) {
    return {
      name: 'alias',
      resolveId: () => null
    };
  }

  return {
    name: 'alias',
    // 传入三个参数，当前模块路径、引用当前模块的模块路径、其余参数
    resolveId(importee, importer, resolveOptions) {
      console.log('importee', importee)
      if (!importer) {
        return null;
      }
      // 先检查能不能匹配别名规则
      const matchedEntry = entries.find((entry) => matches(entry.find, importee))
      // 如果不能匹配替换规则，则不会继续后面的别名替换流程
      if (!matchedEntry) {
        return null;
      }
      // 正则替换路径
      const updateId = importee.replace(matchedEntry.find, matchedEntry.replacement);

      if (matchedEntry.resolverFunction) {
        return matchedEntry.resolverFunction.call(this, updatedId, importer, resolveOptions);
      }

      // 每个插件执行时都会绑定一个上下文对象作为 this
      // 这里的 this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子
      return this.resolve(updateId, importer, Object.assign({ skipSelf: true }, resolveOptions)).then((resolved) => resolved || { id: updatedId })
    }
  }
}