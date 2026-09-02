# §17 — Extension playbooks

*[Index](README.md) · [← §16 Testing](16-testing.md)*

The changes that touch many layers at once, and the properties of the codebase worth knowing before adding to it.

---

## 17.1 Add a field to an existing entity

Touch all of:

1. the internal model ([§7](07-domain-model.md))
2. the API model
3. the Mongoose schema ([§8](08-persistence.md))
4. the mapper ([§11](11-models-and-mapping.md))
5. tests

And, when they apply:

- the external-service mapper, if the field comes from a catalog ([§12](12-catalog-integrations.md))
- route request validation, if the field is new API input ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything))

**The front end has to agree.** A persisted field also needs its internal model, API model, mapper, form data, form view and possibly its list row on the other side — see the front end's [§16.2](../../../front-end/docs/technical/16-extension-playbooks.md).

## 17.2 Add a new media type

The biggest extension path here. At minimum:

1. internal models
2. API models
3. the Mongoose schema
4. an entity controller subclass ([§9.7](09-controllers.md#97-media-specific-entity-controllers))
5. a catalog controller subclass ([§12](12-catalog-integrations.md))
6. API, internal and catalog mappers
7. a route module built from the generic router builders ([§10.5](10-api-surface.md#105-media-item-entity-routes))
8. `mediaItemFactory` resolution ([§9.8](09-controllers.md#98-mediaitemfactory))
9. a config section, if it needs a new external provider ([§4.3](04-configuration.md#43-external-api-config))
10. integration and unit tests

Also update `INTERNAL_MEDIA_TYPES`, the API `MEDIA_TYPES`, and these pages plus `CLAUDE.md` if any convention changed.

**Do not add a `switch` on media type.** If a step here seems to need one, it belongs in `mediaItemFactory` instead — that is the file a sixth media type will be added through, and every duplicate of it is one that gets missed.

The front end needs the matching work: see its [§16.3](../../../front-end/docs/technical/16-extension-playbooks.md).

## 17.3 Add a new route

1. define the API request and response classes
2. validate with `parserValidator` ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything))
3. map to the internal model
4. call the controller
5. map the result back to the API response
6. cover both the unit and integration paths where it makes sense

**Keep the route thin.** If a rule has to be written in the route file, it belongs in a controller ([§1.2](01-architecture.md#12-the-layers)).

## 17.4 Add a cross-category or cross-media workflow

Reach for what exists before inventing anything:

- `mediaItemFactory` ([§9.8](09-controllers.md#98-mediaitemfactory))
- `QueryHelper` ([§8.5](08-persistence.md#85-queryhelper))
- the shared media-item router and controller base classes
- the common media-item mappers

## 17.5 Known implementation characteristics

Not necessarily bugs, but each one changes what a new feature can assume:

- **Most route failures return HTTP `500`**, including validation and some precondition failures ([§6.2](06-validation-and-errors.md#62-what-a-validation-failure-returns)). The mapping is in one place now ([§6.3](06-validation-and-errors.md#63-the-error-model)), but changing it is still an API change the front end has to make too.
- **There is no transaction handling** around multi-step deletes, merges or imports ([§8.6](08-persistence.md#86-no-transactions)).
- **No database uniqueness constraints are enforced by the current controllers** — `QueryHelper.checkUniquenessAndSave` exists but is unused ([§8.5](08-persistence.md#85-queryhelper)).
- **Catalog routes require authentication** even though they are not user-scoped ([§5.4](05-authentication.md#54-catalog-routes)).
- **The app starts listening before the database connection resolves**; a failed database init throws after the port is already bound ([§1.4](01-architecture.md#14-startup)).

---

[← §16 Testing](16-testing.md)
