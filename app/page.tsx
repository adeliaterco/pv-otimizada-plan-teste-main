"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [urgencyCount, setUrgencyCount] = useState(127)
  
  // Efeito para gerenciar carregamento e eventos
  useEffect(() => {
    // Verificar conexão de rede
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      // Gerenciar carregamento da página
      const handleLoad = () => {
        setIsLoading(false)
        setIsLoaded(true)
        
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
      
      // Fallback se o evento onload não disparar
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsLoaded(true)
      }, 3000)
      
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
      }
      window.addEventListener('error', handleError)
      
      // Cleanup
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
        window.removeEventListener('load', handleLoad)
        window.removeEventListener('error', handleError)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])
  
  // Função para preservar UTMs e iniciar o quiz
  const handleStart = () => {
    // Desabilitar múltiplos cliques
    if (isLoading) return
    setIsLoading(true)
    
    // Registra evento de início do quiz
    enviarEvento('iniciou_quiz', {
      device_type: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
    })
    
    try {
      if (typeof window !== 'undefined') {
        // Reset quiz data
        localStorage.removeItem("quizData")
        localStorage.removeItem("unlockedBonuses")
        localStorage.removeItem("totalValue")
        
        // Preservar UTMs no redirecionamento - mantendo lógica original para garantir compatibilidade
        const currentUrl = new URL(window.location.href)
        const utmParams = new URLSearchParams()
        
        // Coletar todos os parâmetros UTM da URL atual
        for (const [key, value] of currentUrl.searchParams.entries()) {
          if (key.startsWith('utm_')) {
            utmParams.append(key, value)
          }
        }
        
        // Se não houver UTMs na URL, verificar se estão armazenados no localStorage
        if (utmParams.toString() === '' && localStorage.getItem('utmParams')) {
          try {
            const storedUtms = JSON.parse(localStorage.getItem('utmParams'))
            for (const key in storedUtms) {
              if (key.startsWith('utm_')) {
                utmParams.append(key, storedUtms[key])
              }
            }
          } catch (e) {
            console.error('Erro ao processar UTMs armazenados:', e)
          }
        }
        
        // Armazenar UTMs no localStorage para uso em páginas futuras
        if (utmParams.toString() !== '') {
          const utmObject = {}
          for (const [key, value] of utmParams.entries()) {
            utmObject[key] = value
          }
          localStorage.setItem('utmParams', JSON.stringify(utmObject))
        }
        
        // Construir a URL de destino com os parâmetros UTM
        const targetUrl = `/quiz/1${utmParams.toString() ? '?' + utmParams.toString() : ''}`
        
        // Usar window.location para manter compatibilidade com a implementação original
        window.location.href = targetUrl
      }
    } catch (error) {
      console.error('Erro ao processar redirecionamento:', error)
      setIsLoading(false)
      
      // Em caso de erro, tentar redirecionamento simples
      if (typeof window !== 'undefined') {
        window.location.href = '/quiz/1'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
      {/* Indicador de carregamento */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
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
                animate={{
                  scale: [1, 1.03, 1], // Reduzido de 1.05 para 1.03
                }}
                transition={{
                  duration: 1.5,
                  repeat: 3, // Limitado a 3 repetições em vez de infinito
                  repeatType: "reverse",
                }}
                className="relative w-28 h-28 mx-auto mb-6"
              >
                {/* Efeitos de luz simplificados */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-lg"></div>
                
                {/* Imagem arredondada otimizada */}
                <motion.div
                  animate={{
                    y: [0, -3, 0], // Reduzido de -5 para -3
                    rotate: [0, 1, -1, 0], // Reduzido de 2 para 1
                  }}
                  transition={{
                    duration: 3, // Reduzido de 4 para 3
                    repeat: 2, // Limitado a 2 repetições
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10"
                >
                  <img
                    src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                    alt="Logo Plano A - Reconquista"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="112"
                    height="112"
                  />
                </motion.div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">PLAN A</h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-orange-400 mb-8">RECUPERACIÓN RÁPIDA</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-10"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-6 leading-tight">
                ÉL/ELLA ESTÁ A PUNTO DE SEGUIR ADELANTE...
                <br />
                <span className="text-white">¿VAS A DEJAR QUE ESO SUCEDA?</span>
              </h3>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <p className="text-lg text-red-800 font-semibold mb-2">
                  ⚠️ CADA DÍA QUE PASA, ÉL/ELLA SE ALEJA MÁS DE TI
                </p>
                <p className="text-red-700">
                  Mientras dudas, otras personas están ganando su atención. ¡El tiempo está en tu contra!
                </p>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-bold text-green-800 mb-3">
                  ✅ DESCUBRE AHORA SI AÚN HAY CHANCE DE RECUPERARLO(A)
                </h4>
                <p className="text-green-700 text-lg">
                  Prueba rápida de 2 minutos revela si tu caso tiene solución y qué estrategia usar
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{urgencyCount}</div>
                  <div className="text-sm text-gray-300">personas lo hicieron hoy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">91%</div>
                  <div className="text-sm text-gray-300">tasa de éxito</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">21</div>
                  <div className="text-sm text-gray-300">días o menos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.03, 1], // Reduzido de 1.05 para 1.03
                }}
                transition={{
                  duration: 2,
                  repeat: 2, // Limitado a 2 repetições
                  repeatType: "reverse",
                }}
              >
                {/* Botão com feedback visual de carregamento */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !isOnline}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-pulse">PROCESANDO...</span>
                      <div className="ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      HACER PRUEBA GRATIS
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                <Clock className="w-5 h-5" />
                <p className="text-sm font-semibold text-white">⏰ Solo 2 minutos • Resultado inmediato</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-amber-800">
                  <Users className="w-5 h-5" />
                  <p className="text-sm font-bold">
                    🔥 ATENCIÓN: Más de 200 personas hacen esta prueba por día. ¡No pierdas tu oportunidad!
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
