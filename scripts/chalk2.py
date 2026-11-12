import numpy as np, math
from PIL import Image, ImageFilter, ImageDraw
rng=np.random.default_rng(11);W,H=1600,1100
def noise(scale):
    n=rng.random((H//scale+2,W//scale+2))
    im=Image.fromarray((n*255).astype(np.uint8)).resize((W+scale*2,H+scale*2),Image.BICUBIC).crop((scale,scale,scale+W,scale+H))
    return np.asarray(im,np.float32)/255-0.5
base=np.array([38,41,39],np.float32)
L=noise(220)*12+noise(50)*5
# eraser swipes: big arcs made of many thin parallel lines
sw=Image.new('L',(W,H),0);d=ImageDraw.Draw(sw)
for _ in range(14):
    cx,cy=rng.integers(0,W),rng.integers(0,H);r=rng.integers(200,600)
    a0=rng.uniform(0,360);span=rng.uniform(40,110);width=rng.integers(50,120)
    inten=rng.uniform(8,20)
    for k in range(0,width,2):
        v=int(inten*rng.uniform(0.3,1))
        d.arc((cx-r-k,cy-r-k,cx+r+k,cy+r+k),a0,a0+span,fill=v,width=1)
sw=sw.filter(ImageFilter.GaussianBlur(2.5))
swa=np.asarray(sw,np.float32)
# break the swipes up so they look rubbed, not painted
swa*= (noise(30)+0.6).clip(0,1.2)
dust=(rng.random((H,W))>0.996).astype(np.float32)*rng.random((H,W))*60
dust=np.asarray(Image.fromarray(dust.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)),np.float32)*1.8
lum=L+swa*1.6+dust+(rng.random((H,W))-0.5)*6
Image.fromarray((base[None,None]+lum[...,None]).clip(0,255).astype(np.uint8)).save('chalkboard.webp','WEBP',quality=75,method=6)
