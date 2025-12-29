import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface RainDrop {
  imgNumber: number;
  left: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  showRain = false;
  rainDrops: RainDrop[] = [];
  audio: HTMLAudioElement | null = null;
  isMusicPlaying = false;
  musicLoaded = false;
  showWelcome = true;
  contentStarted = false;
  
  // Secciones
  currentSection: 'main' | 'yes' | 'no' = 'main';
  noClickCount = 0;
  noButtonScale = 1;
  yesButtonScale = 1;
  
  // Control de textos en sección "Sí"
  showFirstText = true;
  showSecondText = false;
  isTextFading = false;
  
  // Pool de imágenes para evitar repeticiones
  imagePool: number[] = [];
  usedImages: number[] = [];
  
  // Control de lluvia continua
  rainInterval: any = null;
  
  // Control de posiciones para evitar amontonamiento
  usedPositions: number[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('App initialized');
    console.log('Platform is browser:', isPlatformBrowser(this.platformId));
    
    // Inicializar pool de imágenes
    this.initializeImagePool();
    
    // Solo preparar audio si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      console.log('✅ Estamos en navegador, preparando audio');
      this.prepareAudio();
    } else {
      console.log('⚠️ Estamos en servidor (SSR), esperando al navegador');
    }
  }

  initializeImagePool(): void {
    const totalImages = 145;
    const missingImages = [111]; // Solo falta la imagen 111
    
    // Crear pool con todas las imágenes disponibles
    this.imagePool = [];
    for (let i = 1; i <= totalImages; i++) {
      if (!missingImages.includes(i)) {
        this.imagePool.push(i);
      }
    }
    
    // Mezclar el pool
    this.imagePool = this.imagePool.sort(() => Math.random() - 0.5);
    console.log('✅ Image pool initialized with', this.imagePool.length, 'images (1-145, missing 111)');
  }

  useSpecialImages(): void {
    // SOLO usar imágenes 143-159 para la sección "Sí"
    // Crear array con imágenes del 143 al 159
    const specialImages: number[] = [];
    for (let i = 143; i <= 159; i++) {
      specialImages.push(i);
    }
    
    // Mezclar aleatoriamente
    this.imagePool = specialImages.sort(() => Math.random() - 0.5);
    this.usedImages = [];
    
    console.log('✅ Lluvia limitada a imágenes especiales: 143-159 (', this.imagePool.length, 'imágenes)');
  }

  getNextImages(count: number): number[] {
    const selectedImages: number[] = [];
    
    for (let i = 0; i < count; i++) {
      // Si el pool está vacío, reinicializarlo con las imágenes usadas
      if (this.imagePool.length === 0) {
        console.log('🔄 Pool vacío, reinicializando con', this.usedImages.length, 'imágenes usadas');
        this.imagePool = [...this.usedImages];
        this.imagePool = this.imagePool.sort(() => Math.random() - 0.5);
        this.usedImages = [];
        console.log('✅ Pool reiniciado con', this.imagePool.length, 'imágenes');
      }
      
      // Tomar la primera imagen del pool
      const imgNumber = this.imagePool.shift()!;
      selectedImages.push(imgNumber);
      this.usedImages.push(imgNumber);
    }
    
    console.log('Selected images:', selectedImages, '| Pool restante:', this.imagePool.length, '| Usadas:', this.usedImages.length);
    
    return selectedImages;
  }

  startContent(): void {
    console.log('Starting content...');
    this.showWelcome = false;
    this.contentStarted = true;
    
    // Iniciar lluvia cuando el usuario acepta ver el contenido
    if (isPlatformBrowser(this.platformId)) {
      this.showRain = true;
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        this.createRainDrops();
        console.log('Rain started');
      }, 100);
    }
    
    // Iniciar música después
    if (this.audio && isPlatformBrowser(this.platformId)) {
      this.audio.play().then(() => {
        this.isMusicPlaying = true;
        console.log('Music started');
      }).catch(error => {
        console.log('Error playing music:', error);
      });
    }
  }

  cancelContent(): void {
    console.log('Content cancelled');
    this.showWelcome = false;
    // Puedes redirigir o mostrar otro mensaje
  }

  prepareAudio(): void {
    // Crear elemento de audio pero no reproducir
    this.audio = new Audio('assets/audio/Ending Saint Seiya The Lost Canvas  Cadena de Flores - Carolina Ayala (Letra).mp3');
    this.audio.loop = true;
    this.audio.volume = 0.075; // 7.5% de volumen (25% menos que 0.10)
    
    this.audio.addEventListener('loadeddata', () => {
      this.musicLoaded = true;
      console.log('Música cargada correctamente');
    });
    
    this.audio.addEventListener('error', () => {
      console.log('Error al cargar la música');
    });
  }

  toggleMusic(): void {
    if (!this.audio) {
      console.log('No audio available');
      return;
    }
    
    if (this.isMusicPlaying) {
      this.audio.pause();
      this.isMusicPlaying = false;
      console.log('Music paused - no other changes');
    } else {
      this.audio.play().then(() => {
        this.isMusicPlaying = true;
        console.log('Music playing - no other changes');
      }).catch(error => {
        console.log('Error playing music:', error);
      });
    }
    
    // NO cambiar ninguna otra variable
    // NO afectar showFirstText, showSecondText, currentSection, etc.
  }

  onMainAnswer(answer: boolean): void {
    console.log('Respuesta principal:', answer ? 'Sí' : 'No');
    console.log('noClickCount antes:', this.noClickCount);
    
    if (answer) {
      // Ir a la sección "Sí"
      this.currentSection = 'yes';
      this.showFirstText = true;
      this.showSecondText = false;
      this.isTextFading = false;
      
      console.log('Cambiando a sección Sí, cambiando música...');
      
      // Cambiar música PRIMERO
      if (isPlatformBrowser(this.platformId)) {
        this.changeMusic('yes');
      }
      
      // Usar imágenes especiales (143-145) para esta sección
      this.useSpecialImages();
      
      console.log('✅ Lluvia continúa con imágenes especiales');
      
      // Después de 30 segundos, disolver el primer texto y mostrar el segundo
      console.log('⏰ Configurando timeout de 30 segundos para cambiar texto...');
      setTimeout(() => {
        console.log('=== INICIANDO DISOLUCIÓN DEL PRIMER TEXTO ===');
        
        // Activar animación de disolución
        this.isTextFading = true;
        this.cdr.detectChanges();
        
        // Después de la animación de disolución (1 segundo), cambiar al segundo texto
        setTimeout(() => {
          this.showFirstText = false;
          this.showSecondText = true;
          this.isTextFading = false;
          this.cdr.detectChanges();
          console.log('=== SEGUNDO TEXTO MOSTRADO ===');
        }, 1000);
        
      }, 30000); // 30 segundos
    } else {
      // Ir a la sección "No"
      this.noClickCount++;
      console.log('noClickCount después:', this.noClickCount);
      console.log('Mensaje:', this.getNoMessage());
      
      // Hacer crecer el botón Sí y achicar el No
      this.yesButtonScale = 1 + (this.noClickCount * 0.3);
      this.noButtonScale = Math.max(0.3, 1 - (this.noClickCount * 0.15));
      
      console.log('yesButtonScale:', this.yesButtonScale);
      console.log('noButtonScale:', this.noButtonScale);
      
      // Cambiar a sección "No"
      this.currentSection = 'no';
    }
  }

  tryAgainFromNo(): void {
    // Volver a la pregunta principal
    this.currentSection = 'main';
    this.noClickCount = 0;
    this.yesButtonScale = 1;
    this.noButtonScale = 1;
  }

  changeMusic(section: 'yes' | 'no'): void {
    console.log('changeMusic called with section:', section);
    
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not in browser, skipping music change');
      return;
    }
    
    if (!this.audio) {
      console.log('Audio not initialized');
      return;
    }
    
    // Detener música actual
    this.audio.pause();
    this.isMusicPlaying = false;
    console.log('Current music paused');
    
    // Cambiar a nueva música
    const musicPath = section === 'yes' 
      ? 'assets/audio/desicion de si ‐ Hecho con Clipchamp.m4a' 
      : 'assets/audio/Ending Saint Seiya The Lost Canvas  Cadena de Flores - Carolina Ayala (Letra).mp3';
    
    console.log('Changing to music:', musicPath);
    
    this.audio.src = musicPath;
    this.audio.volume = 0.15; // 15% de volumen
    this.audio.loop = true; // Asegurar que haga loop
    this.audio.load();
    
    // Reproducir nueva música
    this.audio.play().then(() => {
      this.isMusicPlaying = true;
      console.log('New music playing successfully:', musicPath);
    }).catch(error => {
      console.error('Error playing new music:', error);
    });
  }

  getNoMessage(): string {
    const messages = [
      '¿Cómo que no te acuerdas? 🤔',
      'Mala persona, ¿cómo es que lo olvidaste? 😢',
      'Pero si pasó hace poco... 😔',
      '¿De verdad no recuerdas nada? 💔',
      'Eso me duele mucho... 😞',
      'Por favor, piénsalo mejor... 🥺',
      'Ya no hay opción de "No"... solo "Sí" ❤️'
    ];
    
    const index = Math.min(this.noClickCount - 1, messages.length - 1);
    return messages[index];
  }

  shouldShowNoButton(): boolean {
    return this.noClickCount < 6;
  }

  createRainDrops(): void {
    // Este método ahora solo inicia la lluvia continua
    this.startContinuousRain();
  }

  startContinuousRain(): void {
    // Limpiar intervalo anterior
    if (this.rainInterval) {
      clearInterval(this.rainInterval);
      this.rainInterval = null;
    }
    
    console.log('🌧️ Iniciando lluvia de imágenes');
    
    // Agregar imágenes iniciales escalonadas
    this.addSingleRainDrop();
    setTimeout(() => this.addSingleRainDrop(), 1000);
    setTimeout(() => this.addSingleRainDrop(), 2000);
    setTimeout(() => this.addSingleRainDrop(), 3000);
    
    // Agregar una imagen cada 2 segundos constantemente
    this.rainInterval = setInterval(() => {
      this.addSingleRainDrop();
    }, 2000);
    
    console.log('✅ Lluvia iniciada - una imagen cada 2 segundos');
  }

  stopContinuousRain(): void {
    if (this.rainInterval) {
      clearInterval(this.rainInterval);
      this.rainInterval = null;
      console.log('🛑 Lluvia continua detenida');
    }
  }

  ngOnDestroy(): void {
    // Limpiar intervalo cuando se destruye el componente
    this.stopContinuousRain();
  }

  addSingleRainDrop(): void {
    // Obtener siguiente imagen del pool
    const selectedImages = this.getNextImages(1);
    const imgNumber = selectedImages[0];

    // Tamaño según dispositivo
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    
    let size;
    if (isMobile) {
      size = 80 + Math.random() * 40; // 80-120px en móvil
    } else if (isTablet) {
      size = 110 + Math.random() * 50; // 110-160px en tablet
    } else {
      size = 140 + Math.random() * 60; // 140-200px en PC
    }

    // Posición horizontal aleatoria (5% - 85%)
    const leftPosition = 5 + Math.random() * 80;

    // Duración según dispositivo (más rápido en móvil)
    const duration = isMobile ? 6 : 8;

    const newDrop: RainDrop = {
      imgNumber: imgNumber,
      left: leftPosition,
      width: size,
      height: size,
      duration: duration,
      delay: 0
    };

    this.rainDrops.push(newDrop);
    this.cdr.detectChanges();
    
    console.log(`✓ Imagen ${imgNumber} agregada | Total: ${this.rainDrops.length}`);
    
    // Remover después de que termine la animación
    setTimeout(() => {
      const index = this.rainDrops.indexOf(newDrop);
      if (index > -1) {
        this.rainDrops.splice(index, 1);
        this.cdr.detectChanges();
      }
    }, (duration + 1) * 1000);
  }

  trackByDrop(index: number, drop: RainDrop): number {
    return drop.imgNumber * 1000 + drop.left;
  }

  onAnswer(answer: boolean): void {
    console.log('Respuesta:', answer ? 'Sí' : 'No');
    // Método antiguo - ya no se usa
  }
}
