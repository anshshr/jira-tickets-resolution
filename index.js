import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";


// Create an MCP server
const server = new McpServer({
    name: "Demo",
    version: "1.0.0"
});

// Add an addition tool
server.tool("add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
    })
);


server.tool(
    "get-weather",
    "fetches the current weather of the given city",
    {
        city: z.string()
    },
    async ({ city }) => {
        try {
            const response = await axios.get(
                `http://api.weatherapi.com/v1/current.json?key=84061f97028b4759b8e125256240105&q=${city}&aqi=no`
            );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2), // formatted nicely
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching weather: ${error.message || error}`,
                    },
                ],
            };
        }
    }
);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);