import { NextResponse } from 'next/server';

// Base de datos en memoria para el CRUD completo
let usuariosDB = [
    { id: 1, name: "Kevin", email: "Kevin@kevin.com", status: "Cliente" },
    { id: 2, name: "paulina", email: "paulina@paulina.com", status: "Usuario" }
];

export async function GET() {
    return NextResponse.json(usuariosDB);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const nuevoUsuario = {
            id: Date.now(), 
            name: body.name,
            email: body.email || "",
            status: body.status || "Usuario" // O Cliente
        };
        
        usuariosDB.unshift(nuevoUsuario); // unshift para agregarlo al principio
        
        return NextResponse.json(nuevoUsuario, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Fallo al crear usuario" }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || "0");
        const body = await request.json();

        // Encontrar índice
        const index = usuariosDB.findIndex((u) => u.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        }

        // Actualizar datos
        usuariosDB[index] = { ...usuariosDB[index], ...body };
        return NextResponse.json(usuariosDB[index]);
    } catch (error) {
        return NextResponse.json({ error: "Fallo al actualizar" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || "0");

        // Filtrar y eliminar
        usuariosDB = usuariosDB.filter((u) => u.id !== id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Fallo al eliminar" }, { status: 400 });
    }
}