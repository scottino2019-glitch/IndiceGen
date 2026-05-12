import { GlobalSettings, IndexItem } from "../types";

export function generateFullHTML(items: IndexItem[], settings: GlobalSettings): string {
  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, "+")}:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap');`;

  const getShapeStyles = (shape: string) => {
    switch (shape) {
      case 'pill': return `border-radius: 9999px;`;
      case 'skew': return `transform: skew(-6deg); border-radius: 4px;`;
      case 'organic': return `border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;`;
      case 'square': return `border-radius: 0;`;
      default: return `border-radius: ${settings.borderRadius};`;
    }
  };

  const themeStyles = {
    minimal: {
      itemPadding: '1.5rem 0',
      shadow: 'none',
      border: 'none',
      borderBottom: `1px solid ${settings.textColor}11`,
      itemHover: 'letter-spacing: 0.05em; opacity: 0.5;',
      containerPadding: '80px 20px',
      iconBg: 'transparent'
    },
    technical: {
      itemPadding: '1rem',
      shadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
      border: `1px solid ${settings.primaryColor}33`,
      borderBottom: 'none',
      itemHover: `background: ${settings.primaryColor}08; box-shadow: 0 0 15px ${settings.primaryColor}22;`,
      containerPadding: '40px 20px',
      iconBg: `${settings.primaryColor}11`
    },
    brutalist: {
      itemPadding: '1.5rem',
      shadow: `10px 10px 0px ${settings.primaryColor}`,
      border: `3px solid ${settings.textColor}`,
      borderBottom: 'none',
      itemHover: `transform: translate(-4px, -4px); box-shadow: 14px 14px 0px ${settings.textColor};`,
      containerPadding: '60px 20px',
      iconBg: settings.primaryColor
    },
    atmospheric: {
      itemPadding: '2rem',
      shadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderBottom: 'none',
      itemHover: 'transform: scale(1.02) translateY(-5px); background: rgba(255,255,255,0.8);',
      containerPadding: '100px 20px',
      iconBg: 'rgba(255,255,255,0.5)'
    },
    editorial: {
      itemPadding: '2.5rem 0',
      shadow: 'none',
      border: 'none',
      borderBottom: `2px solid ${settings.textColor}22`,
      itemHover: 'transform: translateX(20px);',
      containerPadding: '120px 20px',
      iconBg: 'transparent'
    }
  }[settings.theme] || { itemPadding: '1rem', shadow: 'none', border: 'none', borderBottom: 'none', itemHover: '', containerPadding: '40px 20px', iconBg: 'transparent' };

  const renderItems = (nodes: IndexItem[], depth = 0): string => {
    return nodes.map(item => {
      const isTopLevel = depth === 0;
      const animationClass = settings.animationType !== 'none' ? `animate-${settings.animationType}` : '';
      
      const itemStyles = `
        color: ${item.color || settings.textColor};
        font-size: ${item.fontSize || (isTopLevel ? settings.titleFontSize : settings.subtitleFontSize)};
        padding-left: ${depth > 0 ? (settings.theme === 'minimal' ? '2.5rem' : '4rem') : '0'};
        margin-left: ${depth > 0 ? '1rem' : '0'};
        ${depth > 0 && settings.theme === 'technical' ? `border-left: 2px dashed ${settings.primaryColor}22;` : ''}
      `;
      
      const linkProps = item.url ? `href="${item.url}" ${item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}` : '';
      const Tag = item.url ? 'a' : 'div';
      const shapeStyles = getShapeStyles(settings.itemShape);

      return `
        <div class="index-item ${animationClass} depth-${depth}" style="${itemStyles} margin-bottom: ${isTopLevel ? '3rem' : '1rem'};">
          <${Tag} ${linkProps} class="item-link" style="
            text-decoration: none; 
            color: inherit; 
            display: flex; 
            align-items: center; 
            gap: 2rem; 
            border: ${themeStyles.border}; 
            border-bottom: ${themeStyles.borderBottom};
            ${shapeStyles}
            padding: ${themeStyles.itemPadding}; 
            box-shadow: ${themeStyles.shadow};
            ${settings.theme === 'atmospheric' ? 'background: rgba(255,255,255,0.4); backdrop-filter: blur(20px);' : ''}
          ">
            ${isTopLevel ? `<div class="number-badge" style="
              font-family: ${settings.theme === 'technical' ? 'JetBrains Mono' : (settings.theme === 'editorial' ? 'Playfair Display' : 'inherit')};
              font-weight: 900;
              font-size: 0.9rem;
              width: 3rem;
              height: 3rem;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid ${settings.primaryColor}33;
              border-radius: 50%;
              color: ${settings.primaryColor};
            ">${String(nodes.indexOf(item) + 1).padStart(2, '0')}</div>` : ''}
            
            ${item.icon ? `<span class="icon" style="
              font-size: 1.75rem; 
              flex-shrink: 0; 
              width: ${settings.iconSize}; 
              height: ${settings.iconSize}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: ${themeStyles.iconBg}; 
              border-radius: ${settings.itemShape === 'square' ? '0' : '16px'};
              color: ${settings.theme === 'brutalist' ? 'white' : 'inherit'};
              ${settings.theme === 'brutalist' ? `border: 3px solid ${settings.textColor};` : ''}
            ">${item.icon}</span>` : ''}

            <div class="content" style="flex: 1; min-width: 0;">
              <div class="title" style="
                font-weight: ${isTopLevel ? '900' : '600'}; 
                line-height: 1;
                font-family: ${settings.theme === 'editorial' ? 'Playfair Display' : 'inherit'};
                text-transform: ${settings.theme === 'brutalist' ? 'uppercase' : 'none'};
                letter-spacing: ${settings.theme === 'brutalist' ? '0.15em' : 'normal'};
                font-size: ${isTopLevel ? `calc(${settings.titleFontSize} * 1.2)` : settings.subtitleFontSize};
              ">${item.title}</div>
              ${item.subtitle ? `<div class="subtitle" style="
                font-size: 0.7rem; 
                opacity: 0.6; 
                margin-top: 0.5rem; 
                font-weight: 800; 
                letter-spacing: 0.1em; 
                text-transform: uppercase;
                color: ${settings.primaryColor};
              ">${item.subtitle}</div>` : ''}
            </div>
            ${item.isExternal ? `<svg style="opacity: 0.2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>` : ''}
          </${Tag}>
          ${item.children.length > 0 ? `<div class="children" style="margin-top: 1.5rem;">${renderItems(item.children, depth + 1)}</div>` : ''}
        </div>
      `;
    }).join("");
  };

  const bgStyle = settings.bgType === 'gradient' 
    ? `background: ${settings.bgGradient};` 
    : (settings.bgType === 'mesh' 
        ? `background-color: ${settings.backgroundColor}; background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);`
        : `background-color: ${settings.backgroundColor};`);

  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Indice Multimediale</title>
    <style>
        ${fontImport}
        
        * { box-sizing: border-box; }

        body {
            font-family: '${settings.fontFamily}', -apple-system, sans-serif;
            ${bgStyle}
            color: ${settings.textColor};
            padding: ${themeStyles.containerPadding};
            margin: 0;
            line-height: 1.4;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        .index-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .item-link {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .item-link:hover {
            ${themeStyles.itemHover}
        }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 
          0% { opacity: 0; transform: scale(0.8) translateY(20px); } 
          60% { opacity: 1; transform: scale(1.05) translateY(-5px); } 
          100% { transform: scale(1) translateY(0); } 
        }

        .animate-fade { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide { animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce { animation: bounceIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @media (max-width: 640px) {
            body { padding: 40px 15px; }
            .index-item { margin-bottom: 1rem; }
            .content .title { font-size: 1.1rem !important; }
            .item-link { gap: 1rem; padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="index-container">
        ${renderItems(items)}
    </div>
</body>
</html>
  `.trim();
}
