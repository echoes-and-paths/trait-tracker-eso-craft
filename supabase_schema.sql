CREATE TABLE trait_progress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    profile_id text NOT NULL,
    section text NOT NULL,
    item text NOT NULL,
    trait text NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE item_notes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    profile_id text NOT NULL,
    section text NOT NULL,
    item text NOT NULL,
    note text,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bank_status (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    profile_id text NOT NULL,
    section text NOT NULL,
    item text NOT NULL,
    in_bank boolean NOT NULL DEFAULT false,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE research_timers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    profile_id text NOT NULL,
    section text NOT NULL,
    item text NOT NULL,
    trait text NOT NULL,
    end_time timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);
