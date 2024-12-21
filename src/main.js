import './style.css'
import Phaser from 'phaser'
import playerStats from './player'
import background from './assets/background.png'
import head1 from './assets/headNameless.png'
import SheepUpgrade from './assets/SheepUpgrade.png'
import oldcampmusic from './assets/GothicOldCamp.mp3'

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
  this.load.image('rectangle')
  this.load.image('SheepUpgrade', SheepUpgrade)

  this.load.audio('OldCampMusic', oldcampmusic)
}

//Złoto
let zloto = 0
let zlotoAchiever = 1
let zlotoPassive = 0
let zlotoText

//Owca
let sheepText
let sheepAmount = 0
let sheepCost = 100

function create ()
{
  const music = this.sound.add('OldCampMusic');
  music.play({
      loop: true, // Muzyka będzie odtwarzana w pętli
      volume: 0.1 // Poziom głośności (0.0 do 1.0)
  });

  this.add.image(0,0, 'background').setOrigin(0,0)

  const head = this.add.image(1024/2,768/2, 'head1').setScale(0.5)
  zlotoText = this.add.text(16, 16, `Złoto: ${zloto}`, {fontSize: '32px',fontFamily: 'Times New Roman', fill: '#000'})
  head.setInteractive({cursor: 'pointer'})
  head.on('pointerdown', () => {
    zloto+=zlotoAchiever
    zlotoText.setText(`Złoto: ${zloto}`)
  })
  setInterval(()=>{
    zloto+=zlotoPassive
    zlotoText.setText(`Złoto: ${zloto}`)
  },1000)

  const SheepUpgradePanel = this.add.image(720, 44, 'SheepUpgrade').setOrigin(0,0)
  SheepUpgradePanel.setInteractive({cursor: 'pointer'})
  sheepText = this.add.text(728, 111, `Ilość: ${sheepAmount}`, {fontSize: '24px', fontFamily: 'Times New Roman', fill: '#fff'}).setOrigin(0,0)
  SheepUpgradePanel.on('pointerdown', () => {
    if(zloto>=100){
      sheepAmount+=1
      zloto = zloto-sheepCost
      zlotoText.setText(`Złoto: ${zloto}`)
      sheepText.setText(`Ilość: ${sheepAmount}`)
      zlotoPassive+=1

    } else if (zloto < 100) {
      alert('Biedaku, nawet złota nie masz!')
    }
    
    
  })
  
}

function update ()
{
}
