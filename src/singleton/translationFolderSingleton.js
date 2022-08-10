import fs from 'fs-extra'

// Dev Only
let path = null

// let path = null

export const getTranslationFolderSingleton = () => {
  if (!path) throw new Error('Caminho não foi definido ainda')
  return path
}

/**
 *
 * @param {string} newPath
 * @returns {string}
 */
export const setTranslationFolderSingleton = (newPath) => {
  newPath = newPath.replace(/\/$/, '')

  if (!fs.pathExistsSync(newPath)) {
    throw new Error(`Caminho ${newPath} não existe`)
  }

  ['pt', 'es', 'en'].forEach((file) => {
    if (!fs.existsSync(`${newPath}/${file}.json`)) {
      throw new Error(`Arquivo de tradução ${file}.json não encontrado`)
    }
  })

  path = newPath.replace(/\/$/, '')

  return path
}
