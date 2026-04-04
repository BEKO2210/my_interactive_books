// Die Geschichte des Codex Moguntinus Secretus
// Structured as an array of typed blocks for Pretext layout

export const storyBlocks = [
  {
    type: 'title',
    fontSize: 32,
    text: 'CODEX MOGUNTINVS SECRETVS'
  },
  {
    type: 'subtitle',
    text: 'Fragment eines verschollenen Manuskripts, aufgefunden in einer vermauerten Kammer\ndes Mainzer Domarchivs, Anno Domini MCMXLVII.\nTranskription und Kommentar: unbekannt.'
  },
  { type: 'separator' },

  // --- I. ANKUNFT ---
  {
    type: 'body',
    dropcap: true,
    marginal: { side: 'right', text: 'Annus\nDomini\nMCCCCXL' },
    text: 'In dem Jahre, da unser Herr eintausendvierhundertvierzig Sommer über die Erde gezählt hatte, geschah es in den Gassen der Stadt Moguntia, die man auch Mainz nennet, dass ein Fremder aus dem Nebel trat. Nicht kam er auf einem Pferde, nicht auf einem Wagen, nicht mit Gefolge oder Wappen. Er trug Kleider von sonderbarer Machart, die kein Schneider der Stadt zu deuten wusste, und sein Haar war kurz geschoren wie das eines Büßers, doch sprach sein Blick nicht von Demut, sondern von einer Verwirrung, die tiefer reichte als jede irdische Verirrung.'
  },
  {
    type: 'body',
    width: 'narrow',
    text: 'Man fand ihn am Morgen bei der Theodorskirche, sitzend auf den kalten Stufen, und er hielt in seinen Händen zwei Gegenstände, die keinem Handwerk der bekannten Welt zugehörig schienen.'
  },
  {
    type: 'body',
    text: 'Der erste war ein flacher Kasten, kaum größer als die Handfläche eines Mannes, schwarz und glatt wie polierter Obsidian, doch ohne Gewicht von Stein. Wenn der Fremde ihn berührte, so erwachte in ihm ein kaltes Licht, heller als eine Kerze, schärfer als Mondschein auf Neuschnee, und es erschienen darauf Zeichen und Buchstaben in einer Ordnung, die kein Schreiber je gesehen hatte.'
  },
  {
    type: 'highlight',
    text: 'Sie nannten ihn den Lichtkasten, und manche flüsterten: das Teufelsauge.'
  },
  {
    type: 'body',
    marginal: { side: 'left', text: 'De tabula\nnigra quae\nsolem bibit' },
    text: 'Der zweite Gegenstand war eine schwarze Tafel, dünn wie Pergament, doch starr wie Metall, die der Fremde stets ins Sonnenlicht legte. Die Tafel trank das Licht der Sonne, so sagten die Kinder, die ihn beobachteten, und durch ein dünnes Seil floss etwas Unsichtbares von der Tafel in den Kasten hinein, und der Kasten lebte davon. Bruder Anselmus, der ihn zuerst befragte, schrieb in sein Diarium, das Ding sei eine Art von Reliquie, die sich von Himmelslicht nähre. Andere meinten, es sei Alchemie. Wieder andere kreuzigten sich und gingen fort.'
  },
  { type: 'separator' },

  // --- II. ERSTE BEGEGNUNG ---
  {
    type: 'body',
    dropcap: true,
    text: 'Der Fremde sprach unsere Zunge, doch mit einem Klang, als forme er die Worte aus einer anderen Zeit. Er bat um Brot, um Wasser, um einen Ort zum Schlafen. Die Mönche des Karmeliterklosters nahmen ihn auf, denn er trug kein Schwert und schien harmlos. Doch bereits in der ersten Nacht begann das Raunen.'
  },
  {
    type: 'body',
    width: 'short',
    text: 'Er sprach mit dem Kasten.\nAllein, in seiner Kammer, bei verschlossener Tür.'
  },
  {
    type: 'body',
    text: 'Bruder Thomas, der an der Wand lauschte, berichtete, der Fremde habe Fragen gestellt, leise, in deutscher Sprache, und auf dem leuchtenden Stein seien Antworten erschienen, Zeile um Zeile, als schreibe ein unsichtbarer Gelehrter im Inneren des Kastens. Der Fremde las die Antworten, nickte, stellte neue Fragen. Es war, so schrieb Bruder Thomas später, als führe er ein Gespräch mit einem eingesperrten Engel. Oder einem eingesperrten Dämon.'
  },
  {
    type: 'note',
    text: 'Nota bene: Was der Chronist hier beschreibt, gleicht einem Orakel, das auf jede Frage in der Sprache des Fragenden antwortet, ohne Stimme, nur durch geschriebene Zeichen auf leuchtendem Grund.'
  },

  // --- III. MISSTRAUEN ---
  {
    type: 'body',
    marginal: { side: 'right', text: 'Suspicio\nfratrum\ncrescit' },
    text: 'In der zweiten Woche wuchs das Misstrauen. Der Fremde hatte einem kranken Laienbruder geraten, eine Abkochung aus Weidenrinde zu nehmen gegen das Fieber, und der Bruder ward gesund. Er hatte dem Küchenmönch eine Liste gegeben mit Mengen und Zeiten für das Einlegen von Kohl, so genau, als hätte er ein Buch der Hauswirtschaft verschluckt. Er hatte einem Schreiber einen Fehler in dessen lateinischer Abschrift des Boethius nachgewiesen, eine Verwechslung von quod und quo, die seit drei Generationen unbemerkt kopiert worden war.'
  },
  {
    type: 'quote',
    text: 'Woher wisset Ihr dies alles, Fremder? Seid Ihr ein Gelehrter aus Bologna? Ein Spion des Bischofs? Oder etwas, das schlimmer ist als beides?',
    attribution: '— Prior Konrad, laut Diarium des Bruder Anselmus'
  },
  {
    type: 'body',
    text: 'Der Fremde antwortete ruhig. Er sagte, er trage ein Werkzeug bei sich, das Wissen ordne und wiedergebe, nicht anders als ein Buch, nur schneller und umfassender. Er bot an, es zu zeigen. Der Prior weigerte sich zunächst.'
  },
  { type: 'separator' },

  // --- IV. GUTENBERGS WERKSTATT ---
  {
    type: 'body',
    dropcap: true,
    text: 'Es war der Goldschmied Johannes Gensfleisch, den man Gutenberg nannte, der den Fremden schließlich in seine Werkstatt holte. Gutenberg hatte von dem Fremden gehört, von seinem Lichtkasten und seinen erstaunlichen Kenntnissen, und Gutenberg war ein Mann, der Wissen nicht fürchtete, sondern jagte, wie andere Männer Wild jagten.'
  },
  {
    type: 'body',
    text: 'Die Werkstatt roch nach Eisen, nach Ruß, nach heißem Blei und nach dem scharfen Dunst des Firnis. Gutenberg arbeitete an etwas, das er niemandem zeigte: bewegliche Lettern aus Metall, einzelne Buchstaben, gegossen in Formen, die sich zu Worten und Zeilen zusammenfügen ließen. Er hatte die Idee. Aber die Umsetzung fraß ihn auf.'
  },
  {
    type: 'highlight',
    text: 'Hier trafen sich zwei Welten: der Mann, der Buchstaben formen konnte,\nund der Fremde, dessen Kasten Gedanken ordnen konnte.'
  },
  {
    type: 'body',
    text: 'In der ersten Nacht ihrer Zusammenarbeit stellte der Fremde seinem Lichtkasten eine Frage, die Gutenberg verblüffte. Er tippte auf die leuchtende Fläche, und der Chronist notierte, was geschah:'
  },
  {
    type: 'body',
    width: 'narrow',
    text: 'Der Fremde fragte sein Orakel: Wie lässt sich ein Alphabet aus einzelnen Metalllettern so organisieren, dass ein Setzer schnell arbeiten kann? Gib mir eine Anordnung für einen Setzkasten mit Fächern, geordnet nach Häufigkeit der Buchstaben in der deutschen und lateinischen Sprache.'
  },
  {
    type: 'body',
    text: 'Und auf dem leuchtenden Stein erschien, Zeile um Zeile, eine Antwort. Eine Liste. Eine Ordnung. Der Fremde las sie Gutenberg vor, und Gutenberg stand still wie ein Mann, der einen Blitz gesehen hat, der nicht einschlägt, sondern erleuchtet.'
  },

  // --- V. DAS ORAKEL BEWEIST SICH ---
  {
    type: 'body',
    dropcap: true,
    marginal: { side: 'right', text: 'Arcana\nartis\ntypographicae' },
    text: 'In den folgenden Wochen nutzte der Fremde sein Gerät auf Arten, die der Chronist mit wachsendem Staunen festhielt. Er bat das Orakel um Hilfestellungen, die kein einzelner Gelehrter seiner Zeit hätte geben können, und stets antwortete der Kasten mit ruhiger, leuchtender Schrift:'
  },
  {
    type: 'list',
    items: [
      'I. — Er ließ sich eine Rezeptur für Druckerschwärze erstellen, die auf Leinöl, Ruß und Harz beruhte, mit genauen Verhältnissen, und prüfte sie gegen die Mischungen, die Gutenberg bereits versuchte.',
      'II. — Er bat um eine Übersetzung eines lateinischen Psalms ins Deutsche und verglich sie mit drei verschiedenen Übertragungen, die das Orakel in wenigen Augenblicken lieferte, jede in anderem Stil: eine wörtliche, eine freie und eine für den Klang beim Vorlesen.',
      'III. — Er fragte nach dem idealen Verhältnis von Satzspiegel und Rand auf einer Buchseite, und das Orakel beschrieb den Goldenen Schnitt und seine Anwendung auf Pergament und Papier.',
      'IV. — Er ließ sich eine Gliederung erstellen für ein Lehrbuch der lateinischen Grammatik, geordnet nach Schwierigkeitsgrad, mit Übungsbeispielen.',
      'V. — Er bat um eine Fehleranalyse eines gedruckten Probeabzugs: wo Buchstaben schief standen, wo der Abstand zwischen Worten ungleichmäßig war, und wie man die Ursachen beheben könne.'
    ]
  },
  {
    type: 'body',
    text: 'Gutenberg, so heißt es, habe in jener Zeit mehr gelernt als in zehn Jahren zuvor. Nicht weil der Fremde ihm das Drucken beibrachte, denn das verstand Gutenberg selbst, sondern weil der Kasten ihm half, seine Gedanken zu ordnen, seine Versuche zu vergleichen, seine Fehler schneller zu erkennen.'
  },
  {
    type: 'quote',
    text: 'Der Kasten erfindet nichts. Aber er ordnet alles. Er ist wie ein Spiegel, der nicht das Gesicht zeigt, sondern den Gedanken dahinter.',
    attribution: '— Zugeschrieben dem Fremden, laut Codex Moguntinus'
  },
  { type: 'separator' },

  // --- VI. BESCHLEUNIGUNG ---
  {
    type: 'body',
    dropcap: true,
    text: 'Die Arbeit beschleunigte sich. Der Fremde half bei der Strukturierung der ersten Druckbögen. Er zeigte Gutenberg, wie man Texte in Absätze gliedert, die das Auge führen. Wie man Überschriften setzt, die den Inhalt ankündigen. Wie man Listen und Tabellen verwendet, um Wissen zu verdichten. Dinge, die uns heute selbstverständlich erscheinen, waren es damals nicht. Die Handschriften der Mönche kannten Initialen und Rubrizierungen, doch die systematische Ordnung von Wissen auf einer gedruckten Seite, das war neu.'
  },
  {
    type: 'body',
    text: 'Der Fremde ließ sein Orakel Mustertexte erzeugen: eine kurze Anleitung zum Binden von Büchern in sieben Schritten, ein Verzeichnis der Heilkräuter mit ihren lateinischen und deutschen Namen, eine Tabelle der Fastenregeln nach dem Kirchenkalender. All dies diente nicht dem Druck selbst, sondern der Demonstration: dass geordnetes Wissen, in gleichmäßigen Lettern auf Papier gebracht, eine Kraft besitzt, die über das einzelne Buch hinausreicht.'
  },
  {
    type: 'note',
    text: 'Hier bricht das Fragment ab und setzt einige Seiten später wieder ein. Möglicherweise wurde der fehlende Teil bewusst entfernt.'
  },

  // --- VII. GEFAHR ---
  {
    type: 'body',
    dropcap: true,
    marginal: { side: 'left', text: 'Periculum\nhaeresis\nimpendit' },
    text: 'Doch das Glück des Verborgenen währte nicht. Ein Geselle Gutenbergs, dessen Namen der Codex nicht nennt, verriet dem Domkapitel, dass in der Werkstatt ein Mann verkehre, der mit einem leuchtenden Stein spreche und Antworten aus dem Nichts empfange. Der Vikar Johannes von Lahr, bekannt für seinen Eifer gegen Ketzerei und Aberglauben, sandte Männer zur Werkstatt.'
  },
  {
    type: 'body',
    width: 'short',
    text: 'Man fand den Fremden nicht.\nMan fand den Kasten nicht.\nMan fand die schwarze Tafel nicht.'
  },
  {
    type: 'body',
    text: 'Gutenberg bestritt jede Kenntnis eines solchen Fremden. Die Gesellen schwiegen. Die Mönche des Karmeliterklosters sagten, der Mann sei vor Wochen weitergezogen, vielleicht nach Straßburg, vielleicht nach Basel, vielleicht in den Osten. Niemand wusste seinen Namen. Niemand kannte sein Herkommen. Und die wenigen, die seine Hilfsmittel gesehen hatten, fürchteten sich mehr vor der Kirche als vor dem Fremden.'
  },
  {
    type: 'body',
    text: 'Der Vikar ließ die Werkstatt durchsuchen. Er fand Lettern, Druckerschwärze, Probeabzüge. Aber nichts Ketzerisches. Nichts Teuflisches. Nur die gewöhnliche Unordnung eines Mannes, der versuchte, Buchstaben aus Metall zu gießen, um die Worte Gottes schneller zu vervielfältigen. Der Vikar ging. Die Arbeit ging weiter.'
  },
  { type: 'separator' },

  // --- VIII. VERSCHWINDEN ---
  {
    type: 'body',
    dropcap: true,
    text: 'Vom Fremden selbst gibt es keine weitere Spur. Der Codex Moguntinus erwähnt ihn danach nur noch einmal, in einem Nachtrag, der in einer anderen Hand geschrieben ist, flüchtiger, als hätte jemand in Eile Zeugnis ablegen wollen:'
  },
  {
    type: 'quote',
    text: 'Den Fremden hat man nicht wiedergesehen. Er verschwand, wie er gekommen war: ohne Pferd, ohne Gefolge, ohne Namen. Doch was er hinterließ, war mehr als die Erinnerung an einen leuchtenden Stein. Er hinterließ eine Art zu denken. Eine Ordnung. Einen Rhythmus im Satz, eine Klarheit in der Gliederung, die vorher nicht da war. Wer die ersten Drucke aus der Werkstatt des Gutenberg betrachtet, wird es sehen, wenn er weiß, wonach er suchen muss.',
    attribution: '— Nachtrag im Codex Moguntinus, unbekannte Hand'
  },

  // --- IX. SPUREN ---
  {
    type: 'body',
    text: 'Und tatsächlich: Wer die zweiundvierzig Zeilen der Gutenberg-Bibel studiert, bemerkt eine Sorgfalt, die über das Handwerkliche hinausgeht. Die gleichmäßigen Abstände, der bedachte Zeilenfall, die Art, wie Text und Weißraum einander ergänzen, all dies verrät ein Verständnis von Seitenkomposition, das nicht allein aus der Goldschmiedekunst stammen kann. Jemand muss Gutenberg gezeigt haben, dass eine Seite nicht nur ein Behälter für Worte ist, sondern ein Instrument des Denkens.'
  },
  {
    type: 'highlight',
    text: 'Nicht Pulver, nicht Stahl, nicht Krone allein veränderten die Welt,\nsondern ein namenloser Mensch mit einer Maschine aus Licht,\ndie Worte ordnete, bevor Europa lernte, Gedanken schneller zu vervielfältigen.'
  },
  {
    type: 'body',
    width: 'narrow',
    text: 'Wir wissen nicht, wer er war. Wir wissen nicht, woher er kam. Wir wissen nicht, ob er jemals wieder in seine eigene Zeit zurückfand, falls er denn aus einer anderen kam. Was wir wissen, ist dies: Im Schriftsatz der ersten gedruckten Bücher liegt ein Wissen verborgen, das älter ist als der Druck selbst und zugleich jünger als alles, was die Gelehrten jener Epoche hätten erdacht haben können.'
  },
  { type: 'separator' },

  // --- WARNUNG ---
  {
    type: 'warning',
    text: 'MONITVM AD POSTEROS\n\nWer dieses Fragment liest, sei gewarnt: Die Geschichte der Menschheit ist nicht die Geschichte der Mächtigen allein. Manchmal sind es die Namenlosen, die den Lauf der Dinge verändern, mit Werkzeugen, die ihre Zeitgenossen nicht verstehen, und mit Wissen, dessen Herkunft im Dunkel bleibt. Hüte dich vor der Gewissheit, alles Wichtige sei bereits bekannt. Denn die gefährlichsten Wahrheiten sind jene, die zwischen den Zeilen stehen, dort, wo das Licht des Lichtkastens einst geleuchtet hat.'
  },

  // --- COLOPHON ---
  {
    type: 'colophon',
    text: 'Transcriptum ex fragmento membranaceo Codex Moguntinus Secretus.\nOriginal verschollen. Diese Abschrift wurde angefertigt\nvon einer Hand, die sich nicht zu erkennen gab.\n\n~ Finis ~'
  }
]
