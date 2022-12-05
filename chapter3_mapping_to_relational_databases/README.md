# How to Use

```
$ docker-compose run --rm dev bash
$ deno test --allow-net --allow-read
```

## DB Console

```
$ docker-compose run --rm db bash
$ psql -h db -U postgres
```

## ER Diagram

### Mapping Relationships

```mermaid
erDiagram
    crews ||..o{ special_moves : has
    crews {
        integer id PK
        string name
        bigint bounty
    }
    special_moves {
        integer id PK
        string name
        integer crew_id FK
    }
```

```mermaid
erDiagram
    crews ||..o{ crews_haki_list : has
    crews_haki_list }o..|| haki_list : has
    crews {
        integer id PK
        string name
        bigint bounty
    }
    crews_haki_list {
        integer crew_id FK
        integer haki_id FK
    }
    haki_list {
        integer id PK
        string name
    }
```

### Inheritance

```mermaid
erDiagram
    people ||..o| pirates : has
    people ||..o| marines : has
    people {
        integer id PK
        string name
    }
    pirates {
        integer person_id FK
        string role
    }
    marines {
        integer person_id FK
        string rank
    }
```
