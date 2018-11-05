import * as sourcegraph from 'sourcegraph'
import { URL as _URL } from 'url'

declare class URL extends _URL {
    constructor(urlStr: string)
}

/**
 * A serialized representation of a {@link URI} produced by {@link URI#toJSON} and that can be deserialized with
 * {@link URI.fromJSON}.
 */
export interface URIComponents {
    scheme: string
    authority: string
    path: string
    query: string
    fragment: string
}

/**
 * A uniform resource identifier (URI), as defined in [RFC 3986](https://tools.ietf.org/html/rfc3986#section-3).
 *
 * This URI class should be used instead of WHATWG URL because it parses all URI schemes in the same way on all
 * platforms. The WHATWG URL spec requires "non-special schemes" (anything other than http, https, and a few other
 * common schemes; see https://url.spec.whatwg.org/#special-scheme) to be parsed differently in a way that is not
 * desirable. For example:
 *
 * With WHATWG URL:
 *
 *   new URL("https://foo/bar").pathname === "/bar"
 *
 *   new URL("git://foo/bar").pathname === "//foo/bar" // UNDESIRABLE
 *
 * With this URI class:
 *
 *   URI.parse("https://foo/bar").pathname === "/bar"
 *
 *   URI.parse("git://foo/bar").pathname === "/bar"
 *
 * Sourcegraph extensions generally intend to treat all URI schemes identically (as in the second example). This
 * class implements that behavior.
 */
export class URI implements sourcegraph.URI, URIComponents {
    public static parse(uri: string): sourcegraph.URI {
        const url = new URL(uri)
        return new URI({
            scheme: url.protocol.slice(0, -1), // omit trailing ':'
            authority: makeAuthority(url),
            path: url.pathname,
            query: url.search.slice(1), // omit leading '?'
            fragment: url.hash.slice(1), // omit leading '#'
        })
    }

    public static isURI(value: any): value is sourcegraph.URI {
        return (
            value instanceof URI ||
            (value &&
                (typeof value.scheme === 'string' &&
                    typeof value.authority === 'string' &&
                    typeof value.path === 'string' &&
                    typeof value.query === 'string' &&
                    typeof value.fragment === 'string'))
        )
    }

    private constructor(components: URIComponents) {
        this.scheme = components.scheme
        this.authority = components.authority
        this.path = components.path
        this.query = components.query
        this.fragment = components.fragment
    }

    public readonly scheme: string

    public readonly authority: string

    public readonly path: string

    public readonly query: string

    public readonly fragment: string

    public with(change: Partial<URIComponents>): URI {
        return new URI({ ...this.toJSON(), ...change })
    }

    public toString(): string {
        let s = ''
        if (this.scheme) {
            s += this.scheme
            s += ':'
        }
        if (this.authority || this.scheme === 'file') {
            s += '//'
        }
        if (this.authority) {
            s += this.authority
        }
        if (this.path) {
            s += this.path
        }
        if (this.query) {
            s += '?'
            s += this.query
        }
        if (this.fragment) {
            s += '#'
            s += this.fragment
        }
        return s
    }

    public toJSON(): URIComponents {
        return {
            scheme: this.scheme,
            authority: this.authority,
            path: this.path,
            query: this.query,
            fragment: this.fragment,
        }
    }

    public static fromJSON(value: URIComponents): sourcegraph.URI {
        return new URI(value)
    }
}

function makeAuthority(url: URL): string {
    let s = ''
    if (url.username) {
        s += url.username
    }
    if (url.password) {
        s += `:${url.password}`
    }
    if (url.username || url.password) {
        s += '@'
    }
    return s + url.host
}
