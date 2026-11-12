// Les Deux Jardins — tokens Tailwind (thème v1). À intégrer dans tailwind.config.js
// du futur dépôt Next.js. Fonts : le CSP interdit les CDN → les charger en @font-face
// (Cormorant Garamond, Lato, Quicksand, Amiri) ou via next/font en self-host.
module.exports = {
  theme: {
    extend: {
      colors: {
        shell:  { bg:'#FBF7EF', surface:'#FFFFFF', soft:'#F4EFE4', border:'#E7D8B8',
                  text:'#43463F', muted:'#7D7269' },
        gold:   { DEFAULT:'#C3873C', dark:'#B4782D', light:'#D4A050' },
        jq:     { deep:'#3E4A38', sage:'#7C8B6C', tender:'#D9E4CB', rose:'#C48B93', cream:'#FBF7EF' },
        et:     { teal:'#3C6478', magenta:'#F050C8', sky:'#B4F0F0', lavender:'#C8A0F0',
                  mint:'#B4F0C8', yellow:'#F0F078', beige:'#F0E4D3', offwhite:'#FAF7F2' },
      },
      borderRadius: { xl:'16px', '2xl':'20px' },
      fontFamily: {
        serif: ['"Cormorant Garamond"','Georgia','serif'],   // Jardin du cœur (titres)
        round: ['Quicksand','Nunito','"Trebuchet MS"','sans-serif'], // Jardin des graines (titres)
        body:  ['Lato','"Open Sans"','Arial','sans-serif'],
        arab:  ['Amiri','"Scheherazade New"','serif'],
      },
    },
  },
};
