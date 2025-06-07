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
      return "RECONQUISTAR AHORA"
    } else if (userGender === "FEMININO") {
      return "RECONQUISTAR AHORA"
    }
    return "RECONQUISTAR AHORA"
  }

  const getPersonalizedPronoun = () => {
    return userGender === "FEMININO" ? "él" : "ella";
  }
  
  // Função para feedback tátil em dispositivos móveis
  const handleTouchFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4" ref={contentRef}>
      {/* Navegação fixa para mobile - Simplificada e discreta */}
      <div className="md:hidden sticky top-0 z-50 bg-black/90 backdrop-blur-md p-2 border-b border-orange-500">
        <div className="flex justify-between items-center">
          <h2 className="text-orange-400 font-bold text-sm">Tu Plan de Reconquista</h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => scrollToSection('resultado')}
              variant="ghost" 
              size="sm"
              className="text-white text-xs"
            >
              Resultado
            </Button>
            <Button 
              onClick={() => scrollToSection('modulos')}
              variant="ghost" 
              size="sm"
              className="text-white text-xs"
            >
              Módulos
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Banner de escassez no topo - Mais urgente e específico */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          className="bg-red-600 text-white p-3 rounded-lg text-center mb-6 animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 inline-block mr-2" />
          <span className="font-bold">OFERTA LIMITADA:</span> El Sistema Plan A + los 2 bonos solo por <span className="font-bold text-yellow-300">$9</span> durante las próximas <CountdownTimer minutes={15} seconds={0} />.
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{getPersonalizedTitle()}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-4">EN 21 DÍAS O MENOS</h2>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            <span className="font-bold text-orange-300">Aunque {getPersonalizedPronoun()} haya dicho que nunca más quiere verte</span> y hayas intentado todo sin éxito.
          </p>
        </motion.div>

        {/* RESULTADO DO QUIZ - SEÇÃO IMPACTANTE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          id="resultado"
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white overflow-hidden border-4 border-yellow-400 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">TU RESULTADO DEL QUIZ</h3>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative z-10 w-40 h-40 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white">
                      <div className="text-center">
                        <span className="text-4xl font-extrabold text-white">91%</span>
                        <p className="text-sm font-bold text-white">COMPATIBLE</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <h4 className="text-xl font-bold text-yellow-300 mb-2">DIAGNÓSTICO PERSONALIZADO:</h4>
                  <p className="text-white text-lg mb-4">
                    Basado en tus respuestas, tu situación es <span className="font-bold underline">altamente recuperable</span> con el método correcto.
                  </p>
                  
                  <div className="bg-black/30 p-4 rounded-lg mb-4">
                    <h5 className="font-bold text-yellow-300 mb-2">LO QUE DESCUBRIMOS:</h5>
                    <ul className="space-y-2 text-white">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-1" />
                        <span>{getPersonalizedPronoun() === "él" ? "Él" : "Ella"} aún tiene sentimientos por ti, pero hay barreras emocionales que superar</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-1" />
                        <span>Tu tipo de ruptura requiere el enfoque del Módulo 3 del Plan A</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-1" />
                        <span>Con el método correcto, puedes ver resultados en menos de 21 días</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Prova social dinâmica */}
              <div className="mt-6 bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-400 mr-2" />
                    <div className="text-sm text-white">
                      <span className="font-bold text-orange-400">{recentBuyers}</span> personas activaron su plan hoy
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-400 mr-2" />
                    <div className="text-sm text-white">
                      Oferta expira en: <CountdownTimer minutes={15} seconds={0} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparativo Antes y Después */}
        <div id="historia" className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gray-50 border-2 border-gray-300 overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">DÓNDE ESTÁS VS. DÓNDE ESTARÁS</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="text-xl font-bold text-red-800 mb-4 text-center">AHORA</h4>
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
                  <h4 className="text-xl font-bold text-green-800 mb-4 text-center">EN 21 DÍAS</h4>
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

              {/* Imágenes animadas - Plan A y 21 Gatillos - SIMPLIFICADO PARA 2 PRODUTOS PRINCIPAIS */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-2xl animate-pulse"></div>
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                <div className="grid md:grid-cols-2 gap-8">
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
                    className="relative z-10 bg-white rounded-xl p-3 shadow-2xl border-2 border-orange-400"
                  >
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-Plan-A-Livro.png"
                      alt="Plan A - Sistema Completo"
                      className="w-full h-auto rounded-lg shadow-lg product-image"
                    />
                    <div className="mt-3 text-center">
                      <h4 className="font-bold text-orange-800">PLAN A</h4>
                      <p className="text-sm text-gray-700">Sistema Completo de Reconquista</p>
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 line-through">$97</span>
                        <span className="ml-2 text-green-600 font-bold">$9</span>
                      </div>
                    </div>
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
                    className="relative z-10 bg-white rounded-xl p-3 shadow-2xl border-2 border-yellow-400"
                  >
                    <img
                      src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/Nova-Imagem-21-gatilhos-A-Livro.png"
                      alt="21 Gatillos Emocionales"
                      className="w-full h-auto rounded-lg shadow-lg product-image"
                    />
                    <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold py-1 px-3 rounded-full text-sm transform rotate-12 shadow-lg">
                      ¡BONO #1!
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="font-bold text-orange-800">21 GATILLOS EMOCIONALES</h4>
                      <p className="text-sm text-gray-700">Activa el Deseo Inmediato</p>
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 line-through">$47</span>
                        <span className="ml-2 text-green-600 font-bold">GRATIS</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Texto explicativo - SIMPLIFICADO E FOCADO */}
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 relative z-10">
                  <h4 className="text-xl font-bold text-orange-800 mb-2 text-center">¿POR QUÉ ESTA COMBINACIÓN ES TAN PODEROSA?</h4>
                  <p className="text-orange-700 text-center">
                    El <span className="font-bold">Plan A</span> te da el sistema completo paso a paso para reconquistar a {getPersonalizedPronoun()}, mientras que los <span className="font-bold">21 Gatillos Emocionales</span> aceleran todo el proceso activando sentimientos profundos que {getPersonalizedPronoun()} creía haber olvidado.
                  </p>
                </div>
              </div>
              
              {/* PRIMEIRO CTA ESTRATÉGICO - Após mostrar a transformação e o produto */}
              <div className="mt-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handlePurchase}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onTouchStart={handleTouchFeedback}
                  >
                    ACTIVAR MI PLAN AHORA
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
                <p className="text-gray-500 text-sm mt-2">
                  Acceso inmediato • Garantía de 30 días • Soporte prioritario
                </p>
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
                
                <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pl-8 hidden md:block timeline-card">
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
              
              <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden timeline-card">
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
                <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pr-8 hidden md:block timeline-card">
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
              
              <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden timeline-card">
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
                
                <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pl-8 hidden md:block timeline-card">
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
              
              <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden timeline-card">
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
                <Card className="bg-gray-800 border border-orange-500 md:w-5/12 md:pr-8 hidden md:block timeline-card">
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
              
              <Card className="bg-gray-800 border border-orange-500 mt-4 md:hidden timeline-card">
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
          
          {/* CTA após timeline - Segundo CTA estratégico */}
          <div className="mt-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handlePurchase}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onTouchStart={handleTouchFeedback}
              >
                EMPEZAR MI PLAN DE 21 DÍAS
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>

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
                
                {/* CTA após explicação do método - Terceiro CTA estratégico */}
                <div className="mt-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePurchase}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onTouchStart={handleTouchFeedback}
                    >
                      SÍ, ESTO ES PARA MÍ
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Detalle de los Módulos - SIMPLIFICADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.3 }}
          id="modulos"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">CONTENIDO DEL SISTEMA PLAN A</h3>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-orange-400">PLAN A - RECUPERACIÓN RÁPIDA</h4>
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
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* BÔNUS SIMPLIFICADOS - APENAS 2 PRINCIPAIS */}
                <div className="mb-8">
                  <div className="bg-yellow-900/30 rounded-lg overflow-hidden border-2 border-yellow-500">
                    <div className="bg-yellow-600 text-white p-3">
                      <h5 className="text-xl font-bold">
                        <Gift className="w-5 h-5 inline-block mr-2" />
                        BONOS INCLUIDOS
                      </h5>
                    </div>
                    <div className="p-4 text-gray-300">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/70 p-4 rounded-lg border border-yellow-500">
                          <h6 className="text-lg font-bold text-yellow-400 mb-2">BONO #1: 21 GATILLOS EMOCIONALES</h6>
                          <p className="text-sm mb-2">
                            21 técnicas psicológicas que despiertan sentimientos profundos en {getPersonalizedPronoun()}. Cada gatillo incluye exactamente qué decir y cuándo usarlo.
                          </p>
                          <div className="text-yellow-300 font-bold">Valor: $47 → GRATIS</div>
                        </div>
                        
                        <div className="bg-gray-800/70 p-4 rounded-lg border border-yellow-500">
                          <h6 className="text-lg font-bold text-yellow-400 mb-2">BONO #2: PROTOCOLO DE EMERGENCIA</h6>
                          <p className="text-sm mb-2">
                            Guía paso a paso para situaciones críticas donde necesitas actuar rápidamente para evitar perder a {getPersonalizedPronoun()} para siempre.
                          </p>
                          <div className="text-yellow-300 font-bold">Valor: $37 → GRATIS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CTA após detalhes dos módulos - Quarto CTA estratégico */}
                <div className="text-center mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePurchase}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onTouchStart={handleTouchFeedback}
                    >
                      ACCEDER AHORA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Comparativo com Alternativas - SIMPLIFICADO */}
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
                  <th className="p-4 text-center">Éxito</th>
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
                <tr className="bg-gradient-to-r from-orange-900/30 to-orange-800/30">
                  <td className="p-4 text-orange-400 font-bold">PLAN A - RECUPERACIÓN RÁPIDA</td>
                  <td className="p-4 text-center text-orange-300 font-bold">21 días</td>
                  <td className="p-4 text-center text-orange-300 font-bold">$9</td>
                  <td className="p-4 text-center text-orange-300 font-bold">87-97%</td>
                  <td className="p-4 text-center text-green-400">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Testimonios Categorizados - SIMPLIFICADO */}
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
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="traicion" className="text-sm md:text-base">Traición/Desgaste</TabsTrigger>
                <TabsTrigger value="peleas" className="text-sm md:text-base">Peleas/Bloqueo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="traicion">
                <div className="grid md:grid-cols-2 gap-6 testimonial-grid">
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
              
              <TabsContent value="peleas">
                <div className="grid md:grid-cols-2 gap-6 testimonial-grid">
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
              <div className="flex justify-center gap-6 text-gray-300 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">3.847+</div>
                  <div className="text-sm">Relaciones recuperadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">21</div>
                  <div className="text-sm">Días o menos</div>
                </div>
              </div>
            </div>
            
            {/* VÍDEO DEPOIMENTO - VERSÃO ULTRA SIMPLES - CORRIGIDO */}
            <div className="mt-12 mb-12">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-white text-center mb-2">VE LO QUE DICE QUIEN YA LO LOGRÓ</h3>
                <p className="text-orange-400 text-center font-semibold mb-8">
                  Testimonio real de alguien que recuperó su relación en menos de 21 días
                </p>
                
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-500 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-black rounded-lg mb-4">
                      <iframe 
                        src="https://fast.wistia.net/embed/iframe/oqyjs7cler"
                        className="w-full h-full rounded-lg"
                        allowFullScreen={true}
                        title="Testimonio de reconquista"
                      />
                    </div>
                    
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA após vídeo */}
            <div className="mt-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handlePurchase}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onTouchStart={handleTouchFeedback}
                >
                  QUIERO RESULTADOS COMO MARÍA
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Seção de Bônus Melhorada - CORRIGIDA PARA MOBILE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 0.6 }}
          id="bonos"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">BONOS INCLUIDOS</h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bônus 1 - 21 Gatilhos - CORRIGIDO PARA MOBILE */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mr-4 flex-shrink-0">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-yellow-400">BONO #1: 21 GATILLOS EMOCIONALES</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-400 line-through mr-2">$47</span>
                        <span className="text-green-400 font-bold">GRATIS</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white mb-4">
                    Este bono te da acceso a 21 técnicas psicológicas específicas que despiertan sentimientos profundos en {getPersonalizedPronoun()}. Mientras el Plan A te da la estrategia completa, estos gatillos son las "llaves emocionales" que aceleran todo el proceso.
                  </p>
                  
                  <div className="bg-black/30 p-3 rounded-lg">
                    <h5 className="font-bold text-yellow-300 mb-2">INCLUYE:</h5>
                    <ul className="space-y-2 text-white">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Gatillos de nostalgia que activan recuerdos positivos</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Frases exactas que despiertan curiosidad inmediata</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Técnicas de comunicación que generan atracción</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Bônus 2 - Protocolo de Emergência - CORRIGIDO PARA MOBILE */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mr-4 flex-shrink-0">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-yellow-400">BONO #2: PROTOCOLO DE EMERGENCIA</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-400 line-through mr-2">$37</span>
                        <span className="text-green-400 font-bold">GRATIS</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white mb-4">
                    Guía paso a paso para situaciones críticas donde necesitas actuar rápidamente para evitar perder a {getPersonalizedPronoun()} para siempre. Este protocolo es crucial para los primeros días después de la ruptura.
                  </p>
                  
                  <div className="bg-black/30 p-3 rounded-lg">
                    <h5 className="font-bold text-yellow-300 mb-2">INCLUYE:</h5>
                    <ul className="space-y-2 text-white">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Qué hacer en las primeras 72 horas críticas</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Cómo responder si {getPersonalizedPronoun()} te bloquea</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1" />
                        <span>Estrategia para cuando hay terceros involucrados</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-yellow-300 font-bold mb-4">
                VALOR TOTAL DE LOS BONOS: <span className="text-2xl">$84</span> - HOY INCLUIDOS GRATIS
              </p>
            </div>
          </div>
        </motion.div>

        {/* Oferta Principal Consolidada - SIMPLIFICADA E FOCADA */}
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

              <h3 className="text-3xl md:text-5xl font-bold mb-4">PLAN A - RECUPERACIÓN RÁPIDA</h3>

              <p className="text-xl md:text-2xl mb-6 font-semibold">
                El Sistema Completo que Ya Reconquistó Más de 3.847 Relaciones
              </p>

              {/* Conteúdo Principal - Consolidado e Simplificado */}
              <div className="bg-white/20 rounded-lg p-6 mb-6">
                <h4 className="text-2xl font-bold text-yellow-300 mb-4">LO QUE RECIBES HOY:</h4>
                
                <div className="text-left mb-6">
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <div className="min-w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-xl">PLAN A: Sistema Completo</span>
                        <p className="text-sm text-gray-200">Sistema paso a paso de 21 días con los 4 módulos completos</p>
                        <div className="mt-1">
                          <span className="text-gray-300 line-through mr-2">$97</span>
                          <span className="text-yellow-300 font-bold">$9</span>
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="min-w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <Gift className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <span className="font-bold text-xl">BONO #1: 21 Gatillos Emocionales</span>
                        <p className="text-sm text-gray-200">Técnicas psicológicas que aceleran todo el proceso de reconquista</p>
                        <div className="mt-1">
                          <span className="text-gray-300 line-through mr-2">$47</span>
                          <span className="text-green-400 font-bold">GRATIS</span>
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="min-w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <span className="font-bold text-xl">BONO #2: Protocolo de Emergencia</span>
                        <p className="text-sm text-gray-200">Guía para situaciones críticas en las primeras 72 horas</p>
                        <div className="mt-1">
                          <span className="text-gray-300 line-through mr-2">$37</span>
                          <span className="text-green-400 font-bold">GRATIS</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="text-left">
                      <h5 className="font-bold text-yellow-300 mb-1">VALOR TOTAL:</h5>
                      <div className="text-2xl font-bold text-white">
                        <span className="line-through text-gray-400">$181</span>
                        <span className="ml-2 text-yellow-300">$9</span>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <h5 className="font-bold text-yellow-300 mb-1">TU AHORRO:</h5>
                      <div className="text-2xl font-bold text-green-400">$172</div>
                    </div>
                    
                    <div className="text-left">
                      <h5 className="font-bold text-yellow-300 mb-1">OFERTA EXPIRA EN:</h5>
                      <div className="text-xl font-bold text-white">
                        <CountdownTimer minutes={15} seconds={0} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Principal - Sexto CTA estratégico (ou mais importante) */}
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
                  onTouchStart={handleTouchFeedback}
                >
                  {getPersonalizedCTA()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <div className="flex justify-center gap-4 text-sm text-white flex-wrap">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-1" />
                  <span>Acceso inmediato</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-1" />
                  <span>Pago seguro</span>
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

        {/* Garantías - SIMPLIFICADAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.2 }}
          id="garantias"
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">GARANTÍA TOTAL DE 30 DÍAS</h3>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-green-50 border-2 border-green-300">
              <CardContent className="p-6 text-center">
                <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-green-800 mb-2">SATISFACCIÓN GARANTIZADA</h4>
                <p className="text-green-700 font-semibold mb-3">Si no ves resultados en 30 días, te devolvemos el 100% de tu inversión</p>
                <p className="text-sm text-green-600 max-w-2xl mx-auto">
                  Estamos tan seguros de que este método funcionará para ti que te ofrecemos una garantía completa. Si después de seguir el plan durante 30 días no ves ningún resultado positivo, simplemente escríbenos y te devolveremos el 100% de tu dinero sin preguntas.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* CTA após garantias - Sétimo CTA estratégico */}
          <div className="mt-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handlePurchase}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onTouchStart={handleTouchFeedback}
              >
                ACTIVAR MI PLAN CON GARANTÍA
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Preguntas Frecuentes - SIMPLIFICADAS */}
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
                <h4 className="text-xl font-bold text-orange-400 mb-2">¿Cómo voy a recibir el acceso?</h4>
                <p className="text-gray-300">
                  Inmediatamente después de la confirmación del pago, recibirás un email con tus credenciales 
                  de acceso a la plataforma. Todo el contenido estará disponible instantáneamente, incluyendo los 
                  bonos esenciales.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Final - Personalizado - CTA final e mais impactante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ delay: 1.6 }}
          className="mb-12 text-center"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-2xl border-4 border-yellow-400 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">¿LISTO PARA RECUPERAR A {getPersonalizedPronoun().toUpperCase()}?</h3>
            <p className="text-xl text-white mb-6">
              No pierdas más tiempo con estrategias que no funcionan. El Plan A ya ha ayudado a más de 3.847 personas a reconquistar sus relaciones.
            </p>
            
            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-yellow-300 mr-2" />
                <p className="text-yellow-300 font-bold">OFERTA ESPECIAL EXPIRA EN:</p>
              </div>
              <div className="text-2xl font-bold text-white mb-3">
                <CountdownTimer minutes={15} seconds={0} />
              </div>
              <p className="text-white text-sm">
                Después de este tiempo, el precio volverá a $97 y los bonos ya no estarán disponibles.
              </p>
            </div>
            
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="mb-4"
            >
              <Button
                onClick={handlePurchase}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-6 px-8 rounded-full text-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                onTouchStart={handleTouchFeedback}
              >
                RECONQUISTAR AHORA
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
            
            <p className="text-yellow-300 text-sm">
              Acceso inmediato • Garantía de 30 días • Sistema completo + 2 bonos
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Estilos CSS específicos para mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .timeline-card {
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 100% !important;
          }
          
          .product-image {
            max-height: 200px;
            object-fit: contain;
          }
          
          .testimonial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
