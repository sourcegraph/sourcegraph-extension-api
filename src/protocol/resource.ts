/** The types of resources. */
enum ResourceType {
    /** A repository (e.g., a Git repository). */
    Respository = 'repository',

    /** A directory. */
    Directory = 'directory',

    /** A file. */
    File = 'file',

    /**
     * An item in a directory tree (including files, symlinks, and other directories).
     */
    TreeEntry = 'tree-entry',
}

/**
 * Identifies a resource (other than a text document, such as a directory or repository) and
 * contains some attributes that enable resource decoration providers to provide appropriate
 * decorations for the resource.
 */
export interface ResourceItem {
    /** The URI of the resource. */
    uri: string

    /**
     * The types of this resource. A resource can be of many types. For example, the root directory
     * of a repository is a repository and a directory in some contexts.
     */
    types: ResourceType[]
}
