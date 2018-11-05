import { FileType, URI } from 'sourcegraph'
import { ClientFileSystemAPI } from '../../client/api/fileSystem'

/** @internal */
export class ExtFileSystem {
    constructor(private proxy: ClientFileSystemAPI) {}

    public readDirectory(uri: URI): Promise<[string, FileType][]> {
        return this.proxy.$readDirectory(uri.toString())
    }

    public readFile(uri: URI): Promise<Uint8Array> {
        return this.proxy.$readFile(uri.toString())
    }
}
