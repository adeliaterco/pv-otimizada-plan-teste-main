"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// 1. Adicione esta função para enviar eventos ao Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', nombre_evento, propriedades);
    console.log('Evento enviado:', nombre_evento, propriedades);
  }
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [urgencyCount, setUrgencyCount] = useState(127)

  useEffect(() => {
    setIsLoaded(true)

    // Contador de urgência
    const interval = setInterval(() => {
      setUrgencyCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 45000)

    // 2. Adicione este código para registrar visualização da página inicial
    enviarEvento('visualizou_pagina_inicial');

    return () => clearInterval(interval)
  }, [])

  // 3. Modifique esta função para registrar o início do quiz e preservar UTMs
  const handleStart = () => {
    // Registra evento de início do quiz
    enviarEvento('iniciou_quiz');
    
    // Reset quiz data
    localStorage.removeItem("quizData")
    localStorage.removeItem("unlockedBonuses")
    localStorage.removeItem("totalValue")
    
    // Preservar UTMs no redirecionamento
    const currentUrl = new URL(window.location.href);
    const utmParams = new URLSearchParams();
    
    // Coletar todos os parâmetros UTM da URL atual
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    // Se não houver UTMs na URL, verificar se estão armazenados no localStorage
    if (utmParams.toString() === '' && localStorage.getItem('utmParams')) {
      const storedUtms = JSON.parse(localStorage.getItem('utmParams'));
      for (const key in storedUtms) {
        if (key.startsWith('utm_')) {
          utmParams.append(key, storedUtms[key]);
        }
      }
    }
    
    // Armazenar UTMs no localStorage para uso em páginas futuras
    if (utmParams.toString() !== '') {
      const utmObject = {};
      for (const [key, value] of utmParams.entries()) {
        utmObject[key] = value;
      }
      localStorage.setItem('utmParams', JSON.stringify(utmObject));
    }
    
    // Construir a URL de destino com os parâmetros UTM
    const targetUrl = `/quiz/1${utmParams.toString() ? '?' + utmParams.toString() : ''}`;
    window.location.href = targetUrl;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
          <CardContent className="p-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              {/* Substituindo o coração por foto arredondada com efeitos */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="relative w-28 h-28 mx-auto mb-6"
              >
                {/* Efeitos de luz */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-xl animate-pulse"></div>
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-md animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>

                {/* Imagem arredondada */}
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-orange-500 shadow-lg shadow-orange-500/30 z-10"
                >
                  <img
                    src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                    alt="Logo Plano A - Reconquista"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">PLAN A</h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-orange-400 mb-8">RECUPERACIÓN RÁPIDA</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
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
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {/* Botão com texto reduzido */}
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 w-full sm:w-auto"
                >
                  HACER PRUEBA GRATIS
                  <ArrowRight className="w-5 h-5 ml-2" />
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
