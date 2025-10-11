// =============================================
// API: TEST DE CONEXIÓN A BASE DE DATOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { testConnection, executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test básico de conexión
    const connectionTest = await testConnection();
    console.log('Connection test result:', connectionTest);
    
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: 'No se pudo conectar a la base de datos',
        details: 'Verifica las credenciales en .env.local'
      }, { status: 500 });
    }

    // Test de consulta a tabla Usuarios
    try {
      const users = await executeQuery('SELECT COUNT(*) as total FROM Usuarios LIMIT 1');
      console.log('Users query result:', users);
      
      return NextResponse.json({
        success: true,
        message: 'Conexión exitosa a la base de datos',
        data: {
          connectionTest: true,
          usersTableExists: true,
          totalUsers: users[0]?.total || 0
        }
      }, { status: 200 });
      
    } catch (tableError) {
      console.error('Table query error:', tableError);
      
      return NextResponse.json({
        success: false,
        error: 'Conexión establecida pero tabla Usuarios no encontrada',
        details: 'Ejecuta el script SQL para crear las tablas',
        connectionTest: true,
        tableError: tableError instanceof Error ? tableError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error de conexión a la base de datos',
      details: error instanceof Error ? error.message : 'Unknown error',
      env: {
        DB_HOST: process.env.DB_HOST || 'not set',
        DB_PORT: process.env.DB_PORT || 'not set',
        DB_USER: process.env.DB_USER || 'not set',
        DB_NAME: process.env.DB_NAME || 'not set',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'set' : 'not set'
      }
    }, { status: 500 });
  }
}