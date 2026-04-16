# MediaTrackerWeb Manual Testbook

This is a concise manual QA checklist for the current web app. The goal is feature coverage, not exhaustive test-case prose.

## Suggested Pass Setup
- Run at least one pass on desktop width and one on a narrow/mobile width.
- For any failure scenario, verify the global error toast appears and loading states end cleanly.
- When retrying list failures, check both an empty dataset and a list that already has data.

# AUTHENTICATION
[  ] cold start while logged out
  [  ] auth loading screen is transient
  [  ] user lands on login
  [  ] authenticated app routes are not usable
[  ] signup
  [  ] submit disabled until email and password are filled
  [  ] alternate link returns to login
  [  ] success
  [  ] backend error toast
[  ] logout from settings
  [  ] open confirmation dialog
  [  ] cancel
  [  ] confirm success
[  ] login
  [  ] submit disabled until email and password are filled
  [  ] alternate link opens signup
  [  ] success
  [  ] backend error toast
[  ] cold start while logged in
  [  ] auth loading screen is transient
  [  ] user lands in the authenticated app

# CATEGORIES
[  ] categories list
  [  ] first-load skeletons
  [  ] empty state
  [  ] fetch failure toast, keeping prior data if any
  [  ] non-empty list and counter
  [  ] open a category
[  ] category row actions
  [  ] open context menu
  [  ] close menu without action
  [  ] edit
  [  ] delete confirmation: cancel and confirm
  [  ] delete failure toast
[  ] category details
  [  ] add category with required fields
  [  ] edit existing category with prefilled data
  [  ] media type editable only for a new category
  [  ] color picker
  [  ] save disabled while invalid
  [  ] save loading
  [  ] save success returns to list
  [  ] save failure toast
  [  ] duplicate-name confirmation: cancel and confirm
  [  ] dirty-form leave guard on browser back
  [  ] dirty-form leave guard on in-app navigation

# MEDIA ITEMS LIST
[  ] list
  [  ] first-load skeletons
  [  ] empty state
  [  ] fetch failure toast, keeping prior data if any
  [  ] non-empty list and counter
[  ] search
  [  ] submit by button
  [  ] submit by Enter
  [  ] open search mode from a fresh term
  [  ] run a second search while already in search mode
  [  ] clear the term and submit again to exit search mode
  [  ] no-match result
[  ] filters
  [  ] open filter modal
  [  ] close with Cancel
  [  ] close by clicking outside
  [  ] apply status filter
  [  ] apply importance filter
  [  ] apply group filter
  [  ] apply platform filter
  [  ] change sort order
  [  ] clear filters again with the neutral Any / All / None options
[  ] row rendering
  [  ] status icon / accent variations -> normal, active, completed, redo
  [  ] with and without row 1
  [  ] with and without row 2
  [  ] with and without platform
  [  ] with and without group
[  ] row action menu
  [  ] open and close menu
  [  ] edit
  [  ] delete confirmation: cancel and confirm
  [  ] mark as active when offered
  [  ] mark as complete when offered
  [  ] mark as redo when offered
  [  ] inline-action failure toast
  [  ] view group when offered
[  ] view-group mode
  [  ] enter from row menu
  [  ] banner shows selected group
  [  ] back button exits group view and restores the normal list

# MEDIA ITEM DETAILS
[  ] create a new item from each category type
[  ] open an existing item
[  ] fields
  [  ] name
  [  ] description
  [  ] release date
  [  ] genres comma splitting / trimming
  [  ] importance
  [  ] platform picker
  [  ] group picker
  [  ] order-in-group appears only when a group is selected
  [  ] user comment
  [  ] completion dates: empty hint, add, edit, remove
  [  ] books
    [  ] pages
    [  ] authors comma splitting / trimming
  [  ] movies
    [  ] duration in minutes
    [  ] directors comma splitting / trimming
  [  ] TV shows
    [  ] average episode runtime
    [  ] creators comma splitting / trimming
    [  ] seasons summary line
    [  ] open seasons handler
    [  ] in-production toggle
    [  ] next-episode-air-date hidden while not in production
    [  ] next-episode-air-date visible and editable while in production
  [  ] videogames
    [  ] average length in hours
    [  ] developers comma splitting / trimming
    [  ] publishers comma splitting / trimming
    [  ] platforms comma splitting / trimming
[  ] save flow
  [  ] save disabled while invalid
  [  ] new item success
  [  ] existing item success
  [  ] save failure toast
  [  ] duplicate-name confirmation: cancel and confirm
