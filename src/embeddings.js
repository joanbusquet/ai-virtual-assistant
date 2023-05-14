import * as fs from 'fs';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

/**
 * Función para crear los embeddings a partir de los contenidos
 */
const embeddings = async () => {
  // Obtener el fichero txt
  const text = fs.readFileSync('data/devoluciones.txt', 'utf8');

  // Splitear el texto en chunks de largo máximo concreto y crear los documentos spliteados
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 50 });
  const docs = await textSplitter.createDocuments([text]);

  // Crear el store de los vectores en supabase a partir de los documentos creados
  const openAIEmbeddings = new OpenAIEmbeddings();
  await SupabaseVectorStore.fromDocuments(docs, openAIEmbeddings, {
    client: supabaseClient,
    tableName: 'documents',
    queryName: 'match_documents',
  });

  res.status(200).json({ message: 'Embeddings generados correctamente' });
};

export { embeddings };
