// =============================================
// API: AUTENTICACIÓN DE USUARIOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/database';
import { Usuario, LoginRequest, LoginResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { correo, contraseña } = body;

    // Validar campos requeridos
    if (!correo || !contraseña) {
      return NextResponse.json({
        success: false,
        message: 'Email y contraseña son requeridos'
      } as LoginResponse, { status: 400 });
    }

    // Buscar usuario por correo
    const usuarios = await executeQuery<Usuario>(
      'SELECT * FROM Usuarios WHERE Correo = ? AND Estatus = 1',
      [correo]
    );

    if (usuarios.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Credenciales inválidas'
      } as LoginResponse, { status: 401 });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    let isValidPassword = false;
    
    // Verificar si la contraseña está hasheada (empieza con $2b$)
    if (usuario.Contraseña.startsWith('$2b$')) {
      isValidPassword = await bcrypt.compare(contraseña, usuario.Contraseña);
    } else {
      // Para usuarios con contraseña en texto plano (solo durante desarrollo)
      isValidPassword = contraseña === usuario.Contraseña;
    }

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: 'Credenciales inválidas'
      } as LoginResponse, { status: 401 });
    }

    // Obtener información del nivel de usuario
    const nivelUsuario = await executeQuery(
      'SELECT NivelUsuario FROM nivelusuarios WHERE idNivelUsuario = ?',
      [usuario.NivelUsuario]
    );

    // Generar JWT token
    const token = jwt.sign(
      {
        userId: usuario.idUsuarios,
        email: usuario.Correo,
        nivel: usuario.NivelUsuario,
        nivelNombre: nivelUsuario[0]?.NivelUsuario
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // Preparar respuesta sin contraseña
    const userResponse = {
      idUsuarios: usuario.idUsuarios,
      NombreUsuario: usuario.NombreUsuario,
      NivelUsuario: usuario.NivelUsuario,
      Correo: usuario.Correo,
      Estatus: usuario.Estatus,
      NivelNombre: nivelUsuario[0]?.NivelUsuario
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: 'Login exitoso'
    } as LoginResponse, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    } as LoginResponse, { status: 500 });
  }
}