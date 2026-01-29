'use client'

import { useState } from 'react'

interface Shot {
  id: number
  title: string
  description: string
  imageUrl: string
  shotNumber: number
}

export default function Home() {
  const [shots, setShots] = useState<Shot[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImage = async (prompt: string): Promise<string> => {
    // Generate a placeholder image with the prompt text
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // Random gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 600)
      const colors = [
        ['#667eea', '#764ba2'],
        ['#f093fb', '#f5576c'],
        ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'],
        ['#fa709a', '#fee140'],
        ['#30cfd0', '#330867'],
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      gradient.addColorStop(0, randomColor[0])
      gradient.addColorStop(1, randomColor[1])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 800, 600)

      // Add prompt text
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Word wrap
      const words = prompt.split(' ')
      const lines: string[] = []
      let currentLine = ''
      const maxWidth = 700

      words.forEach(word => {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine)
          currentLine = word + ' '
        } else {
          currentLine = testLine
        }
      })
      lines.push(currentLine)

      // Draw lines
      const lineHeight = 35
      const startY = 300 - (lines.length * lineHeight) / 2
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), 400, startY + index * lineHeight)
      })
    }

    return canvas.toDataURL('image/png')
  }

  const addShot = async () => {
    if (!title.trim()) return

    setIsGenerating(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const imageUrl = await generateImage(imagePrompt || title)

    const newShot: Shot = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      shotNumber: shots.length + 1,
    }

    setShots([...shots, newShot])
    setTitle('')
    setDescription('')
    setImagePrompt('')
    setIsGenerating(false)
  }

  const deleteShot = (id: number) => {
    const updatedShots = shots.filter(shot => shot.id !== id).map((shot, index) => ({
      ...shot,
      shotNumber: index + 1,
    }))
    setShots(updatedShots)
  }

  const moveShot = (index: number, direction: 'up' | 'down') => {
    const newShots = [...shots]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= shots.length) return

    [newShots[index], newShots[newIndex]] = [newShots[newIndex], newShots[index]]

    const reorderedShots = newShots.map((shot, idx) => ({
      ...shot,
      shotNumber: idx + 1,
    }))

    setShots(reorderedShots)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Storyboard Creator
        </h1>
        <p className="text-center text-gray-600 mb-8">Create visual storyboard shots for your project</p>

        {/* Add Shot Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Shot</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shot Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Opening scene - Hero walks into sunset"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the shot in detail..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Prompt (Optional)
              </label>
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Custom text for image visualization"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={addShot}
              disabled={!title.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isGenerating ? 'Generating...' : 'Add Shot'}
            </button>
          </div>
        </div>

        {/* Storyboard Grid */}
        {shots.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Storyboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shots.map((shot, index) => (
                <div
                  key={shot.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={shot.imageUrl}
                      alt={shot.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                      Shot {shot.shotNumber}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{shot.title}</h3>
                    {shot.description && (
                      <p className="text-gray-600 text-sm mb-4">{shot.description}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => moveShot(index, 'up')}
                        disabled={index === 0}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded disabled:opacity-30 text-sm font-medium"
                      >
                        ↑ Up
                      </button>
                      <button
                        onClick={() => moveShot(index, 'down')}
                        disabled={index === shots.length - 1}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded disabled:opacity-30 text-sm font-medium"
                      >
                        ↓ Down
                      </button>
                      <button
                        onClick={() => deleteShot(shot.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No shots yet</h3>
            <p className="text-gray-500">Add your first shot to start building your storyboard</p>
          </div>
        )}
      </div>
    </main>
  )
}
