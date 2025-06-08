import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/redis';

// Simulăm o bază de date simplă pentru tranzacții
let tranzactiiSimulate = [
  {
    id: 1,
    data: "2024-03-20",
    tip: "debit",
    descriere: "Plată factura Enel",
    suma: -250,
    categorie: "Utilități"
  },
  {
    id: 2,
    data: "2024-03-19",
    tip: "credit",
    descriere: "Salariu",
    suma: 5000,
    categorie: "Venit"
  },
  {
    id: 3,
    data: "2024-03-18",
    tip: "debit",
    descriere: "Cumpărături Carrefour",
    suma: -320,
    categorie: "Cumpărături"
  },
  {
    id: 4,
    data: "2024-03-17",
    tip: "debit",
    descriere: "Restaurant La Plăcinte",
    suma: -150,
    categorie: "Alimentație"
  },
  {
    id: 5,
    data: "2024-03-16",
    tip: "debit",
    descriere: "Transport public",
    suma: -25,
    categorie: "Transport"
  }
];

// Memory storage for when Redis is not available
let memoryStorage = {
  tranzactii: tranzactiiSimulate
};

export async function GET() {
  try {
    // Încercăm să obținem datele din cache
    const cachedData = await getCache('tranzactii');
    
    if (cachedData) {
      return NextResponse.json({
        success: true,
        sursa: 'cache',
        data: cachedData
      });
    }

    // Încercăm să salvăm în cache
    try {
      await setCache('tranzactii', memoryStorage.tranzactii, 3600);
    } catch (cacheError) {
      console.error('Eroare la salvarea în cache:', cacheError);
    }

    return NextResponse.json({
      success: true,
      sursa: 'memory',
      data: memoryStorage.tranzactii
    });
  } catch (error) {
    console.error('Eroare la obținerea tranzacțiilor:', error);
    // Return data from memory storage as fallback
    return NextResponse.json({
      success: true,
      sursa: 'memory_fallback',
      data: memoryStorage.tranzactii
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validare date
    if (!body.descriere || !body.suma || !body.categorie) {
      return NextResponse.json(
        { success: false, error: 'Date incomplete' },
        { status: 400 }
      );
    }

    // Creăm o nouă tranzacție
    const tranzactieNoua = {
      id: Date.now(),
      data: new Date().toISOString().split('T')[0],
      tip: body.suma > 0 ? 'credit' : 'debit',
      descriere: body.descriere,
      suma: body.suma,
      categorie: body.categorie
    };

    // Adăugăm la storage-ul în memorie
    memoryStorage.tranzactii = [tranzactieNoua, ...memoryStorage.tranzactii];
    tranzactiiSimulate = memoryStorage.tranzactii;

    // Încercăm să actualizăm cache-ul
    try {
      await setCache('tranzactii', memoryStorage.tranzactii, 3600);
    } catch (cacheError) {
      console.error('Eroare la actualizarea cache-ului:', cacheError);
    }

    return NextResponse.json({
      success: true,
      data: tranzactieNoua
    });
  } catch (error) {
    console.error('Eroare la adăugarea tranzacției:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la adăugarea tranzacției' },
      { status: 500 }
    );
  }
}
