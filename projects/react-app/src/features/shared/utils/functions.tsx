import { Constants } from './constants'

export function cutIfLongName(name: string, cutIfGreatherThan: number): string {
  if (name.length > cutIfGreatherThan) {
    const shortedName = name.substring(0, name.length - 1).substring(0, cutIfGreatherThan)

    return `${shortedName}${Constants.treeDots}`
  }

  return name
}

export function cutIfLongFileName(fileName: string, cutIfGreatherThan: number): string {
  if (fileName.length > cutIfGreatherThan) {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
    const shortedName = fileName.substring(0, fileName.length - extension.length - 1).substring(0, cutIfGreatherThan)

    return `${shortedName}${Constants.treeDots}${Constants.Dot}${extension}`
  }

  return fileName
}
