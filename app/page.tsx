"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Head from "next/head"

// Función optimizada para enviar eventos a Google Analytics - implementación diferida
const enviarEvento = (nombre_evento, propriedades = {}) => {
  // Usar requestIdleCallback para operaciones no críticas
  const runWhenIdle = (callback) => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
      } else {
        setTimeout(callback, 200);
      }
    }
  };

  runWhenIdle(() => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', nombre_evento, propriedades);
      } else if (typeof window !== 'undefined') {
        window._gtagEvents = window._gtagEvents || [];
        window._gtagEvents.push({event: nombre_evento, props: propriedades});
      }
    } catch (error) {
      console.error('Error al enviar evento:', error);
    }
  });
};

export default function HomePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [urgencyCount, setUrgencyCount] = useState(127)
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  
  // Detectar dispositivos de bajo rendimiento - implementación optimizada
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Usar función inmediata para evitar re-renders innecesarios
    const checkDevice = () => {
      const isLowEnd = 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
        (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
        window.innerWidth < 768;
      
      if (isLowEnd !== isLowEndDevice) {
        setIsLowEndDevice(isLowEnd);
      }
      
      // Verificar conexión solo si es necesario
      if (navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
      }
    };
    
    // Ejecutar inmediatamente
    checkDevice();
    
    // Configurar listeners con throttling
    let timeoutId;
    const handleConnectionChange = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsOnline(navigator.onLine);
      }, 300);
    };
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOnline, isLowEndDevice]);
  
  // Efecto para métricas - implementación optimizada con lazy loading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Marcar como cargado inmediatamente para mejorar LCP
    setIsLoaded(true);
    
    // Usar IntersectionObserver para cargar métricas solo cuando sea visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Registrar visualización cuando sea visible
        const runMetrics = () => {
          enviarEvento('visualizo_pagina_inicial', {
            device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
          });
          
          // Registrar métricas solo si están disponibles
          if ('performance' in window && 'getEntriesByType' in window.performance) {
            const perfEntries = window.performance.getEntriesByType('navigation');
            if (perfEntries && perfEntries.length > 0) {
              const perfData = perfEntries[0];
              enviarEvento('metricas_rendimiento', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                deviceType: window.innerWidth <= 768 ? 'mobile' : 'desktop'
              });
            }
          }
        };
        
        // Ejecutar métricas después de que la página esté completamente cargada
        if (document.readyState === 'complete') {
          runMetrics();
        } else {
          window.addEventListener('load', runMetrics, { once: true });
        }
        
        observer.disconnect();
      }
    });
    
    // Observar el elemento principal
    const mainElement = document.querySelector('.min-h-screen');
    if (mainElement) {
      observer.observe(mainElement);
    }
    
    // Contador de urgencia optimizado - usar requestAnimationFrame
    let urgencyIntervalId;
    let lastUpdateTime = 0;
    
    const updateUrgencyCount = (timestamp) => {
      if (timestamp - lastUpdateTime > 45000) { // 45 segundos
        setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3));
        lastUpdateTime = timestamp;
      }
      urgencyIntervalId = requestAnimationFrame(updateUrgencyCount);
    };
    
    urgencyIntervalId = requestAnimationFrame(updateUrgencyCount);
    
    // Monitorear errores críticos solamente
    const handleCriticalError = (error) => {
      if (error && error.message && (
        error.message.includes('network') || 
        error.message.includes('fetch') || 
        error.message.includes('load')
      )) {
        console.error('Error crítico:', error);
        enviarEvento('error_pagina_inicial', {
          error_message: error.message.substring(0, 100) // Limitar longitud
        });
      }
    };
    
    window.addEventListener('error', handleCriticalError);
    
    return () => {
      if (urgencyIntervalId) {
        cancelAnimationFrame(urgencyIntervalId);
      }
      window.removeEventListener('error', handleCriticalError);
      observer.disconnect();
    };
  }, []);
  
  // Función optimizada para iniciar el quiz
  const handleStart = () => {
    // Evitar múltiples clics
    if (isLoading) return;
    
    // Mostrar feedback visual inmediato
    setIsLoading(true);
    setLoadingMessage("Preparando tu test personalizado...");
    setLoadingProgress(15);
    
    // Registrar evento de inicio
    enviarEvento('inicio_quiz', {
      device_type: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
    });
    
    try {
      if (typeof window !== 'undefined') {
        // Usar requestAnimationFrame para animación fluida
        let progress = 15;
        let lastTimestamp = 0;
        
        const updateProgress = (timestamp) => {
          if (!lastTimestamp) lastTimestamp = timestamp;
          const elapsed = timestamp - lastTimestamp;
          
          if (elapsed > 50 && progress < 90) { // Actualizar cada 50ms
            progress += 5;
            setLoadingProgress(progress);
            lastTimestamp = timestamp;
          }
          
          if (progress < 90) {
            requestAnimationFrame(updateProgress);
          }
        };
        
        requestAnimationFrame(updateProgress);
        
        // Preservar UTMs de forma optimizada
        let targetUrl = '/quiz/1';
        
        // Verificar UTMs solo una vez
        if (window.location.search) {
          const utmParams = new URLSearchParams();
          const currentParams = new URLSearchParams(window.location.search);
          
          // Extraer solo parámetros UTM
          for (const [key, value] of currentParams.entries()) {
            if (key.startsWith('utm_')) {
              utmParams.append(key, value);
            }
          }
          
          // Agregar UTMs a la URL de destino si existen
          const utmString = utmParams.toString();
          if (utmString) {
            targetUrl += `?${utmString}`;
          }
        }
        
        // Navegación optimizada
        setTimeout(() => {
          setLoadingProgress(100);
          // Prefetch de la siguiente página
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = targetUrl;
          document.head.appendChild(link);
          
          // Navegar después de prefetch
          setTimeout(() => router.push(targetUrl), 100);
        }, 800);
      }
    } catch (error) {
      console.error('Error al procesar redirección:', error);
      setLoadingProgress(0);
      setIsLoading(false);
      setErrorMessage("Hubo un problema al iniciar el test. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Head>
        {/* Preload crítico y optimizado */}
        <link 
          rel="preload" 
          href="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png" 
          as="image"
          fetchpriority="high"
          type="image/png"
        />
        {/* Preconnect optimizado */}
        <link rel="preconnect" href="https://comprarplanseguro.shop" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://comprarplanseguro.shop" />
        
        {/* Meta tags optimizados */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Conheça o Truque de 3 etapas que está fazendo mulheres voltarem até depois da traição" />
        <meta name="theme-color" content="#000000" />
        
        {/* Optimización de cache */}
        <meta http-equiv="Cache-Control" content="max-age=86400" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
        {/* Indicador de carga optimizado */}
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
        
        {/* Mensaje de error condicional */}
        {errorMessage && (
          <div className="fixed top-4 left-0 right-0 mx-auto max-w-md bg-red-100 text-red-800 p-4 rounded-lg shadow-lg text-center font-medium z-50">
            {errorMessage}
            <button 
              onClick={() => setErrorMessage("")} 
              className="ml-2 text-red-600 font-bold"
              aria-label="Cerrar mensaje de error"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Alerta de offline condicional */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-100 text-red-800 p-3 text-center font-medium z-50">
            Parece que estás sin conexión. Verifica tu internet para continuar.
          </div>
        )}
        
        {/* Contenido principal optimizado */}
        <div className="max-w-3xl w-full text-center">
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-4 sm:p-8">
              <div className="mb-4 sm:mb-8">
                {/* Imagen principal optimizada - LCP */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6">
                  {/* Efectos de luz simplificados */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-lg"></div>
                  
                  {/* Imagen optimizada para LCP */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10">
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                      alt="Logo Plan A"
                      className="w-full h-full object-cover"
                      fetchpriority="high"
                      width="112"
                      height="112"
                      id="lcp-image"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-10">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight" id="lcp-title">
                  Conheça o <span className="text-red-500">Truco de 3 pasos</span> que está funcionando 
                  <br />
                  <span className="text-red-500">hace que las mujeres regresen incluso después de una traición</span>
                </h1>

                <p className="text-base sm:text-lg text-white font-semibold mb-2">
                  ✓ Funciona con cualquier mujer...
                </p>
                <p className="text-white mb-4 sm:mb-6">
                  sin mensajes largos, desaparecer ni jugar juegos.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-green-500 mb-4 sm:mb-6">
                  ✅ ¿Y lo mejor? Es el mismo que usaron grandes celebridades.
                </h2>

                {/* Imagen optimizada con dimensiones explícitas */}
                <img 
                  src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/02-IMAGE-INICIAL-NOVA.png" 
                  alt="Imagen de ejemplo" 
                  className="w-full h-auto rounded-lg mb-6 sm:mb-8"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div>
                {/* Botón optimizado */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !isOnline}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 sm:py-5 px-4 sm:px-6 md:px-8 rounded-full text-base sm:text-lg md:text-xl shadow-lg transition-all duration-300 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Iniciar test"
                >
                  {isLoading ? (
                    <>
                      <span>PREPARANDO...</span>
                      <div className="ml-2 w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      QUIERO DESCUBRIR EL TRUCO
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-gray-400 mt-4 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" aria-hidden="true" />
                  Tus respuestas son confidenciales y están protegidas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Script optimizado para LCP */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Optimización de LCP
          document.addEventListener('DOMContentLoaded', function() {
            // Marcar elementos críticos
            const lcpElements = document.querySelectorAll('#lcp-image, #lcp-title');
            lcpElements.forEach(el => {
              if (el) el.setAttribute('fetchpriority', 'high');
            });
            
            // Monitorear LCP para optimización
            if ('PerformanceObserver' in window) {
              try {
                new PerformanceObserver((entryList) => {
                  const entries = entryList.getEntries();
                  if (entries.length > 0) {
                    const lcpEntry = entries[entries.length - 1];
                    const lcpTime = Math.round(lcpEntry.startTime);
                    
                    // Reportar LCP solo si es relevante (>2.5s)
                    if (lcpTime > 2500) {
                      console.log('LCP:', lcpTime, 'ms');
                    }
                  }
                }).observe({type: 'largest-contentful-paint', buffered: true});
              } catch (e) {}
            }
            
            // Cargar recursos no críticos después
            setTimeout(function() {
              // Precargar páginas siguientes
              const nextPages = ['/quiz/1', '/quiz/2'];
              nextPages.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
              });
            }, 2000);
          });
          
          // Optimización de imágenes
          if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
              img.loading = 'lazy';
            });
          }
        `
      }} />
    </>
  )
}
