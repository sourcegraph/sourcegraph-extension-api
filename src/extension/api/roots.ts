import { Observable, Subject } from 'rxjs'
import * as sourcegraph from 'sourcegraph'
import { WorkspaceRoot as PlainWorkspaceRoot } from '../../protocol/plainTypes'
import { URI } from '../../shared/uri'

/** @internal */
export interface ExtRootsAPI {
    $acceptRoots(roots: PlainWorkspaceRoot[]): void
}

/** @internal */
export class ExtRoots implements ExtRootsAPI {
    private roots: ReadonlyArray<sourcegraph.WorkspaceRoot> = []

    /**
     * Returns all workspace roots.
     *
     * @internal
     */
    public getAll(): ReadonlyArray<sourcegraph.WorkspaceRoot> {
        return this.roots
    }

    private changes = new Subject<void>()
    public readonly onDidChange: Observable<void> = this.changes

    public $acceptRoots(roots: PlainWorkspaceRoot[]): void {
        this.roots = Object.freeze(
            roots.map(plain => ({ ...plain, uri: URI.parse(plain.uri) } as sourcegraph.WorkspaceRoot))
        )
        this.changes.next()
    }
}
