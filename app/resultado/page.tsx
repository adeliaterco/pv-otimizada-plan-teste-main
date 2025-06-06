"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Gift, Star, Shield, ArrowRight, Check, Clock, AlertTriangle, BookOpen, Heart, Award, Play, ThumbsUp, User, Users, MessageCircle, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import { bonuses, getPersonalizedContent } from "@/lib/quiz-data"
import { enviarEvento } from '../../lib/analytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResultPage() {
  const [unlockedBonuses, setUnlockedBonuses] = useState<number[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [recentBuyers, setRecentBuyers] = useState(3)
  const [userGender, setUserGender] = useState<string>("")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedBonuses = localStorage.getItem("unlockedBonuses")
    const savedValue = localStorage.getItem("totalValue")
    const savedGender = localStorage.getItem("userGender")

    if (savedBonuses) setUnlockedBonuses(JSON.parse(savedBonuses))
    if (savedValue) setTotalValue(Number.parseInt(savedValue))
    if (savedGender) setUserGender(savedGender)

    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Simulate recent buyers with more dynamic behavior
    const interval = setInterval(() => {
      setRecentBuyers((prev) => {
        // Random increase between 1-3 people
        const increase = Math.floor(Math.random() * 3) + 1
        return Math.min(prev + increase, 17)
      })
    }, 30000)

    // Registra visualização da página de resultado
    try {
      enviarEvento('visualizou_resultado');
      console.log('Evento de visualização registrado com sucesso');
    } catch (error) {
      console.error('Erro ao registrar evento de visualização:', error);
    }

    return () => clearInterval(interval)
  }, [])

  const handlePurchase = () => {
    try {
      enviarEvento('clicou_comprar', {
        posicao: 'principal'
      });
    } catch (error) {
      console.error('Erro ao registrar evento de clique:', error);
    }
    window.open("https://pay.hotmart.com/D100080158I?checkoutMode=10", "_blank")
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getPersonalizedTitle = () => {
    if (userGender === "MASCULINO") {
      return "DE RECHAZADO A DESEADO"
    } else if (userGender === "FEMININO") {
      return "DE RECHAZADA A DESEADA"
    }
    return "DE RECHAZADO(A) A DESEADO(A)"
  }

  const getPersonalizedCTA = () => {
    if (userGender === "MASCULINO") {
      return "RECONQUISTAR A ELLA AHORA"
    } else if (userGender === "FEMININO") {
      return "RECONQUISTAR A ÉL AHORA"
    }
    return "RECONQUISTAR AHORA"
  }

  const getPersonalizedPronoun = () => {
    return userGender === "FEMININO" ? "él" : "ella";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4" ref={contentRef}>
      {/* Navegación interna */}

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{getPersonalizedTitle()}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-4">EN 21 DÍAS O MENOS</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            <span className="font-bold text-orange-300">Aunque {getPersonalizedPronoun()} haya dicho que nunca más quiere verte</span> y hayas intentado todo sin éxito.
          </p>

          {/* Comparativo Antes y Después */}
          <div id="historia" className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gray-50 border-2 border-gray-300 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">DÓNDE ESTÁS VS. DÓNDE ESTARÁS</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h4 className="text-xl font-bold text-red-800 mb-4">AHORA</h4>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-red-600">✗</span>
                        </div>
                        <span className="text-red-700">Sufriendo por el rechazo y el dolor de la separación</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-red-600">✗</span>
                        </div>
                        <span className="text-red-700">Intentando estrategias que solo empeoran la situación</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-red-600">✗</span>
                        </div>
                        <span className="text-red-700">Sin saber qué hacer para recuperar su atención</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-red-600">✗</span>
                        </div>
                        <span className="text-red-700">Perdiendo noches de sueño pensando en qué salió mal</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-4">EN 21 DÍAS</h4>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-green-700">Reconquistando su atención e interés</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-green-700">Aplicando estrategias que realmente funcionan</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-green-700">Viendo cómo {getPersonalizedPronoun()} te mira con ese brillo en los ojos nuevamente</span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-green-700">Construyendo una relación aún más fuerte que antes</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Imágenes animadas - Plan A y 21 Gatillos */}
                <div className="mt-8 relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-2xl animate-pulse"></div>
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/15 to-pink-500/15 blur-lg animate-pulse"
                    style={{ animationDelay: "2s" }}
                  ></div>

                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      scale: [1, 1.02, 1],
                      rotate: [0, 0.8, -0.8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 bg-white rounded-xl p-3 shadow-2xl border-2 border-orange-400 mb-8"
                  >
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                      alt="Resultado Real de Transformación"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </motion.div>

                  {/* 21 Gatillos Emocionales */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.03, 1],
                      rotate: [0, -0.7, 0.7, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="relative z-10 bg-white rounded-xl p-3 shadow-2xl border-2 border-yellow-400 mt-12"
                  >
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-21-gatilhos-A-Livro.png"
                      alt="21 Gatillos Emocionales"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold py-1 px-3 rounded-full text-sm transform rotate-12 shadow-lg">
                      ¡INCLUIDO!
                    </div>
                  </motion.div>

                  {/* Partículas animadas para ambas imágenes */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-3 h-3 rounded-full opacity-60 ${
                        i % 3 === 0 ? "bg-orange-400" : i % 3 === 1 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      animate={{
                        x: [0, Math.random() * 120 - 60, 0],
                        y: [0, Math.random() * 120 - 60, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.8, 0.5],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.3,
                      }}
                      style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${i < 6 ? 15 + Math.random() * 30 : 50 + Math.random() * 30}%`,
                      }}
                    />
                  ))}
                  
                  {/* Texto explicativo */}
                  <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 relative z-10">
                    <h4 className="text-xl font-bold text-orange-800 mb-2 text-center">PLAN A + 21 GATILLOS EMOCIONALES</h4>
                    <p className="text-orange-700 text-center">
                      Además del sistema completo Plan A, recibirás los <span className="font-bold">21 Gatillos Emocionales</span> que 
                      activan el deseo inmediato y despiertan sentimientos profundos en {getPersonalizedPronoun()}, 
                      acelerando tu proceso de reconquista.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sobre el Creador del Método */}
          <div id="metodo" className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border-2 border-orange-500">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-400 flex-shrink-0">
                    <img 
                      src="https://optimalhealthscout.shop/wp-content/uploads/2025/06/imagem_gerada-2025-06-01T212625.544.png" 
                      alt="Creador del Método" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-orange-400 mb-2">CONOCE AL CREADOR DEL MÉTODO</h3>
                    <p className="text-gray-300 mb-4">
                      Después de ayudar a más de <span className="text-orange-300 font-bold">3.847 personas</span> a reconquistar sus relaciones, 
                      desarrollé un sistema que funciona para <span className="text-orange-300 font-bold">cualquier tipo de ruptura</span>, 
                      incluso en los casos más difíciles.
                    </p>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        87% DE ÉXITO
                      </div>
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ESPECIALISTA EN RECONQUISTA
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      "Mi misión es ayudar a las personas a recuperar el amor que parecía perdido para siempre."
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
          
          {/* Timeline de Resultados */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-3xl font-bold text-white text-center mb-8">QUÉ ESPERAR EN LOS PRÓXIMOS 21 DÍAS</h3>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange-500"></div>
              
              {/* Día 1-3 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="flex-grow md:w-5/12 md:pr-8 text-right hidden md:block">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 1-3</h4>
                    <p className="text-gray-300">Fase de Desintoxicación Emocional</p>
                  </div>
                  
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center z-10 mx-4 md:mx-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  
                  <div className="flex-grow md:w-5/12 md:pl-8 md:hidden">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 1-3</h4>
                    <p className="text-gray-300">Fase de Desintoxicación Emocional</p>
                  </div>
                  
                  <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pl-8 hidden md:block">
                    <CardContent className="p-4">
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Detener comportamientos que alejan a {getPersonalizedPronoun()}</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Aplicar la técnica del "Espacio Magnético"</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Recuperar tu estabilidad emocional</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden">
                  <CardContent className="p-4">
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Detener comportamientos que alejan a {getPersonalizedPronoun()}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Aplicar la técnica del "Espacio Magnético"</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Recuperar tu estabilidad emocional</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Día 4-7 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pr-8 hidden md:block">
                    <CardContent className="p-4">
                      <ul className="text-gray-300 space-y-2 text-right">
                        <li className="flex items-start justify-end">
                          <span>Primeras señales de curiosidad de su parte</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                        <li className="flex items-start justify-end">
                          <span>Implementar la técnica del "Gatillo de Nostalgia"</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                        <li className="flex items-start justify-end">
                          <span>Primeros contactos indirectos</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div className="flex-grow md:w-5/12 md:pr-8 text-right hidden md:block">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 4-7</h4>
                    <p className="text-gray-300">Fase de Reconexión Inicial</p>
                  </div>
                  
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center z-10 mx-4 md:mx-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  
                  <div className="flex-grow md:w-5/12 md:pl-8">
                    <h4 className="text-xl font-bold text-orange-400 md:hidden">DÍAS 4-7</h4>
                    <p className="text-gray-300 md:hidden">Fase de Reconexión Inicial</p>
                  </div>
                </div>
                
                <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden">
                  <CardContent className="p-4">
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Primeras señales de curiosidad de su parte</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Implementar la técnica del "Gatillo de Nostalgia"</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Primeros contactos indirectos</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Día 8-14 */}
              <div className="relative z-10 mb-12">
                <div className="flex items-center">
                  <div className="flex-grow md:w-5/12 md:pr-8 text-right hidden md:block">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 8-14</h4>
                    <p className="text-gray-300">Fase de Atracción Renovada</p>
                  </div>
                  
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center z-10 mx-4 md:mx-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  
                  <div className="flex-grow md:w-5/12 md:pl-8 md:hidden">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 8-14</h4>
                    <p className="text-gray-300">Fase de Atracción Renovada</p>
                  </div>
                  
                  <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pl-8 hidden md:block">
                    <CardContent className="p-4">
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Contacto directo y reacercamiento</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Despertar del interés romántico</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                          <span>Aplicar los 7 Pilares de la Presencia Irresistible</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden">
                  <CardContent className="p-4">
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Contacto directo y reacercamiento</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Despertar del interés romántico</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Aplicar los 7 Pilares de la Presencia Irresistible</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Día 15-21 */}
              <div className="relative z-10">
                <div className="flex items-center">
                  <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pr-8 hidden md:block">
                    <CardContent className="p-4">
                      <ul className="text-gray-300 space-y-2 text-right">
                        <li className="flex items-start justify-end">
                          <span>Reconquista completa y reconciliación</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                        <li className="flex items-start justify-end">
                          <span>Restablecimiento de la conexión emocional profunda</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                        <li className="flex items-start justify-end">
                          <span>Construcción de una relación más fuerte</span>
                          <Check className="w-4 h-4 text-green-400 ml-2 mt-1" />
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div className="flex-grow md:w-5/12 md:pr-8 text-right hidden md:block">
                    <h4 className="text-xl font-bold text-orange-400">DÍAS 15-21</h4>
                    <p className="text-gray-300">Fase de Reconquista Total</p>
                  </div>
                  
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center z-10 mx-4 md:mx-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  
                  <div className="flex-grow md:w-5/12 md:pl-8">
                    <h4 className="text-xl font-bold text-orange-400 md:hidden">DÍAS 15-21</h4>
                    <p className="text-gray-300 md:hidden">Fase de Reconquista Total</p>
                  </div>
                </div>
                
                <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden">
                  <CardContent className="p-4">
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Reconquista completa y reconciliación</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Restablecimiento de la conexión emocional profunda</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Construcción de una relación más fuerte</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ¿Este método es para ti? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-orange-400 text-center mb-6">¿ESTE MÉTODO ES PARA TI?</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-green-400 mb-4">ESTE MÉTODO ES PARA TI SI...</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                        <span>Tu relación terminó recientemente o hace algún tiempo</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                        <span>Aún amas a {getPersonalizedPronoun()} y quieres una segunda oportunidad</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                        <span>Ya intentaste todo, pero nada funcionó hasta ahora</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                        <span>{getPersonalizedPronoun() === "él" ? "Él" : "Ella"} dijo que no quiere nada más contigo</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                        <span>Estás dispuesto a seguir un método comprobado</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-red-400 mb-4">ESTE MÉTODO NO ES PARA TI SI...</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                        <span>Solo quieres manipular a {getPersonalizedPronoun()} por motivos egoístas</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                        <span>No estás dispuesto a hacer cambios personales</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                        <span>La relación involucró abuso o violencia</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                        <span>No estás comprometido con el proceso de 21 días</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                        <span>Esperas resultados mágicos sin ningún esfuerzo</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 bg-orange-100 p-4 rounded-lg text-center">
                  <h4 className="text-xl font-bold text-orange-800 mb-2">¿POR QUÉ ESTO FUNCIONA CUANDO NADA MÁS FUNCIONÓ?</h4>
                  <p className="text-orange-700">
                    Porque aborda las <span className="font-bold">causas emocionales profundas</span> de la ruptura, 
                    no solo los síntomas superficiales. El método trabaja con los 7 Pilares de la Presencia Irresistible, 
                    activando gatillos psicológicos que despiertan su deseo natural por ti.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Detalle de los Módulos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.3 }}
          id="modulos"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">CONTENIDO DETALLADO DEL PROGRAMA</h3>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-orange-400">PLAN A - RECUPERACÓN RÁPIDA</h4>
                    <p className="text-orange-300 font-semibold text-lg">Sistema Completo de Reconquista en 21 Días</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-orange-600 text-white p-3">
                      <h5 className="text-xl font-bold">MÓDULO 1: FUNDAMENTOS DE LA RECONQUISTA</h5>
                    </div>
                    <div className="p-4 text-gray-300">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Diagnóstico de la Ruptura</span>
                            <p className="text-sm">Identifica exactamente por qué terminó la relación y cómo esto afecta tu estrategia</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Protocolo de Emergencia de 72 horas</span>
                            <p className="text-sm">Qué hacer inmediatamente para evitar errores fatales que imposibilitan la reconquista</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Mapeo Emocional</span>
                            <p className="text-sm">Entiende su estado emocional actual y cómo esto influye en tus posibilidades</p>
                          </div>
                        </li>
                      </ul>
                      
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-orange-600 text-white p-3">
                      <h5 className="text-xl font-bold">MÓDULO 2: LOS 7 PILARES DE LA PRESENCIA IRRESISTIBLE</h5>
                    </div>
                    <div className="p-4 text-gray-300">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Pilar 1: Independencia Emocional</span>
                            <p className="text-sm">Cómo volverte emocionalmente atractivo incluso después de la ruptura</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Pilar 2: Comunicación Magnética</span>
                            <p className="text-sm">Las palabras y frases exactas que despiertan interés inmediato</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Pilares 3-7: Revelados en el programa</span>
                            <p className="text-sm">Los 5 pilares restantes que completan el sistema de reconquista</p>
                          </div>
                        </li>
                      </ul>
                      
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-orange-600 text-white p-3">
                      <h5 className="text-xl font-bold">MÓDULO 3: ESTRATEGIAS PARA CADA TIPO DE RUPTURA</h5>
                    </div>
                    <div className="p-4 text-gray-300">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-700/40 p-3 rounded-lg">
                          <h6 className="font-bold text-orange-300 mb-1">RUPTURA POR TRAICIÓN</h6>
                          <p className="text-sm">Protocolo específico para recuperar la confianza y superar el dolor</p>
                        </div>
                        <div className="bg-gray-700/40 p-3 rounded-lg">
                          <h6 className="font-bold text-orange-300 mb-1">RUPTURA POR DESGASTE</h6>
                          <p className="text-sm">Cómo reavivar la llama y traer novedad a la relación</p>
                        </div>
                        <div className="bg-gray-700/40 p-3 rounded-lg">
                          <h6 className="font-bold text-orange-300 mb-1">RUPTURA POR PELEAS</h6>
                          <p className="text-sm">Técnicas de comunicación para resolver conflictos permanentemente</p>
                        </div>
                        <div className="bg-gray-700/40 p-3 rounded-lg">
                          <h6 className="font-bold text-orange-300 mb-1">RUPTURA POR TERCEROS</h6>
                          <p className="text-sm">Cómo lidiar cuando hay otras personas involucradas</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-orange-600 text-white p-3">
                      <h5 className="text-xl font-bold">MÓDULO 4: RECONQUISTA Y MANTENIMIENTO</h5>
                    </div>
                    <div className="p-4 text-gray-300">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">El Primer Encuentro Post-Ruptura</span>
                            <p className="text-sm">Exactamente qué hacer y decir para garantizar que no sea el último</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Reconstrucción de la Intimidad</span>
                            <p className="text-sm">Cómo restablecer la conexión física y emocional de forma natural</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1" />
                          <div>
                            <span className="font-bold text-white">Prevención de Recaídas</span>
                            <p className="text-sm">Cómo garantizar que los mismos problemas no vuelvan a ocurrir</p>
                          </div>
                        </li>
                      </ul>
                      
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    <Button
                      onClick={() => scrollToSection('oferta')}
                      size="lg"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      VER OFERTA COMPLETA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Comparativo con Alternativas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">COMPARA LAS ALTERNATIVAS:</h3>
          
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-lg overflow-hidden border-collapse">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-4 text-left">Opción</th>
                  <th className="p-4 text-center">Tiempo</th>
                  <th className="p-4 text-center">Costo</th>
                  <th className="p-4 text-center">Tasa de Éxito</th>
                  <th className="p-4 text-center">Recomendado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-white font-medium">Terapia de Pareja</td>
                  <td className="p-4 text-center text-gray-300">3-6 meses</td>
                  <td className="p-4 text-center text-gray-300">$150 - $360</td>
                  <td className="p-4 text-center text-gray-300">40-60%</td>
                  <td className="p-4 text-center text-gray-300">❌</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-white font-medium">Intentar solo</td>
                  <td className="p-4 text-center text-gray-300">Indefinido</td>
                  <td className="p-4 text-center text-gray-300">$0</td>
                  <td className="p-4 text-center text-gray-300">15-20%</td>
                  <td className="p-4 text-center text-gray-300">❌</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-white font-medium">Otros cursos online</td>
                  <td className="p-4 text-center text-gray-300">30-90 días</td>
                  <td className="p-4 text-center text-gray-300">$50 - $250</td>
                  <td className="p-4 text-center text-gray-300">30-50%</td>
                  <td className="p-4 text-center text-gray-300">❌</td>
                </tr>
                <tr className="bg-gradient-to-r from-orange-900/30 to-orange-800/30">
                  <td className="p-4 text-orange-400 font-bold">PLAN A - RECUPERACÓN RÁPIDA</td>
                  <td className="p-4 text-center text-orange-300 font-bold">21 días</td>
                  <td className="p-4 text-center text-orange-300 font-bold">$9</td>
                  <td className="p-4 text-center text-orange-300 font-bold">87-97%</td>
                  <td className="p-4 text-center text-green-400">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Testimonios Categorizados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.5 }}
          id="testimonios"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-2">RESULTADOS REALES</h3>
          <p className="text-orange-400 text-center font-semibold mb-8">
            Historias de personas que ya pasaron por lo que estás pasando ahora
          </p>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="traicion" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="traicion" className="text-sm md:text-base">Traición</TabsTrigger>
                <TabsTrigger value="desgaste" className="text-sm md:text-base">Desgaste</TabsTrigger>
                <TabsTrigger value="peleas" className="text-sm md:text-base">Peleas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="traicion">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/05/04-roberto.png" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Carlos S.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Después de descubrir la traición, pensé que nunca más podría confiar en ella. 
                        Pero el Módulo 3 me mostró cómo reconstruir la confianza paso a paso. Hoy llevamos 
                        juntos 8 meses y nuestra relación está más fuerte que antes."
                      </p>
                      <div className="text-sm text-gray-500">Reconciliado hace 8 meses</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/05/01.png" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Mariana L.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Él me traicionó y terminó conmigo por mensaje. Estaba destrozada hasta encontrar este método. Seguí exactamente el protocolo de 72 horas 
                        y en 18 días él estaba suplicando que volviéramos. ¡Hoy estamos comprometidos!"
                      </p>
                      <div className="text-sm text-gray-500">Reconciliada hace 1 año</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="desgaste">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/05/06.png" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">André P.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Nuestra relación de 5 años había perdido la gracia. Ella dijo que ya no sentía 
                        nada por mí. Apliqué los 7 Pilares de la Presencia Irresistible y en 3 semanas ella 
                        confesó que estaba enamorada de mí otra vez."
                      </p>
                      <div className="text-sm text-gray-500">Reconciliado hace 6 meses</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/06/2-DEPOIMENTO.png" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Juliana M.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Después de 7 años, él dijo que ya no sentía lo mismo. Pensé que era el fin. 
                        Seguí el método al pie de la letra, especialmente la parte de reconexión emocional, y hoy estamos 
                        más enamorados que al principio de la relación."
                      </p>
                      <div className="text-sm text-gray-500">Reconciliada hace 4 meses</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="peleas">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/06/f256f28a41fc4b4e1427cc37874429da.jpg" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Rafael T.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Peleábamos por cualquier cosa. Nuestra última discusión fue tan fea que ella bloqueó 
                        mi número. Usé las técnicas de comunicación del Módulo 3 y hoy logramos resolver 
                        nuestros problemas sin gritarnos."
                      </p>
                      <div className="text-sm text-gray-500">Reconciliado hace 3 meses</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img 
                            src="https://optimalhealthscout.shop/wp-content/uploads/2025/06/4-DEPOIMENTO.png" 
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Fernanda C.</h5>
                          <div className="flex text-orange-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Nuestra relación era una montaña rusa de peleas y reconciliaciones. Él terminó 
                        diciendo que estaba cansado. Apliqué el método y en 19 días estábamos juntos nuevamente, 
                        pero esta vez con herramientas para resolver conflictos."
                      </p>
                      <div className="text-sm text-gray-500">Reconciliada hace 7 meses</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">87%</div>
              <p className="text-white text-lg mb-4">de los usuarios reportan primeras señales positivas en menos de 14 días</p>
              <div className="flex justify-center gap-6 text-gray-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">3.847+</div>
                  <div className="text-sm">Relaciones recuperadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">21</div>
                  <div className="text-sm">Días o menos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">97%</div>
                  <div className="text-sm">Tasa de satisfacción</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

{/* Oferta Principal Consolidada */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
  transition={{ delay: 0.2 }}
  id="oferta"
  className="mb-12"
>
  <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-2xl border-4 border-yellow-400">
    <CardContent className="p-8 text-center">
      <div className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full inline-block mb-6">
        🔥 OFERTA LIMITADA - SOLO HOY
      </div>

      <h3 className="text-3xl md:text-5xl font-bold mb-4">PLAN A - RECUPERACÓN RÁPIDA</h3>

      <p className="text-xl md:text-2xl mb-6 font-semibold">
        El Sistema Completo que Ya Reconquistó Más de 3.847 Relaciones
      </p>

      {/* Conteúdo Principal - Consolidado */}
      <div className="bg-white/20 rounded-lg p-6 mb-6">
        <h4 className="text-2xl font-bold text-yellow-300 mb-4">LO QUE RECIBES:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-left mb-6">
          <div>
            <h5 className="text-xl font-bold text-yellow-200 mb-3">📚 CONTENIDO PRINCIPAL:</h5>
            <ul className="space-y-2 text-white">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Sistema completo de 21 días paso a paso</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>7 Pilares de la Presencia Irresistible</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>21 Disparadores Emocionales Infalibles</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Protocolo de 72 horas para casos urgentes</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-xl font-bold text-yellow-200 mb-3">🎯 SOPORTE Y ACCESO:</h5>
            <ul className="space-y-2 text-white">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Acceso desde móvil, tablet o computadora</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Actualizaciones gratuitas de por vida</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Soporte prioritario por 30 días</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span>Comunidad privada de apoyo</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bônus Consolidados */}
        <div className="text-left mb-6">
          <h5 className="text-xl font-bold text-yellow-200 mb-3">🎁 BONOS EXCLUSIVOS DESBLOQUEADOS ({unlockedBonuses.length} de 5):</h5>
          <div className="grid md:grid-cols-2 gap-3">
            {bonuses.map((bonus, index) => (
              <div 
                key={bonus.id}
                className={`p-3 rounded-lg ${
                  unlockedBonuses.includes(bonus.id)
                    ? "bg-green-500/30 border border-green-400"
                    : "bg-gray-700/30 border border-gray-600"
                }`}
              >
                <div className="flex items-start">
                  {unlockedBonuses.includes(bonus.id) ? (
                    <Check className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                  ) : (
                    <Gift className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white">
                      {getPersonalizedContent(bonus.title, userGender)}
                    </span>
                    <div className="text-sm text-yellow-200 mt-1">Valor: $ {bonus.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preço Consolidado */}
      <div className="mb-6">
        <div className="text-red-300 text-xl font-bold mb-2">
          <span className="line-through">VALOR TOTAL: $ 197</span>
        </div>
        <div className="text-6xl font-bold text-yellow-300 mb-2">$ 9</div>
        
        <div className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-full inline-block mt-4">
          💰 ¡AHORRO DE $ 188 HOY!
        </div>
      </div>

      {/* CTA Unificado */}
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
        <Button
          onClick={handlePurchase}
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 w-full sm:w-auto"
        >
          {getPersonalizedCTA()}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
      
      <div className="flex justify-center gap-4 text-sm text-white">
        <div className="flex items-center">
          <Check className="w-4 h-4 text-green-400 mr-1" />
          <span>Acceso inmediato</span>
        </div>
        <div className="flex items-center">
          <Check className="w-4 h-4 text-green-400 mr-1" />
          <span>Pago en cuotas disponible</span>
        </div>
        <div className="flex items-center">
          <Check className="w-4 h-4 text-green-400 mr-1" />
          <span>Garantía de 30 días</span>
        </div>
      </div>
      
      {recentBuyers > 0 && (
        <div className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full inline-block">
          🔥 ¡{recentBuyers} personas compraron en las últimas 2 horas!
        </div>
      )}
    </CardContent>
  </Card>
</motion.div>

        {/* Garantías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.2 }}
          id="garantias"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">TUS GARANTÍAS:</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-2 border-green-300">
              <CardContent className="p-6 text-center">
                <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-green-800 mb-2">GARANTÍA #1</h4>
                <p className="text-green-700 font-semibold mb-3">Resultados en 7 días o devolución total</p>
                <p className="text-sm text-green-600">
                  Si no percibes ninguna señal positiva en los primeros 7 días, devolveremos el 100% de tu inversión sin preguntas.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-2 border-blue-300">
              <CardContent className="p-6 text-center">
                <Star className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-blue-800 mb-2">GARANTÍA #2</h4>
                <p className="text-blue-700 font-semibold mb-3">Soporte prioritario 24/7</p>
                <p className="text-sm text-blue-600">
                  Tendrás acceso a nuestro equipo de especialistas para resolver dudas y recibir orientaciones personalizadas durante todo el proceso.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-2 border-purple-300">
              <CardContent className="p-6 text-center">
                <Clock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-purple-800 mb-2">GARANTÍA #3</h4>
                <p className="text-purple-700 font-semibold mb-3">30 días sin preguntas</p>
                <p className="text-sm text-purple-600">
                  Si por cualquier motivo no quedas satisfecho en los primeros 30 días, solo solicítalo y devolveremos tu inversión íntegramente.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Preguntas Frecuentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.3 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">PREGUNTAS FRECUENTES</h3>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Y si {getPersonalizedPronoun()} ya está con otra persona?</h4>
                <p className="text-gray-300">
                  El método incluye estrategias específicas para casos donde hay terceros involucrados. Muchos de nuestros casos 
                  de éxito comenzaron exactamente en esa situación. El Módulo 3 aborda detalladamente cómo proceder en estos casos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Cuánto tiempo toma ver resultados?</h4>
                <p className="text-gray-300">
                  El 87% de los usuarios reportan las primeras señales positivas en menos de 14 días. El método completo 
                  está diseñado para funcionar en 21 días, pero muchos consiguen resultados más rápidos, especialmente 
                  con el Protocolo de Emergencia de 72 horas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿El método funciona para cualquier tipo de ruptura?</h4>
                <p className="text-gray-300">
                  ¡Sí! El programa incluye estrategias específicas para diferentes tipos de ruptura: traición, 
                  desgaste natural, peleas constantes, interferencia de terceros, etc. El Módulo 3 está enteramente 
                  dedicado a abordar cada situación con técnicas personalizadas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Y si {getPersonalizedPronoun()} me bloqueó en todo?</h4>
                <p className="text-gray-300">
                  El método incluye técnicas de "contacto indirecto" que funcionan incluso cuando estás bloqueado 
                  en todas las redes sociales. Muchos de nuestros casos de éxito comenzaron con bloqueo total y 
                  terminaron con reconciliación completa.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Cómo voy a recibir el acceso?</h4>
                <p className="text-gray-300">
                  Inmediatamente después de la confirmación del pago, recibirás un email con tus credenciales 
                  de acceso a la plataforma. Todo el contenido estará disponible instantáneamente, incluyendo los 
                  bonos desbloqueados durante el quiz.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Y si no logro aplicar el método correctamente?</h4>
                <p className="text-gray-300">
                  Tendrás acceso a nuestro soporte prioritario por 30 días, donde nuestro equipo te ayudará 
                  a implementar el método correctamente para tu situación específica. Además, la comunidad 
                  privada ofrece apoyo adicional de personas que ya pasaron por el mismo proceso.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Testimonios - Reemplazado por una sola imagen flotante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">MÁS RESULTADOS REALES:</h3>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-50 border-2 border-gray-300 overflow-hidden">
              <CardContent className="p-6 text-center">
<motion.div
  animate={{
    y: [0, -8, 0],
    rotate: [0, 1, -1, 0],
  }}
  transition={{
    duration: 5,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  }}
  className="w-full rounded-lg overflow-hidden shadow-lg"
>
  <video 
    src="https://optimalhealthscout.shop/wp-content/uploads/2025/06/prova-pronta-espanhol-joselino.mp4" 
    controls
    className="w-full h-auto object-cover"
  >
    Tu navegador no soporta el elemento de video.
  </video>
</motion.div>
                <p className="text-gray-600 font-medium mt-4">
                  ¡Mira lo que nuestros clientes están diciendo sobre los resultados!
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Final - Personalizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.6 }}
          className="mb-12 text-center"
        >
          <Button
            onClick={handlePurchase}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            COMPRAR AHORA
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ ¡Esta oferta expira pronto! </p>
        </motion.div>
      </div>
    </div>
  )
}
