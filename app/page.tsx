"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Head from "next/head"

// Función optimizada para enviar eventos a Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', nombre_evento, propriedades);
    } else if (typeof window !== 'undefined') {
      // Cola de eventos simplificada
      window._gtagEvents = window._gtagEvents || [];
      window._gtagEvents.push({event: nombre_evento, props: propriedades});
    }
  } catch (error) {
    console.error('Error al enviar evento:', error);
  }
}

export default function HomePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Cambiado a false inicialmente
  const [isOnline, setIsOnline] = useState(true)
  const [urgencyCount, setUrgencyCount] = useState(127)
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  
  // Detectar dispositivos de bajo rendimiento - movido después del primer render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLowEndDevice(
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
        (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
        window.innerWidth < 768
      )
      
      // Verificar conexión de red
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])
  
  // Efecto separado para métricas y carga - ejecutado después del primer render
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Marcar como cargado inmediatamente para mejorar LCP
    setIsLoaded(true)
    
    // Registrar visualización de la página inicial - diferido para no bloquear renderización
    setTimeout(() => {
      enviarEvento('visualizo_pagina_inicial', {
        device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
      })
      
      // Registrar métricas de rendimiento - diferido para no bloquear renderización
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        const perfData = window.performance.getEntriesByType('navigation')[0]
        if (perfData) {
          enviarEvento('metricas_rendimiento', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadTime: perfData.loadEventEnd - perfData.fetchStart,
            deviceType: window.innerWidth <= 768 ? 'mobile' : 'desktop'
          })
        }
      }
    }, 1000)
    
    // Contador de urgencia con intervalo optimizado - diferido para no bloquear renderización
    const interval = setInterval(() => {
      setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 45000)
    
    // Monitorear errores de carga
    const handleError = (error) => {
      console.error('Error en la página:', error)
      // Evitar enviar eventos de analytics durante carga inicial
      setTimeout(() => {
        enviarEvento('error_pagina_inicial', {
          error_message: error.message
        })
      }, 2000)
    }
    window.addEventListener('error', handleError)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('error', handleError)
    }
  }, [])
  
  // Función simplificada para iniciar el quiz
  const handleStart = () => {
    // Evitar múltiples clics
    if (isLoading) return
    
    // Mostrar feedback visual inmediato
    setIsLoading(true)
    setLoadingMessage("Preparando tu test personalizado...")
    setLoadingProgress(15)
    
    // Registra evento de inicio del quiz
    enviarEvento('inicio_quiz', {
      device_type: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
    })
    
    try {
      if (typeof window !== 'undefined') {
        // Incrementar progreso para feedback visual
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
        
        // Verificar si hay UTMs en la URL actual - simplificado
        if (window.location.search) {
          const currentParams = new URLSearchParams(window.location.search)
          const utmParams = new URLSearchParams()
          
          for (const [key, value] of currentParams.entries()) {
            if (key.startsWith('utm_')) {
              utmParams.append(key, value)
            }
          }
          
          // Agregar UTMs a la URL de destino si existen
          if (utmParams.toString()) {
            targetUrl += `?${utmParams.toString()}`
          }
        }
        
        // Usar Next.js Router para navegación más suave
        setTimeout(() => {
          clearInterval(progressInterval)
          setLoadingProgress(100)
          router.push(targetUrl)
        }, 800)
      }
    } catch (error) {
      console.error('Error al procesar redirección:', error)
      setLoadingProgress(0)
      setIsLoading(false)
      setErrorMessage("Hubo un problema al iniciar el test. Inténtalo de nuevo.")
    }
  }

  return (
    <>
      <Head>
        {/* Preload de la imagen principal para mejorar LCP */}
        <link 
          rel="preload" 
          href="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png" 
          as="image"
          fetchpriority="high"
        />
        {/* Preconnect para dominios externos */}
        <link rel="preconnect" href="https://comprarplanseguro.shop" />
        {/* Meta tags para SEO y rendimiento */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Conheça o Truque de 3 etapas que está fazendo mulheres voltarem até depois da traição" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
        {/* Indicador de carga mejorado */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-white text-lg">{loadingMessage || "Cargando..."}</p>
            <div className="w-64 h-2 bg-gray-700 rounded-full mt-4">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Mensaje de error cuando aplique */}
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
            Parece que estás sin conexión. Verifica tu internet para continuar.
          </div>
        )}
        
        {/* Contenido principal - sin animaciones iniciales para mejorar FCP y LCP */}
        <div className="max-w-3xl w-full text-center">
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-8">
              <div className="mb-8">
                {/* Imagen principal - elemento LCP */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  {/* Efectos de luz simplificados */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-lg"></div>
                  
                  {/* Imagen redondeada optimizada - potencial LCP */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10">
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                      alt="Logo Plan A - Reconquista"
                      className="w-full h-full object-cover"
                      fetchpriority="high"
                      width="112"
                      height="112"
                      id="lcp-image"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                  Conheça o <span className="text-red-500">Truco de 3 pasos</span> que está funcionando 
                  <br />
                  <span className="text-red-500">hace que las mujeres regresen incluso después de una traición</span>
                </h3>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                  <p className="text-lg text-blue-800 font-semibold mb-2">
                    ✓ Funciona con cualquier mujer...
                  </p>
                  <p className="text-blue-700">
                    sin mensajes largos, desaparecer ni jugar juegos.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-300 rounded-lg p-6 mb-8">
                  <h4 className="text-xl font-bold text-green-800 mb-3">
                    ✅ ¿Y lo mejor? Es el mismo que usaron grandes celebridades.
                  </h4>
                </div>

                <img 
                  src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/02-IMAGE-INICIAL-NOVA.png" 
                  alt="Imagem Inicial" 
                  className="w-full h-auto rounded-lg mb-8"
                />

              </div>

              <div>
                
                {/* Botón con feedback visual de carga */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !isOnline}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transition-all duration-300 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span>PREPARANDO...</span>
                      <div className="ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      QUIERO DESCUBRIR EL TRUCO
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-gray-400 mt-4 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Tus respuestas son confidenciales y están protegidas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Script para identificar el LCP para el PageSpeed */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Ayuda al PageSpeed a identificar el LCP
          document.addEventListener('DOMContentLoaded', function() {
            // Marcar elementos potenciales de LCP
            const lcpCandidates = ['lcp-image', 'lcp-title'];
            lcpCandidates.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.setAttribute('fetchpriority', 'high');
            });
            
            // Reportar el LCP para el PageSpeed
            new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                console.log('LCP candidate:', entry.element);
              }
            }).observe({type: 'largest-contentful-paint', buffered: true});
          });
        `
      }} />
    </>
  )
}
