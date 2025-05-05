// Sample quizzes for seeding the database
module.exports = [
  // Quiz 1: Programmeringsbegreper
  {
    title: 'Programmeringsbegreper i JavaScript',
    description: 'Test din kunnskap om grunnleggende programmeringsbegreper i JavaScript. Denne quizen dekker variabler, datatyper, funksjoner og loops.',
    category: 'programutvikling',
    difficulty: 'enkel',
    timeLimit: 10,
    isPublic: true,
    isAdminQuiz: true,
    tags: ['javascript', 'programmering', 'grunnleggende'],
    questions: [
      {
        questionText: 'Hvilken av disse er IKKE en primitiv datatype i JavaScript?',
        questionType: 'multiple-choice',
        options: [
          { text: 'String', isCorrect: false },
          { text: 'Number', isCorrect: false },
          { text: 'Boolean', isCorrect: false },
          { text: 'Array', isCorrect: true }
        ],
        points: 1,
        explanation: 'Array er en objekt-datatype, ikke en primitiv datatype. Primitive datatyper i JavaScript er: String, Number, Boolean, Null, Undefined, Symbol og BigInt.'
      },
      {
        questionText: 'Hva er forskjellen mellom "==" og "===" i JavaScript?',
        questionType: 'multiple-choice',
        options: [
          { text: 'De gjør akkurat det samme', isCorrect: false },
          { text: '"===" sammenligner både verdi og datatype, mens "==" sammenligner bare verdi', isCorrect: true },
          { text: '"==" er for strenger, "===" er for tall', isCorrect: false },
          { text: '"===" finnes ikke i JavaScript', isCorrect: false }
        ],
        points: 1,
        explanation: '"===" (strict equality) sjekker både verdi og datatype, mens "==" (loose equality) konverterer typene først og sammenligner deretter verdiene.'
      },
      {
        questionText: 'Hvilken loop vil ALLTID kjøre minst én gang?',
        questionType: 'multiple-choice',
        options: [
          { text: 'for-loop', isCorrect: false },
          { text: 'while-loop', isCorrect: false },
          { text: 'do-while-loop', isCorrect: true },
          { text: 'forEach-loop', isCorrect: false }
        ],
        points: 1,
        explanation: 'En do-while-loop vil alltid kjøre minst én gang fordi betingelsen sjekkes etter første iterasjon, mens de andre loopene sjekker betingelsen før første iterasjon.'
      },
      {
        questionText: 'Hva er resultatet av: "5" + 2 i JavaScript?',
        questionType: 'multiple-choice',
        options: [
          { text: '7', isCorrect: false },
          { text: '"52"', isCorrect: true },
          { text: 'Error', isCorrect: false },
          { text: '"5+2"', isCorrect: false }
        ],
        points: 1,
        explanation: 'JavaScript konverterer 2 til en streng og utfører streng-konkatenering, som resulterer i "52".'
      },
      {
        questionText: 'Hvilket av disse er en riktig måte å definere en anonym funksjon på?',
        questionType: 'multiple-choice',
        options: [
          { text: 'function = () {}', isCorrect: false },
          { text: 'const function() {}', isCorrect: false },
          { text: '() => {}', isCorrect: true },
          { text: 'function() => {}', isCorrect: false }
        ],
        points: 1,
        explanation: '() => {} er syntaksen for en anonym pilefunksjon (arrow function) i JavaScript.'
      }
    ]
  },
  
  // Quiz 2: Nettverk og sikkerhet
  {
    title: 'Nettverk og sikkerhet - Grunnleggende',
    description: 'Test din kunnskap om grunnleggende nettverk og sikkerhetsemner. Denne quizen dekker protokoller, modeller og sikkerhetstiltak.',
    category: 'nettverk',
    difficulty: 'middels',
    timeLimit: 15,
    isPublic: true,
    isAdminQuiz: true,
    tags: ['nettverk', 'sikkerhet', 'protokoller', 'OSI'],
    questions: [
      {
        questionText: 'Hvilke av disse er ikke et lag i OSI-modellen?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Fysisk lag', isCorrect: false },
          { text: 'Nettverkslag', isCorrect: false },
          { text: 'Sikkerhetslag', isCorrect: true },
          { text: 'Transportlag', isCorrect: false }
        ],
        points: 1,
        explanation: 'OSI-modellen har syv lag: Fysisk, Datalink, Nettverk, Transport, Sesjon, Presentasjon og Applikasjon. Det finnes ikke noe "sikkerhetslag".'
      },
      {
        questionText: 'Hva står HTTPS for?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Hypertext Transfer Protocol Secure', isCorrect: true },
          { text: 'Hypertext Transfer Protocol System', isCorrect: false },
          { text: 'Hypertext Transport Protocol System', isCorrect: false },
          { text: 'Hypertext Transport Protocol Secure', isCorrect: false }
        ],
        points: 1,
        explanation: 'HTTPS står for Hypertext Transfer Protocol Secure, og er en sikker versjon av HTTP som bruker TLS/SSL for kryptering.'
      },
      {
        questionText: 'Hvilken port bruker vanligvis HTTP?',
        questionType: 'multiple-choice',
        options: [
          { text: '21', isCorrect: false },
          { text: '80', isCorrect: true },
          { text: '443', isCorrect: false },
          { text: '23', isCorrect: false }
        ],
        points: 1,
        explanation: 'HTTP bruker vanligvis port 80, mens HTTPS bruker port 443. FTP bruker port 21 og Telnet bruker port 23.'
      },
      {
        questionText: 'Match protokollene med deres funksjon:',
        questionType: 'matching',
        matchingPairs: [
          { left: 'DHCP', right: 'Tildele IP-adresser automatisk' },
          { left: 'DNS', right: 'Oversette domenenavn til IP-adresser' },
          { left: 'SMTP', right: 'Sende e-post' },
          { left: 'FTP', right: 'Overføre filer' }
        ],
        points: 2,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) tildeler IP-adresser, DNS (Domain Name System) oversetter domenenavn til IP-adresser, SMTP (Simple Mail Transfer Protocol) brukes for å sende e-post, og FTP (File Transfer Protocol) brukes for å overføre filer.'
      },
      {
        questionText: 'Er dette utsagnet sant eller falskt: "En brannmur kan beskytte mot alle typer cyberangrep."',
        questionType: 'true-false',
        options: [
          { text: 'Sant', isCorrect: false },
          { text: 'Usant', isCorrect: true }
        ],
        points: 1,
        explanation: 'Dette er usant. En brannmur er kun ett sikkerhetstiltak som hovedsakelig kontrollerer innkommende og utgående nettverkstrafikk basert på forhåndsdefinerte regler. Den kan ikke beskytte mot alle typer angrep, som for eksempel phishing, sosial manipulering, eller ondsinnet kode som allerede er inne på nettverket.'
      }
    ]
  },
  
  // Quiz 3: Operativsystemer og drift
  {
    title: 'Operativsystemer og systemdrift',
    description: 'Test din kunnskap om operativsystemer, virtualisering og systemdrift. Denne quizen dekker grunnleggende konsepter innen systemadministrasjon.',
    category: 'drift',
    difficulty: 'vanskelig',
    timeLimit: 20,
    isPublic: true,
    isAdminQuiz: false,
    tags: ['operativsystemer', 'virtualisering', 'linux', 'windows'],
    questions: [
      {
        questionText: 'Hvilken av følgende teknologier brukes for å kjøre flere operativsystemer på samme fysiske maskin?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Kompilering', isCorrect: false },
          { text: 'Virtualisering', isCorrect: true },
          { text: 'Komprimering', isCorrect: false },
          { text: 'Kryptering', isCorrect: false }
        ],
        points: 1,
        explanation: 'Virtualisering lar deg kjøre flere virtuelle maskiner på samme fysiske maskinvare, hvor hver VM kan kjøre sitt eget operativsystem.'
      },
      {
        questionText: 'Hvilken kommando i Linux brukes for å vise diskbruk i menneskelesbart format?',
        questionType: 'multiple-choice',
        options: [
          { text: 'ls -la', isCorrect: false },
          { text: 'df -h', isCorrect: true },
          { text: 'ps aux', isCorrect: false },
          { text: 'top', isCorrect: false }
        ],
        points: 1,
        explanation: 'df -h (disk free human-readable) viser ledig diskplass i et lesbart format. ls -la lister filer, ps aux viser prosesser, og top viser ressursbruk i sanntid.'
      },
      {
        questionText: 'Hva gjør følgende Linux-kommando: "chmod 755 script.sh"?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Sletter filen script.sh', isCorrect: false },
          { text: 'Kopierer filen script.sh', isCorrect: false },
          { text: 'Endrer eieren av script.sh', isCorrect: false },
          { text: 'Gir lese-, skrive- og kjøretillatelser til eieren, og lese- og kjøretillatelser til andre', isCorrect: true }
        ],
        points: 1,
        explanation: 'chmod 755 gir eieren (7=rwx) alle rettigheter, og gir gruppen og andre (5=rx) lese- og kjøretillatelser.'
      },
      {
        questionText: 'Forklar kort hva RAID er og nevn minst to ulike RAID-nivåer.',
        questionType: 'short-answer',
        correctAnswer: 'raid',
        points: 2,
        explanation: 'RAID (Redundant Array of Independent Disks) er en teknologi som kombinerer flere fysiske disker til én logisk enhet for økt ytelse, redundans eller begge deler. Vanlige RAID-nivåer inkluderer RAID 0 (striping), RAID 1 (speiling), RAID 5 (striping med paritet), RAID 6 (striping med dobbel paritet) og RAID 10 (kombinasjon av RAID 1 og 0).'
      },
      {
        questionText: 'Match hver begrep med riktig beskrivelse:',
        questionType: 'matching',
        matchingPairs: [
          { left: 'Hypervisor', right: 'Programvare som muliggjør virtualisering' },
          { left: 'Kernel', right: 'Kjernen i et operativsystem' },
          { left: 'Docker', right: 'Container-plattform' },
          { left: 'Active Directory', right: 'Katalogtjeneste fra Microsoft' }
        ],
        points: 2,
        explanation: 'En hypervisor muliggjør virtualisering ved å la flere operativsystemer kjøre på samme maskinvare. Kernel er kjernen i et operativsystem som håndterer ressurser. Docker er en plattform for å kjøre applikasjoner i containere. Active Directory er Microsofts katalogtjeneste for bruker- og ressursadministrasjon.'
      }
    ]
  }
]; 