const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph")
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai")
const { ToolMessage, AIMessage, HumanMessage, SystemMessage } = require("@langchain/core/messages")
const tools = require("./tools")    


const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.5,
})


const graph = new StateGraph(MessagesAnnotation)
    .addNode("tools", async (state, config) => {

        const lastMessage = state.messages[ state.messages.length - 1 ]

        const toolsCall = lastMessage.tool_calls

        const toolCallResults = await Promise.all(toolsCall.map(async (call) => {

            const tool = tools[ call.name ]
            if (!tool) {
                throw new Error(`Tool ${call.name} not found`)
            }
            const toolInput = call.args

            console.log("Invoking tool:", call.name, "with input:", call)

            const toolResult = await tool.func({ ...toolInput, token: config.metadata.token })

            return new ToolMessage({ content: toolResult, name: call.name })

        }))

        state.messages.push(...toolCallResults)

        return state
    })
    .addNode("chat", async (state, config) => {
        const systemMessage = new SystemMessage({
            content: `You are the ShopMantra AI Buddy, a premium shopping assistant.
Your main job is to help users find and add products to their cart.

RULES FOR ADDING PRODUCTS TO CART:
- When a customer wants to search for, look at, or buy a product, ALWAYS call the 'searchProduct' tool first to find available products.
- Inspect the products returned by 'searchProduct':
  1. If there is ONLY ONE product in that category in the search results, you must DIRECTLY call 'addProductToCart' to add that product to their cart.
  2. If the customer's requested product is different from the available products (or if the exact product is not available), you must select the MOST RELEVANT/closest matching product from the catalog (based on product name and description) and DIRECTLY call 'addProductToCart' to add it to their cart. Do not ask for confirmation; add it immediately.
- After calling the tool, confirm to the user which product you have added to their cart and explain why (e.g., it is the only product in that category or the most relevant alternative).`
        });

        const messages = [systemMessage, ...state.messages];
        const response = await model.invoke(messages, { tools: [ tools.searchProduct, tools.addProductToCart ] })

        state.messages.push(new AIMessage({ content: response.text, tool_calls: response.tool_calls }))

        return state

    })
    .addEdge("__start__", "chat")
    .addConditionalEdges("chat", async (state) => {

        const lastMessage = state.messages[ state.messages.length - 1 ]

        if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
            return "tools"
        } else {
            return "__end__"
        }

    })
    .addEdge("tools", "chat")



const agent = graph.compile()


module.exports = agent







