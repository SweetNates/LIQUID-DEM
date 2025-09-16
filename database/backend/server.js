// This file sets up a basic Node.js server using the Express framework.
// It follows the structure outlined in the PDF, with placeholders for controllers, services, and routes.

const express = require('express');
const cors = require('cors');
// const http = require('http'); // Uncomment to use socket.io
// const { Server } = require("socket.io"); // Uncomment to use socket.io

const app = express();
const port = process.env.PORT || 3001;

// const server = http.createServer(app); // Uncomment to use socket.io
// const io = new Server(server); // Uncomment to use socket.io

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// --- Placeholder for Services (Business Logic) ---
// As per the design doc, these services would contain the core logic.
const authService = { /* ... authentication logic ... */ };
const tallyService = { /* ... vote tallying and delegation weight calculation ... */ };
const delegationService = { /* ... logic for creating/revoking delegations ... */ };

// --- API Routes ---
// These routes match the examples provided in Section 15 of the design document.

// Auth Routes
app.post('/api/auth/register', (req, res) => {
    // TODO: Implement user registration via authService
    res.status(201).json({ message: 'User registered successfully (placeholder)' });
});
app.post('/api/auth/login', (req, res) => {
    // TODO: Implement user login via authService
    res.json({ token: 'fake-jwt-token' });
});

// Proposal Routes
app.get('/api/proposals', (req, res) => {
    // TODO: Fetch all proposals
    res.json([{ id: 'uuid-1', title: 'Sample Cultural Initiative' }]);
});
app.post('/api/proposals', (req, res) => {
    // TODO: Create a new proposal
    res.status(201).json({ message: 'Proposal created (placeholder)' });
});
app.get('/api/proposals/:id', (req, res) => {
    // TODO: Fetch a single proposal by ID
    res.json({ id: req.params.id, title: `Details for ${req.params.id}` });
});

// Voting and Delegation Routes
app.post('/api/proposals/:id/vote', (req, res) => {
    // TODO: Cast a direct vote
    res.status(201).json({ message: `Voted on proposal ${req.params.id} (placeholder)` });
});
app.post('/api/delegations', (req, res) => {
    // TODO: Create a new delegation using delegationService
    res.status(201).json({ message: 'Delegation created (placeholder)' });
});
app.get('/api/proposals/:id/tally', (req, res) => {
    // TODO: Calculate and return the current tally using tallyService
    res.json({ optionA: 150, optionB: 85 });
});
app.get('/api/proposals/:id/graph', (req, res) => {
    // TODO: Generate and return data for the delegation graph visualization
    res.json({
        nodes: [
            { id: 'user-1', label: 'Alice', role: 'resident', weight: 3 },
            { id: 'user-2', label: 'Bob', role: 'resident', weight: 1 },
            { id: 'user-3', label: 'Charlie', role: 'superuser', weight: 5 },
        ],
        edges: [
            { from: 'user-1', to: 'user-3' },
            { from: 'user-2', to: 'user-3' },
        ],
    });
});

// --- Real-time WebSocket Logic (Optional with socket.io) ---
/*
io.on('connection', (socket) => {
  console.log('a user connected');

  // Example: Join a room for a specific proposal
  socket.on('join_proposal_room', (proposalId) => {
    socket.join(`proposal:${proposalId}`);
    console.log(`User joined room for proposal: ${proposalId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// When a delegation is updated, you would emit an event like this:
// io.to(`proposal:${proposalId}`).emit('delegation_update', { delegatorId, delegateeId });
*/


// --- Server Startup ---
app.listen(port, () => {
    console.log(`Liquid Governance backend listening at http://localhost:${port}`);
});

// To use with socket.io, comment out app.listen and uncomment this:
// server.listen(port, () => {
//   console.log(`Liquid Governance backend listening at http://localhost:${port}`);
// });
