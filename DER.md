erDiagram
    %% direction LR

    COUNTRY ||--o{ PROVINCE : contiene
    PROVINCE ||--o{ CITY : contiene
    CITY ||--o{ NEIGHBORHOOD : contiene

    CITY ||--o{ USER : residencia
    CITY ||--o{ PROPERTY : ubica
    NEIGHBORHOOD ||--o{ PROPERTY : ubica

    USER ||--o| SEARCH_PREFERENCE : define
    CITY ||--o{ SEARCH_PREFERENCE : preferida
    NEIGHBORHOOD ||--o{ SEARCH_PREFERENCE : preferido

    USER ||--o{ PROPERTY : registra
    PROPERTY ||--o{ PROPERTY_IMAGE : posee
    PROPERTY ||--o{ LISTING : publica
    USER ||--o{ LISTING : publica

    LISTING ||--o{ MODERATION_LOG : registra
    USER ||--o{ MODERATION_LOG : modera

    LISTING ||--o{ CONTACT_REQUEST : recibe
    USER ||--o{ CONTACT_REQUEST : realiza

    LISTING ||--o{ VISIT_REQUEST : recibe
    USER ||--o{ VISIT_REQUEST : solicita

    ROLE ||--o{ MODEL_HAS_ROLE : asigna
    USER ||--o{ MODEL_HAS_ROLE : posee

    PERMISSION ||--o{ MODEL_HAS_PERMISSION : asigna
    USER ||--o{ MODEL_HAS_PERMISSION : posee

    ROLE ||--o{ ROLE_HAS_PERMISSION : agrupa
    PERMISSION ||--o{ ROLE_HAS_PERMISSION : pertenece

    COUNTRY {
        uuid country_id PK
        varchar name
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    PROVINCE {
        uuid province_id PK
        uuid country_id FK
        varchar name
        varchar code
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    CITY {
        uuid city_id PK
        uuid province_id FK
        varchar name
        numeric latitude
        numeric longitude
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    NEIGHBORHOOD {
        uuid neighborhood_id PK
        uuid city_id FK
        varchar name
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    USER {
        uuid user_id PK
        uuid city_id FK
        varchar email
        varchar password_hash
        varchar full_name
        varchar phone
        date birth_date
        varchar occupation
        varchar avatar_url
        text bio
        varchar business_name
        varchar tax_id
        varchar license_number
        varchar verification_document_url
        varchar verification_status
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    ROLE {
        bigint id PK
        varchar name
        varchar guard_name
        timestamptz created_at
        timestamptz updated_at
    }

    PERMISSION {
        bigint id PK
        varchar name
        varchar guard_name
        timestamptz created_at
        timestamptz updated_at
    }

    MODEL_HAS_ROLE {
        bigint role_id FK
        uuid model_id FK
        varchar model_type
    }

    MODEL_HAS_PERMISSION {
        bigint permission_id FK
        uuid model_id FK
        varchar model_type
    }

    ROLE_HAS_PERMISSION {
        bigint permission_id FK
        bigint role_id FK
    }

    SEARCH_PREFERENCE {
        uuid search_preference_id PK
        uuid user_id FK
        varchar operation_type
        varchar property_type
        uuid city_id FK
        uuid neighborhood_id FK
        numeric min_price
        numeric max_price
        varchar currency
        smallint min_rooms
        smallint min_bedrooms
        smallint min_bathrooms
        numeric min_total_m2
        boolean requires_pets_allowed
        boolean requires_children_allowed
        boolean needs_patio
        boolean needs_garage
        date desired_available_from
        boolean has_income_proof
        boolean has_guarantor
        text notes
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    PROPERTY {
        uuid property_id PK
        uuid owner_id FK
        uuid city_id FK
        uuid neighborhood_id FK
        varchar property_type
        varchar title
        text description
        varchar address
        smallint bedrooms
        smallint bathrooms
        smallint rooms
        numeric covered_m2
        numeric total_m2
        numeric latitude
        numeric longitude
        varchar formatted_address
        smallint location_precision
        varchar map_url
        boolean has_patio
        boolean has_garage
        jsonb amenities
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    PROPERTY_IMAGE {
        uuid image_id PK
        uuid property_id FK
        varchar url
        smallint sort_order
        boolean is_cover
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    LISTING {
        uuid listing_id PK
        uuid property_id FK
        uuid publisher_id FK
        varchar operation_type
        numeric price
        varchar currency
        varchar availability_status
        varchar moderation_status
        text requirements
        text conditions
        boolean allows_pets
        boolean allows_children
        date available_from
        boolean allow_messages
        timestamptz created_at
        timestamptz updated_at
        timestamptz published_at
        timestamptz rejected_at
        timestamptz deleted_at
    }

    MODERATION_LOG {
        uuid moderation_id PK
        uuid listing_id FK
        uuid admin_id FK
        varchar action
        text reason
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    CONTACT_REQUEST {
        uuid contact_id PK
        uuid listing_id FK
        uuid requester_id FK
        text message
        varchar status
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    VISIT_REQUEST {
        uuid visit_id PK
        uuid listing_id FK
        uuid requester_id FK
        date preferred_date
        varchar preferred_time_slot
        varchar status
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }