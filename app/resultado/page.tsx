{/* VÍDEO DEPOIMENTO - POSIÇÃO ESTRATÉGICA */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
  transition={{ delay: 0.7 }}
  className="mt-12 mb-12"
>
  <div className="max-w-4xl mx-auto">
    <h3 className="text-3xl font-bold text-white text-center mb-2">VE LO QUE DICE QUIEN YA LO LOGRÓ</h3>
    <p className="text-orange-400 text-center font-semibold mb-8">
      Testimonio real de alguien que recuperó su relación en menos de 21 días
    </p>
    
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-500 overflow-hidden shadow-2xl">
      <CardContent className="p-6">
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          {/* Wistia Video Player */}
          <div 
            dangerouslySetInnerHTML={{
              __html: `<script src="https://fast.wistia.com/player.js" async></script><script src="https://fast.wistia.com/embed/oqyjs7cler.js" async type="module"></script><style>wistia-player[media-id='oqyjs7cler']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/oqyjs7cler/swatch'); display: block; filter: blur(5px); padding-top:178.33%; } wistia-player { width: 100% !important; border-radius: 8px; }</style><wistia-player media-id="oqyjs7cler" aspect="0.5607476635514018"></wistia-player>`
            }}
          />
        </div>
        
        <div className="text-center">
          <h4 className="text-xl font-bold text-orange-400 mb-2">
            "En 19 días él volvió suplicando perdón"
          </h4>
          <p className="text-gray-300 mb-4">
            - María C., reconquistó su relación después de 6 meses separada
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Play className="w-4 h-4 text-orange-400 mr-1" />
              <span>Testimonio verificado</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 text-orange-400 mr-1" />
              <span>Resultado real</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</motion.div>

{/* CTA após vídeo depoimento - Quinto CTA estratégico POTENCIALIZADO */}
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
  <p className="text-gray-400 text-sm mt-2">
    ⚡ Más de 200 personas compraron después de ver este video
  </p>
</div>
