

export async function generateSalesAnalysis(salesData) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ salesData }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error('Erreur lors de l\'appel API IA:', error)
    throw error
  }
}

