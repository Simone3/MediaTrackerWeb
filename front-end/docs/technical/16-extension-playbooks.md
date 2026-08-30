# §16 — Extension playbooks

*[Index](README.md) · [← §15 Invariants and pitfalls](15-invariants-and-pitfalls.md)*

The three changes that touch many files at once, in the order that keeps the build green between steps.

---

## 16.1 Add or change a screen

1. `app/utilities/screens.ts`
2. `app/utilities/navigation-routes.ts`
3. the right navigator in `app/components/containers/navigation/*` ([§5.2](05-navigation.md#52-router-composition))
4. `screenRequiredContext`, if the screen cannot render without global context ([§5.6](05-navigation.md#56-screens-that-cannot-be-opened-cold))
5. the container and presentational components
6. the navigation saga, if the screen is action-driven ([§5.4](05-navigation.md#54-saga-driven-navigation))
7. the i18n strings ([§13](13-text-and-languages.md))
8. a smoke test ([§14](14-testing.md))

## 16.2 Add a media-item field

1. the internal subtype model in `app/data/models/internal/media-items/*`
2. the API model in `app/data/models/api/media-items/*`, if it is persisted remotely
3. the mapper in `app/data/mappers/media-items/*`
4. subtype validation and normalization in `.../form/data/*`
5. the subtype form view in `.../form/view/*`
6. the subtype list row, if the field shows in the list
7. tests

If the field is catalog-backed, also check the catalog API model, the catalog mapper, the default catalog item constant, and `onLoadCatalogDetails`.

**The back end has to agree.** A persisted field also needs its internal model, API model, schema and mapper on the other side — see the back end's [§17.1](../../../back-end/docs/technical/17-extension-playbooks.md).

## 16.3 Add a new media type

The largest change in the app. Expect all of:

1. category media-type definitions and labels
2. internal and API models
3. mappers
4. controller interfaces
5. real controllers
6. mock controllers
7. `app/controllers/main/entities/media-items/*`
8. the factory switches ([§9.5](09-data-layer.md#95-media-type-factories))
9. the subtype form container, wrapper, view and data files
10. the subtype list row files
11. i18n keys
12. tests

**Keep the generic media-item components generic.** Media-type-specific logic belongs in a subtype wrapper, a subtype view, a subtype row, a definitions controller, or subtype controller/mapper code — never in the shared media-item base ([§8.5](08-domain-model.md#85-generic-media-item)).

A new media type also needs the whole back-end side, including an external catalog provider: see the back end's [§17.2](../../../back-end/docs/technical/17-extension-playbooks.md).

---

[← §15 Invariants and pitfalls](15-invariants-and-pitfalls.md)
