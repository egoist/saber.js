import path from 'path'
import { fs, glob } from 'saber-utils'
import chokidar from 'chokidar'
import { log, colors } from 'saber-log'
import hash from 'hash-sum'
import { SaberPlugin } from '..'
import { FileInfo } from '../Pages'

const ID = 'builtin:source-pages'

const sourcePagesPlugin: SaberPlugin = {
  name: ID,

  apply(api) {
    api.hooks.beforeRun.tapPromise(ID, async () => {
      api.dataStore.addData('$pages', options => {
        return api.dataStore.findAndSort(api.pages.store, options)
      })

      const pagesDir = api.resolveCwd('pages')
      const exts = api.transformers.supportedExtensions
      const filePatterns = [
        `**/*.${exts.length === 1 ? exts[0] : `{${exts.join(',')}}`}`,
        '!**/{node_modules,dist,vendor}/**',
        '!**/_!(posts)/**'
      ]

      const files: FileInfo[] = await glob(filePatterns, {
        cwd: pagesDir,
        dot: false,
        stats: true
      }).then(files =>
        Promise.all(
          files
            .sort((a, b) => (a.path > b.path ? 1 : -1))
            .map(async file => {
              log.verbose(`Found page`, colors.dim(file.path))
              const absolute = path.join(pagesDir, file.path)
              // eslint-disable-next-line require-atomic-updates
              const content = await fs.readFile(absolute, 'utf8')
              return {
                relative: file.path,
                absolute,
                content,
                mtime: file.stats && file.stats.mtime,
                birthtime: file.stats && file.stats.birthtime
              } as FileInfo
            })
        )
      )

      api.hooks.manipulatePage.tapPromise(
        'manipulate-page',
        async ({ action, id, page }) => {
          // Remove all child pages
          api.pages.store.removeWhere(page => Boolean(page.parent))

          if (action === 'remove') {
            // Remove itself
            api.pages.store.removeWhere(page => {
              return page.id === id
            })
          } else if (action) {
            api.pages.createPage(page)
            await api.hooks.postCreatePage.promise(page)
          }
        }
      )

      // Write all pages
      // This is triggered by all file actions: change, add, remove
      api.hooks.emitPages.tapPromise('pages', async () => {
        const pages = api.pages.store.find()
        log.verbose('Emitting pages')
        // TODO: maybe write pages with limited concurrency?
        await Promise.all(
          pages.map(async page => {
            if (page.internal.saved) return

            const newContentHash = hash(page)
            const outPath = api.resolveCache('pages', `${page.id}.saberpage`)
            // TODO: is there any better solution to checking if we need to write the page?
            const exists = await fs.pathExists(outPath)
            if (exists) {
              const contentHash = await fs.readFile(outPath, 'utf8')
              if (contentHash === newContentHash) {
                // Skip if content doesn't change
                return
              }
            }

            log.verbose(`Emitting page ${outPath}`)
            await fs.outputFile(outPath, newContentHash, 'utf8')
            // eslint-disable-next-line require-atomic-updates
            page.internal.saved = true
          })
        )
      })

      await api.hooks.initPages.promise()

      await Promise.all(
        files.map(async file => {
          const page = api.pages.fileToPage(file)
          api.pages.createPage(page)
          await api.hooks.postCreatePage.promise(page)
        })
      )

      await api.hooks.postCreatePages.promise()
      await api.hooks.emitPages.promise()

      if (api.dev) {
        const watcher = chokidar.watch(filePatterns, {
          cwd: pagesDir,
          ignoreInitial: true
        })
        const handler = (type: 'add' | 'remove' | 'change') => async (
          filename: string
        ) => {
          const filepath = path.join(pagesDir, filename)

          if (type === 'remove') {
            await api.hooks.manipulatePage.promise({
              action: 'remove',
              id: hash(filepath)
            })
          } else {
            const stat = await fs.stat(filepath)
            const file: FileInfo = {
              absolute: filepath,
              relative: filename,
              birthtime: stat.birthtime,
              mtime: stat.mtime,
              content: await fs.readFile(filepath, 'utf8')
            }
            const page = api.pages.fileToPage(file)
            await api.hooks.manipulatePage.promise({ action: 'create', page })
          }

          await api.hooks.postCreatePages.promise()
          await api.hooks.emitPages.promise()
          await api.hooks.emitRoutes.promise()
        }

        watcher.on('add', (filename: string) => {
          handler('add')(filename)
        })
        watcher.on('unlink', (filename: string) => {
          handler('remove')(filename)
        })
        watcher.on('change', (filename: string) => {
          handler('change')(filename)
        })
      }
    })
  }
}

export default sourcePagesPlugin
