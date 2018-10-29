import * as sourcegraph from 'sourcegraph'
import { ClientStorageAPI } from '../../client/api/storage'

/** @internal */
export interface ExtStorageAPI {}

/**
 * Implements the sourcegraph.Storage API.
 *
 *  @internal
 */
export class ExtStorage implements ExtStorageAPI {
    constructor(private proxy: ClientStorageAPI) {}

    public get(type: string, key: string): Promise<any> {
        return this.proxy.$get(type, key)
    }

    public set(type: string, key: string, value: any): Promise<void> {
        return this.proxy.$set(type, key, value)
    }
}
