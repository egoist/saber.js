import path from 'path'
import os from 'os'
import { fs } from 'saber-utils'
import WebpackChain from 'webpack-chain'

const ID = Math.round(Math.random() * 1000)

/**
 * Inspect webpack config in your default editor
 */
export default async (config: WebpackChain, type: 'client' | 'server') => {
  const tempFile = path.join(
    os.tmpdir(),
    `saber-webpack-config-${type}-${ID}.js`
  )
  await fs.writeFile(tempFile, `var config = ${config.toString()}`, 'utf8')
  await require('open')(tempFile)
}
