"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ArrowRight, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Importação lazy do framer-motion para reduzir o JavaScript inicial
const motion = lazy(() => import('framer-motion').then(mod => ({
  default: mod.motion,
  AnimatePresence: mod.AnimatePresence
})))

// Componente de fallback para carregamento lazy
const MotionFallback = ({ children }) => {
  return <div className="opacity-0">{children}</div>
}

// Função otimizada para enviar eventos ao Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  // Usar requestIdleCallback para não bloquear a thread principal
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      try {
        if (window.gtag) {
          window.gtag('event', nombre_evento, propriedades);
        } else {
          window._gtagEvents = window._gtagEvents || [];
          window._gtagEvents.push({event: nombre_evento, props: propriedades});
        }
      } catch (error) {
        console.error('Erro ao enviar evento:', error);
      }
    });
  } else {
    // Fallback para navegadores que não suportam requestIdleCallback
    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', nombre_evento, propriedades);
        }
      } catch (error) {
        console.error('Erro ao enviar evento:', error);
      }
    }, 1);
  }
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [urgencyCount, setUrgencyCount] = useState(127)
  const [isMotionLoaded, setIsMotionLoaded] = useState(false)
  
  // Efeito para carregar framer-motion apenas após renderização inicial
  useEffect(() => {
    // Usar setTimeout para adiar o carregamento de componentes não críticos
    const timer = setTimeout(() => {
      setIsMotionLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Efeito para gerenciar carregamento e eventos - otimizado para performance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar conexão de rede
      setIsOnline(navigator.onLine)
      
      // Usar AbortController para limpar event listeners
      const controller = new AbortController();
      const signal = controller.signal;
      
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      
      window.addEventListener('online', handleOnline, { signal })
      window.addEventListener('offline', handleOffline, { signal })
      
      // Gerenciar carregamento da página de forma otimizada
      const handleLoad = () => {
        setIsLoading(false)
        setIsLoaded(true)
        
        // Adiar métricas de performance para não bloquear a thread principal
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
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
          });
        }
      }
      
      // Configurar handlers de carregamento
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad, { signal })
      }
      
      // Fallback se o evento onload não disparar
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsLoaded(true)
      }, 2000) // Reduzido de 3000ms para 2000ms
      
      // Contador de urgência com intervalo otimizado
      // Usar um intervalo maior para reduzir o impacto na performance
      const interval = setInterval(() => {
        setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3))
      }, 60000) // Aumentado de 45000ms para 60000ms
      
      // Registrar visualização da página inicial - adiado para não bloquear renderização
      setTimeout(() => {
        enviarEvento('visualizou_pagina_inicial', {
          device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
        })
      }, 1000);
      
      // Cleanup
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
        controller.abort(); // Limpar todos os event listeners de uma vez
      }
    }
  }, [])
  
  // Função para preservar UTMs e iniciar o quiz - otimizada
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
        
        // Preservar UTMs no redirecionamento - otimizado
        const currentUrl = new URL(window.location.href)
        const utmParams = new URLSearchParams()
        
        // Coletar todos os parâmetros UTM da URL atual
        currentUrl.searchParams.forEach((value, key) => {
          if (key.startsWith('utm_')) {
            utmParams.append(key, value)
          }
        })
        
        // Se não houver UTMs na URL, verificar se estão armazenados no localStorage
        if (utmParams.toString() === '' && localStorage.getItem('utmParams')) {
          try {
            const storedUtms = JSON.parse(localStorage.getItem('utmParams'))
            Object.entries(storedUtms).forEach(([key, value]) => {
              if (key.startsWith('utm_')) {
                utmParams.append(key, value)
              }
            })
          } catch (e) {
            console.error('Erro ao processar UTMs armazenados:', e)
          }
        }
        
        // Armazenar UTMs no localStorage para uso em páginas futuras
        if (utmParams.toString() !== '') {
          const utmObject = {}
          utmParams.forEach((value, key) => {
            utmObject[key] = value
          })
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

  // Renderização condicional para evitar problemas de hidratação
  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center">
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="w-28 h-28 mx-auto mb-6">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10">
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.webp"
                      alt="Logo Plano A - Reconquista"
                      className="w-full h-full object-cover"
                      width="112"
                      height="112"
                    />
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">PLAN A</h1>
                <h2 className="text-3xl md:text-4xl font-semibold text-orange-400 mb-8">RECUPERACIÓN RÁPIDA</h2>
              </div>
              {/* Versão estática do conteúdo para SSR */}
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
      
      {isMotionLoaded ? (
        <Suspense fallback={<MotionFallback>
          <div className="max-w-3xl w-full text-center">
            {/* Conteúdo de fallback */}
          </div>
        </MotionFallback>}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }} // Reduzido de 0.6 para 0.4
            className="max-w-3xl w-full text-center"
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
              <CardContent className="p-8">
                <motion.div
                  initial={{ y: -10 }} // Reduzido de -20 para -10
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }} // Reduzido de 0.5 para 0.3
                  className="mb-8"
                >
                  {/* Imagem otimizada com efeitos reduzidos */}
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1], // Reduzido de 1.03 para 1.02
                    }}
                    transition={{
                      duration: 1.2, // Reduzido de 1.5 para 1.2
                      repeat: 2, // Reduzido de 3 para 2
                      repeatType: "reverse",
                    }}
                    className="relative w-28 h-28 mx-auto mb-6"
                  >
                    {/* Efeitos de luz simplificados */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 to-red-600/10 blur-lg"></div>
                    
                    {/* Imagem arredondada otimizada */}
                    <motion.div
                      animate={{
                        y: [0, -2, 0], // Reduzido de -3 para -2
                        rotate: [0, 0.5, -0.5, 0], // Reduzido de 1 para 0.5
                      }}
                      transition={{
                        duration: 2, // Reduzido de 3 para 2
                        repeat: 1, // Reduzido de 2 para 1
                        ease: "easeInOut",
                      }}
                      className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10"
                    >
                      <img
                        src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.webp" // Convertido para WebP
                        alt="Logo Plano A - Reconquista"
                        className="w-full h-full object-cover"
                        loading="eager" // Carregamento prioritário para LCP
                        fetchpriority="high"
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
                  transition={{ delay: 0.2, duration: 0.3 }} // Reduzido de 0.5 para 0.3
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
                  initial={{ y: 10, opacity: 0 }} // Reduzido de 20 para 10
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }} // Reduzido de 0.6/0.5 para 0.3
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1], // Reduzido de 1.03 para 1.02
                    }}
                    transition={{
                      duration: 1.5, // Reduzido de 2 para 1.5
                      repeat: 1, // Reduzido de 2 para 1
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
        </Suspense>
      ) : (
        // Versão estática enquanto framer-motion não carrega
        <div className="max-w-3xl w-full text-center animate-fade-in">
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 to-red-600/10 blur-lg"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10">
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.webp"
                      alt="Logo Plano A - Reconquista"
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchpriority="high"
                      width="112"
                      height="112"
                    />
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">PLAN A</h1>
                <h2 className="text-3xl md:text-4xl font-semibold text-orange-400 mb-8">RECUPERACIÓN RÁPIDA</h2>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-6 leading-tight">
                  ÉL/ELLA ESTÁ A PUNTO DE SEGUIR ADELANTE...
                  <br />
                  <span className="text-white">¿VAS A DEJAR QUE ESO SUCEDA?</span>
                </h3>

                {/* Conteúdo estático enquanto framer-motion carrega */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !isOnline}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  HACER PRUEBA GRATIS
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Adicionar preload para recursos críticos */}
      <link 
        rel="preload" 
        href="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.webp" 
        as="image"
      />
    </div>
  )
}
