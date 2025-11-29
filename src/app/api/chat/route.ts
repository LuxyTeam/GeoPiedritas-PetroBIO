import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { rockTypes, environments, characteristics } from '@/data/sedimentaryData';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: 'AIzaSyDbLDfcw-h3RfLFO9JNQXSOaM8GCsrXVH8' });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        console.log('🤖 GeoBot: Recibiendo mensaje...', message);

        // Construct context from our data
        const context = `
      Eres GeoBot, un asistente experto en geología sedimentaria para la aplicación GeoPiedritas.
      
      Usa EXCLUSIVAMENTE la siguiente información para responder, si la respuesta no está aquí, usa tu conocimiento general de geología pero prioriza estos datos:

      ROCAS DISPONIBLES:
      ${JSON.stringify(rockTypes, null, 2)}

      AMBIENTES SEDIMENTARIOS:
      ${JSON.stringify(environments, null, 2)}

      CARACTERÍSTICAS:
      ${JSON.stringify(characteristics, null, 2)}

      Instrucciones:
      1. Responde de manera amigable y educativa.
      2. Usa emojis relacionados con rocas y geología.
      3. Si te preguntan por una roca específica, da sus detalles exactos de la base de datos (origen, composición, descripción).
      4. Mantén las respuestas concisas (máximo 3-4 párrafos cortos) pero informativas.
      5. Formatea palabras clave en **negrita**.
      6. Si te saludan, preséntate como GeoBot.
    `;

        // Construct the conversation history manually for generateContent
        const contents = [
            {
                role: 'user',
                parts: [{ text: context }],
            },
            {
                role: 'model',
                parts: [{ text: 'Entendido. Soy GeoBot y estoy listo para responder preguntas sobre rocas sedimentarias usando la información proporcionada. 🪨✨' }],
            },
            {
                role: 'user',
                parts: [{ text: message }],
            }
        ];

        // Use gemini-2.5-flash as requested
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });

        // Extract the text from the response
        // The structure is result.candidates[0].content.parts[0].text
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response text generated');
        }

        console.log('🤖 GeoBot: Respuesta generada:', text);

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('❌ Error calling Gemini:', error);
        return NextResponse.json({ error: 'Failed to generate response', details: error.message }, { status: 500 });
    }
}
