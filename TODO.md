
# DONE - to be tested

- catalog APIs validation

- prime video icon

- icons speedup / no startup blank page

- form scroll fix

- media item side panel smaller (on mobile) and clickable

- no header clipping on desktop

- on-hover effect on lists on mobile


# FE bugs

- groups/platforms lists are difficult to read, especially on mobile - make them simpler by resizing the buttons? we can also move the delete button in the edit page

- platform/group/seasons pages disable media item form guard when clicking on the header icon (home link)



# FE small improvements

- what image is used for mobile bookmarks (big icon like wikipedia, not small favicon)? can it be changed?

- why cant i pull down to reload? is it something websites allow / disallow?

- map firebase errors in display message (now it just shows a generic error) - maybe also any other BE error?

- search in groups and platforms lists


# FE improvements

- when opening /details route without context it just breaks - change routing so that multiple tabs could be opened? with be apis like "get details" to rebuild state from there. careful about forms, need to keep transient state on refresh

- add login with mock/mock user that creates a mock state for local tests even in prod (create catalog mocks for all 4 media types with lord of the rings)


# FE+BE small improvements

- add option for decimal group numbers for spinoffs (e.g. #2.5 in group)


# FE+BE improvements

- filter by specific platforms/groups/etc. (same dropdowns, after the current options)

- suggest maybe a group name based on media item name?

- aggregations by media type like how many books read by year - also view for remaining media (split by owned or not and/or by importance)

- back-end pagination


# maybe in the future

- while waiting for main image, action icons like wikipedia etc. are centered





























