import { nanoid } from "nanoid"

export const generateUniqueUrl = () => {
    return nanoid(10)
}

export const generateUniqueAlias = () => {
    return nanoid(8)
}