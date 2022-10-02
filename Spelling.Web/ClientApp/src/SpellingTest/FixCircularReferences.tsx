export function fixCircularReferences() {
  const defs = {};
  return (k, v) => {
    if (typeof k === 'string') {
      if (k.startsWith('_react')) return undefined;
      if (k.startsWith('__react')) return undefined;
      if (k === 'window') return undefined;
      if (k === 'view') return undefined;
    }
    const def = defs[v];
    if (def && typeof v == 'object') return '[same as ' + def + ']';
    defs[v] = k;
    return v;
  };
}
