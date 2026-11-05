import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Check,
  Heart,
  Menu,
  MoveUpRight,
  X,
} from 'lucide-react';
import './App.css';

const perfumes = [
  {
    id: 'afnan-9pm',
    brand: 'AFNAN',
    name: '9 PM',
    subtitle: 'The after-hours icon',
    image: '/images/afnan-9pm-cutout.png',
    family: 'Gourmand',
    category: 'Manis · Spicy',
    volume: '100 ml · Eau de Parfum',
    palette: 'rose',
    intro: 'Malam terasa lebih dekat. Perpaduan buah yang cerah dengan vanilla hangat, dibuat untuk meninggalkan kesan yang tinggal lebih lama.',
    notes: { top: 'Bergamot · Lavandin · Cinnamon · Apple', heart: 'Muguet · Orange Blossom', base: 'Patchouli · Amber · Vanilla · Tonka Bean' },
    link: 'https://india.afnan.com/products/9-pm',
  },
  {
    id: 'zimaya-sharaf',
    brand: 'ZIMAYA',
    name: 'Sharaf Blend',
    subtitle: 'A little golden hour',
    image: '/images/zimaya-sharaf-cutout.png',
    family: 'Gourmand',
    category: 'Amber · Gourmand',
    volume: '100 ml · Eau de Parfum',
    palette: 'amber',
    intro: 'Hangat, kaya, dan memikat. Saffron serta kurma membuka perjalanan yang berakhir di vanilla, praline, dan amberwood.',
    notes: { top: 'Nutmeg · Saffron · Dates', heart: 'Vanilla · Praline · Tuberose', base: 'Tonka Bean · Benzoin · Amberwood · Musk' },
    link: 'https://zimayaperfumes.com/products/sharaf-blend-100ml',
  },
  {
    id: 'hmns-philea',
    brand: 'HMNS',
    name: 'Philea',
    subtitle: 'A softer kind of becoming',
    image: '/images/hmns-philea-cutout.png',
    family: 'Floral',
    category: 'Floral · Green',
    volume: '100 ml · Eau de Parfum',
    palette: 'mint',
    intro: 'Sahabat yang tumbuh bersamamu. Magnolia dan mimosa terasa lembut, lalu menghangat dengan cashmeran.',
    notes: { top: 'Bergamot · Magnolia · Coriander Seed', heart: 'Jasmine · Mimosa Absolute · Orange Blossom', base: 'Cashmeran · Heliotrope · Musk' },
    link: 'https://hmnsperfume.com/products/hmns-perfume-philea-100ml',
  },
  {
    id: 'rasasi-hawas-frost',
    brand: 'KENZ × RASASI',
    name: 'Hawas Frost',
    subtitle: 'A new chapter in ice',
    image: '/images/hawas-frost-cutout.png',
    family: 'Fresh',
    category: 'New release · 2026',
    volume: '100 ml · Eau de Parfum',
    palette: 'frost',
    intro: 'Hawas Frost adalah rilisan baru dari Kenz × Rasasi. Detail komposisi aromanya belum diumumkan resmi.',
    notes: { top: 'Belum diumumkan', heart: 'Belum diumumkan', base: 'Belum diumumkan' },
    link: 'https://fragrance-gems.eu/products/rasasi-hawas-frost-kenz-de-rasasi-100ml',
  },
];

const filters = ['Semua aroma', 'Fresh', 'Gourmand', 'Floral'];

gsap.registerPlugin(ScrollTrigger);

function Logo({ dark = false }) {
  return (
    <a className={`brand-mark${dark ? ' brand-mark--dark' : ''}`} href="#top" aria-label="Parfumefy, ke atas">
      <img className="brand-icon" src="/parfumefy-mark.png" alt="" aria-hidden="true" />
      <span>parfumefy<span className="brand-dot">.</span></span>
    </a>
  );
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function clipVoronoiCell(cell, other) {
  const a = 2 * (other.x - cell.x);
  const b = 2 * (other.y - cell.y);
  const c = other.x * other.x + other.y * other.y - cell.x * cell.x - cell.y * cell.y;
  const output = [];
  const polygon = cell.polygon;
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentDistance = a * current.x + b * current.y - c;
    const previousDistance = a * previous.x + b * previous.y - c;
    const currentInside = currentDistance <= 0.0001;
    const previousInside = previousDistance <= 0.0001;
    if (currentInside !== previousInside) {
      const amount = previousDistance / (previousDistance - currentDistance);
      output.push({
        x: previous.x + (current.x - previous.x) * amount,
        y: previous.y + (current.y - previous.y) * amount,
      });
    }
    if (currentInside) output.push(current);
  }
  return output;
}

