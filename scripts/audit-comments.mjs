import { readdir, readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true })
  const output = []
  for (const entry of entries) {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) output.push(...await walk(path))
    else if (['.vue', '.js', '.css'].includes(extname(path))) output.push(path)
  }
  return output
}

const failures = []
for (const path of await walk('src')) {
  const text = await readFile(path, 'utf8')
  const expressions = [/<!--/, /\/\*/, /^\s*\/\//m]
  if (expressions.some(expression => expression.test(text))) failures.push(path)
}
if (failures.length) {
  process.stderr.write('Arquivos com comentários remanescentes:\n' + failures.join('\n') + '\n')
  process.exitCode = 1
} else {
  process.stdout.write('Nenhum comentário detectado nos arquivos-fonte de src.\n')
}