[  ] catalog search
  [  ] search by button
  [  ] search by Enter
  [  ] results list appears
  [  ] selecting a result loads catalog data into the form
  [  ] typing a new name clears old suggestions
  [  ] catalog search error toast
  [  ] catalog details load error toast
  [  ] empty catalog search results
[  ] image and quick actions area
  [  ] hidden for a brand-new item without catalog data
  [  ] shown for an existing or catalog-backed item
  [  ] fallback image when no cover is available
  [  ] reload catalog confirmation: cancel and confirm
  [  ] Google search action
  [  ] Wikipedia search action
  [  ] movies
    [  ] JustWatch external action
  [  ] TV shows
    [  ] JustWatch external action
  [  ] videogames
    [  ] HowLongToBeat external action
[  ] picker round trips
  [  ] open group picker, select a group, return to the form
  [  ] open group picker, select None, return to the form
  [  ] open platform picker, select a platform, return to the form
  [  ] open platform picker, select None, return to the form
[  ] unsaved changes handling
  [  ] browser back guard: cancel and confirm
  [  ] in-app navigation guard: cancel and confirm
  [  ] unsaved draft survives remount caused by group / platform picker navigation

# TV SHOW SEASONS
[  ] form
  [  ] TV-show catalog reload
    [  ] watched season progress is preserved for matching season numbers
  [  ] seasons flow return
    [  ] handled seasons come back into the details form
    [  ] non-season draft edits survive the round trip
[  ] seasons list
  [  ] empty state
  [  ] non-empty list with counters
  [  ] season-row accent for untouched / in-progress / completed seasons
  [  ] add season
  [  ] edit season
  [  ] complete season inline
  [  ] complete button disabled when already fully watched
  [  ] delete confirmation: cancel and confirm
  [  ] Done button returns to TV-show details
[  ] season details
  [  ] add new season with required number
  [  ] existing season with locked season number
  [  ] episodes count
  [  ] watched episodes count
  [  ] save success
  [  ] duplicate season number error

# GROUPS
[  ] groups list
  [  ] first-load skeletons
  [  ] empty state
  [  ] fetch failure toast, keeping prior data if any
  [  ] non-empty list and counter
  [  ] select a group
  [  ] select None
  [  ] selected label / badge
  [  ] edit from list
  [  ] delete confirmation: cancel and confirm
[  ] group details
  [  ] add group
  [  ] edit existing group with prefilled data
  [  ] save disabled while invalid
  [  ] save loading
  [  ] save success returns to list
  [  ] save failure toast
  [  ] duplicate-name confirmation: cancel and confirm
[  ] group picker use from media-item details
  [  ] choose existing group
  [  ] choose None
  [  ] add / edit / delete a group, then resume selection

# PLATFORMS
[  ] platforms list
  [  ] first-load skeletons
  [  ] empty state
  [  ] fetch failure toast, keeping prior data if any
  [  ] non-empty list and counter
  [  ] select a platform
  [  ] select None
  [  ] selected label / badge
  [  ] icon and color rendering
  [  ] edit from list
  [  ] delete confirmation: cancel and confirm
[  ] platform details
  [  ] add platform
  [  ] edit existing platform with prefilled data
  [  ] change icon
  [  ] change color
  [  ] save disabled while invalid
  [  ] save loading
  [  ] save success returns to list
  [  ] save failure toast
  [  ] duplicate-name confirmation: cancel and confirm
[  ] platform picker use from media-item details
  [  ] choose existing platform
  [  ] choose None
  [  ] add / edit / delete a platform, then resume selection

# SETTINGS
[  ] settings screen
  [  ] current user email is shown in the logout row
  [  ] logout confirmation dialog
  [  ] cancel
  [  ] confirm success
  [  ] confirm failure toast
  [  ] loading indicator during logout

# CREDITS
[  ] credits screen
  [  ] all source cards render
  [  ] each external link opens the expected site

# APP SHELL / GLOBAL
[  ] authenticated shell navigation
  [  ] app icon is always present in the header and brings back to the categories list
  [  ] settings icon is only present in the categories list page
[  ] global error handling
  [  ] toast appears for auth / CRUD / catalog failures
  [  ] toast auto-dismisses
[  ] session persistence
  [  ] hard refresh while authenticated keeps the selected app context
  [  ] persisted dates still render correctly after refresh
  [  ] unauthenticated state clears persisted session data
[  ] responsive behavior
  [  ] desktop and narrow/mobile layouts remain usable
  [  ] action menus and dialogs remain usable on narrow screens