function createShardCells(seed, count = 28) {
  const random = seededRandom(seed);
  const sites = Array.from({ length: count }, () => ({
    x: 2 + random() * 96,
    y: 2 + random() * 96,
  }));

  return sites.map((site, index) => {
    let polygon = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    for (let otherIndex = 0; otherIndex < sites.length && polygon.length; otherIndex += 1) {
      if (otherIndex === index) continue;
      polygon = clipVoronoiCell({ ...site, polygon }, sites[otherIndex]);
    }

    const center = polygon.reduce((point, vertex) => ({ x: point.x + vertex.x, y: point.y + vertex.y }), { x: 0, y: 0 });
    const xCenter = center.x / polygon.length;
    const yCenter = center.y / polygon.length;
    const angle = Math.atan2(yCenter - 48, xCenter - 50) + (random() - 0.5) * 0.4;
    const distance = 38 + random() * 105;
    return {
      id: index,
      points: polygon.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' '),
      clip: polygon.map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', '),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 20 + random() * 45,
      rotation: (random() - 0.5) * 96,
      scale: 0.84 + random() * 0.28,
    };
  });
}

function HeroPerfume({ perfume, index }) {
  const shards = useMemo(() => createShardCells(1807 + index * 937), [index]);
  const maskStyle = {
    maskImage: `url("${perfume.image}")`,
    WebkitMaskImage: `url("${perfume.image}")`,
  };

  return (
    <div className={`hero-product hero-product--${index + 1}`}>
      <img
        className="hero-product-photo"
        src={perfume.image}
        alt={`${perfume.brand} ${perfume.name}`}
        fetchPriority={index === 0 ? 'high' : 'auto'}
      />
      <div className="hero-shards" aria-hidden="true">
        {shards.map((shard) => (
          <div className="hero-shard" data-x={shard.x.toFixed(2)} data-y={shard.y.toFixed(2)} data-rotation={shard.rotation.toFixed(2)} data-scale={shard.scale.toFixed(2)} key={shard.id} style={{ ...maskStyle, clipPath: `polygon(${shard.clip})`, WebkitClipPath: `polygon(${shard.clip})`, transform: index === 0 ? `translate3d(${shard.x}px, ${shard.y}px, 0) rotate(${shard.rotation}deg) scale(${shard.scale})` : undefined }}>
            <img className="hero-shard__image" src={perfume.image} alt="" />
            <svg className="hero-shard__edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points={shard.points} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerfumeCard({ perfume, saved, onToggle, onOpen, index }) {
  return (
    <article className={`scent-card scent-card--${perfume.palette} reveal`} style={{ '--card-index': index }}>
      <div className="scent-card__visual">
        <div className="scent-card__glow" />
        <span className="scent-card__number">0{index + 1}</span>
        <button
          className={`save-button${saved ? ' is-saved' : ''}`}
          type="button"
          onClick={() => onToggle(perfume.id)}
          aria-label={saved ? `Hapus ${perfume.name} dari daftar tersimpan` : `Simpan ${perfume.name}`}
          aria-pressed={saved}
        >
          <Heart size={17} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <img src={perfume.image} alt={`${perfume.brand} ${perfume.name}`} loading="lazy" />
        <span className="scent-card__tag">{perfume.category}</span>
      </div>
      <div className="scent-card__body">
        <div className="scent-card__brand">{perfume.brand}</div>
        <div className="scent-card__title-row">
          <h3>{perfume.name}</h3>
          <button className="round-arrow" type="button" onClick={() => onOpen(perfume)} aria-label={`Lihat detail ${perfume.name}`}>
            <ArrowUpRight size={18} strokeWidth={1.6} />
          </button>
        </div>
        <p>{perfume.subtitle}</p>
        <div className="scent-card__footer"><span>{perfume.volume}</span><span className="scent-card__dash" /></div>
      </div>
    </article>
  );
}

function PerfumeModal({ perfume, onClose, saved, onToggle }) {
  useEffect(() => {
    if (!perfume) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [perfume, onClose]);

  if (!perfume) return null;
  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`perfume-modal scent-card--${perfume.palette}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} type="button" aria-label="Tutup detail"><X size={20} /></button>
        <div className="perfume-modal__image"><div className="scent-card__glow" /><img src={perfume.image} alt={`${perfume.brand} ${perfume.name}`} /></div>
        <div className="perfume-modal__content">
          <p className="eyebrow">{perfume.brand} <span>·</span> {perfume.volume}</p>
          <h2 id="modal-title">{perfume.name}</h2>
          <p className="perfume-modal__intro">{perfume.intro}</p>
          <div className="notes-list">
            {Object.entries(perfume.notes).map(([label, notes], index) => (
              <div className="note-row" key={label}>
                <span className="note-row__index">0{index + 1}</span>
                <span className="note-row__label">{label === 'top' ? 'Top notes' : label === 'heart' ? 'Heart notes' : 'Dry down'}</span>
                <span className="note-row__value">{notes}</span>
              </div>
            ))}
          </div>
          <div className="perfume-modal__actions">
            <button className={`button button--ink${saved ? ' button--saved' : ''}`} type="button" onClick={() => onToggle(perfume.id)}>
              {saved ? <Check size={17} /> : <Heart size={17} />} {saved ? 'Tersimpan di koleksimu' : 'Simpan ke koleksi'}
            </button>
            <a className="text-link" href={perfume.link} target="_blank" rel="noreferrer">Sumber produk <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState('Semua aroma');
  const [saved, setSaved] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toastTimer = useRef(null);

  const visiblePerfumes = useMemo(() => activeFilter === 'Semua aroma'
    ? perfumes
    : perfumes.filter((item) => item.family === activeFilter), [activeFilter]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  const toggleSaved = (id) => {
    const item = perfumes.find((perfume) => perfume.id === id);
    const wasSaved = saved.includes(id);
    setSaved((current) => wasSaved ? current.filter((itemId) => itemId !== id) : [...current, id]);
    showToast(wasSaved ? `${item.name} dihapus dari koleksi` : `${item.name} masuk ke koleksimu`);
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast('Terima kasih! Form demo ini belum mengirim email.');
  };

  useEffect(() => {
    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const page = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('.hero-copy .eyebrow', { autoAlpha: 0, y: 20, duration: 0.65 })
          .from('.hero-copy h1', { autoAlpha: 0, y: 48, duration: 1.05, ease: 'power4.out' }, '-=0.22')
          .from('.hero-description', { autoAlpha: 0, y: 24, duration: 0.7 }, '-=0.58')
          .from('.hero-actions > *', { autoAlpha: 0, y: 17, duration: 0.55, stagger: 0.1 }, '-=0.45')
          .from('.hero-proof', { autoAlpha: 0, y: 12, duration: 0.5 }, '-=0.3')
          .from('.hero-art__stage', { autoAlpha: 0, scale: 0.9, rotate: -2, duration: 1.25, ease: 'power3.out' }, '-=1.12')
          .from('.hero-art__note, .hero-caption', { autoAlpha: 0, y: 18, duration: 0.65, stagger: 0.12 }, '-=0.52');

        const heroProducts = gsap.utils.toArray('.hero-product');
        const heroPhotos = heroProducts.map((product) => product.querySelector('.hero-product-photo'));
        const heroNotes = gsap.utils.toArray('.hero-art__product-note');
        const heroDots = gsap.utils.toArray('.hero-progress__dot');
        const heroShardLayers = heroProducts.map((product) => product.querySelector('.hero-shards'));
        gsap.set(heroPhotos, { autoAlpha: 0 });
        gsap.set(heroShardLayers.slice(1), { autoAlpha: 0 });
        gsap.set(heroNotes.slice(1), { autoAlpha: 0, y: 18 });
        gsap.set(heroDots.slice(1), { scale: 0.72, opacity: 0.42 });

        const heroSequence = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: () => `+=${window.innerWidth < 700 ? 1750 : 2300}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        heroSequence
          .to('.hero-art__sun', { scale: 1.12, y: -24, duration: 4.8, ease: 'none' }, 0)
          .to('.hero-art__orbit--one', { rotate: 35, x: 25, duration: 4.8, ease: 'none' }, 0)
          .to('.hero-art__orbit--two', { rotate: -27, x: -22, duration: 4.8, ease: 'none' }, 0)
          .fromTo('.hero-progress__fill', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 4.8, ease: 'none' }, 0);

        const firstShards = gsap.utils.toArray('.hero-shard', heroProducts[0]);
        const firstEdges = gsap.utils.toArray('.hero-shard__edge', heroProducts[0]);
        const firstScatter = (attribute) => (_, shard) => Number(shard.dataset[attribute]);
        heroSequence
          .fromTo(firstShards, {
            x: firstScatter('x'), y: firstScatter('y'), rotation: firstScatter('rotation'), scale: firstScatter('scale'), autoAlpha: 1,
          }, {
            x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
            duration: 0.72, stagger: { each: 0.005, from: 'edges' }, ease: 'power2.out',
          }, 0)
          .to(firstEdges, { opacity: 0, duration: 0.24, stagger: 0.002, ease: 'power1.out' }, 0.56)
          .set(heroPhotos[0], { autoAlpha: 1 }, 0.86)
          .set(heroShardLayers[0], { autoAlpha: 0 }, 0.86);

        heroProducts.slice(0, -1).forEach((product, index) => {
          const currentPhoto = heroPhotos[index];
          const nextPhoto = heroPhotos[index + 1];
          const currentShardLayer = heroShardLayers[index];
          const nextShardLayer = heroShardLayers[index + 1];
          const currentShards = gsap.utils.toArray('.hero-shard', product);
          const nextShards = gsap.utils.toArray('.hero-shard', heroProducts[index + 1]);
          const currentEdges = gsap.utils.toArray('.hero-shard__edge', product);
          const nextEdges = gsap.utils.toArray('.hero-shard__edge', heroProducts[index + 1]);
          const currentNote = heroNotes[index];
          const nextNote = heroNotes[index + 1];
          const stepStart = (index + 1) * 1.2;
          const scatter = (attribute) => (_, shard) => Number(shard.dataset[attribute]);
          heroSequence
            .set(currentShardLayer, { autoAlpha: 1 }, stepStart)
            .to(currentPhoto, { autoAlpha: 0, duration: 0.08, ease: 'none' }, stepStart)
            .fromTo(currentShards, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 }, {
              x: scatter('x'), y: scatter('y'), rotation: scatter('rotation'), scale: scatter('scale'), autoAlpha: 0,
              duration: 0.72, stagger: { each: 0.005, from: 'center' }, ease: 'power2.in',
            }, stepStart)
            .to(currentEdges, { opacity: 0.86, duration: 0.12, stagger: 0.002, ease: 'none' }, stepStart)
            .set(nextShardLayer, { autoAlpha: 1 }, stepStart)
            .fromTo(nextShards, {
              x: scatter('x'), y: scatter('y'), rotation: scatter('rotation'), scale: scatter('scale'), autoAlpha: 0,
            }, {
              x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
              duration: 0.72, stagger: { each: 0.005, from: 'edges' }, ease: 'power2.out',
            }, stepStart)
            .to(nextEdges, { opacity: 0.86, duration: 0.15, stagger: 0.002, ease: 'none' }, stepStart + 0.44)
            .to(nextEdges, { opacity: 0, duration: 0.16, ease: 'power1.out' }, stepStart + 0.68)
            .set(currentShardLayer, { autoAlpha: 0 }, stepStart + 0.86)
            .set(nextPhoto, { autoAlpha: 1 }, stepStart + 0.86)
            .set(nextShardLayer, { autoAlpha: 0 }, stepStart + 0.86)
            .to('.hero-art__sun', { filter: `hue-rotate(${(index + 1) * 49}deg)`, duration: 0.86, ease: 'sine.inOut' }, stepStart)
            .to(currentNote, { y: -13, autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, stepStart + 0.1)
            .to(nextNote, { y: 0, autoAlpha: 1, duration: 0.42, ease: 'power2.out' }, stepStart + 0.2)
            .to(heroDots[index], { scale: 0.72, opacity: 0.42, duration: 0.25 }, stepStart)
            .to(heroDots[index + 1], { scale: 1.15, opacity: 1, duration: 0.25 }, stepStart + 0.2);
        });

        heroSequence.to('.hero-copy', { y: -24, autoAlpha: 0.28, duration: 0.38, ease: 'power1.out' }, 4.42);

        gsap.from('.promise-heading, .promise-item, .promise-arrow', {
          autoAlpha: 0, y: 26, stagger: 0.1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: '.promise-strip', start: 'top 84%', once: true },
        });
        gsap.from('.section-heading > div', {
          autoAlpha: 0, y: 40, stagger: 0.16, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.section-heading', start: 'top 82%', once: true },
        });
        gsap.from('.filter-row, .collection-foot', {
          autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.filter-row', start: 'top 88%', once: true },
        });

        gsap.from('.story-image__frame', {
          autoAlpha: 0, clipPath: 'inset(12% 0 12% 0)', scale: 0.95, duration: 1.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.story-section', start: 'top 70%', once: true },
        });
        gsap.from('.story-content > *', {
          autoAlpha: 0, x: 35, stagger: 0.13, duration: 0.78, ease: 'power3.out',
          scrollTrigger: { trigger: '.story-content', start: 'top 76%', once: true },
        });
        gsap.to('.story-image__frame img', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: '.story-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        gsap.fromTo('.journey-line', { scaleY: 0 }, {
          scaleY: 1, transformOrigin: 'top center', ease: 'none',
          scrollTrigger: { trigger: '.scent-journey', start: 'top 74%', end: 'bottom 60%', scrub: 0.5 },
        });
        gsap.from('.journey-step', {
          autoAlpha: 0.2, x: -15, stagger: 0.18, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.scent-journey', start: 'top 76%', once: true },
        });
        gsap.from('.brand-wordmark', {
          autoAlpha: 0, y: 22, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.brand-list', start: 'top 86%', once: true },
        });
        gsap.from('.newsletter-copy > *, .newsletter-form', {
          autoAlpha: 0, y: 25, stagger: 0.12, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: '.newsletter-section', start: 'top 80%', once: true },
        });
        gsap.to('.newsletter-mark', {
          rotate: 90, y: 28, ease: 'none',
          scrollTrigger: { trigger: '.newsletter-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });

      return () => page.revert();
    });

    return () => {
      motion.revert();
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const cardsMotion = gsap.matchMedia();
    cardsMotion.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.context(() => {
        gsap.utils.toArray('.scent-card').forEach((card, index) => {
          gsap.fromTo(card, { autoAlpha: 0, y: 55, rotateX: 2 }, {
            autoAlpha: 1, y: 0, rotateX: 0, duration: 0.85, delay: index * 0.11, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 91%', once: true },
          });
        });
      });
      return () => cards.revert();
    });
    return () => cardsMotion.revert();
  }, [visiblePerfumes]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="top">
      <div className="announcement"><span>SCENT NOTES, GOOD STORIES.</span><span className="announcement__center">Kurasi aroma untuk setiap versi dirimu <span className="announcement__spark">✳</span></span><a href="#collection">Jelajahi koleksi <ArrowUpRight size={13} /></a></div>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigasi utama">
            <a href="#collection" onClick={closeMenu}>Koleksi <span className="nav-count">04</span></a>
            <a href="#story" onClick={closeMenu}>Cerita aroma</a>
            <a href="#brands" onClick={closeMenu}>Brand</a>
          </nav>
          <div className="header-actions">
            <button className="saved-link" type="button" onClick={() => saved.length ? showToast(`${saved.length} aroma tersimpan di koleksimu`) : showToast('Simpan aroma favoritmu dengan ikon hati.') } aria-label={`${saved.length} parfum tersimpan`}>
              <Heart size={18} strokeWidth={1.6} /><span>Koleksi</span>{saved.length > 0 && <span className="saved-count">{saved.length}</span>}
            </button>
            <a className="header-cta" href="#collection">Temukan aroma <ArrowUpRight size={16} /></a>
          </div>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> THE ART OF FINDING YOUR SCENT</div>
              <h1>Wangi yang<br />terasa seperti<br /><em>kamu.</em></h1>
              <p className="hero-description">Temukan parfum yang bukan cuma harum — tapi punya cerita, karakter, dan caranya sendiri untuk tinggal di ingatan.</p>
              <div className="hero-actions">
                <a className="button button--ink" href="#collection">Temukan aroma <ArrowDownRight size={17} /></a>
                <a className="quiet-link" href="#story">Kenali ceritanya <ArrowRight size={15} /></a>
              </div>
              <div className="hero-proof"><div className="avatar-stack"><span>A</span><span>S</span><span>O</span></div><p><strong>4 aroma pilihan</strong><br />sudah menunggu dikenali</p><span className="proof-star">✳</span></div>
            </div>

            <div className="hero-art">
              <div className="hero-art__orbit hero-art__orbit--one" />
              <div className="hero-art__orbit hero-art__orbit--two" />
              <span className="hero-art__vertical">SCENT STUDY &nbsp; / &nbsp; 01—04</span>
              <div className="hero-art__stage">
                <div className="hero-art__sun" />
                <div className="hero-art__pedestal" />
                <div className="hero-art__bottles" aria-label="Empat parfum pilihan">
                  {perfumes.map((perfume, index) => <HeroPerfume key={perfume.id} perfume={perfume} index={index} />)}
                </div>
                <span className="hero-art__spark hero-art__spark--a">✳</span>
                <span className="hero-art__spark hero-art__spark--b">✳</span>
              </div>
              <div className="hero-art__note-stack">
                {perfumes.map((perfume, index) => (
                  <div className={`hero-art__product-note hero-art__product-note--${index + 1}`} key={perfume.id}>
                    <span className="hero-art__note-icon">✳</span>
                    <span><small>{perfume.brand} &nbsp;·&nbsp; {perfume.category}</small><strong>{perfume.name}</strong><em>{perfume.subtitle}</em></span>
                    <ArrowUpRight size={16} />
                  </div>
                ))}
              </div>
              <div className="hero-caption"><span>SCROLL TO ASSEMBLE</span><span className="hero-progress__track"><i className="hero-progress__fill" /></span><span className="hero-progress__dots">{perfumes.map((perfume, index) => <i className="hero-progress__dot" key={perfume.id} aria-label={`Aroma ${index + 1}`} />)}</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#collection"><span>SCROLL TO ASSEMBLE</span><ArrowDown size={15} /></a>
        </section>

        <section className="promise-strip reveal" aria-label="Tentang Parfumefy">
          <div className="promise-heading"><span className="promise-spark">✳</span> GOOD SCENTS<br />GOOD SENSE.</div>
          <div className="promise-item"><span>01</span><p>Kurasi dari rumah parfum yang punya karakter.</p></div>
          <div className="promise-item"><span>02</span><p>Detail notes, supaya kamu tahu ceritanya.</p></div>
          <div className="promise-item"><span>03</span><p>Temukan aroma yang terasa paling dekat denganmu.</p></div>
          <div className="promise-arrow"><ArrowDownRight size={25} strokeWidth={1.3} /></div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading reveal">
            <div><p className="eyebrow"><span className="eyebrow-line" /> THE SCENT EDIT, VOL. 01</p><h2>Mulai dari<br /><em>yang terasa.</em></h2></div>
            <div className="section-heading__aside"><p>Setiap aroma punya caranya sendiri untuk dikenang. Ikuti rasa penasaranmu — yang lain akan mengikuti.</p><span className="section-index">01 <i /> 04</span></div>
          </div>
          <div className="filter-row reveal">
            <div className="filter-label"><span className="filter-dot" /> FILTER BY FEEL</div>
            <div className="filter-list" role="group" aria-label="Filter keluarga aroma">
              {filters.map((filter) => <button className={activeFilter === filter ? 'filter-chip is-active' : 'filter-chip'} key={filter} onClick={() => setActiveFilter(filter)} type="button" aria-pressed={activeFilter === filter}>{filter}</button>)}
            </div>
            <span className="result-count">{String(visiblePerfumes.length).padStart(2, '0')} AROMA</span>
          </div>
          <div className="product-grid" aria-live="polite">
            {visiblePerfumes.map((perfume, index) => <PerfumeCard key={perfume.id} perfume={perfume} saved={saved.includes(perfume.id)} onToggle={toggleSaved} onOpen={setSelectedPerfume} index={index} />)}
          </div>
          <div className="collection-foot reveal"><span>THE RIGHT SCENT IS A FEELING.</span><a href="#brands">Cari rumah aromamu <ArrowUpRight size={16} /></a></div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image reveal">
            <div className="story-image__frame"><img src="/images/hmns-orgsm.png" alt="Botol HMNS ORGSM dengan nuansa bunga dan amber" loading="lazy" /><span className="story-stamp">NOTES<br /><i>of</i><br />YOU</span><span className="story-image__caption">A FRAGRANCE, IN THREE ACTS.</span></div>
            <span className="story-orbit story-orbit--one" /><span className="story-orbit story-orbit--two" />
          </div>
          <div className="story-content reveal">
            <p className="eyebrow eyebrow--light"><span className="eyebrow-line" /> AN OLFACTORY STORY</p>
            <h2>Satu aroma.<br /><em>Tiga babak.</em></h2>
            <p className="story-lead">Parfum bergerak seperti cerita. Awalnya menyapa, lalu mendekat, akhirnya tinggal sebagai sesuatu yang akrab.</p>
            <div className="scent-journey">
              <div className="journey-line"><span /><span /><span /></div>
              <div className="journey-step"><span>01</span><div><strong>Top notes</strong><p>Kesan pertama yang menyentuh udara.</p></div></div>
              <div className="journey-step"><span>02</span><div><strong>Heart notes</strong><p>Karakter yang perlahan membuka diri.</p></div></div>
              <div className="journey-step"><span>03</span><div><strong>Dry down</strong><p>Jejak lembut yang paling lama tinggal.</p></div></div>
            </div>
            <a className="story-link" href="#collection">Temukan ceritamu <ArrowUpRight size={17} /></a>
          </div>
        </section>

        <section className="brands-section" id="brands">
          <div className="brands-top reveal"><p className="eyebrow"><span className="eyebrow-line" /> THE HOUSES WE LOVE</p><span>FOUR HOUSES. FOUR DISTINCT WORLDS.</span></div>
          <div className="brand-list reveal">
            {['AFNAN', 'ZIMAYA', 'HMNS', 'RASASI'].map((brand, i) => <a key={brand} href="#collection" className={`brand-wordmark brand-wordmark--${i + 1}`}><span>{brand}</span><MoveUpRight size={15} /></a>)}
          </div>
          <div className="brands-bottom reveal"><span>Curated with care, discovered at your own pace.</span><a href="#collection">Semua aroma <ArrowRight size={15} /></a></div>
        </section>

        <section className="newsletter-section" id="newsletter">
          <div className="newsletter-mark">✳</div>
          <div className="newsletter-copy"><p className="eyebrow"><span className="eyebrow-line" /> A NOTE FROM US</p><h2>Stay close<br />to <em>good scents.</em></h2><p>Surat kecil tentang aroma, ritual, dan hal-hal yang ingin kita ingat.</p></div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email">EMAIL ADDRESS</label>
            <div className="newsletter-input-wrap"><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" required disabled={subscribed} /><button type="submit" aria-label="Daftar newsletter" disabled={subscribed}>{subscribed ? <Check size={18} /> : <ArrowUpRight size={19} />}</button></div>
            <p>{subscribed ? 'Terima kasih — form demo ini belum mengirim email.' : 'No noise, just notes worth remembering.'}</p>
          </form>
          <span className="newsletter-orbit" />
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top"><div className="footer-brand"><Logo dark /><p>Find the notes<br />that feel like you.</p></div><div className="footer-nav"><div><span>EXPLORE</span><a href="#collection">The scent edit</a><a href="#story">How a scent unfolds</a><a href="#brands">Our houses</a></div><div><span>STAY IN THE LOOP</span><a href="#newsletter">Join scent notes <AtSign size={14} /></a><a href="#top">Discover Parfumefy <ArrowUpRight size={14} /></a></div></div><a className="back-top" href="#top" aria-label="Kembali ke atas"><ArrowUpRight size={19} /></a></div>
        <div className="footer-bottom"><span>© 2026 PARFUMEFY — A LOVE LETTER TO SCENT.</span><span>MADE WITH CURIOSITY <span className="footer-spark">✳</span></span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {toast && <div className="toast" role="status"><span className="toast__icon"><Check size={15} /></span>{toast}</div>}
      <PerfumeModal perfume={selectedPerfume} onClose={() => setSelectedPerfume(null)} saved={selectedPerfume ? saved.includes(selectedPerfume.id) : false} onToggle={toggleSaved} />
    </div>
  );
}

export default App;
