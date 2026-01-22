import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }


    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPG, PNG, WEBP ou GIF' },
        { status: 400 }
      )
    }


    const maxSize = 5 * 1024 * 1024 
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale : 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', dataURI)
    cloudinaryFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erreur Cloudinary:', errorData)
      throw new Error('Erreur lors de l\'upload vers Cloudinary')
    }

    const data = await response.json()
    return NextResponse.json({ url: data.secure_url })
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}

