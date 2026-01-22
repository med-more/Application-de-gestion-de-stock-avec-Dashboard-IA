import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error('⚠️ Clé API Gemini non configurée. Ajoutez GEMINI_API_KEY ou NEXT_PUBLIC_GEMINI_API_KEY dans .env.local')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const MODELS_TO_TRY = [
  'gemini-pro',          
  'gemini-1.5-flash',    
  'gemini-1.5-pro'        
]

export async function POST(request) {
  try {


    if (!apiKey || !genAI) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée. Veuillez ajouter GEMINI_API_KEY dans votre fichier .env.local' },
        { status: 500 }
      )
    }

    const { salesData } = await request.json()

    if (!salesData || !Array.isArray(salesData)) {
      return NextResponse.json(
        { error: 'Données de ventes invalides' },
        { status: 400 }
      )
    }



    const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity, 0)
    const totalValue = salesData.reduce((sum, sale) => sum + sale.totalPrice, 0)
    const categories = [...new Set(salesData.map((sale) => sale.category))]
    
    const salesByCategory = categories.reduce((acc, category) => {
      acc[category] = salesData
        .filter((sale) => sale.category === category)
        .reduce((sum, sale) => sum + sale.quantity, 0)
      return acc
    }, {})

    const prompt = `
      Analyse les données de ventes suivantes :
      - Total des produits vendus : ${totalSales}
      - Valeur totale des ventes : ${totalValue.toFixed(2)}€
      - Catégories : ${categories.join(', ')}
      - Ventes par catégorie : ${JSON.stringify(salesByCategory)}
      
      Génère un résumé bref et concis en maximum 5 lignes avec des recommandations clés en français. Sois direct et précis.
    `



    let lastError = null
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`🔄 Tentative avec le modèle: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        console.log(`✅ Succès avec le modèle: ${modelName}`)
        return NextResponse.json({ analysis: text })
      } catch (error) {
        console.warn(`❌ Échec avec ${modelName}:`, error.message)
        lastError = error
        


        if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('401')) {
          return NextResponse.json(
            { error: `Clé API invalide ou expirée: ${error.message}` },
            { status: 401 }
          )
        }
        


        if (error.message?.includes('404') || error.message?.includes('not found')) {
          continue
        }
        

        continue
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      )
      const data = await response.json()
      const availableModels = data.models?.map(m => m.name.replace('models/', '')) || []
      console.log('📋 Modèles disponibles pour votre clé:', availableModels)
      
      if (availableModels.length > 0) {
        for (const modelName of availableModels) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName })
            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = response.text()
            console.log(`✅ Succès avec le modèle disponible: ${modelName}`)
            return NextResponse.json({ analysis: text })
          } catch (error) {
            continue
          }
        }
      }
    } catch (e) {
      console.warn('Impossible de lister les modèles:', e)
    }

    return NextResponse.json(
      { 
        error: `Impossible de générer l'analyse. Aucun modèle Gemini disponible n'a fonctionné. Dernière erreur: ${lastError?.message || 'Erreur inconnue'}. Vérifiez que votre clé API est valide et active dans Google AI Studio.` 
      },
      { status: 500 }
    )
  } catch (error) {
    console.error('Erreur API AI:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération de l\'analyse' },
      { status: 500 }
    )
  }
}
