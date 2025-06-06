"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Função simplificada para enviar eventos ao Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', nombre_evento, propriedades);
    }
  } catch (error) {
    console.error('Erro ao enviar evento:', error);
  }
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [urgencyCount, setUrgencyCount] = useState(127)
  
  useEffect(() => {
    // Marcar como carregado
    setIsLoaded(true)
    
    // Contador de urgência - usando um intervalo maior para reduzir processamento
    const interval = setInterval(() => {
      setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 60000)
    
    // Registrar visualização da página inicial - adiado para não bloquear renderização
    if (typeof window !== 'undefined') {
      // Usar setTimeout para adiar analytics não crítico
      const timeoutId = setTimeout(() => {
        enviarEvento('visualizou_pagina_inicial', {
          device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
        })
      }, 2000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
      }
    }
    
    return () => clearInterval(interval)
  }, [])
  
  // Função para preservar UTMs e iniciar o quiz
  const handleStart = () => {
    // Evitar múltiplos cliques
    if (isLoading) return
    setIsLoading(true)
    
    try {
      if (typeof window !== 'undefined') {
        // Registrar evento de início do quiz
        enviarEvento('iniciou_quiz')
        
        // Reset quiz data
        localStorage.removeItem("quizData")
        localStorage.removeItem("unlockedBonuses")
        localStorage.removeItem("totalValue")
        
        // Preservar UTMs no redirecionamento
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
      <div className={`max-w-3xl w-full text-center transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-lg"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10">
                  {/* IMAGEM OTIMIZADA: Reduzida para 150x150px e comprimida */}
                  <img
                    src="https://i.ibb.co/6Dn0Lbj/plan-a-optimized.webp"
                    alt="Logo Plano A - Reconquista"
                    className="w-full h-full object-cover"
                    width="112"
                    height="112"
                    loading="eager"
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
            </div>

            <div>
              <div className="hover:scale-105 transition-transform duration-300">
                {/* Botão com feedback visual de carregamento */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Preload de recursos críticos */}
      <link 
        rel="preload" 
        href="https://i.ibb.co/6Dn0Lbj/plan-a-optimized.webp" 
        as="image"
      />
    </div>
  )
}
