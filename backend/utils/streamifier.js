import { Readable } from 'stream'

export default async function bufferToStream(buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
}