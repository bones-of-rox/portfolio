// Brands shown in the "Brands I've worked with" strip on the homepage.
// Logo files live in src/assets/brands/ (white, transparent SVGs).
// Where each logo came from is noted in src/assets/brands/SOURCES.md.
import americanRedCross from '../assets/brands/american-red-cross.svg';
import usNavy from '../assets/brands/us-navy.svg';
import xfinityMobile from '../assets/brands/xfinity-mobile.svg';
import comcastBusiness from '../assets/brands/comcast-business.svg';
import mtv from '../assets/brands/mtv.svg';
import katyPerry from '../assets/brands/katy-perry.svg';
import kesha from '../assets/brands/kesha.svg';

export interface Brand {
  name: string;
  logo: ImageMetadata;
}

export const brands: Brand[] = [
  { name: 'American Red Cross', logo: americanRedCross },
  { name: 'U.S. Navy', logo: usNavy },
  { name: 'Xfinity Mobile', logo: xfinityMobile },
  { name: 'Comcast Business', logo: comcastBusiness },
  { name: 'MTV', logo: mtv },
  { name: 'Katy Perry', logo: katyPerry },
  { name: 'Kesha', logo: kesha },
];
