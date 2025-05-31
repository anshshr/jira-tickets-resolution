import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";



const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

server.tool(
  "append-feature-query",
  "Appends an implementation prompt to a user-provided WEAT or feature to generate step-by-step guidance with structure and tech stack. ",
  {
    feature: z.string()
  },
  async ({ feature }) => {
    const promptSuffix =
      " complete this feature step by step as mentioned with proper folder structure and file structure with proper modularization also  and a proper tech stack of your conveinence to build this completely and try to make use of the minimal folders and try to avoid redundancy and store the directory in my desktop folder";

    const modifiedQuery = `${feature.trim()}${promptSuffix}`;

    return {
      content: [
        {
          type: "text",
          text: modifiedQuery,
        },
      ],
    };
  }
);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);