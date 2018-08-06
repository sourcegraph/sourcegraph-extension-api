/** Partial contribution-related client capabilities. */
export interface ContributionClientCapabilities {
    /** The window client capabilities. */
    window?: {
        /** Contribution-related client capabilities. */
        contribution?: {
            /** Whether the client supports dynamic registration of contributions. */
            dynamicRegistration?: boolean
        }
    }
}

/** Partial contribution-related server capabilities. */
export interface ContributionServerCapabilities {
    /** The contributions provided by the server. */
    contributions?: Contributions
}

/**
 * Contributions describes the functionality provided by an extension.
 */
export interface Contributions {
    /** Commands contributed by the extension. */
    commands?: CommandContribution[]

    /** Menu items contributed by the extension. */
    menus?: MenuContributions
}

/**
 * A special command (for use in CommandContribution#command or
 * CommandContribution#alternateCommand) that causes the first argument to be passed to the default
 * URL handler to open a URL, instead of the command being invoked on the extension.
 */
export const OPEN_COMMAND_ID = 'open'

/** A command and alternate command with arguments. */
export interface CommandItem {
    /**
     * Command is an identifier for the command that is assumed to be unique. If another command
     * with the same identifier is defined (by this extension or another extension), the behavior is
     * undefined. To avoid collisions, the identifier conventionally is prefixed with
     * "${EXTENSION_NAME}.".
     *
     * The special command "open" can be used to open a URL (specified as a string in the first
     * element of commandArguments) using the default URL handler on the client, instead of invoking
     * the command on the extension.
     *
     * Client: If the command is "open", the client should treat the first element of
     * commandArguments as a URL to open with the default URL handler (instead of sending a request
     * to the extension to execute this command).
     */
    command: string | typeof OPEN_COMMAND_ID

    /**
     * Optional arguments to pass to the extension when the command is invoked.
     */
    commandArguments?: any[]

    /**
     * An alternate command to invoke when the user triggers this command with a secondary input
     * action (such as Ctrl+Enter/Cmd+Enter or middle click).
     *
     * Clients: Invoke this command instead of the primary command when the user: (1) presses
     * Ctrl+Enter/Cmd+Enter when this item is selected in a list or (2) clicks the middle mouse
     * button on this item when it is displayed on a toolbar.
     */
    alternateCommand?: string | typeof OPEN_COMMAND_ID

    /**
     * Optional arguments to pass to the extension when the alternate command is invoked.
     */
    alternateCommandArguments?: any[]
}

/**
 * CommandContribution is a command provided by the extension that can be invoked.
 */
export interface CommandContribution extends CommandItem {
    /** The title that succinctly describes the action taken by this command. */
    title?: string

    /**
     * The category that describes the group of related commands of which this command is a member.
     *
     * Clients: When displaying this command's title alongside titles of commands from other groups, the client
     * should display each command as "${category}: ${title}" if the prefix is set.
     */
    category?: string

    /**
     * A longer description of the action taken by this command.
     *
     * Extensions: The description should not be unnecessary repetitive with the title.
     *
     * Clients: If the description is shown, the title must be shown nearby.
     */
    description?: string

    /**
     * A URL to an icon for this command (data: URIs are OK).
     *
     * Clients: The client should show this icon before the title, proportionally scaling the dimensions as
     * necessary to avoid unduly enlarging the item beyond the dimensions necessary to render the text. The client
     * should assume the icon is square (or roughly square). The client must not display a border around the icon.
     * The client may choose not to display this icon.
     */
    iconURL?: string

    /**
     * A specification of how to display this command on a toolbar. The client is responsible for displaying
     * contributions and defining which parts of its interface are considered be toolbars. Generally, items on a
     * toolbar are always visible and, compared to items in a dropdown menu or list, are expected to be smaller and
     * to convey information (in addition to performing an action).
     *
     * For example, a "Toggle code coverage" command may prefer to display a summarized status (such as "Coverage:
     * 77%") on a toolbar instead of the full title.
     *
     * Clients: If the label is empty and only an iconURL is set, and the client decides not to display the icon
     * (e.g., because the client is not graphical), then the client may hide the item from the toolbar.
     */
    toolbarItem?: ToolbarItem
}

/** An item displayed on a toolbar. */
export interface ToolbarItem {
    /** The text label for this command when displayed on a toolbar. */
    label?: string

    /**
     * A description associated with this toolbar item.
     *
     * Clients: The description should be shown in a tooltip when the user focuses or hovers this toolbar item.
     */
    description?: string

    /**
     * The group in the toolbar where this command's toolbar item is displayed. This defines the sort order of
     * toolbar items. The group value is an opaque string (it is just compared relative to other toolbar items'
     * group values); there is no specification set of expected or supported values.
     *
     * Clients: On a toolbar, the client should sort toolbar items by (group, command), with toolbar items
     * lacking a group sorting last. The client must not display the group value.
     */
    group?: string

    /**
     * The icon URL for this command when displayed on a toolbar (data: URIs are OK).
     *
     * Clients: The client should this icon before the label (if any), proportionally scaling the dimensions as
     * necessary to avoid unduly enlarging the toolbar item beyond the dimensions necessary to show the label.
     * In space-constrained situations, the client should show only the icon and omit the label. The client
     * must not display a border around the icon. The client may choose not to display this icon.
     */
    iconURL?: string

    /**
     * A description of the information represented by the icon.
     *
     * Clients: The client should not display this text directly. Instead, the client should use the
     * accessibility facilities of the client's platform (such as the <img alt> attribute) to make it available
     * to users needing the textual description.
     */
    iconDescription?: string
}

export enum ContributableMenu {
    /** The global command palette. */
    CommandPalette = 'commandPalette',

    /** The global navigation bar in the application. */
    GlobalNav = 'global/nav',

    /** The title bar for the current document. */
    EditorTitle = 'editor/title',

    /** A directory page (including for the root directory of a repository). */
    DirectoryPage = 'directory/page',

    /** The help menu in the application. */
    Help = 'help',
}

/**
 * MenuContributions describes the menu items contributed by an extension.
 */
export interface MenuContributions extends Partial<Record<ContributableMenu, MenuItemContribution[]>> {}

/**
 * MenuItemContribution is a menu item contributed by an extension.
 */
export interface MenuItemContribution {
    /** The command to execute when selected (== (CommandContribution).command). */
    command: string
}
