import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
W,H=1600,1100
def noise(scale,w=W,h=H):
    n=rng.random((h//scale+2,w//scale+2)).astype(np.float32)
    im=Image.fromarray((n*255).astype(np.uint8)).resize((w+scale*2,h+scale*2),Image.BICUBIC).crop((scale,scale,scale+w,scale+h))
    return np.asarray(im,np.float32)/255-0.5
def blur(a,r):
    im=Image.fromarray(((a+0.5).clip(0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im,np.float32)/255-0.5
def save(rgb,name):
    Image.fromarray(rgb.clip(0,255).astype(np.uint8)).save(name,'WEBP',quality=72,method=6)

# Chalkboard: smudges + dust
base=np.array([40,43,41],np.float32)
L=noise(200)*10+noise(60)*6+noise(12)*3
sm=np.zeros((H,W),np.float32)
from PIL import ImageDraw
smi=Image.new('L',(W,H),0);d=ImageDraw.Draw(smi)
for _ in range(26):
    x,y=rng.integers(-200,W),rng.integers(-100,H);w=rng.integers(250,700);h=rng.integers(40,140)
    d.ellipse((x,y,x+w,y+h),fill=int(rng.integers(10,30)))
smi=smi.filter(ImageFilter.GaussianBlur(40))
sm=np.asarray(smi,np.float32)*0.55
dust=(rng.random((H,W))>0.9975).astype(np.float32)*rng.random((H,W))*45
dust=np.asarray(Image.fromarray(dust.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),np.float32)*1.6
fine=(rng.random((H,W))-0.5)*5
lum=L+sm+dust+fine
save(base[None,None,:]+lum[...,None],'chalkboard.webp')

# Concrete: fractal mottling + pores
base=np.array([52,51,49],np.float32)
L=noise(300)*14+noise(90)*10+noise(25)*7+noise(5)*5+(rng.random((H,W))-0.5)*10
pores=(rng.random((H,W))>0.9985).astype(np.uint8)*255
pores=np.asarray(Image.fromarray(pores).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8)),np.float32)/255*-26
light=(rng.random((H,W))>0.997).astype(np.float32)*14
save(base[None,None,:]+(L+pores+light)[...,None]-6,'concrete.webp')

# Grain tile (seamless, 256px): grayscale noise with alpha
t=256
g=rng.random((t,t))
a=(np.abs(g-0.5)*2*40).astype(np.uint8)  # alpha up to ~16%
col=np.where(g>0.5,255,0).astype(np.uint8)
rgba=np.dstack([col,col,col,a])
Image.fromarray(rgba,'RGBA').save('grain.png',optimize=True)
