const tmplTypes = n => `TApi${n}, TContext${n}, TEvent${n} extends EventObject, I${n} extends string`
const tmplArg = n => `t${n}: ComposableMachineConfig<TApi${n}, TContext${n}, any, TEvent${n}, I${n}>`
const tmplRecord = n => `Record<I${n}, TApi${n}>`
const tmplCtx = n => `TContext${n}`
const tmplEvt = n => `TEvent${n}`
const tmplReturn = (records, ctxs, evts) => `ComposableMachineConfig<${records.join(' & ')}, ${ctxs.join(' & ')}, any, ${evts.join(' | ')}, I>`

const tmplFn = (types, args, ret) => `function compose<${types.join(', ')}>(${args.join(', ')}): ${ret};`

const results = [];

for (let i = 1; i <= 30; i++) {
  const types = []
  const args = []
  const recs = []
  const ctxs = []
  const evts = []
  
  for (let j = 1; j <= i; j++) {
    types.push(tmplTypes(j))
    args.push(tmplArg(j))
    recs.push(tmplRecord(j))
    ctxs.push(tmplCtx(j))
    evts.push(tmplEvt(j))
  }


  const ret = tmplReturn(recs, ctxs, evts)

  results.push("/* prettier-ignore */")
  results.push(tmplFn(types, args, ret))
}

console.log(results.join("\n"))