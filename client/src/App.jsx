import { useState } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'
import { generateDescription, ApiError } from './services/api'
import IntroScreen from './components/IntroScreen'

function App() {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  const runGenerate = async () => {
    setValidationError(null)
    setCopied(false)
    setIsGenerating(true)

    try {
      const result = await generateDescription({ message, file })
      setOutput(result)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR') {
        setValidationError({
          title: err.message,
          hints: [
            'What happened',
            'How you feel',
            'What you achieved',
            'What you want people to understand',
          ],
        })
      } else if (err instanceof ApiError) {
        setValidationError({ title: err.message, hints: [] })
      } else {
        setValidationError({
          title: 'Something unexpected happened. Please try again.',
          hints: [],
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    if (!message.trim()) {
      setValidationError({
        title: 'Please type something you want to share first.',
        hints: [
          'What happened',
          'How you feel',
          'What you achieved',
          'What you want people to understand',
        ],
      })
      return
    }
    runGenerate()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      <Header />
      <main className="flex-1 px-6 pb-10 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-8 max-w-6xl mx-auto">
          <InputPanel
            message={message}
            setMessage={setMessage}
            file={file}
            setFile={setFile}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            validationError={validationError}
          />
          <OutputPanel
            output={output}
            isGenerating={isGenerating}
            onRegenerate={runGenerate}
            copied={copied}
            onCopy={handleCopy}
          />
        </div>
      </main>
    </div>
  )
}

export default App