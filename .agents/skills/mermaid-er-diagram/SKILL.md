---
name: mermaid-er-diagram
description: Generate professional, accurate Mermaid ER diagrams with complete database metadata. Use when creating ER diagrams that need to display all database information including primary keys (PK), foreign keys (FK), indexes, composite keys, data types, cardinality (1:1, 1:n, n:n), and comments. Triggers on requests for database diagrams, schema visualization, table relationship diagrams, or any Mermaid erDiagram creation.
---

# Mermaid ER Diagram Skill

Generate precise, readable Mermaid ER diagrams with complete database metadata.

## Syntax Reference

### Basic Structure

```mermaid
erDiagram
    TABLE_NAME {
        type column_name PK "comment"
    }
    TABLE1 ||--o{ TABLE2 : "relationship_label"
```

### Data Types

Use standard SQL-like types for clarity:

- `int`, `bigint`, `serial` - Integer types
- `varchar`, `text`, `char` - String types
- `boolean`, `bool` - Boolean
- `date`, `datetime`, `timestamp` - Temporal
- `decimal`, `float`, `double` - Numeric
- `uuid`, `json`, `jsonb` - Special types

### Key Annotations

| Annotation | Meaning     | Usage                     |
| ---------- | ----------- | ------------------------- |
| `PK`       | Primary Key | Single column primary key |
| `FK`       | Foreign Key | References another table  |
| `UK`       | Unique Key  | Unique constraint         |

### Attribute Format

```
type column_name [PK|FK|UK] ["comment"]
```

Examples:

```mermaid
erDiagram
    users {
        bigint id PK "Auto-increment"
        varchar email UK "Unique email"
        varchar name "Display name"
        timestamp created_at "Creation timestamp"
    }
```

### Cardinality Symbols

| Left   | Right  | Meaning             |
| ------ | ------ | ------------------- |
| `\|o`  | `o\|`  | Zero or one (0..1)  |
| `\|\|` | `\|\|` | Exactly one (1)     |
| `}o`   | `o{`   | Zero or more (0..n) |
| `}\|`  | `\|{`  | One or more (1..n)  |

### Relationship Patterns

**1:1 Relationship (One-to-One)**

```mermaid
erDiagram
    users ||--|| user_profiles : "has"
```

**1:n Relationship (One-to-Many)**

```mermaid
erDiagram
    users ||--o{ orders : "places"
    categories ||--|{ products : "contains"
```

**n:n Relationship (Many-to-Many)**
Use junction/bridge table:

```mermaid
erDiagram
    students }o--o{ courses : "enrolls"
    students ||--o{ enrollments : "has"
    courses ||--o{ enrollments : "has"

    enrollments {
        bigint student_id PK "Composite PK (part 1)"
        bigint course_id PK "Composite PK (part 2)"
        date enrolled_at "Enrollment date"
    }
```

### Line Styles

| Syntax | Meaning                                    |
| ------ | ------------------------------------------ |
| `--`   | Solid line (identifying relationship)      |
| `..`   | Dashed line (non-identifying relationship) |

## Layout Best Practices

### 1. Logical Grouping

Group related entities together:

- **Transaction tables**: Center/left, arranged by workflow order
- **Master tables**: Right side, referenced by transactions
- **Junction tables**: Between the tables they connect

### 2. Relationship Flow

- Parent tables above or left of child tables
- Transaction flow: left-to-right chronologically
- Foreign keys point from child to parent

### 3. Readability Rules

- Minimize crossing lines
- Keep related entities close
- Use meaningful relationship labels
- Add comments for non-obvious columns

## Complete Example

```mermaid
erDiagram
    %% Master Tables
    users {
        bigint id PK "Auto-increment"
        varchar email UK "Login email"
        varchar password_hash "Bcrypt hash"
        varchar display_name
        boolean is_active "Soft delete flag"
        timestamp created_at
        timestamp updated_at
    }

    categories {
        int id PK
        varchar name UK "Category name"
        int parent_id FK "Self-reference for hierarchy"
        int sort_order "Display order"
    }

    products {
        bigint id PK
        int category_id FK
        varchar sku UK "Stock keeping unit"
        varchar name
        text description
        decimal price "Unit price"
        int stock_quantity
        boolean is_published
        timestamp created_at
    }

    %% Transaction Tables
    orders {
        bigint id PK
        bigint user_id FK
        varchar order_number UK "ORD-YYYYMMDD-XXXXX"
        varchar status "pending/confirmed/shipped/delivered"
        decimal subtotal
        decimal tax
        decimal total
        timestamp ordered_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price "Price at purchase time"
        decimal subtotal
    }

    payments {
        bigint id PK
        bigint order_id FK
        varchar payment_method "card/bank/wallet"
        varchar status "pending/completed/failed"
        decimal amount
        timestamp paid_at
    }

    %% Relationships
    categories ||--o{ categories : "parent"
    categories ||--o{ products : "contains"
    users ||--o{ orders : "places"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "purchased_in"
    orders ||--o| payments : "paid_by"
```

## Index & Constraint Notation

For indexes and composite keys, use comments:

```mermaid
erDiagram
    order_items {
        bigint id PK
        bigint order_id FK "idx: order_items_order_id"
        bigint product_id FK "idx: order_items_product_id"
        int quantity
    }

    %% Composite unique constraint example
    user_roles {
        bigint user_id PK "Composite PK (part 1)"
        bigint role_id PK "Composite PK (part 2)"
        timestamp assigned_at "Assigned time"
    }
```

## Output Checklist

Before finalizing, verify:

- [ ] All PKs marked with `PK`
- [ ] All FKs marked with `FK`
- [ ] Composite keys are represented by marking each participating column as `PK`
- [ ] Data types are specified for all columns
- [ ] Cardinality accurately reflects business rules
- [ ] Relationship labels are meaningful
- [ ] Comments explain non-obvious columns
- [ ] Indexes noted in comments where relevant
- [ ] Tables logically grouped (masters vs transactions)
