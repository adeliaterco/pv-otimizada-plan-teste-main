"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// Função robusta para enviar eventos ao Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  try {
    if (typeof window !== 'undefined') {
      // Verificar se GA está carregado
      if (window.gtag) {
        window.gtag('event', nombre_evento, propriedades);
        console.log('Evento enviado:', nombre_evento, propriedades);
      } else {
        // Fila de eventos para enviar quando GA estiver disponível
        window._gtagEvents = window._gtagEvents || [];
        window._gtagEvents.push({event: nombre_evento, props: propriedades});
        console.log('Evento enfileirado:', nombre_evento);
      }
    }
  } catch (error) {
    console.error('Erro ao enviar evento:', error);
  }
}

export default function HomePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [urgencyCount, setUrgencyCount] = useState(127)
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  
  // Detectar dispositivos de baixo desempenho
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar se o dispositivo tem recursos limitados
      const checkLowEndDevice = () => {
        return (
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
          (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
          window.innerWidth < 768
        )
      }
      
      setIsLowEndDevice(checkLowEndDevice())
    }
  }, [])
  
  // Efeito para gerenciar carregamento e eventos
  useEffect(() => {
    // Verificar conexão de rede
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      // Mostrar feedback de carregamento progressivo
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 5, 90))
      }, 300)
      
      // Gerenciar carregamento da página
      const handleLoad = () => {
        clearInterval(progressInterval)
        setLoadingProgress(100)
        
        // Pequeno atraso para mostrar 100% antes de remover o loader
        setTimeout(() => {
          setIsLoading(false)
          setIsLoaded(true)
        }, 200)
        
        // Registrar métricas de performance
        if ('performance' in window && 'getEntriesByType' in window.performance) {
          const perfData = window.performance.getEntriesByType('navigation')[0]
          if (perfData) {
            enviarEvento('metricas_performance', {
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              loadTime: perfData.loadEventEnd - perfData.fetchStart,
              deviceType: window.innerWidth <= 768 ? 'mobile' : 'desktop'
            })
          }
        }
      }
      
      // Configurar handlers de carregamento
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
      }
      
      // Fallback se o evento onload não disparar (mais curto - 2s)
      const timeout = setTimeout(() => {
        clearInterval(progressInterval)
        setLoadingProgress(100)
        setIsLoading(false)
        setIsLoaded(true)
      }, 2000)
      
      // Contador de urgência com intervalo otimizado
      const interval = setInterval(() => {
        setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3))
      }, 45000)
      
      // Registrar visualização da página inicial
      enviarEvento('visualizou_pagina_inicial', {
        device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
      })
      
      // Verificar se há eventos enfileirados para enviar
      if (window.gtag && window._gtagEvents?.length) {
        window._gtagEvents.forEach(item => {
          window.gtag('event', item.event, item.props)
        })
        window._gtagEvents = []
      }
      
      // Monitorar erros de carregamento
      const handleError = (error) => {
        enviarEvento('erro_pagina_inicial', {
          error_message: error.message,
          error_stack: error.stack
        })
        
        // Mostrar mensagem de erro amigável
        setErrorMessage("Ocorreu um erro ao carregar a página. Por favor, tente novamente.")
      }
      window.addEventListener('error', handleError)
      
      // Cleanup
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
        clearInterval(progressInterval)
        window.removeEventListener('load', handleLoad)
        window.removeEventListener('error', handleError)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])
  
  // Função simplificada para iniciar o quiz
  const handleStart = () => {
    // Evitar múltiplos cliques
    if (isLoading) return
    
    // Mostrar feedback visual imediato
    setIsLoading(true)
    setLoadingMessage("Preparando seu teste personalizado...")
    setLoadingProgress(15)
    
    // Registra evento de início do quiz
    enviarEvento('iniciou_quiz', {
      device_type: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
    })
    
    try {
      if (typeof window !== 'undefined') {
        // Incrementar progresso para feedback visual
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 150)
        
        // Preservar UTMs de forma simplificada
        let targetUrl = '/quiz/1'
        
        // Verificar se há UTMs na URL atual
        const currentUrl = new URL(window.location.href)
        const utmParams = new URLSearchParams()
        
        for (const [key, value] of currentUrl.searchParams.entries()) {
          if (key.startsWith('utm_')) {
            utmParams.append(key, value)
          }
        }
        
        // Adicionar UTMs à URL de destino se existirem
        if (utmParams.toString()) {
          targetUrl += `?${utmParams.toString()}`
        }
        
        // Usar Next.js Router para navegação mais suave
        setTimeout(() => {
          clearInterval(progressInterval)
          setLoadingProgress(100)
          
          // Navegação com Next.js Router
          router.push(targetUrl)
          
          // Fallback para navegação tradicional após um pequeno atraso
          setTimeout(() => {
            if (document.location.pathname !== '/quiz/1') {
              window.location.href = targetUrl
            }
          }, 1000)
        }, 800)
      }
    } catch (error) {
      console.error('Erro ao processar redirecionamento:', error)
      setLoadingProgress(0)
      setIsLoading(false)
      setErrorMessage("Houve um problema ao iniciar o teste. Tente novamente.")
      
      // Registrar erro
      enviarEvento('erro_iniciar_quiz', {
        error_message: error.message,
        error_stack: error.stack
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
      {/* Indicador de carregamento melhorado */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-white text-lg">{loadingMessage || "Carregando..."}</p>
          <div className="w-64 h-2 bg-gray-700 rounded-full mt-4">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Mensagem de erro quando aplicável */}
      {errorMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto max-w-md bg-red-100 text-red-800 p-4 rounded-lg shadow-lg text-center font-medium z-50">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage("")} 
            className="ml-2 text-red-600 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Alerta de offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 text-red-800 p-3 text-center font-medium z-50">
          Você parece estar offline. Verifique sua conexão para continuar.
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
          <CardContent className="p-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              {/* Imagem otimizada com efeitos reduzidos */}
              <motion.div
                animate={isLowEndDevice ? {} : {
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: isLowEndDevice ? 0 : 2,
                  repeatType: "reverse",
                }}
                className="relative w-28 h-28 mx-auto mb-6"
              >
                {/* Efeitos de luz simplificados */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-lg"></div>
                
                {/* Imagem arredondada otimizada */}
                <motion.div
                  animate={isLowEndDevice ? {} : {
                    y: [0, -2, 0],
                    rotate: [0, 0.5, -0.5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: isLowEndDevice ? 0 : 1,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10"
                >
                  <img
                    src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                    alt="Logo Plano A - Reconquista"
                    className="w-full h-full object-cover"
                    loading="eager" // Carregamento prioritário
                    width="112"
                    height="112"
                  />
                </motion.div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">PLANO A</h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-orange-400 mb-8">RECONQUISTA</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-10"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                Descubra se ainda é possível reconquistar seu ex
                <br />
                <span className="text-orange-400">Em apenas 2 minutos</span>
              </h3>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-lg text-blue-800 font-semibold mb-2">
                  ✓ Teste rápido e personalizado
                </p>
                <p className="text-blue-700">
                  Responda algumas perguntas simples e receba uma análise da sua situação específica.
                </p>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-bold text-green-800 mb-3">
                  ✅ DESCUBRA AGORA SE AINDA HÁ CHANCE DE RECONQUISTA
                </h4>
                <p className="text-green-700 text-lg">
                  Teste rápido de 2 minutos revela se seu caso tem solução e qual estratégia usar
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{urgencyCount}</div>
                  <div className="text-sm text-gray-300">pessoas fizeram hoje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">91%</div>
                  <div className="text-sm text-gray-300">taxa de sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">21</div>
                  <div className="text-sm text-gray-300">dias ou menos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-sm text-gray-300 mb-6">
                Após clicar, você responderá algumas perguntas simples para receber sua análise personalizada.
              </p>
              
              <motion.div
                animate={isLowEndDevice ? {} : {
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: isLowEndDevice ? 0 : 1,
                  repeatType: "reverse",
                }}
              >
                {/* Botão com feedback visual de carregamento */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !isOnline}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transition-all duration-300 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span>INICIANDO SEU TESTE...</span>
                      <div className="ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      INICIAR TESTE GRATUITO
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="flex items-center justify-center gap-2 text-white mb-4">
                <Clock className="w-5 h-5" />
                <p className="text-sm">Leva apenas 2 minutos • Resultado imediato</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-amber-800">
                  <Users className="w-5 h-5" />
                  <p className="text-sm font-bold">
                    🔥 ATENÇÃO: Mais de 200 pessoas fazem este teste por dia. Não perca sua oportunidade!
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mt-4 flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" />
                Suas respostas são confidenciais e protegidas
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
