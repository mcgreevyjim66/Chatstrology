const router = require('express').Router()

console.log("**************************** chatgptRoutes.js enter")

//******Chat GPT Stuff */
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");

require('dotenv').config();
//console.log(process.env.OPENAI_API_KEY);

const chatGPTModel = new OpenAI({ 
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0,
  chatGPTModel: 'gpt-3.5-turbo'
});

//console.log("****************chatgptRoutes.js openai model:", { chatGPTModel });

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  Answer: "Provide a brief answer followed by a brief explanation.",
  Analysis: "Begin with a brief summary of the astrological sign or concept in question.",
  Context: "Provide a brief historical context or origin of the astrological concept in question, followed by its current interpretation.",
  Affirmation: "End your response with a positive affirmation or motivational quote related to the astrological topic.",
});
const formatInstructions = parser.getFormatInstructions();




router.post('/', async (req, res) => {
  console.log("*************************************chatgptRoutes.js /chat_prompt" + req.body.chat_prompt)
  try {

    
    console.log("*********************************** chatgptRoutes.js right before new PromptTemplate:");
    
    const prompt = new PromptTemplate({
     template: "You are an astrology expert. Answer the following question and provide detailed insights in JSON format including Answer, Analysis, Context, and Affirmation. Remember to properly escape any special characters and ensure the structure adheres to JSON standards. Only include key-value pairs for Answer, Analysis, Context, and Affirmation in your response.\n{format_instructions}\n{question}",
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions }
    });

    //const prompt = new PromptTemplate({
    //  template: `You are an astrology expert. Answer the following question and provide detailed insights in JSON format including Answer, Analysis, Context, and Affirmation.
    //
    //  Question: {question}
    //
   // Answer: Provide a concise answer followed by a brief explanation.
    //Analysis: Begin with a summary of the astrological sign or concept in question. Follow with a detailed analysis, and conclude with any relevant advice or insights.
    //Context: Provide a brief historical context or origin of the astrological concept in question, followed by its current interpretation.
    //Affirmation: End your response with a positive affirmation or motivational quote related to the astrological topic.
    //`,
      //inputVariables: ["question"],
      //partialVariables: {}
    //});
    









    console.log("*********************************** chatgptRoutes.js right before prompt.format:");
     const promptInput = await prompt.format({
      question: req.body.chat_prompt
    });
    console.log("*********************************** chatgptRoutes.js right before call the gptmodel:");
    const gptres = await chatGPTModel.call(promptInput);
    //chatGPTModel = null;

    console.log("*********************************** chatgptRoutes.js return from chatgpt:", gptres);
    res.json(gptres)

  } catch (err) {
    res.status(500).json(err);
  }
});

    module.exports = router;
