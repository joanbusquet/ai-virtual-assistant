import * as Constants from './constants.js';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains'; // Para obtener el historico de la conversacion
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabaseClient } from '../tools/supabase.js';

let chatHistory = '';
/**
 * Función para obtener los embeddings y pasarlos a chatgpt para que genere una respuesta para el usuario
 */
const query = async (req, res, next) => {
  const { question, history } = req.body;

  const chat = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    apiKey: Constants.CHATGPT_API_KEY,
  });

  const openAIEmbeddings = new OpenAIEmbeddings();

  const vectorStore = await SupabaseVectorStore.fromExistingIndex(openAIEmbeddings, {
    client: supabaseClient,
    tableName: 'documents',
    queryName: 'match_documents',
  });

  const QA_PROMPT = `You are a Mango.com Virtual Assistant, your name is Iris. You are an AI assistant providing helpful answers based on the context to provide conversational answer without any prior knowledge.
If you can't find the answer in the context below, just say "No tengo respuesta para tu pregunta, pregunta otro tema". You can also ask the customer to rephrase the question if you need more context. But don't try to make up an answer.
If the question is not related to the context passed to you, you can't answer anything.
You should write the answers with the Mediterranean style.
The max length of the answers must be maximum 30 words.
Say a positive message with love emojis only when the question is a positive message of mango brand.
Always answer in Spanish.
=========
{context}
=========
Question: {question}
Answer:`;

  const chain = ConversationalRetrievalQAChain.fromLLM(chat, vectorStore.asRetriever(), {
    qaTemplate: QA_PROMPT,
    returnSourceDocuments: true,
  });

  const response = await chain.call({ question, chat_history: chatHistory });
  // Guardar histórico para el contexto
  chatHistory = question + response.text;
  console.log(chatHistory);

  res.status(200).json({ response: response.text });
};

export { query };
