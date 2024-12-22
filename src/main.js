import './style.css'
import Phaser from 'phaser'
import playerStats from './player'
import background from './assets/background.png'
import head1 from './assets/headNameless.png'
import SheepUpgrade from './assets/SheepUpgrade.png'
import oldcampmusic from './assets/GothicOldCamp.mp3'
import SaveGame from './assets/SaveGame.png'
import LoadGame from './assets/LoadGame.png'
import strengthPanel from './assets/Strength.png'
import dexterityPanel from './assets/Dexterity.png'
import RyzCollector from './assets/RyzCollectorPanel.png'
import Slavery from './assets/SubjectSlavery.png'
import NoMoney from './assets/brakZlota.mp3'
import levelUp from './assets/levelUp.mp3'

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
  this.load.image('StrengthPanel', strengthPanel)
  this.load.image('DexterityPanel', dexterityPanel)
  this.load.image('RyzCollectorPanel', RyzCollector)
  this.load.image('SlaveryPanel', Slavery)

  this.load.audio('OldCampMusic', oldcampmusic)
  this.load.audio('NoMoney', NoMoney)
  this.load.audio('levelUp', levelUp)
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

  let levelText = this.add.text(16,53, `Poziom: ${playerStats.stats.level}`, {fill: '#000', fontSize: '32px', fontFamily: 'Times New Roman'})
  let expText = this.add.text(207,53, `Exp: ${playerStats.stats.expAct}/${playerStats.stats.expNeed}`, {fill: '#000', fontSize: '32px', fontFamily: 'Times New Roman'})
  let PNText = this.add.text(16,90, `PN: ${playerStats.stats.PN}`, {fill: '#000', fontSize: '32px', fontFamily: 'Times New Roman'})
  let STRText = this.add.text(16,124, `Siła: ${playerStats.stats.str}`, {fill: '#000', fontSize: '32px', fontFamily: 'Times New Roman'})
  let DEXText = this.add.text(16,161, `Zręczność: ${playerStats.stats.dex}`, {fill: '#000', fontSize: '32px', fontFamily: 'Times New Roman'})

  //Zapis i wczytanie gry//
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
          STRText.setText(`Siła: ${playerStats.stats.str}`)
          DEXText.setText(`Zręczność: ${playerStats.stats.dex}`)
          RyzCollectorText.setText(`Ilość: ${playerStats.upgrades.ryzCollectorAmount}`)
          SlaveryText.setText(`Ilość: ${playerStats.upgrades.slaversAmount}`)
          
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
  //Zapis i wczytanie gry

  //Głowa do klikania//
  const head = this.add.image(1024/2,768/2, 'head1').setScale(0.5)
  zlotoText = this.add.text(16, 16, `Złoto: ${playerStats.zloto.zloto}`, {fontSize: '32px',fontFamily: 'Times New Roman', fill: '#000'})
  head.setInteractive({cursor: 'pointer'})
  head.on('pointerdown', () => {
    playerStats.zloto.zloto+=playerStats.zloto.zlotoAchiever
    zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
    playerStats.stats.expAct+=1
    expText.setText(`Exp: ${playerStats.stats.expAct}/${playerStats.stats.expNeed}`)
    
  })
  //Głowa do klikania//
  //Odświeżanie przychodu i expa//
  setInterval(()=>{
    playerStats.zloto.zloto+=playerStats.zloto.zlotoPassive
    zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
    playerStats.stats.expAct+=playerStats.expPassive
    expText.setText(`Exp: ${playerStats.stats.expAct}/${playerStats.stats.expNeed}`)

    if(playerStats.stats.expAct >= playerStats.stats.expNeed){
      playerStats.stats.level+=1
      playerStats.stats.expAct=playerStats.stats.expAct-playerStats.stats.expNeed
      playerStats.stats.expNeed+=500
      playerStats.stats.PN+=1
      levelText.setText(`Poziom: ${playerStats.stats.level}`)
      expText.setText(`Exp: ${playerStats.stats.expAct}/${playerStats.stats.expNeed}`)
      PNText.setText(`PN: ${playerStats.stats.PN}`)
      const levelUpSound = this.sound.add('levelUp');
      levelUpSound.play({
        loop: false, // Muzyka będzie odtwarzana w pętli
        volume: 0.2 // Poziom głośności (0.0 do 1.0)
      }); 
    }

    //Console.log'i//
      //console.log(playerStats.incomeTime)
    //Console.log'i//
  },playerStats.incomeTime)
  //Odświeżanie przychodu i expa//


  //Siła//
  const Strength = this.add.image(16, 274, 'StrengthPanel').setOrigin(0,0)
  Strength.setInteractive({cursor: 'pointer'})
  Strength.on('pointerdown', () => {
    if(playerStats.stats.PN>=1){
      playerStats.stats.str+=1
      playerStats.zloto.zlotoAchiever+=1
      playerStats.stats.PN-=1
      PNText.setText(`PN: ${playerStats.stats.PN}`)
      STRText.setText(`Siła: ${playerStats.stats.str}`)
    } else if (playerStats.stats.PN<1) {
      alert('Brak ci doświadczenia!!')
    }
  })
  //Siła//

  //Zręczność//
  const Dexterity = this.add.image(16, 390, 'DexterityPanel').setOrigin(0,0)
  Dexterity.setInteractive({cursor: 'pointer'})
  Dexterity.on('pointerdown', () => {
    if(playerStats.stats.PN>=1){
      playerStats.stats.dex+=1
      playerStats.incomeTime=playerStats.incomeTime*0.95
      playerStats.stats.PN-=1
      PNText.setText(`PN: ${playerStats.stats.PN}`)
      DEXText.setText(`Zręczność: ${playerStats.stats.dex}`)
    } else if (playerStats.stats.PN<1) {
      alert('Brak ci doświadczenia!!')
    }
  })
  //Zręczność//

  //Panel owcy//
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
      playerStats.expPassive+=1

    } else if (playerStats.zloto.zloto < 100) {
        const NoMoneySound = this.sound.add('NoMoney');
        NoMoneySound.play({
           loop: false, // Muzyka będzie odtwarzana w pętli
           volume: 0.5 // Poziom głośności (0.0 do 1.0)
        });
        alert('Biedaku, nawet złota nie masz!')
    }
  })
  //Panel owcy//
  //Panel Ryzu//
  const RyzCollectorPanel = this.add.image(720,160,'RyzCollectorPanel').setOrigin(0,0)
  let RyzCollectorText = this.add.text(728, 226, `Ilość: ${playerStats.upgrades.ryzCollectorAmount}`, {fontSize: '24px', fontFamily: 'Times New Roman', fill: '#fff'}).setOrigin(0,0)
  let RyzCost = 1000
  RyzCollectorPanel.setInteractive({cursor: 'pointer'})

  RyzCollectorPanel.on('pointerdown', () => {
    if(playerStats.zloto.zloto>=1000){
        playerStats.upgrades.ryzCollectorAmount+=1
        playerStats.zloto.zloto = playerStats.zloto.zloto-RyzCost
        zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
        RyzCollectorText.setText(`Ilość: ${playerStats.upgrades.ryzCollectorAmount}`)
        playerStats.zloto.zlotoPassive+=5
        playerStats.expPassive+=5

    } else if (playerStats.zloto.zloto < 1000) {
        const NoMoneySound = this.sound.add('NoMoney');
        NoMoneySound.play({
            loop: false, // Muzyka będzie odtwarzana w pętli
            volume: 0.5 // Poziom głośności (0.0 do 1.0)
        });
        alert('Biedaku, nawet złota nie masz!')
      }
  })
  //Panel Ryzu//
  //Dzisiejszy temat - niewolnictwo//
  const SlaveryPanel = this.add.image(720,276, 'SlaveryPanel').setOrigin(0,0)
  let SlaveryText = this.add.text(728, 342, `Ilość: ${playerStats.upgrades.slaversAmount}`, {fontSize: '24px', fontFamily: 'Times New Roman', fill: '#fff'}).setOrigin(0,0)
  let slaverCost = 1500
  SlaveryPanel.setInteractive({cursor: 'pointer'})

  SlaveryPanel.on('pointerdown', ()=>{
    if(playerStats.zloto.zloto>=1500){
      playerStats.upgrades.slaversAmount+=1
      playerStats.zloto.zloto = playerStats.zloto.zloto-slaverCost
      zlotoText.setText(`Złoto: ${playerStats.zloto.zloto}`)
      SlaveryText.setText(`Ilość: ${playerStats.upgrades.slaversAmount}`)
      playerStats.zloto.zlotoPassive+=7.5
      playerStats.expPassive+=7.5

    } else if (playerStats.zloto.zloto < 1500) {
        const NoMoneySound = this.sound.add('NoMoney');
        NoMoneySound.play({
           loop: false, // Muzyka będzie odtwarzana w pętli
           volume: 0.5 // Poziom głośności (0.0 do 1.0)
        });
      alert('Biedaku, nawet złota nie masz!')
    }
  })
  //Dzisiejszy temat - niewolnictwo//
  
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
