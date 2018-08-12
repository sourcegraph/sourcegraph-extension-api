import { TextDocumentIdentifier, TextDocumentItem } from 'vscode-languageserver-types'
import { RequestHandler } from '../jsonrpc2/handlers'
import { RequestType } from '../jsonrpc2/messages'
import { TextDocumentRegistrationOptions } from './textDocument'

export interface FilesExtensionClientCapabilities {
    files?: boolean
}

export interface XContentParams {
    textDocument: TextDocumentIdentifier
}

export type XFilesParams = string

export namespace XContentRequest {
    export const type = new RequestType<XContentParams, TextDocumentItem, void, TextDocumentRegistrationOptions>(
        'workspace/xcontent'
    )
    export type HandlerSignature = RequestHandler<XContentParams, TextDocumentItem, void>
}

export namespace XFilesRequest {
    export const type = new RequestType<XFilesParams, TextDocumentIdentifier[], void, TextDocumentRegistrationOptions>(
        'workspace/xfiles'
    )
    export type HandlerSignature = RequestHandler<XFilesParams, TextDocumentIdentifier[], void>
}
