import { NextResponse } from 'next/server';
import { generateEmbedding } from '../../../servicio/iaService';
import { MOCK_EMBEDDINGS } from '../../../data/mockDatabase';
import { cosineSimilarity } from '../../../lib/utils';

// File system para crear, leer modificar o eliminar archivos. (IA pero entendiendo)
import fs from 'fs';
// Path sirve para manejar las rutas de los archivos. (IA pero entendiendo)
import path from 'path';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

        // Convierte la palabra en un vector
        const queryVector = await generateEmbedding(query);
        console.log(queryVector);

        // convierte el vector, colocando tabulador entre cada número y saltos de linea (IA, pero entendiendo)
        const vectorString = queryVector.join('\t') + '\n';
        // crea una ruta para almacenar los vectores creando un archivo.tsv, pega al final el vector (IA, pero entendiendo)
        const tsvPath = path.join(process.cwd(), 'vectors.tsv');
        fs.appendFileSync(tsvPath, vectorString);

        // crea una ruta para almacenar los metadatos creando un archivo.tsv, pega al final la query (IA, pero entendiendo)
        const metaPath = path.join(process.cwd(), 'metadata.tsv');
        fs.appendFileSync(metaPath, `${query}\n`);



        // 2. Procesar similitudes
        const results = MOCK_EMBEDDINGS.map(item => ({
            text: item.text,
            similarity: (cosineSimilarity(queryVector, item.vector) * 100).toFixed(2) + "%"
        })).sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

        return NextResponse.json({ query, results });

    } catch (error) {
        console.error("Embedding Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}