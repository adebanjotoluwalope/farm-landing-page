import "./hero.scss"
import { useRef, useEffect, useState, useMemo, useId } from 'react'

// Curved Marquee Component
const CurvedLoop = ({
  marqueeText = 'hello',
  speed = 2,
  className,
  curveAmount = 1000,
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => {
    if (!marqueeText) return 'Welcome to Adebanjo\'s Farm';
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) {
      const textLength = measureRef.current.getComputedTextLength();
      setSpacing(textLength || 200); // Fallback spacing if calculation fails
    }
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      className="curved-loop-jacket"
      style={{ 
        visibility: ready ? 'visible' : 'visible', // Keep visible for debugging
        cursor: cursorStyle 
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text 
            fontWeight="bold" 
            xmlSpace="preserve" 
            className={className}
            fill="white"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="1.8rem"
          >
            <textPath 
              ref={textPathRef} 
              href={`#${pathId}`} 
              startOffset={offset + 'px'} 
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

// Main Hero Component
const Hero = () => {
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const handleAboutClick = () => {
    setShowAbout(true)
    setShowContact(false)
    setShowEmail(false)
  }
  
  const handleHomeClick = () => {
    setShowAbout(false)
    setShowContact(false)
    setShowEmail(false)
  }

  const handleContactClick = () => {
    setShowContact(true)
    setShowAbout(false)
    setShowEmail(false)
  }
  
  const handleEmailClick = () => {
    setShowEmail(true)
    setShowAbout(false)
    setShowContact(false)
  }
  
  return (
    <>
      <div className="hero-container">
        {/* Background Image */}
        <div className="hero-background">
          <img 
            src= 'https://www.pixelstalk.net/wp-content/uploads/images6/The-best-Farm-Wallpaper-HD.jpg'
            alt="Farm Background"
            onLoad={() => {
              console.log('Background image loaded successfully');
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.log('Background image failed', e);
              setImageError(true);
              if (!imageError) {
                e.target.src = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
              }
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="hero-navigation">
          <div className="nav-left">
            <button 
              type="button"
              onClick={handleHomeClick}
              className={!showAbout && !showContact && !showEmail ? "active" : ""}
            >
              <span>Home</span>
            </button> 

            <button 
              type="button"
              onClick={handleAboutClick}
              className={showAbout ? "active" : ""}
            >
              <span>About Us</span>
            </button>
          </div>
          
          <div className="nav-right">
            <button
              type="button"
              onClick={handleContactClick}
              className={showContact ? "active" : ""}
            >
              <span>Contacts</span>
            </button>
            <button
              type="button"
              onClick={handleEmailClick}
              className={showEmail ? "active" : ""}
            >
              <span>Email</span>
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          {/* Decorative Divider */}
          <div className="hero-divider">
            <div className="divider-line"></div>
            <span className="divider-star">★</span>
            <div className="divider-line"></div>
          </div>

          {/* Separate Line */}
          <div className="hero-separator"></div>

          {/* Hero Title */}
          <div className="hero-title">
            <h1>ADEBANJO'S FARM</h1>
          </div>

          {/* SVG Icon */}
        {/*<div className="hero-icon">
            <svg height="500px" width="100%" viewBox="0 0 67.125 67.125">
              <path 
                strokeWidth="0.6"
                stroke="#ffffff"
                fill="none"
                d="M67.125,28.75c0-0.829-0.671-1.5-1.5-1.5h-1.25V17.125c0-0.829-0.671-1.5-1.5-1.5H4.25c-0.829,0-1.5,0.671-1.5,1.5V27.25
                H1.5c-0.829,0-1.5,0.671-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5c-0.829,0-1.5,0.671-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5
                c-0.829,0-1.5,0.672-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5c-0.829,0-1.5,0.672-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5h1.25V50
                c0,0.829,0.671,1.5,1.5,1.5h58.625c0.829,0,1.5-0.671,1.5-1.5V39.25h1.25c0.829,0,1.5-0.671,1.5-1.5c0-0.828-0.671-1.5-1.5-1.5
                c0.829,0,1.5-0.671,1.5-1.5c0-0.828-0.671-1.5-1.5-1.5c0.829,0,1.5-0.672-1.5,1.5c0-0.829-0.671-1.5-1.5-1.5
                C66.453,30.25,67.125,29.579,67.125,28.75z M61.375,48.5H5.75v-9.25H7c0.829,0,1.5-0.671,1.5-1.5c0-0.828-0.671-1.5-1.5-1.5h2.125
                c0.829,0,1.5-0.671,1.5-1.5c0-0.828-0.671-1.5-1.5-1.5h1.125c0.829,0,1.5-0.671,1.5-1.5c0-0.829-0.671-1.5-1.5-1.5H9.125
                c0.829,0,1.5-0.671,1.5-1.5c0-0.829-0.671-1.5-1.5-1.5H5.75v-8.625h55.625v8.625H58c-0.829,0-1.5,0.671-1.5,1.5
                c0,0.829,0.671,1.5,1.5,1.5h-1.125c-0.829,0-1.5,0.671-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5H58c-0.829,0-1.5,0.672-1.5,1.5
                c0,0.829,0.671,1.5,1.5,1.5h2.125c-0.829,0-1.5,0.672-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5h1.25V48.5z"
              />
            </svg>
          </div>*/}
        </div>

        {/* Curved Marquee */}
        <div style={{ position: 'absolute', bottom: '10%', width: '100%', zIndex: 25 }}>
          <CurvedLoop 
            marqueeText="Welcome to Adebanjo's Farm - Sustainable Agriculture at its Finest"
            speed={2}
            curveAmount={0}
            className="marquee-text"
          />
        </div>
      </div>

      {/* About Panel */}
      <div className={`about-panel ${showAbout ? "show" : ""}`}>
        <div className="about-content">
          <h2>About Adebanjo's Farm</h2>
          <p>Welcome!! to Adebanjo's Farm, where we cultivate the finest agricultural products with sustainable farming practices. Our farm has been family-owned for generations, dedicated to providing fresh, organic produce to our community.</p>
          <button onClick={handleHomeClick} style={{marginTop: '20px', padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            Close
          </button>
        </div>
      </div>

      {/* Contact Panel */}
      <div className={`contact-panel ${showContact ? "show" : ""}`}>
        <div className="contact-content">
          <h2>Call the following</h2>
          <p>Welcome to Adebanjo's Farm.</p>
          <button onClick={handleHomeClick} style={{marginTop: '20px', padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            Close
          </button>
        </div>
      </div>

      {/* Email Panel */}
      <div className={`email-panel ${showEmail ? "show" : ""}`}>
        <div className="email-content">
          <h2>Email the following</h2>
          <p>adebanjofarm8@gmail.com</p>
          <button onClick={handleHomeClick} style={{marginTop: '20px', padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default Hero