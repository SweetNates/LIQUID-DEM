import React, { useEffect, useRef, useState } from 'react';

// In a real project, you would install and import this library:
// import { Network } from 'vis-network/standalone';
// For this example, we'll mock its usage.

// Mock of the vis-network library to avoid errors.
const MockNetwork = class {
  constructor(container, data, options) {
    console.log('MockNetwork initialized in:', container);
    console.log('With data:', data);
    console.log('With options:', options);
    // In a real scenario, this would render the interactive graph.
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; border: 2px dashed #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="margin: 0; color: #555;">Delegation Graph Placeholder</h3>
        <p style="color: #777;">Graph visualization would appear here.</p>
        <pre style="text-align: left; background-color: #eee; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  }
  // Add mock methods if needed
  on(event, callback) {
      console.log(`Mock event listener for '${event}' added.`);
  }
};


const DelegationGraph = ({ proposalId }) => {
  // A ref to attach the visualization to
  const visJsRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!proposalId) return;

    const fetchGraphData = async () => {
      setIsLoading(true);
      try {
        // Fetch graph data from the backend API endpoint
        const response = await fetch(`http://localhost:3001/api/proposals/${proposalId}/graph`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGraphData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphData();
  }, [proposalId]);


  useEffect(() => {
    // This effect runs when graphData is successfully fetched and the container ref is available.
    if (graphData && visJsRef.current) {
      const options = {
        nodes: {
          shape: 'dot',
          size: 20,
          font: {
            size: 14,
            color: '#333'
          },
          borderWidth: 2,
        },
        edges: {
          width: 2,
          arrows: 'to',
        },
        physics: {
          enabled: true,
          solver: 'barnesHut',
        },
        interaction: {
          hover: true,
        },
        layout: {
          hierarchical: false,
        },
      };

      // In a real app, 'Network' would be imported from 'vis-network'
      // const network = new Network(visJsRef.current, graphData, options);
      const network = new MockNetwork(visJsRef.current, graphData, options);

      // Example event listener
      network.on('click', (params) => {
        console.log('Clicked nodes:', params.nodes);
      });
    }
  }, [graphData]);

  if (isLoading) {
    return <div>Loading delegation network...</div>;
  }

  if (error) {
    return <div>Error loading graph: {error}</div>;
  }

  // The div that will contain the graph visualization
  return <div ref={visJsRef} style={{ height: '500px', width: '100%', border: '1px solid #ddd', borderRadius: '8px' }} />;
};

export default DelegationGraph;
