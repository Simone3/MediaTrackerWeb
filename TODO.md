
- parsing too strict in books search: Cannot parse external API response - An instance of GoogleBooksSearchResponse has failed the validation: property items[9].volumeInfo.title has failed the following constraints: isString, isNotEmpty 
 
- add amazon prime icon

- images and icons are slow sometimes - cache/resize them? - also svg file vs. embedded like spot?

- media item form opens scrolled to the bottom when clicking from a scrolled list

- reduce right media item row icons on mobile so that more list row data is visible

- what image is used for mobile bookmarks (big icon like wikipedia, not small favicon)? can it be changed?

- when opening /details route without context it just breaks - change routing so that multiple tabs could be opened? with be apis like "get details" to rebuild state from there. careful about forms, need to keep transient state on refresh

- letters like “g” are clipped in the media item header on desktop

- weird on hover effect on list items on mobile

- why cant i pull down to reload? is it something websites allow / disallow?

- while waiting for main image, action icons like wikipedia etc. are centered

- platform/group/seasons pages disable media item form guard when clicking on the header icon (home link)

- suggest maybe a group name based on media item name?

- add option for decimal group numbers for spinoffs (e.g. #2.5 in group)

- aggregations by media type like how many books read by year - also view for remaining media (split by owned or not and/or by importance)

- back-end pagination

- map firebase errors in display message (now it just shows a generic error) - maybe also any other BE error?

- groups/platforms lists are difficult to read, especially on mobile - make them simpler by resizing the buttons? we can also move the delete button in the edit page

- search in groups and platforms lists

- add login with mock/mock user that creates a mock state for local tests even in prod (create catalog mocks for all 4 media types with lord of the rings)








