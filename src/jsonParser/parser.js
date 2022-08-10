import fs from 'fs-extra'
import { getTranslationFolderSingleton } from 'singleton/translationFolderSingleton'

let data = []

export const getData = () => {
  if (!data.length) syncDataWithFiles()
  return data
}

export const saveNewData = (dataToUpdate) => {

  data.push({
    key: dataToUpdate.key,
    pt: dataToUpdate.pt,
    es: dataToUpdate.es,
    en: dataToUpdate.en,
  })

  sortData()
  
  return data
}

export const updateData = (dataToUpdate) => {
  const index = getData().findIndex(({ key }) => key === dataToUpdate.originalKey)

  if (index === -1) {
    throw new Error(`Tradução com chave ${dataToUpdate.originalKey} não encontrada`)
  } 

  data.splice(index, 1)
  data.push({
    key: dataToUpdate.key,
    pt: dataToUpdate.pt,
    es: dataToUpdate.es,
    en: dataToUpdate.en,
  })

  sortData()
  
  return data
}

/**
 * Read Locales files and write to data singleton
 */
const syncDataWithFiles = () => {
  const path = getTranslationFolderSingleton()
  
  const pt = fs.readJsonSync(`${path}/pt.json`)
  const es = fs.readJsonSync(`${path}/es.json`)
  const en = fs.readJsonSync(`${path}/en.json`)
  
  const keys = new Set()
  
  addToSet(keys, pt)
  addToSet(keys, es)
  addToSet(keys, en)
  
  data = Array.from(keys).sort().map((key) => ({
    key,
    pt: pt[key],
    en: en[key],
    es: es[key],
  }))

  return data
}

/**
 * Write Data Singleton to locales files
 */
export const syncFilesWithData = () => {
  const path = getTranslationFolderSingleton()

  const ptToSync = {}
  const esToSync = {}
  const enToSync = {}
  
  data.forEach(({ key, pt, en, es }) => {
    ptToSync[key] = pt
    esToSync[key] = es
    enToSync[key] = en
  })

  fs.writeJSONSync(`${path}/pt.json`, ptToSync, { spaces: 2, })
  fs.writeJSONSync(`${path}/es.json`, esToSync, { spaces: 2, })
  fs.writeJSONSync(`${path}/en.json`, enToSync, { spaces: 2, })
}

/**
 * @private
 * @param {Set} set 
 * @param {object} json 
 */
const addToSet = (set, json) => {
  Object.keys(json).forEach((key) => {
    set.add(key)
  })
}

function sortData() {
  data = data.sort((before, after) => before.key < after.key ? -1 : 1)
}
