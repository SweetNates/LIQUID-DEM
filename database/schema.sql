-- This schema is based on the data model described in the "Liquid Governance" PDF.
-- It establishes the core tables for users, proposals, votes, and delegations.

-- Users Table: Stores user information, roles, and authentication details.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Nullable if using an external OAuth/OpenID provider
    full_name TEXT,
    role TEXT CHECK (role IN ('resident', 'superuser', 'admin')) DEFAULT 'resident',
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Proposals Table: Represents the issues or topics that users can vote on.
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    author_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('draft', 'open', 'closed', 'archived')) DEFAULT 'draft',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    voting_starts TIMESTAMPTZ,
    voting_ends TIMESTAMPTZ
);

-- Proposal Options Table: Defines the specific choices for a given proposal (e.g., 'Yes', 'No').
CREATE TABLE proposal_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    metadata JSONB
);

-- Delegations Table: Tracks how users delegate their voting power to others.
-- A null 'proposal_id' indicates a global delegation.
CREATE TABLE delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    delegatee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE, -- If null, it's a global delegation
    created_at TIMESTAMPTZ DEFAULT now(),
    revoked_at TIMESTAMPTZ,
    CONSTRAINT no_self_delegation CHECK (delegator_id <> delegatee_id)
);

-- Votes Table: Records direct votes cast by users.
-- The 'weight' will be calculated at tally time by including delegated votes.
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
    option_id UUID REFERENCES proposal_options(id) ON DELETE CASCADE NOT NULL,
    voter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    weight NUMERIC DEFAULT 1, -- Base weight is 1, final weight calculated with delegations
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(proposal_id, voter_id) -- Ensures a user can only vote once per proposal
);

-- Comments Table: Stores user comments in a threaded structure.
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threading
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for frequently queried columns for better performance
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_delegations_delegator_id ON delegations(delegator_id);
CREATE INDEX idx_delegations_delegatee_id ON delegations(delegatee_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_comments_proposal_id ON comments(proposal_id);
