/* global Phaser*/
var factorDificultad = (200);
var app={
  inicio: function(){
    DIAMETRO_CUP = 5;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){
var land;
var timer = 0;
var total = 0;

var b;
var campo;
var cupname=["cup1","cup2","cup3"];
var cup =[];
var mummys=[];
var z;

var max1 = 100;
var min1 = -800;
var max2 = 800;
var min2 = -800;
var aleatorio1;
var aleatorio2;
var i;

// Para zonmbies 

function releaseMummy() {

    var mummy = game.add.sprite(-(Math.random() * 800), game.world.randomY, 'mummy');

    mummy.scale.setTo(2, 2);

    //  If you prefer to work in degrees rather than radians then you can use Phaser.Sprite.angle
    //  otherwise use Phaser.Sprite.rotation
    mummy.angle = game.rnd.angle();

    mummy.animations.add('walk');
    mummy.animations.play('walk', 20, true);

    game.add.tween(mummy).to({ x: game.width + (1600 + mummy.x) }, 20000, Phaser.Easing.Linear.None, true);

    total++;
    timer = game.time.now + 100;
    
    mummy.bringToTop();
    mummys.push(mummy);
    game.physics.arcade.enable(mummys[mummys.length - 1]);
}
    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      // Cargo animación
      game.load.atlasJSONHash('bot', 'assets/running_bot.png', 'assets/running_bot.json');
      // Cargo fondo
      game.load.image('campo', 'assets/Fondo.png');
      // Cargo obstaculos
      game.stage.backgroundColor = '#f27d0c';
      game.load.image('cup1', 'assets/zombie3.png');
      game.load.image('cup2', 'assets/zombie2.png');
      game.load.image('cup3', 'assets/zombie1.png');
      // Creo el escenario
      land = game.add.tileSprite(0, 0, 800, 600, 'campo');
      land.fixedToCamera = true;
      
      //Para zombies
      game.load.spritesheet('mummy', 'assets/metalslug_mummy37x45.png', 37, 45, 18);

    }



    function create() {
        
        // Establezco el escenario
        game.world.setBounds(-1000, -1000, 1950, 1000);
        campo = game.add.sprite(-1000,-1000,'campo');
        game.physics.arcade.enable(campo);
        
        // Añado animación
        b = game.add.sprite(1000,0, 'bot');
        b.animations.add('run');
        b.animations.play('run', 15, true);

        game.physics.enable(campo, Phaser.Physics.ARCADE);
        game.physics.enable(b, Phaser.Physics.ARCADE);
        b.body.drag.set(1.2);

        b.body.collideWorldBounds = true;
        campo.bringToTop();
        b.bringToTop();
        
        
        game.camera.follow(b);

        //game.camera.deadzone = new Phaser.Rectangle(150, 150, 3, 3);
        game.camera.focusOnXY(0, 0);
        
        b.body.collideWorldBounds = true;
        b.body.onWorldBounds = new Phaser.Signal();
        
        
        var newlenght;
        var j = 0;
        for (i = 0; i < 4; i++){
            
            aleatorio1 = Math.random() * (max2 - min2) + min2;
            aleatorio2 = Math.random() * (max1 - min1) + min1;
            newlenght = cup.push(game.add.sprite(aleatorio1,aleatorio2,cupname[j]));
            game.physics.arcade.enable(cup[cup.length - 1]); 
            j=j+1;
            if(j>2){
                j=0;
            }
        }
        
        // Para zombies
        releaseMummy();
    }

    function update(){

      game.physics.arcade.overlap(b, null, this);
      puntuacion= b.body.position.x;
      //movimieno de la animacion
      
      b.body.velocity.y = (velocidadY * factorDificultad);
      b.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.velocityFromRotation(b.body.velocity);
        
      // movimiento de la camara
      land.tilePosition.x = -game.camera.x;
      land.tilePosition.y = -game.camera.y;

      // acción  de choque con obstaculo
      for (i = 0; i < 4; i++){
          game.physics.arcade.overlap(cup[i], b ,app.acaba, null, this);
      }
      
      if(b.body.position.x<-900)
      {
          total=-5;
          alert("Touchdown!!! Continua subiendo puntos");
          b.body.position.x=900
          b.y=900;
          for (i = 0; i < 4; i++){
              aleatorio1 = Math.random() * (max2 - min2) + min2;
              aleatorio2 = Math.random() * (max1 - min1) + min1;
              cup[i].body.position.x=aleatorio1;
              cup[i].body.position.y=aleatorio2;
          }
          factorDificultad=factorDificultad+200;
      }
      
      //Para zombies. 
        if (total < 1 && game.time.now > timer)
         {
             releaseMummy();
         }
         
         for (z = 0; z < mummys.length; z++){
          game.physics.arcade.overlap(mummys[z], b ,app.acaba, null, this);
         }
    }
    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);  
   
  },


// Función choca obstaculo
  acaba: function(){
      alert("Zombie noooooooooo!!!!! Última puntuación: " + (factorDificultad-200));
      document.location.reload(true);
  },
  
  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_CUP );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_CUP );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 0.01*10^-100 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}