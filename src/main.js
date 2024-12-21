import './style.css'
import Phaser from 'phaser'
import playerStats from './player'
import background from './assets/background.png'
import head1 from './assets/headNameless.png'
import SheepUpgrade from './assets/SheepUpgrade.png'
import oldcampmusic from './assets/GothicOldCamp.mp3'
import SaveGame from './assets/SaveGame.png'
import LoadGame from './assets/LoadGame.png'

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);

function preload ()
{
  this.load.image('background', background)
  this.load.image('head1', head1)
  this.load.image('SheepUpgrade', SheepUpgrade)
  this.load.image('SaveGame', SaveGame)
  this.load.image('LoadGame', LoadGame)

  this.load.audio('OldCampMusic', oldcampmusic)
}

//Złoto
let zlotoText

//Owca
let sheepText
let sheepCost = 100

function create ()
{
  const music = this.sound.add('OldCampMusic');
  music.play({
      loop: true, // Muzyka będzie odtwarzana w pętli
      volume: 0.1 // Poziom głośności (0.0 do 1.0)
  });

  this.add.image(0,0, 'background').setOrigin(0,0)

  const saveButton = this.add.image(13, 706, 'SaveGame').setOrigin(0,0)
  saveButton.setInteractive({cursor: 'pointer'})
  saveButton.on('pointerdown', () => {
    saveGame()
  })
  const LoadButton = this.add.image(152, 706, 'LoadGame').setOrigin(0,0)
  LoadButton.setInteractive({cursor: 'pointer'})
  

  const fileInput = document.createElement('input');
  fileInput.type = 'file'
  fileInput.accept = 'application/json'
  fileInput.style.display = 'none' // Ukryj element
  document.body.appendChild(fileInput)

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result)

          // Uaktualnij playerStats na podstawie załadowanych danych
          Object.assign(playerStats, loadedData)

          // Zaktualizuj wyświetlane wartości
          zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
          sheepText.setText(`Ilość: ${playerStats.upgrades.sheepAmount}`)
        } catch (err) {
          console.error("Błąd podczas wczytywania pliku:", err)
          alert("Nieprawidłowy format pliku JSON! Edytuj plik za pomocą notatnika i usuń z jego zawartości fragment [object Object]")
        }
      };
      reader.readAsText(file)
    }
  })

  LoadButton.on('pointerdown', () => {
    fileInput.click() // Wywołaj kliknięcie na ukrytym elemencie
  })

  const head = this.add.image(1024/2,768/2, 'head1').setScale(0.5)
  zlotoText = this.add.text(16, 16, `Złoto: ${playerStats.zloto.zloto}`, {fontSize: '32px',fontFamily: 'Times New Roman', fill: '#000'})
  head.setInteractive({cursor: 'pointer'})
  head.on('pointerdown', () => {
    playerStats.zloto.zloto+=playerStats.zloto.zlotoAchiever
    zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
  })
  setInterval(()=>{
    playerStats.zloto.zloto+=playerStats.zloto.zlotoPassive
    zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
  },1000)

  const SheepUpgradePanel = this.add.image(720, 44, 'SheepUpgrade').setOrigin(0,0)
  SheepUpgradePanel.setInteractive({cursor: 'pointer'})
  sheepText = this.add.text(728, 111, `Ilość: ${playerStats.upgrades.sheepAmount}`, {fontSize: '24px', fontFamily: 'Times New Roman', fill: '#fff'}).setOrigin(0,0)
  SheepUpgradePanel.on('pointerdown', () => {
    if(playerStats.zloto.zloto>=100){
      playerStats.upgrades.sheepAmount+=1
      playerStats.zloto.zloto = playerStats.zloto.zloto-sheepCost
      zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
      sheepText.setText(`Ilość: ${playerStats.upgrades.sheepAmount}`)
      playerStats.zloto.zlotoPassive+=1

    } else if (playerStats.zloto.zloto < 100) {
      alert('Biedaku, nawet złota nie masz!')
    }
    
    
  })
  
}

function update ()
{
}

function saveGame(){
  const dataString = JSON.stringify(playerStats, null, 2)
  const blob = new Blob([dataString, {type: "application/json"}])
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href=url
  link.download = "save2137.json"
  link.click()
  URL.revokeObjectURL(url)
}
function loadGame() {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
}
