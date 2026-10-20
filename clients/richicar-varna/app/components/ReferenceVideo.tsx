'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Expand, FastForward, Pause, Play, Rewind, SkipBack, SkipForward, Volume2, VolumeX} from 'lucide-react';

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${Math.floor(seconds % 60).toString().padStart(2,'0')}`;
/** Real local reference media, with the observed inline controls. Never simulates playback. */
export default function ReferenceVideo({src, poster, label, posterHasButton = false, ratio = '1.64',autoPlay=false}: {src: string; poster: string; label: string; posterHasButton?: boolean; ratio?: string;autoPlay?:boolean}) {
  const tx = useCopy();

  const video = useRef<HTMLVideoElement>(null), container = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [started, setStarted] = useState(autoPlay), [playing, setPlaying] = useState(false), [controls, setControls] = useState(!autoPlay);
  const [time, setTime] = useState(0), [duration, setDuration] = useState(0), [muted, setMuted] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {if (!entries[0]?.isIntersecting) element.pause();}, {threshold:0.05});
    observer.observe(element);
    if(autoPlay)void element.play().catch(()=>setError('The video could not start. Tap play to retry.'));
    return () => {observer.disconnect(); if (hideTimer.current) clearTimeout(hideTimer.current); element.pause();};
  }, [autoPlay]);
  function reveal() {setControls(true); if (hideTimer.current) clearTimeout(hideTimer.current); hideTimer.current=setTimeout(()=>setControls(false),3000);}
  async function play() {
    if (!video.current) return;
    setStarted(true);setError('');reveal();
    try {await video.current.play();} catch {setError('The video could not start. Tap play to retry.');}
  }
  function toggle() {if (video.current?.paused) void play(); else video.current?.pause();reveal();}
  function seek(value: number) {if (video.current && Number.isFinite(duration) && duration > 0) {video.current.currentTime=Math.max(0,Math.min(duration,value));setTime(video.current.currentTime);}reveal();}
  async function fullscreen() {try {if (document.fullscreenElement) await document.exitFullscreen(); else await container.current?.requestFullscreen();}catch{setError('Fullscreen is unavailable in this browser.');}}
  return <div ref={container} data-reference-video={label} style={{aspectRatio:ratio} as CSSProperties} onPointerMove={reveal} onFocus={reveal} {...stylex.props(s.container)}>
    <video ref={video} src={assetPath(src)} poster={assetPath(poster)} preload="none" playsInline aria-label={tx(label)} onLoadedMetadata={event=>setDuration(event.currentTarget.duration)} onDurationChange={event=>setDuration(event.currentTarget.duration)} onTimeUpdate={event=>setTime(event.currentTarget.currentTime)} onPlay={()=>setPlaying(true)} onPause={()=>{setPlaying(false);setControls(true);}} onEnded={()=>{setPlaying(false);setControls(true);}} onVolumeChange={event=>setMuted(event.currentTarget.muted)} onError={()=>{if(started)setError('The reference video is unavailable. Please retry.');}} onClick={toggle} {...stylex.props(s.video)} />
    {!started?<button type="button" aria-label={tx(`Watch ${label}`)} onClick={()=>void play()} {...stylex.props(s.poster)}><img src={assetPath(poster)} width={1146} height={699} alt={tx("")} {...stylex.props(s.posterImage)}/><span {...stylex.props(s.watch,posterHasButton&&s.watchCover)}>{tx("Watch video ")}<Play size={12} fill="currentColor"/></span></button>:null}
    {started ? <div aria-label={tx(`${label} video controls`)} {...stylex.props(s.controls,(controls||!playing)&&s.shown)}>
      <div {...stylex.props(s.transport)}><button type="button" aria-label={tx("Restart video")} onClick={()=>seek(0)} {...stylex.props(s.control)}><SkipBack size={23} fill="currentColor"/></button><button type="button" aria-label={tx("Rewind 10 seconds")} onClick={()=>seek(time-10)} {...stylex.props(s.control)}><Rewind size={25} fill="currentColor"/></button><button type="button" aria-label={tx(playing?'Pause video':'Play video')} onClick={toggle} {...stylex.props(s.control)}>{playing?<Pause size={23} fill="currentColor"/>:<Play size={23} fill="currentColor"/>}</button><button type="button" aria-label={tx("Forward 10 seconds")} onClick={()=>seek(time+10)} {...stylex.props(s.control)}><FastForward size={25} fill="currentColor"/></button><button type="button" aria-label={tx("Skip to end")} onClick={()=>seek(duration)} {...stylex.props(s.control)}><SkipForward size={23} fill="currentColor"/></button></div>
      <div {...stylex.props(s.timeline)}><output aria-label={tx("Elapsed video time")}>{tx(clock(time))}</output><input aria-label={tx("Video playback position")} type="range" min={0} max={Number.isFinite(duration)?duration:0} step={0.1} value={time} onChange={event=>seek(Number(event.target.value))} {...stylex.props(s.seek)}/><span>{tx(clock(Number.isFinite(duration)?duration:0))}</span><button type="button" aria-label={tx("Fullscreen video")} onClick={()=>void fullscreen()} {...stylex.props(s.smallControl)}><Expand size={15}/></button></div>
      <button type="button" aria-label={tx(muted?'Unmute video':'Mute video')} onClick={()=>{if(video.current)video.current.muted=!muted;}} {...stylex.props(s.volume)}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button>
    </div>:null}
    {error?<div role="alert" {...stylex.props(s.error)}>{tx(error)}<button type="button" onClick={()=>void play()} {...stylex.props(s.retry)}>{tx("Retry")}</button></div>:null}
  </div>;
}
const s=stylex.create({
  container:{position:'relative',width:'100%',overflow:'hidden',backgroundColor:'#000'},
  video:{display:'block',width:'100%',height:'100%',objectFit:'contain'},
  poster:{position:'absolute',inset:0,display:'grid',placeItems:'center',width:'100%',height:'100%',padding:0,borderWidth:0,backgroundColor:'#f6f6f6',cursor:'pointer'},
  posterImage:{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'},
  watch:{position:'relative',display:'inline-flex',alignItems:'center',gap:6,padding:'8px 12px',color:'#202024',fontSize:12,fontWeight:600,lineHeight:'18px',borderRadius:4,backgroundColor:'#fff'},
  // Cover the old blue label baked into captured posters with the themed control.
  watchCover:{justifyContent:'center',minWidth:'28%',minHeight:'14%',fontSize:'clamp(12px,1.25vw,18px)'},
  controls:{position:'absolute',left:0,right:0,bottom:0,zIndex:2,padding:'16px 0 7px',color:'#fff',opacity:0,pointerEvents:'none',backgroundImage:'linear-gradient(transparent,rgba(0,0,0,.55))',transitionProperty:'opacity',transitionDuration:'150ms'},
  shown:{opacity:1,pointerEvents:'auto'},
  transport:{display:'flex',justifyContent:'space-around',alignItems:'center',height:35,paddingInline:17},
  control:{display:'grid',placeItems:'center',width:36,height:35,padding:0,color:'#fff',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  timeline:{display:'flex',alignItems:'center',gap:8,height:26,fontSize:12,lineHeight:'18px'},
  seek:{flex:'1 1 0',minWidth:0,height:3,margin:0,accentColor:'#fff',cursor:'pointer'},
  smallControl:{display:'grid',placeItems:'center',width:19,height:24,padding:0,color:'#fff',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  volume:{position:'absolute',top:0,right:7,display:'grid',placeItems:'center',width:26,height:26,padding:0,color:'#fff',borderWidth:0,borderRadius:'50%',backgroundColor:'rgba(0,0,0,.4)',cursor:'pointer'},
  error:{position:'absolute',inset:0,display:'grid',placeContent:'center',gap:12,padding:18,color:'#fff',fontSize:13,lineHeight:'20px',textAlign:'center',backgroundColor:'rgba(0,0,0,.8)'},
  retry:{justifySelf:'center',padding:'7px 14px',color:'#202024',fontSize:13,fontWeight:600,borderWidth:0,borderRadius:5,backgroundColor:'#fff',cursor:'pointer'},
});
