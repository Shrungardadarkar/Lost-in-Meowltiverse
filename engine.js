export const W = 420, H = 760;
export const BIOMES = [
  { name: 'CHROME ROOT', color: '#b8f8d8', accent: '#c39cff', bg: '#1b1430', story: 'A golden pawprint. He was here.' },
  { name: 'TIDE CATHEDRAL', color: '#7ce7ed', accent: '#fa9bd1', bg: '#102b38', story: 'A familiar bark echoes through the water.' },
  { name: 'CLOCKWORK BLOOM', color: '#f5d08e', accent: '#fb9dae', bg: '#302038', story: 'His favorite ball, caught between seconds.' }
];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function random(seed) { let s=seed>>>0; return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;}; }
export class Game {
  constructor(onEvent = ()=>{}) { this.onEvent=onEvent; this.reset(); }
  emit(type, text, value) { this.onEvent({type,text,value}); }
  reset() {
    this.state='ready';this.camera=0;this.maxHeight=0;this.lives=7;this.score=0;this.freed=0;
    this.checkpoint=0;this.cycle=0;this.biome=0;this.time=0;this.room=null;this.seen=new Set();
    this.input=[false,false];this.flips=[0,0];this.strikeLock=0;this.particles=[];this.shake=0;
    this.objects=[];this.generated=0;this.generate(6000);this.ball={x:210,y:145,vx:0,vy:0,r:13,trail:[]};
  }
  start() { this.state='playing';this.launch();this.emit('story','Find the golden pawprints. Your friend is up there.'); }
  launch() { this.ball={x:210,y:this.camera+146,vx:this.time%2>1?-65:65,vy:670,r:13,trail:[]};this.strikeLock=.3; }
  generate(top) {
    while(this.generated<top) {
      const i=this.generated/250, y=this.generated+320, r=random(i+17+this.cycle*71);
      const x=90+r()*240;
      this.objects.push({type:'bumper',x,y,r:23+r()*8,cool:0,variant:i%3});
      if(i%2===0)this.objects.push({type:'rail',x:i%4===0?45:300,y:y+100,w:75,slant:i%4===0?1:-1,cool:0});
      for(let j=0;j<3;j++)this.objects.push({type:'star',x:clamp(x+(j-1)*34,35,385),y:y+70+j*16,r:9});
      if(i%6===2)this.objects.push({type:'portal',x:i%12===2?82:338,y:y+105,r:34,kind:i%12===2?'tide':'time',cool:0});
      if(i%6===4)this.objects.push({type:'cat',x:210+(r()-.5)*200,y:y+65,r:25,hits:0,cool:0});
      if(i%6===3)this.objects.push({type:'break',x:140,y:y+85,w:140,r:10,cool:0});
      if(i%6===5)this.objects.push({type:'bell',x:210,y:y+40,r:12});
      this.generated+=250;
    }
  }
  gainLife(reason) { if(this.lives<7){this.lives++;this.emit('bell',reason+' · +1 collar bell');}else{this.score+=100;this.emit('bell','Seven bells full · +100 stardust');} }
  addScore(n) { const before=Math.floor(this.score/1500);this.score+=n;if(Math.floor(this.score/1500)>before)this.gainLife('A lucky constellation'); }
  burst(x,y,color,n=14) { for(let i=0;i<n;i++){const a=i/n*Math.PI*2;this.particles.push({x,y,vx:Math.cos(a)*(40+Math.random()*100),vy:Math.sin(a)*120,life:1,color});} }
  enterRoom(portal) {
    if(this.room)return;
    portal.used=true;
    this.room={kind:portal.kind,returnY:this.ball.y+120,camera:this.camera,objects:this.objects,elapsed:0,collected:0};
    this.objects=[];
    for(let i=0;i<5;i++){const x=i%2?300:120;this.objects.push({type:'bumper',x,y:260+i*160,r:27,cool:0});this.objects.push({type:'star',x:420-x,y:300+i*160,r:12});}
    this.objects.push({type:'exit',x:210,y:1050,r:38});
    this.camera=0;this.launch();this.seen.add(portal.kind);
    this.emit('portal',portal.kind==='tide'?'LIQUID MOON · low gravity + flowing currents':'THE HOURS BETWEEN · time moves at half speed');
  }
  exitRoom() {
    const room=this.room;if(!room)return;
    this.objects=room.objects;this.camera=Math.max(room.camera,room.returnY-420);this.room=null;
    this.ball={x:210,y:room.returnY,vx:0,vy:600,r:13,trail:[]};
    if(room.collected>=3)this.gainLife('The room left you a gift');
    this.addScore(250);this.emit('story','Another world discovered. The trail continues.');
  }
  loseLife() {
    if(this.room){this.objects=this.room.objects;this.camera=this.room.camera;this.room=null;}
    this.lives--;this.shake=12;
    if(this.lives<=0){this.lives=0;this.state='gameover';this.emit('gameover','Even little spirits need a second chance.');return;}
    this.launch();this.emit('lost','One bell fades. Your ascent is safe.');
  }
  continueCheckpoint() {this.lives=7;this.camera=Math.max(0,this.checkpoint-220);this.maxHeight=this.checkpoint;this.biome=Math.floor(this.checkpoint/1500)%3;this.state='playing';this.launch();}
  continueEndless() {this.cycle++;this.state='playing';this.generate(this.maxHeight+6000);this.launch();this.emit('story','Universe '+(this.cycle+1)+' · That bark is still a little further.');}
  flipper(side) {
    const f=this.flips[side],angle=-.36+f*.88,sign=side===0?1:-1;
    const x=side===0?105:315,y=this.camera+106;
    return {x,y,ex:x+sign*Math.cos(angle)*80,ey:y+Math.sin(angle)*80};
  }
  step(dt) {
    if(this.state!=='playing')return;
    this.time+=dt;this.shake*=.9;this.strikeLock=Math.max(0,this.strikeLock-dt);
    for(let i=0;i<2;i++)this.flips[i]+=((this.input[i]?1:0)-this.flips[i])*Math.min(1,dt*24);
    const b=this.ball;
    if(this.room){this.room.elapsed+=dt;if(this.room.elapsed>30){this.exitRoom();return;}}
    const speed=this.room?.kind==='time'?.58:1;
    const h=dt*speed;
    b.vy-=(this.room?.kind==='tide'?370:620)*h;
    if(this.room?.kind==='tide')b.vx+=Math.sin(this.time*1.5+b.y/170)*170*h;
    b.vx*=Math.pow(.998,h*120);b.vx=clamp(b.vx,-440,440);b.vy=clamp(b.vy,-1000,1050);
    b.x+=b.vx*h;b.y+=b.vy*h;
    if(b.x<b.r+18){b.x=b.r+18;b.vx=Math.abs(b.vx)*.83;}
    if(b.x>W-b.r-18){b.x=W-b.r-18;b.vx=-Math.abs(b.vx)*.83;}
    for(let i=0;i<2;i++) {
      const f=this.flipper(i),dx=f.ex-f.x,dy=f.ey-f.y;
      const t=clamp(((b.x-f.x)*dx+(b.y-f.y)*dy)/(dx*dx+dy*dy),0,1);
      const px=f.x+t*dx,py=f.y+t*dy,dist=Math.hypot(b.x-px,b.y-py);
      if(dist<b.r+9&&b.y>py-10&&b.vy<200&&this.strikeLock===0) {
        b.y=py+b.r+10;b.vy=this.input[i]?900:20;
        b.vx=(i===0?1:-1)*(this.input[i]?(100+t*235):65);this.strikeLock=.13;
        this.emit('flip');this.burst(b.x,b.y,BIOMES[this.biome].color,7);
      }
    }
    for(const o of this.objects) {
      o.cool=Math.max(0,(o.cool||0)-dt);
      if(o.dead||o.used||Math.abs(o.y-b.y)>130)continue;
      let x=o.x;
      if(o.type==='cat')x+=Math.sin(this.time*1.3+o.y)*28;
      const dx=b.x-x,dy=b.y-o.y,dist=Math.hypot(dx,dy);
      if(o.type==='rail'||o.type==='break'){
        const end=o.x+o.w;
        const surface=o.y+(o.type==='rail'?(b.x-o.x)*o.slant*.28:0);
        if(b.x>o.x-8&&b.x<end+8&&Math.abs(b.y-surface)<b.r+9&&o.cool===0){
          if(o.type==='break'){o.dead=true;this.addScore(75);this.burst(b.x,o.y,'#e4b4ff',18);b.vy=650;this.emit('hit');}
          else{b.y=surface+b.r+10;b.vy=790;b.vx=o.slant*190;o.cool=.25;this.emit('hit');}
        }
      } else if(dist<b.r+o.r) {
        if(o.type==='star'){o.dead=true;this.addScore(35);if(this.room)this.room.collected++;this.burst(x,o.y,'#f7d68b',6);this.emit('collect');}
        if(o.type==='bell'){o.dead=true;this.gainLife('A hidden gift');this.burst(x,o.y,'#f7d68b');}
        if(o.type==='portal'){this.enterRoom(o);return;}
        if(o.type==='exit'){this.exitRoom();return;}
        if((o.type==='bumper'||o.type==='cat')&&o.cool===0){
          const nx=dx/(dist||1),ny=dy/(dist||1);
          b.x=x+nx*(b.r+o.r+1);b.y=o.y+ny*(b.r+o.r+1);
          b.vx=nx*290+(b.x<210?50:-50);b.vy=Math.max(580,b.vy*.4+380);o.cool=.22;
          this.addScore(20);this.burst(x,o.y,BIOMES[this.biome].color);this.emit('hit');this.shake=3;
          if(o.type==='cat'){o.hits++;if(o.hits>=2){o.dead=true;this.freed++;this.addScore(200);this.emit('spirit','A cat spirit is free. “I heard him, beyond the summit.”');this.burst(x,o.y,'#b8f8d8',30);}}
        }
      }
    }
    this.camera+=(Math.max(this.camera,b.y-470)-this.camera)*Math.min(1,dt*6);
    if(!this.room){
      this.maxHeight=Math.max(this.maxHeight,b.y-146);
      const zone=Math.floor(this.maxHeight/1500);
      if(zone>Math.floor(this.checkpoint/1500)){this.checkpoint=zone*1500;this.biome=zone%3;this.emit('checkpoint',BIOMES[this.biome].story+' · Checkpoint reached');}
      if(this.maxHeight>=(this.cycle+1)*4500){this.state='summit';this.emit('summit');}
      this.generate(this.camera+1800);
    }
    if(b.y<this.camera-45)this.loseLife();
    b.trail.unshift({x:b.x,y:b.y});if(b.trail.length>22)b.trail.pop();
    for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1.6;}this.particles=this.particles.filter(p=>p.life>0);
  }
}
