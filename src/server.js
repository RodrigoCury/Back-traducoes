import cors from 'cors'
import express from 'express'
import { getData, saveNewData, syncFilesWithData, updateData } from 'jsonParser/parser'
import { getTranslationFolderSingleton, setTranslationFolderSingleton } from 'singleton/translationFolderSingleton'

const app = express()
const port = 4200

app.use(express.json())
app.use(cors({ origin: '*' }))


app.get('/file', (req, res) => {
  res.send(getData())
})

app.post('/file', (req, res) => {
  syncFilesWithData()
  res.send()
})

app.post('/key', (req, res) => {
  try {
    const updatedData = saveNewData(req.body)
    res.send(updatedData)
  } catch (error) {
    res.status(400)
    res.send(error.message)
  }
})

app.put('/key', (req, res) => {
  try {
    const updatedData = updateData(req.body)
    res.send(updatedData)
  } catch (error) {
    console.error(error)
    res.status(400)
    res.send(error.message)
  }
})

app.get('/path', (req, res) => {
  try {
    const path = getTranslationFolderSingleton()
    res.send(path)
  } catch (error) {
    res.status(400)
    res.send(error.message)
  }
})

app.post('/path', (req, res) => {
  try {
    const path = setTranslationFolderSingleton(req.body.path)
    res.send(path)
  } catch (error) {
    res.status(400)
    res.send(error.message)
  }
})

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
})

app.listen(port, () => console.info(`Running - Tranlator Helper ( port: ${port} )`))