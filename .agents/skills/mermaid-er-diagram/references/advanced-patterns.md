# Advanced ER Diagram Patterns

## Table of Contents

1. [Self-Referencing Tables](#self-referencing-tables)
2. [Polymorphic Relationships](#polymorphic-relationships)
3. [Audit Columns Pattern](#audit-columns-pattern)
4. [Soft Delete Pattern](#soft-delete-pattern)
5. [Multi-Tenant Pattern](#multi-tenant-pattern)
6. [Versioning Pattern](#versioning-pattern)
7. [State Machine Pattern](#state-machine-pattern)

---

## Self-Referencing Tables

Hierarchical data (categories, org charts, comments):

```mermaid
erDiagram
    categories {
        int id PK
        varchar name
        int parent_id FK "Self-ref, nullable"
        int depth "Calculated hierarchy level"
        varchar path "Materialized path: 1/2/5"
    }
    categories ||--o{ categories : "parent_of"

    %% Alternative: Closure table for complex queries
    category_closure {
        int ancestor_id PK,FK
        int descendant_id PK,FK
        int depth
    }
    categories ||--o{ category_closure : "ancestor"
    categories ||--o{ category_closure : "descendant"
```

## Polymorphic Relationships

When multiple tables share a relationship type:

```mermaid
erDiagram
    %% Option 1: Shared FK columns (nullable)
    comments {
        bigint id PK
        bigint post_id FK "Nullable"
        bigint product_id FK "Nullable"
        text content
        varchar commentable_type "post/product - for validation"
    }
    posts ||--o{ comments : "has"
    products ||--o{ comments : "has"

    %% Option 2: Separate junction tables (cleaner)
    post_comments {
        bigint id PK
        bigint post_id FK
        text content
    }
    product_comments {
        bigint id PK
        bigint product_id FK
        text content
    }
```

## Audit Columns Pattern

Standard audit fields for all entities:

```mermaid
erDiagram
    %% Include these in every table
    any_table {
        bigint id PK
        timestamp created_at "NOT NULL DEFAULT NOW()"
        bigint created_by FK "User who created"
        timestamp updated_at "ON UPDATE CURRENT_TIMESTAMP"
        bigint updated_by FK "User who last modified"
    }
    users ||--o{ any_table : "created_by"
    users ||--o{ any_table : "updated_by"
```

## Soft Delete Pattern

```mermaid
erDiagram
    %% Option 1: Boolean flag
    users_v1 {
        bigint id PK
        varchar email
        boolean is_deleted "Default false"
        timestamp deleted_at "Nullable"
    }

    %% Option 2: Status enum (more flexible)
    users_v2 {
        bigint id PK
        varchar email
        varchar status "active/suspended/deleted"
        timestamp status_changed_at
    }
```

## Multi-Tenant Pattern

```mermaid
erDiagram
    %% Every table includes tenant_id
    tenants {
        uuid id PK
        varchar name
        varchar subdomain UK
    }

    users {
        bigint id PK
        uuid tenant_id FK "idx: tenant_users"
        varchar email "UK per tenant"
    }

    projects {
        bigint id PK
        uuid tenant_id FK "idx: tenant_projects"
        varchar name
    }

    tenants ||--o{ users : "owns"
    tenants ||--o{ projects : "owns"
```

## Versioning Pattern

Track changes over time:

```mermaid
erDiagram
    %% Current state table
    products {
        bigint id PK
        varchar name
        decimal price
        int current_version
        timestamp updated_at
    }

    %% History table
    product_versions {
        bigint id PK
        bigint product_id FK
        int version_number "idx: product_version"
        varchar name
        decimal price
        bigint changed_by FK
        timestamp changed_at
        varchar change_type "create/update/delete"
    }

    products ||--o{ product_versions : "history"
    users ||--o{ product_versions : "changed_by"
```

## State Machine Pattern

Order lifecycle with valid transitions:

```mermaid
erDiagram
    orders {
        bigint id PK
        varchar current_status "FK to order_statuses"
        timestamp status_updated_at
    }

    order_statuses {
        varchar code PK "draft/pending/paid/shipped/delivered/cancelled"
        varchar display_name
        boolean is_terminal "Cannot transition from"
        int sort_order
    }

    order_status_transitions {
        varchar from_status PK,FK
        varchar to_status PK,FK
        varchar required_role "Who can perform"
    }

    order_status_history {
        bigint id PK
        bigint order_id FK
        varchar from_status FK
        varchar to_status FK
        bigint changed_by FK
        timestamp changed_at
        text notes
    }

    order_statuses ||--o{ order_status_transitions : "from"
    order_statuses ||--o{ order_status_transitions : "to"
    orders ||--o{ order_status_history : "transitions"
```

## Index Notation Conventions

Document indexes in comments:

| Prefix   | Meaning         | Example                      |
| -------- | --------------- | ---------------------------- |
| `idx:`   | B-tree index    | `"idx: users_email"`         |
| `uidx:`  | Unique index    | `"uidx: users_tenant_email"` |
| `gist:`  | GiST index      | `"gist: locations_coords"`   |
| `gin:`   | GIN index       | `"gin: posts_tags"`          |
| `btree:` | Explicit B-tree | `"btree: orders_created_at"` |

Example:

```mermaid
erDiagram
    products {
        bigint id PK
        int category_id FK "idx: products_category"
        varchar name "idx: products_name"
        tsvector search_vector "gin: products_search"
        jsonb metadata "gin: products_metadata"
    }
```

## Composite Index Notation

```mermaid
erDiagram
    order_items {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
    }
    %% Note: Composite index on (order_id, product_id)
    %% idx: order_items_order_product
```
