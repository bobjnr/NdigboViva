import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { getLatestVideos } from '@/lib/youtube'

// Define interface for video credits structure
interface VideoCredit {
  title: string;
  thumbnail: string;
  credits: {
    guestAcknowledgement?: string;
    books: { citation: string }[];
    visualSources: { title: string; source: string; link: string }[];
    teamAcknowledgements?: string;
    aiAssistance?: string;
  };
}

interface VideoCredits {
  [key: string]: VideoCredit;
}

// Load credits for this specific video
function getVideoCredits(): VideoCredits {
  return {
    'colonial-narratives-that-shaped-the-perception-of-ndigbo': {
      title: "Colonial narratives that shaped the perception of ndigbo",
      thumbnail: "https://i.ytimg.com/vi/1OpMb3BPU1M/maxresdefault.jpg",
      credits: {
        books: [
          { citation: "Achebe, C. (1958). Things Fall Apart. William Heinemann Ltd." },
          { citation: "Afigbo, A. E. (2005). The Abolition of the Slave Trade in Southeastern Nigeria, 1885–1950. University of Rochester Press." },
          { citation: "Basden, G. T. (1921). Among the Igbos of Nigeria. Kessinger Legacy Reprint." },
          { citation: "Buxton, T. F. (1840). The African Slave Trade and Its Remedy. John Murray. London." },
          { citation: "Ekechi, F. K. (1972). Missionary Enterprise and Rivalry in Igboland, 1857–1914. Frank Cass." },
          { citation: "Equiano, O. (1789). The Interesting Narrative of the Life of Olaudah Equiano. London." },
          { citation: "Falola, T., & Njoku, R. C. (2016). Igbo in the Atlantic World: African Origin and Diasporic Destination. Indiana University Press." },
          { citation: "Lugard, F. (1905). The Dual Mandate in British Tropical Africa. Cosimo Classics." },
          { citation: "Nwokeji, G. U. (2013). The Slave Trade and the Culture in the Bight of Biafra. Cambridge University Press." },
          { citation: "Domingues da Silva, D. B. (2017). The Atlantic Slave Trade from West African Central 1780–1867. Cambridge University Press." },
          { citation: "Omowale, D. (2019). The Igbo and the Slave Trade: Another Response to Yvette. Carnell, Medium." }
        ],
        visualSources: [
          { title: "Images of enslavement and slavetrade (May 6, 2025)", source: "Alistair Boddy-Evans", link: "https://www.thoughtco.com/images-african-slavery-and-slave-trade-4122913" },
          { title: "Mother and daughter sold at Slave Auction, Southern USA (Nov. 3, 2019)", source: "Ducan1890", link: "https://www.gettyimages.com/detail/illustration/mother-and-daughter-sold-at-slave-auction-royalty-free-illustration/1185247988?adppopup=true" },
          { title: "164 years of the coming of Christianity to Igboland (May 27, 2021)", source: "odugwu media", link: "https://www.odogwublog.com/164-years-of-the-coming-of-christianity-to-igboland/#google_vignette" },
          { title: "How christianity spread in Nigeria during the 19th century (March 16, 2025)", source: "Afriklens", link: "https://www.afriklens.com/how-christianity-spread-in-nigeria-during-the-19th-century/" },
          { title: "Moral Evil Economic good, Washing the sins of colonialism (Feb. 22, 2021)", source: "Sabelo J Ndlovu-Gatsheni", link: "https://www.aljazeera.com/opinions/2021/2/26/colonialism-in-africa-empire-was-not-ethical" },
          { title: "Footage of Nigerian Flag Flying (n.d.)", source: "This vikto", link: "https://www.pexels.com/video/low-angle-view-of-the-nigerian-flag-waving-on-a-pole-15922465/" },
          { title: "In former British colonies (Sept. 12, 2022)", source: "The Washington Post", link: "https://www.washingtonpost.com/world/2022/09/12/queen-elizabeth-death-africa-colonialism/" },
          { title: "Image of Colonial Masters", source: "Alarmy", link: "https://www.alamy.com/stock-photo/colonial-master.html?sortBy=relevant" },
          { title: "Antique Image from British Magazine (August 31, 2023)", source: "ilbusca", link: "https://www.gettyimages.com/detail/illustration/antique-image-from-british-magazine-officers-royalty-free-illustration/1650270014?adppopup=true" },
          { title: "Sir Henry Johnson (1970)", source: "Norman Hepple", link: "https://collection.sciencemuseumgroup.org.uk/objects/co227816/sir-henry-johnso" },
          { title: "Image of The Transatlantic Slave Trade (Sept 22, 2023)", source: "Thomas lewis", link: "https://www.britannica.com/topic/transatlantic-slave-trade" },
          { title: "Journey to the Recovery of the source of the Nile (May 6, 2025)", source: "Alistair Buddy", link: "https://www.thoughtco.com/images-african-slavery-and-slave-trade-4122913" },
          { title: "Details of horrific first voyage in transatlantic slave trade (27 Aug., 2018)", source: "David keys", link: "https://www.independent.co.uk/news/world/americas/transatlantic-slave-trade-voyages-ships-log-details-africa-america-atlantic-ocean-deaths-disease-a8494546.html" },
          { title: "Trans Atlantic slave trade (2008)", source: "Smithsonia National Museum", link: "https://www.britannica.com/summary/Transatlantic-Slave-Trade-Timelin" },
          { title: "Igbo Landing Story (20th August 2022)", source: "voice of Ndi Igbo Post", link: "https://www.facebook.com/OnuIgbo/posts/the-igbo-landing-story-is-a-story-of-mass-suicide-of-enslaved-igbo-people-who-ch/1538630709888905/" },
          { title: "Black History Month (Feb 21, 2020)", source: "Chike Uduah", link: "https://chikaoduah.medium.com/black-history-month-remember-igbo-landing-and-the-flying-africans-16686b2f25dc" },
          { title: "Olaudah Equiano (June 1, 1840)", source: "Daniel Orime", link: "https://en.wikipedia.org/wiki/Olaudah_Equiano" },
          { title: "Image of Niger Expedition (1841)", source: "Wikipedia (Free Encyclopedia)", link: "https://en.wikipedia.org/wiki/Niger_expedition_of_1841" },
          { title: "Queen Victoria of England (13 August 2013)", source: "Alexenda Bassano, Wikipedia", link: "https://en.wikipedia.org/wiki/Queen_Victoria" },
          { title: "Image of Igbo Landing Story (1Jan. 18, 2025)", source: "United Africa Facebook Page", link: "https://www.facebook.com/100071906905947/posts/the-igbo-landing-story-of-1803-in-may-1803-around-75-igbo-slaves-who-were-being-/625126959894195/" },
          { title: "Image of Igbo Culture and Tradition (27 June, 2020)", source: "Anaerobi Ikenna", link: "https://www.facebook.com/groups/804093113665303/" },
          { title: "John Anyogu (July 5 2020)", source: "Chikezie Ogbonna", link: "https://choiceflame.com.ng/2020/07/05/remembering-bishop-anyogu-the-deep-voice-disciplinarian-who-stood-against-all-odds/" },
          { title: "Rev. G. T. Basden (28 Feb. 2020)", source: "Wikipedia (Free Encyclopedia)", link: "https://en.wikipedia.org/wiki/George_Basden" },
          { title: "Frederick Lugard (1936)", source: "Margery perham (Britannica)", link: "https://www.britannica.com/biography/Frederick-Lugard" },
          { title: "Artfacts (Sept 21, 2024)", source: "Alchetron", link: "https://alchetron.com/Meyer-Fortes" },
          { title: "Hugh Crow (Oct 30, 2025)", source: "ArtsPrints", link: "https://www.art-prints-on-demand.com/a/english-school/captainhughcrow.htm" },
          { title: "Prof. Onwuka Kenneth (Dec,17 2022)", source: "Dike Republic Journal", link: "https://rpublc.com/december-2022/who-was-kenneth-dike/" },
          { title: "Jaja Wachukwu (4th August 2011)", source: "Wikipedia (Free Encyclopedia)", link: "https://en.wikipedia.org/wiki/File:Jaja_Wachuku_at_UN_New_York_USA.jpg" },
          { title: "Edward Allen Falk (Oct. 20, 2024)", source: "The Legacy", link: "https://www.legacy.com/us/obituaries/name/edward-falk-obituary?id=56567953" },
          { title: "Image of The Ekumeku Movement (28th oct 2023)", source: "Koma Club", link: "https://komaclub.com/the-ekumeku-movement-a-valiant-example-of-bravery-and-resistance/" },
          { title: "Image of Aba Women's Riot (March 30, 2013)", source: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Aba_Women_of_Nigeria_%28early_20th_century%29.jpg" },
          { title: "Dr. Nnamdi Azikiwe (1 Oct. 1963)", source: "Wikipedia, Official Experience", link: "https://en.wikipedia.org/wiki/Nnamdi_Azikiwe" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputa Ifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'facts-on-how-ndigbo-lost-their-first-nation': {
      title: "Facts on How Ndigbo Lost Their First Nation",
      thumbnail: "",
      credits: {
        books: [
          { citation: "Azubuike Okoro & Ben Ezumah (2024). Perspectives on Aro History & Civilization. The splendour of a great past vol 1. Lulu Press." },
          { citation: "Samuel Okoro Onwukwe (2023). Arochukwu: The Rise and the Fall of Arochukwu and the Path to Rediscovery. Zoba's facilities." },
          { citation: "Nwankwo Nwaezeigwe, PhD (2020). Politics, Culture and Origins in Nigeria: The Igbo and Their Nri Neighbours. Academic Press." },
          { citation: "Charles M. Ezekwugo (January 1, 1986). Ora-Eri Nnokwa & Nri dynasty. lenjon printers." },
          { citation: "Chukwuemeka I. Onyesoh (2021). Dirt on white spectrum: Myths, Travails and Legacies of Eze Nri, the custodian of Igbo Tradition and Nigerian's Oldest Kingship Institution. The Pan African Press." }
        ],
        visualSources: [
          { title: "Cassava tree (plant with roots) (June 2025)", source: "Shutterstock", link: "https://www.shutterstock.com/es/image-vector/cassava-tree-plant-roots-1567280" },
          { title: "The Maji Maji Rebellion: How African Rebels Held Their Own Against German Colonialists for Two Years (December 22, 2022)", source: "Mr. Madu", link: "https://talkafricana.com/maji-maji-rebellion-1905/" },
          { title: "Group of Warriors from Bornu (November 21, 2019)", source: "World History Encyclopedia", link: "https://www.worldhistory.org/image/11499/group-of-warriors-from-bornu/" },
          { title: "Quarterly Overview of Global and Regional Situation (December 24, 2022)", source: "Nazariya Magazine", link: "https://nazariyamagazine.in/2022/12/24/quarterly-overview-of-global-and-regional-situation-september-to-december-2022/" },
          { title: "The Igbo Nation (24 Feb. 2025)", source: "The tribes", link: "https://www.facebook.com/61552244129979/posts/igbo-is-not-a-tribe-you-dont-use-a-tribe-to-describe-a-group-of-tribes-igbo-is-a/122217709682074804/" },
          { title: "Dim Chukwuemeka Odumegwu Ojukwu (March 2, 2022)", source: "@republicjourna", link: "https://www.instagram.com/p/CamPoHVs0hs/" },
          { title: "Uwazurike (August 26, 2015)", source: "Chukwujekwu Ilozue, The Biafra Times", link: "https://www.thebiafratimes.co/2015/08/compromise-uwazurike-your-member-was.html" },
          { title: "Nnamdi Kanu (15th July 2025)", source: "Angel Network News", link: "https://www.instagram.com/p/DMH1WqyM9I_/?utm_source=chatgpt.com" },
          { title: "Foundation applauds the signing of the Southeast Development Commission bill into law (July 24, 2024)", source: "Lawani Mikairu, Vanguard News", link: "https://www.vanguardngr.com/2024/07/foundation-applauds-the-signing-of-the-southeast-development-commission-bill-into-law/" },
          { title: "Ilo Chi na Ịlọ Ụwa (August 22, 2018): The Cosmic Journey of the Soul in Igbo Cosmology & Spirituality", source: "OmenigboỊlọ", link: "https://igbocybershrine.com/2018/08/22/ilo-chi-na-ilo-uwa-the-cosmic-journey-of-the-soul-in-igbo-cosmology-spirituality/" },
          { title: "Traditional art series (Nigerian Art): Igbo Ukwu art (5 Sept. 2020)", source: "Ihesiulo Grace, DAILY TIMES Nigeria", link: "https://www.dailytimesng.com/traditional-art-series-nigerian-art-igbo-ukwu-art/" },
          { title: "Woman of Isele Asaba (August 4, 2021)", source: "Entanglements, Re-Entanglements", link: "https://re-entanglements.net/physical-types/" },
          { title: "Image of Traditional Bilas from Papua New Guinea's Maprik region (2023)", source: "David Kirkland", link: "https://www.davidkirklandphotography.com/media/2ecea48d-045b-4a13-89ab-b8d36317d822-local-art-maprik-region-papua-new-guinea" },
          { title: "How colonial Govt launched the de-Igbonisation of Igbos in Rivers, Delta (Jan. 20, 2025)", source: "David Kirkland Photography", link: "https://www.irohinodua.org/how-colonial-govt-launched-the-de-igbonisation-of-igbos-in-rivers-delta/" },
          { title: "Nri-Igbo (Jan. 15, 2025) (last edited)", source: "Wikipedia (Hausa edition)", link: "https://ha.wikipedia.org/wiki/Nri-Igbo" },
          { title: "Nara Early Educational History (25 Oct. 2024)", source: "Ikenga Unateze Heritage: Facebook Page – Unoohutaeze", link: "https://www.facebook.com/Unoohutaeze/photos/nara_early_educational_history-copied-from-ikenga-unateze-heritage-series-articl/978660624276981/" },
          { title: "A photograph of Chief Mgbeze of Okpanam at the Udo Shrine, after his title-taking ceremony in 1912 (April. 17 2024)", source: "Eclectic histories", link: "https://www.instagram.com/p/C53KB5LrqHq" },
          { title: "Scarification (Jan. 23 2025)", source: "Chuka Odike", link: "https://ozikoro.com/tag/scarification/" },
          { title: "Myths of Divination and Parables (Jan 23 2025)", source: "LUKU", link: "https://filesheet.wordpress.com/2013/08/29/myths-of-divination-and-parables/" },
          { title: "Obi of Onitsha Samuel Okosi I, the First Christian Obi of onitsha.1899 (March 29, 2024)", source: "Onyeka Nwokike, Igbo Archives", link: "https://igboarchives.com.ng/obi-onitsha-sammy-okosi-the-first-christian-obi-of-onitsha-1899/" },
          { title: "How Igbos Lived in the Olden Days (April 4, 2022)", source: "aribisala, nairaland.com", link: "https://www.nairaland.com/6624267/how-igbos-lived-olden-days/26" },
          { title: "Residual Souls \"Aborted Children and Igbo Cleansing (June 14, 2024)", source: "Odinaala", link: "https://www.instagram.com/p/C8L3CagtWuF/" },
          { title: "Igbo History (27 Aug. 2022)", source: "Igbo history Post", link: "https://www.facebook.com/100066676973079/posts/eze-nri-ifikuanim-the-priest-king-of-the-ancient-nri-kingdom-of-igboland-was-a-h/459415809428962/" },
          { title: "Benadir. Galla Abdallah, the first freed slave in Somalia (Sept. 2, 2008)", source: "somala-bulshada soomaaliyeed", link: "https://www.reddit.com/r/Somalia/comments/yaubto/1893_benadir_galla_abdallah_the_first_freed_slave/" },
          { title: "Slave owner shooting a fugitive slave (27 May 2025)", source: "Slavery", link: "https://commons.wikimedia.org/wiki/File:Slavery16.jpg" },
          { title: "Uzuzu Oke Ngene Success Odini Igbo (18 Aug. 2021)", source: "Uzuzu Oke Ngene Success Odini Igbo Post", link: "https://www.facebook.com/Uzuzu-Oke-Ngene-Success-Odini-Igbo-101218085351251/photos/210675431072182/" },
          { title: "You Shouldn't Die of Poverty and Hunger in A Blessed Land Like Ours: A Look at Our Profitable Resources (27 Sept. 2021)", source: "Lens of Meaning Post", link: "https://www.facebook.com/LensofMeaning/posts/you-shouldnt-die-of-poverty-and-hunger-in-a-blessed-land-like-ours-a-look-at-our/389052602768051/" },
          { title: "Nigeria Kingdom series (May 6, 2024)", source: "Historylovers _001", link: "https://www.instagram.com/p/C6o4SMiI_lc/" },
          { title: "Some Health Benefits of Cocoyam (4th March, 2025)", source: "Folahan Oyelekan", link: "https://www.facebook.com/photo.php?fbid=9363852713691501&id=100002005976633&set=a.109519909124" },
          { title: "We sustain oil palm in Edo state (Aug. 4, 2022)", source: "The Guardian", link: "https://guardian.ng/news/we-can-sustain-500m-oil-palm-investment-in-edo-says-obaseki/" },
          { title: "How to Start Ugu Farming in Nigeria (A-Z of Running A Profitable Ugu Farm (Feb. 22, 2024)", source: "Adewebs, agrolearner.com", link: "https://agrolearner.com/ugu-farming/" },
          { title: "Igbo ironworking technology originated in Awka (Aug 3, 2022)", source: "Igbo History", link: "https://www.instagram.com/p/CvfaCBetBo" },
          { title: "Basketry or basket making, known as \"ikpa nkata\" in Igbo culture (March 28 2024)", source: "Igbo history", link: "https://www.instagram.com/p/C5EihacrLhU/" },
          { title: "Akwete weaving a century Igbo old tradition (sept 18 2025)", source: "zinkatadaily", link: "https://www.instagram.com/p/DOqmuZFiEZ5/" },
          { title: "Uli is a celebrated Igbo artform that has been the subject of many studies over the decades, serving as an inspiration for artists both at (June 11,2024)", source: "Igbo History", link: "https://www.instagram.com/p/C8FdqNmtev9/" },
          { title: "Ishiagu Pottery Works: Traditional Igbo Craftsmanship in Ebonyi State (Not specified)", source: "Nnewi City Editorial Team", link: "https://nnewicity.com/ishiagu-pottery-works-traditional-igbo-craftsmanship-in-ebonyi-state/" },
          { title: "Ikoro, The Voice of the Gods (Nwadịọramma (17 Feb 2024)", source: "Umuahia first post", link: "https://www.facebook.com/100064158180328/posts/ikoro-the-voice-of-the-godswritten-by-nwad%E1%BB%8B%E1%BB%8Drammawhen-a-man-moulds-a-big-lump-of/800859128729353/" },
          { title: "Fayil Traditional Medicine (10 sept 2014)", source: "Wikipedia Hausa", link: "https://ha.m.wikipedia.org/wiki/Fayil:Traditional_Medicine.JPG" },
          { title: "Isiagu pottery (Sept 17, 2025): Isiagu pottery work :Craftsmanship in Ebonyi State", source: "Isiagu pottery work", link: "https://nnewicity.com/ishiagu-pottery-works-traditional-igbo-craftsmanship-in-ebonyi-state/" },
          { title: "Basden Igbo market (Jan 1 1930)", source: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Basden_Igbo_market.jpg" },
          { title: "MAKING WATER AND COOKING POTS (Igbo women) (1921)", source: "George basden", link: "https://ukpuru.tumblr.com/post/38153851446/igbo-women-making-water-and-cooking-pot" },
          { title: "Dibia mkpọrọgwụgwụ na mkpa akwụkwọ (December 17, 2012)", source: "NDỊ IGBO Global's post", link: "https://www.facebook.coImage Title: Dibia Mkpụrụ ndị gwụgụ na mkpa akụkwịrị" },
          { title: "Native Doctor (22 Oct. 2024)", source: "IHIALA LGA HOMIES", link: "https://www.facebook.com/groups/299035713465089/posts/8427313587303887/" },
          { title: "Prince Henry the Navigator (May 21, 2021)", source: "Nuno Gonçalves", link: "https://www.worldhistory.org/image/14066/prince-henry-the-navigator" },
          { title: "When was gun powder invented? (March 13, 2025)", source: "Robert Holmes", link: "https://www.thecollector.com/history-of-gunpowder/" },
          { title: "Translucent Ancient Glass (2025)", source: "ZakSAntiquities.com", link: "https://zaksantiquities.com/shop/ancient-roman-glass/jars-flasks/roman-glass-perfume-jar-2/" },
          { title: "NatCopper (6th July, 2009)", source: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:NatCopper.png" },
          { title: "Bartering for slaves at a fort on the Guinea coast (1911)", source: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Bartering_for_slaves_at_a_fort_on_the_Guinea_coast.png" },
          { title: "The Igbo People (14th April 2017)", source: "Kemi Sara", link: "https://www.facebook.com/groups/1474041249514450/" },
          { title: "Eze Nri Obalike with Alo and Gong (July 30, 2021)", source: "The Eastern Post's post", link: "https://www.facebook.com/easternpost17/posts/ezenri-obalike-with-alo-and-gongeze-nri-%C3%B2bal%C3%ADke-is-the-15th-recorded-eze-nri-of-/545375540213226/" },
          { title: "The Brief History of Egba (Oct. 3, 2012)", source: "oloolutof.wordpress.com", link: "https://oloolutof.wordpress.com/2012/10/03/the-brief-history-of-egba/" },
          { title: "Olaudah Equiano (Oct. 23, 2025)", source: "Iguedo and Omanbala", link: "https://x.com/RealOlauda" },
          { title: "Osun-Osogbo Sacred Grove (15 July, 2005)", source: "Thierry Joffroy", link: "https://whc.unesco.org/en/list/1118/gallery/" },
          { title: "Ugwuele Archaeological Findings (15th July, 2025)", source: "Wikipedia", link: "https://en.wikipedia.org/wiki/Ugwuele" },
          { title: "King Duke ix of calabar (March 14th, 2025)", source: "patrick_patrickstories", link: "https://www.instagram.com/p/DHKRHc1MBTk/" },
          { title: "Mangaaka (March 27, 2025)", source: "African arts", link: "https://www.britannica.com/art/likembe-dza-vadzimu" },
          { title: "Uli — The Art of Igbo Body Decoration (28th Sept, 2024)", source: "Onyeka Nwokike", link: "https://igboarchives.com.ng/uli-the-art-of-igbo-body-decoration/" },
          { title: "The Story of a Great Warrior Who Inspired Chimurenga (Oct. 20, 2018)", source: "Murenga", link: "https://pamberineruzhinji1980.wordpress.com/2018/10/20/murenga-the-story-of-a-great-warrior-who-inspired-chimurenga/" },
          { title: "A Group of Igbo Warriors in Ancient Times (20th Oct, 2013)", source: "Nigerian Nostalgia Project", link: "https://nigerianostalgia.tumblr.com/post/64608078110/ukpuru-a-group-of-igbo-warriors-in-ancient" },
          { title: "Unveiling Ohafia's Historical heritage and significance at Ohafia war Dance (10th Oct 2024)", source: "Amos kalu Oge", link: "https://www.ohafiatv.com/unveiling-ohafias-historical-heritage-and-significance-of-ohafia-war-dance/" },
          { title: "Mazi Kanu Oji, the eze (king) of Aro in Nigeria (8 Dec., 2019)", source: "Aro Okeigbo Blog", link: "https://www.facebook.com/photo.php?fbid=1170905956454022&id=660049817539641&set=a.690367141174575" },
          { title: "In Igbo cosmology the elephant tusk known as Okike (May 14, 2025)", source: "Afiatvofficial", link: "https://www.instagram.com/p/DJoF4vvoRgq/" },
          { title: "Major Historical Events in Nigeria During the Colonial Era (4th Oct., 2014)", source: "Adarianna simwa", link: "https://www.legit.ng/1128532-major-historical-events-nigeria-colonial-era.html" },
          { title: "Ekpeye (Ekpafia Igbo) (2025)", source: "Jones Archive", link: "https://jonesarchive.siu.edu/ekpeye-ekpafia-igbo/" },
          { title: "Mirroring Nigeria's First Indigenous (March 21, 2024): Niger Delta's Jonathan A. Green", source: "NDLink", link: "https://ndlink.org/mirroring-nigerias-first-indigenous-photographer-niger-deltas-jonathan-a-green/" },
          { title: "Kenyans Are Far Behind Nigerians In Every Aspect (Sept 3, 2016)", source: "Fani Kayode, nairaland.com", link: "https://www.nairaland.com/3327823/kenyans-far-behind-nigerians-every/" },
          { title: "Igbo Culture and Origin (15th Dec. 2022)", source: "Isioma Ani (Igbo people of Nigeria)", link: "https://www.facebook.com/groups/httpsyoutube.comchannelucwgna8mhaahnoxhhxlpi/posts/8444207252317801" },
          { title: "People at Ehugbo (Afikpo) (August 12, 2020)", source: "@ukpuru", link: "https://www.instagram.com/p/CDyvElHF0Kd/" },
          { title: "History of Igbo People: Exploration of the Origins of the Igbo Tribe of Nigeria (March 22, 2025)", source: "Barack Okaka Obama", link: "https://www.omtchannel.com.ng/2025/03/history-of-igbo-people-exploration-of.html" },
          { title: "Igbo Architecture (15 Oct. 2022)", source: "adjayevisua", link: "https://www.instagram.com/p/CjbZAMXqMaC/" },
          { title: "Ancient Pyramids in Igbo Land Suggest a West African Origin of Egyptian Civilization", source: "Igbo history Museum", link: "https://igboacienthistory.weebly.com/ancient-pyramids-in-igbo-land-suggest-a-west-african-origin.html" },
          { title: "Dike Tower (Sept 2 2025)", source: "Osiakponmwonsa", link: "https://www.instagram.com/p/DOGDUXojeYC/" },
          { title: "Ukpuru (6th May, 2016)", source: "Tumblr – Ụkpụrụ", link: "https://ukpuru.tumblr.com/post/118302297417/emene-owo-igbo-country-compound-of-nnaji" },
          { title: "Historical images of the igbo, their neighbour and beyond (Feb. 6, 2015)", source: "Ụkpụrụ", link: "https://ukpuru.tumblr.com/post/110208262012/a-girl-wife-belles-of-the-village-igbo" },
          { title: "The Aro Settlements And The Confederacy (Sep. 12, 2022)", source: "AkuOlisa, Nairaland", link: "https://www.nairaland.com/7329368/aro-settlements-confederacy" },
          { title: "Exploring the Osun-Osogbo Sacred Grove (2017)", source: "Finelib.com", link: "https://www.finelib.com/about/places-and-attractions/exploring-the-osunosogbo-sacred-grove-a-testament-to-yoruba-culture-and-tradition/702" },
          { title: "The slave trade,maroons,windsrceen wipers and Reparation (Jan. 18, 2015)", source: "KellyKatharin", link: "https://kellykatharin.com/the-slave-trade-maroons-windscreen-wipers-and-reparations-i-want-to-know/" },
          { title: "Resources - Social Justice & Civil Rights History (July 19, 2023)", source: "Yesterday's AmericaTeam", link: "https://yesterdaysamerica.com/resources-social-justice-civil-rights-history" },
          { title: "The Significance of Disease Driving Historical Change (April 19, 2022)", source: "HubPages Contributor", link: "https://discover.hubpages.com/education/The-Significance-of-Disease-Driving-Historical-Change-Between-1500-and-1800" },
          { title: "African transport in African (Nov 17, 2004)", source: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:AfricanSlavesTransport.jpg" },
          { title: "Significance of Igbo Trumpet (Dec 12,2024)", source: "Sophia Igbani", link: "https://ogbonoblog.com/education/the-significance-of-igbo-trumpets/" },
          { title: "Our History to pre-colonial Africa (Jan 2018)", source: "Peace92", link: "https://steemit.com/history/@peace92/our-history-to-pre-colonial-africa" },
          { title: "Eze Nri Ifikuanim, the Priest-King of the ancient Nri kingdom of Igboland (12 Aug. 2021)", source: "dailytimes", link: "https://dailytimesng.com/back-in-history-eze-nri-ifikuanim-the-priest-king-of-the-ancient-nri-kingdom-of-igboland/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputa Ifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'for-igbo-origin-follow-those-who-know-the-way': {
      title: "For Igbo Origin, Follow Those Who Know The Way",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Prof. Peter-Jazzy Ezeh for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Prof. Ezeh in line with YouTube Policies. All views expressed remain those of Prof. Ezeh and do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Dike, K. O., & Ekejiuba, F. I. (1990). The Aro of South-Eastern Nigeria, 1650–1980: A Study of Socio-Economic Formation and Transformation in Nigeria. Ibadan: University of Ibadan Press." },
          { citation: "Kenneth Onwuka Dike (1956). Trade and Politics in the Niger Delta, (1830‑1885): An Introduction to the Economic and Political History of Nigeria. Clarendon Press (Oxford)." },
          { citation: "Prof. Adiele Afigbo (1981). Ropes of Sand: Studies in Igbo History and Culture. Published for University Press in association with Oxford University Press Nigeria (Ibadan)." },
          { citation: "Prof. Elizabeth Isichei (1977). Igbo Worlds. Macmillan (London) Cambridge University Press & Assessment." },
          { citation: "Mbonu Ojike (1955). My Africa by Blandford Press (London)." }
        ],
        visualSources: [
          { title: "Who Was Kenneth Onwuka Dike? (December 17, 2022)", source: "Afoma Dike / Remembering the Father of Modern African", link: "https://rpublc.com/december-2022/who-was-kenneth-dike/?utm_source=chatgpt.com" },
          { title: "Kenneth L. Pike (Prof. of Linguistics,1948-1979) (4th July 2024)", source: "University of Michigan faculty portrait", link: "https://en.wikipedia.org/wiki/Kenneth_Lee_Pike?utm_source=chatgpt.co" },
          { title: "Professor Adiele Afigbo (3rd August 2009)", source: "AEAfigbo", link: "https://en.wikipedia.org/wiki/Adiele_Afigbo?utm_source=chatgpt.com#/media/File:AEAfigbo.jpg" },
          { title: "Lord Lugard, British Colonial Administrator (19 nov 2010)", source: "Alarmy", link: "https://www.alamy.com/stock-photo/british-colonial-administrator.html?sortBy=relevant" },
          { title: "A History of the Igbo (1976) Elizabeth Isichei", source: "Palgrave Macmillan (UK) / Macmillan", link: "https://books.google.com.ng" },
          { title: "Who Is Professor Elisabeth Isichei (October 8, 2024)", source: "Fada Angelo Chidi Unegbu post", link: "https://www.facebook.com/100064601959594/posts/who-is-professor-elisabeth-isichei-profesdor-elisabeth-isichei-was-born-elizabet/942623504567706/" },
          { title: "Felicia Ekejiuba (Associate professor at fein,such khan and amp shepard) (Oct 2009)", source: "by Felicia Ekejiuba", link: "https://www.linkedin.com/in/felicia-ekejiuba-a576551a" },
          { title: "Mbonu Ojike, an African delegate from Nigeria (September 1942)", source: "photographer Gordon Parks", link: "https://commons.wikimedia.org/wiki/File:Mbonu_Ojike,_an_African_delegate_from_Nigeria_LCCN2017836079.jpg" },
          { title: "Key dates in the history of the African integration process (April 2018)", source: "Libor Grega & Petr Blizkovsky", link: "https://www.researchgate.net/figure/Key-dates-in-the-history-of-the-African-integration-process_tbl2_324506184" },
          { title: "African Intellectuals As Cultural Nationalists (Year, 2014): A Comparative Analysis Of Edward Wilmot Blyden And Mbonu Ojike", source: "by Glorie Chuku", link: "https://www.journals.uchicago.edu/doi/abs/10.5323/jafriamerhist.99.4.0350?journalCode=jaah" },
          { title: "The Discovery of the Egyptian Duat, The Table of the Sun and the World's Old. Catherine Acholonu Research Center (CARC Africa). (July 20, 2020)", source: "@carc_africa (Lejja)", link: "https://www.facebook.com/Catherine.Acholonu.Research.Center/posts/134434814968582/" },
          { title: "Thurstan Shaw's contributions to West African archaeology (10 sept 2013)", source: "by kevin c macdonald", link: "https://www.tandfonline.com/doi/full/10.1080/0067270X.2013.828390" },
          { title: "The Cave of Ashes in Ondo State (July 22, 2025)", source: "Historical Nigeria post", link: "https://www.facebook.com/HistoricalNigeria/posts/ih%C3%B2-el%C3%A9%C3%89%C3%A9r%C3%BA-the-cave-of-ashes-in-ondo-state-a-window-into-africas-ancient-pasthid/122228773148189242/" },
          { title: "Bronze pot, Igbo-Ukwu, 9th century.JPG by Thurstan Shaw (3 October 2013)", source: "Wikimedia Commons", link: "https://en.wikipedia.org/wiki/Charles_Thurstan_Shaw#/media/File:Bronze_pot,_Igbo-Ukwu,_9th_century.JPG" },
          { title: "Thurstan shaw (3 November 1967)", source: "by John Atherton", link: "https://en.wikipedia.org/wiki/Charles_Thurstan_Shaw#/media/File:Bronze_pot,_Igbo-Ukwu,_9th_century.JPG" },
          { title: "Ochiwar Bronze ceremonial vessel in the form of a snail shell, 9th century, Igbo‑Ukwu, Nigeria (October 3, 2013)", source: "Wikimedia Commons (CC BY-SA 3.0)", link: "https://upload.wikimedia.org/wikipedia/commons/8/83/Bronze_ceremonial_vessel_in_form_of_a_snail_shell%2C_9th_century%2C_Igbo-Ukwu%2C_Nigeria.JPG" },
          { title: "The Igbo Ukwu Bronzes (December 24, 2024)", source: "@nigerianshistory", link: "https://www.instagram.com/p/DD9WlJ0qkYz/" },
          { title: "James Africanus Beale Horton (1868) (2011)", source: "West African Countries and Peoples, British and Native: And a Vindication of the African Race by Cambridge University Press", link: "https://books.google.com" },
          { title: "Horton, James 'Africanus' Beale (1835-1883) (May 22, 2009)", source: "BlackPast.org", link: "https://blackpast.org/global-african-history/horton-james-africanus-beale-1835-1883/" },
          { title: "Igbo independence (February 5, 2022)", source: "Onitsha Rant", link: "https://www.facebook.com/groups/494301797793142/posts/1062660210957295" },
          { title: "Portrait of an African by Allan Ramsey", source: "Fine Art America", link: "https://fineartamerica.com/shop/framed+prints/allan+ramsay" },
          { title: "Prof. Anezi Okoro (December 11, 2024)", source: "Historical Nigeria", link: "https://www.facebook.com/HistoricalNigeria/posts/west-african-first-professor-of-dermatology-and-renowned-author-of-the-popular-n/122186489774189242/" },
          { title: "Corpus Christi College in Cambridge (August 24, 2014)", source: "Peter Trimming (via geograph.org.uk)", link: "https://upload.wikimedia.org/wikipedia/commons/8/89/Corpus_Christi_College_in_Cambridge_-geograph.org.uk-_3937854.jpg" },
          { title: "Group seeks end to herders/farmers crisis in Taraba (January 3, 2025)", source: "Blessing Oziwo, thetrumpet.ng", link: "https://thetrumpet.ng/group-seeks-end-to-herders-farmers-crisis-in-taraba/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputa Ifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'hear-values-that-make-ndigbo-great-by-prof-casmir-ck-ani-part-2': {
      title: "Hear Values that make Ndigbo Great by Prof. Casmir C.K. Ani Part 2",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Prof. Casmir C.K. Ani for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Prof. Casmir C.K. Ani in line with YouTube Policies. All views expressed remain those of Prof. Ani and do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Ikejiani-Clark, M. (2009). Peace studies and conflict resolution in Nigeria: A reader. Ibadan, Nigeria: Spectrum Books." }
        ],
        visualSources: [
          {
            title: "Prof. Miriam Ikejiani-Clark (2011, October 11)",
            source: "Testing Only on 25 Jan 2012",
            link: "https://testingonlyon25jan2012.wordpress.com/2011/10/11/miriam-ikejiani-clark-tear-for-a-quintessential-woman/"
          },
          {
            title: "Monsignor Obiora Ike (Producer). (May 27, 2018). Lohmann, M. Image [Video screenshot]. YouTube.",
            source: "Obiora Ike Christentum & Islam",
            link: "https://www.youtube.com/watch?v=HJc20iyGAwI"
          },
          {
            title: "Ngozi Okonjo-Iweala, Managing Director, World Bank Fund. (July 28, 2010). International Monetary [Photograph]. IMF Photographic Archives.",
            source: "Wikipedia",
            link: "https://yo.wikipedia.org/wiki/Ngozi_Okonjo-Iweala#/media/F%C3%A1%C3%ACl%C3%AC:Okonjo-Iweala,_Ngozi_(2008_portrait).jpg"
          },
          {
            title: "Chimamanda Ngozi Adichie. (2025, February 17). Nwebonyi OliverJunior [Photograph]. Facebook group \"Nigerian Teachers\".",
            source: "Facebook",
            link: "https://www.facebook.com/groups/nigerianteachers/posts/4959580914267255/"
          },
          {
            title: "Dr. Chuba Okadigbo (2024, February 8)",
            source: "Wikipedia, Wikimedia Commons",
            link: "https://commons.wikimedia.org/wiki/File:"
          }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'how-to-achieve-unity-and-solidarity-among-ndigbo': {
      title: "How to Achieve Unity and Solidarity Among Ndigbo",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Dr. I.O. Ezuma for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Dr. I.O. Ezuma in line with YouTube Policies. All views expressed by Dr. I.O. Ezuma do not represent the position of Ndigbo Viva.`,
        books: [],
        visualSources: [
          { title: "30 Years Later Genocide Still Scars Rwanda (April 9, 2024)", source: "The Orange County Register", link: "https://www.ocregister.com/2024/04/09/30-years-later-genocide-still-scars-rwanda/" },
          { title: "Dibia Nwangwu Uchendu Ngwụ (August 21, 2023). Spiritual Tree And Its Spiritual Significance", source: "Dibia Nwangwu Uchendu", link: "https://dibianwangwuuchendu.com/2023/08/21/ngwu-spiritual-tree-and-its-spiritual-significance/" },
          { title: "What is the significance of Ovo and Arua in Uburu Traditional Setting? (8 May, 2025)", source: "Facebook group post", link: "https://www.facebook.com/groups/462680338156672/posts/1322634972161200/" },
          { title: "Resources – Calvary Baptist Church", source: "Calvary Baptist Church (Irwin)", link: "https://calvarybaptistirwin.org/resources.html" },
          { title: "Oil Palm Production in Nigeria: What You Should Know (August 21, 2023)", source: "Afrimash", link: "https://afrimash.com/oil-palm-production-in-nigeria-what-you-should-know/" },
          { title: "The African Pear (Dacryodes edulis) (Feb. 13, 2025)", source: "Zigwen Fashion", link: "https://www.facebook.com/zigwenfashion/posts/the-african-pear-also-known-as-dacryodes-edulis-is-a-tropical-fruit-that-grows-p/602535422633156/" },
          { title: "Beer Consumption in Nigeria Is the Highest Alcohol-Drinking Country In Africa (12 May 2017)", source: "Africa Business Insider", link: "https://africa.businessinsider.com/lifestyle/beer-consumption-nigeria-is-the-highest-alcohol-drinking-country-in-africa/yjlblkz" },
          { title: "Roasted New Yam and Ukana with 4 lives Sauce (Sept. 19, 2018)", source: "Nd Beau @BeauCanCook", link: "https://cookpad.com/eng/recipes/5845729?search_term=news&via=search" },
          { title: "Indian company to invest $80 million in Pokot cement plant (April 9, 2024)", source: "The EastAfrican", link: "https://www.theeastafrican.co.ke/tea/business-tech/indian-company-to-invest-80-million-in-pokot-cement-plant-1295486#google_vignette" },
          { title: "Black and White Chick / Chicken / Hen Poultry", source: "WallpaperFlare user", link: "https://www.wallpaperflare.com/black-and-white-chick-chicken-hen-poultry-rooster-baby-easter-wallpaper-zeazc" },
          { title: "Arch Coal & Peabody Energy Joint Venture (June 19, 2019)", source: "The Wall Street Journal", link: "https://www.wsj.com/articles/arch-coal-peabody-energy-to-form-coal-joint-venture-11560948644" },
          { title: "Ancient Igbo Practices You Should Not Do In A Dibia's House (24th oct, 2024)", source: "Tobe Osigwe", link: "https://www.youtube.com/watch?v=t1qC5jvXt-0" },
          { title: "A Review of Phytochemical and Pharmacological Activity of Mangifera indica Linn. (Sept. 14, 2024)", source: "Sivaranjini S., Sakthi Abirami M., Arun K.", link: "https://ijppr.humanjournals.com/wp-content/uploads/2024/09/14.Sivaranjini-S-Sakthi-Abirami-M-Arun-K.pdf" },
          { title: "Vertical shot of trees in the desert in Deadvlei, Namibia, under a blue sky", source: "Wirestock / Freepik", link: "https://www.freepik.com/free-photo/vertical-shot-trees-desert-deadvlei-namibia-blue-sky_13006847.htm" },
          { title: "The IPOB Agricultural Revolution — \"Ehi Igbo\" (Aug 29, 2024)", source: "This is Ehi Igbo, Emeka Gift", link: "https://x.com/EmekaGift100/status/1829097487610589346" },
          { title: "This is local egg (akwa okuku) Igbo (July 23, 2023)", source: "Ezemmiri Na Igbo. Facebook user at profile ID 100069672669650", link: "https://www.facebook.com/100069672669650/posts/this-is-local-egg-akwa-okuku-igbo-as-the-color-differs-so-does-the-work-although/351816450479028/" },
          { title: "G – Nigeria (Nok, Igbo Ukwu, Ife) Flashcards", source: "Quizlet user (243451719)", link: "https://quizlet.com/243451719/g-nigeria-nok-igbo-ukwu-ife-flash-cards/" },
          { title: "Hausa/Igba-meta tí kò já lórí ìgbà Hausa Ìṣáájú kí àwọn Fulani tó dé ibẹ̀ ìgbà àkọ́kú (March 20, 2024)", source: "Itan Yoruba (Facebook page)", link: "https://www.facebook.com/itanyoruba1/posts/hausaigba-meta-t%C3%AD-k%E1%BB%8Dj%C3%A1-l%C3%B3r%C3%AD-%C3%ACgb%C3%A0-hausa-%E1%B9%A3%C3%A1%C3%A1j%C3%A9-k%C3%AC-%C3%A0w%E1%BB%8Dn-fulani-t%C3%B3-d%C3%A9-ib%E1%BA%B9-%C3%ACgb%C3%A0-%C3%A0k%E1%BB%8D%CC%81k/813515947482828/" },
          { title: "Odinạnị (22, August 2022)", source: "Wikipedia contributors", link: "https://ig.wikipedia.org/wiki/Odin%E1%BA%A1n%E1%BB%8B" },
          { title: "Kene Nnewi (March 8, 2020)", source: "Kene Nnewi", link: "https://x.com/Kene_Nnewi/status/1236558582071668737" },
          { title: "10 People Killed, Many Injured, 10 Communities Burnt in Taraba Ongoing Crisis (April 7,2019)", source: "Nathaniel Gbaoron, Jalingo, businessday.ng", link: "https://businessday.ng/uncategorized/article/10-people-killed-many-injured-10-communities-burnt-in-taraba-ongoing-crisis/" },
          { title: "Ogun iko, coughódidí, atare meje, orogbo meje, obi-abàtà meje, ogede òminì-bí ó (Sept. 19, 2025)", source: "Iwulo Ewe Ati iwosan", link: "https://www.facebook.com/100063643055447/posts/ogun-iko-coughodidi-atare-meje-7-orogbo-meje-7-obi-abata-meje-7-ogede-omini-bi-o/1415815307216558/" },
          { title: "Great Igbo Human Achievements. A Compendium (August 10, 2015)", source: "Things Fall Apart/Chinua Achebe, Nairaland", link: "https://www.nairaland.com/2516317/great-igbo-human-achievements-compendium" },
          { title: "Food Science And Tech Diary – Facebook Group Cover/Logo", source: "Food Science And Tech Diary (Facebook Group)", link: "https://www.facebook.com/groups/380538522058342/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'igbo-god-before-christianity': {
      title: "Igbo God Before Christianity",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Prince C.I. Onyesoh for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Prince C.I. Onyesoh in line with YouTube Policies. All views expressed remain those of Prince C.I. Onyesoh and do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Prince Chukwuemeka I. Onysoh (2021). Dirts on white on Spectrum. The Pan Afrika Press." },
          { citation: "Prince Chukwuemeka I. Onysoh (2017). To The Rescue; The Right To Self-Determination, The Pathways To A Genuine Federation Of People With No Shared Values. FPNEV." },
          { citation: "Prince Chukwuemeka I. Onysoh (2023). Defeat of Biafra, The Conquest Of Nigeria; Easy On The Niger Civil War, 1967-70 Volume 1. The Pan Afrika Press." }
        ],
        visualSources: [
          { title: "A 9th century Bronze ceremonial pot (Oct. 2013)", source: "Wikimedia Common", link: "https://ig.wikipedia.org/wiki/Fa%E1%BB%8Bl%E1%BB%A5:Intricate_bronze_ceremonial_pot,_9th_century,_Igbo-Ukwu,_Nigeria.jpg" },
          { title: "Ichi Marks (July 24, 2020)", source: "Obinna_Eze", link: "https://www.facebook.com/photo/?fbid=903534363487872&set=a.504994096675236" },
          { title: "Masquerade dance (Aug 11 2014)", source: "G. I. Jones", link: "https://ukpuru.tumblr.com/post/94463724902/small-boys-masquerade-in-ovim-village-isu-ikwa" },
          { title: "Abolition of killing of Twin (n.d.)", source: "yoruba_ness", link: "https://www.instagram.com/p/DPrR430jARN/" },
          { title: "Cannibals (April 8, 2024)", source: "Igbo history.TV", link: "https://www.facebook.com/photo.php?fbid=824303399729257&id=100064488147167&set=a.466760278816906" },
          { title: "Missionary in Ivory Coast (n.d.)", source: "gettyimage", link: "https://www.gettyimages.ie/detail/news-photo/vintage-postcard-featuring-a-catholic-catechism-exami" },
          { title: "Eze Nri Obalike (n.d.)", source: "Noni Edozie", link: "https://x.com/Hibana122/status/1975914679282418006/photo/2" },
          { title: "Nwanyi Ajadu (n.d.)", source: "IgboProverbs", link: "https://nigeriandictionary.com/tupu-gi-na-nwanyi-ajadu-ebido-ime-eyi-juo-ihe-gburu-di-ya#google_vignette" },
          { title: "Emergency shelter building (May 12, 2025)", source: "hotashstove", link: "https://hotashstove.com/blogs/news/emergency-shelter-building" },
          { title: "Tabansi, Eze Nri (June 9, 2022)", source: "Voice of The East-NDI IGBO's Post", link: "https://www.facebook.com/photo/?fbid=1488632998222010&set=pcb.1488633124888664" },
          { title: "Obu hall (Sept. 18, 2013)", source: "Ibo-speaking peoples of Nigeria. Harrison, 1913, pg. 48. Thomas, Northcote Whitridge. Anthropological report on the", link: "https://ha.wikipedia.org/wiki/Nri-Igbo#/media/Fayil:Eze_Nri_Obalike.jpg" },
          { title: "EzeNri Obalike with Alo and Gong (July 30, 2021)", source: "The Eastern Post", link: "https://www.facebook.com/photo/?fbid=545375506879896&set=a.109497157134402" },
          { title: "Eggs (Aug. 1, 2023)", source: "Amalu chioma's Post", link: "https://www.facebook.com/100067680823767/posts/if-you-have-not-appease-your-chi-uwand%E1%BB%8B-ichend%E1%BB%8B-mmili-umuadand%E1%BB%8B-otu-ogbenje-spir/617421413857214/" },
          { title: "The Chamois Colored Goat (n.d.)", source: "creatures", link: "https://creatures.com/species/goat/chamois-colored" },
          { title: "West African Dwarf Ewe (2022)", source: "Muhammed Alhassan", link: "https://www.agriculturenigeria.com/sheep/" },
          { title: "Hen (n.d.)", source: "Sofia", link: "https://in.pinterest.com/pin/614459942948005404/" },
          { title: "A nation's pride: The untold story of Azerbaijani Jews in WWII (May 9)", source: "Mehman Mammadov", link: "https://caspianpost.com/opinion/a-nation-s-pride-the-untold-story-of-azerbaijani-jews-in-wwii" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.`
      }
    },
    'learn-the-moral-values-of-igbo-greatness': {
      title: "Learn The Moral Values of Igbo Greatness",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Prof. Casmir C.K. Ani for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Prof. Ani in line with YouTube Policies. All views expressed by Prof. Ani do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Integral Development, Ethics, Governance, and Human Rights in the African Context. Author: Prof. Monsignor Obiora F. Ike. Major Contributor / Editor: Prof. Casmir C.K. Ani. Year of Publication: 2016. Displayed and discussed with the guest's consent for educational, ethical, and cultural commentary." },
          { citation: "Fundamentals of Marxism and Human Welfare. Author: Karl Marx. Presented and discussed by: Prof. Casmir C. K Ani (Studio Guest). Displayed with the guest's consent for educational and philosophical commentary (Aug., 12, 2025)." },
          { citation: "Equality Matters: Understanding the Importance of Human Rights. By: Adeola Odubajo. Source: LinkedIn. Publishing Date: Published on March 4, 2022. https://www.linkedin.com/pulse/equality-matters-understanding-importance-human-rights-adeola-odubajo" },
          { citation: "Philosophy, Science, and Human Development. Lead Paper Presenter / Contributor: Prof. Casmir C. K Ani. Used in this program with the guest's consent for educational and cultural discussion (Aug., 12, 2025)." }
        ],
        visualSources: [
          { title: "Image of Ethics Tree (October 2025)", source: "Created by: NDI IGBO VIVA Channel, Tool/Platform: Meta AI Image Generator", link: "(No external stock source — this image was AI-generated.)" },
          { title: "Karl Marx (1875)", source: "John Jabez Edwin Mayall, hand-coloured by Olga Shirnina, Wikimedia Commons (CC BY-SA 2.0)", link: "https://commons.wikimedia.org/wiki/File:Karl_Marx,_1875.jpg" },
          { title: "Neasa refused to sign the offer (31 July 2014)", source: "Staff / Sapa / Staff Reporter, Mail & Guardian (mg.co.za)", link: "https://mg.co.za/article/2014-07-31-neasa-lock-out-to-continue-despite-threats/" },
          { title: "Neasa lock-out to continue 'despite threats' (31 July 2014)", source: "Staff / Sapa / Staff Reporter, Mail & Guardian", link: "https://mg.co.za/article/2014-07-31-neasa-lock-out-to-continue-despite-threats/" },
          { title: "The gods now pay tax: Ori Okpa Nsukka is officially registered with the State Gov", source: "Veronica Okolo, Facebook — Veronica Okolo (Public Post)", link: "https://www.facebook.com/veronica.okolo/posts/the-gods-now-pay-tax-ori-okpa-nsukka-is-officially-registered-with-the-state-gov/8965187440253113/" },
          { title: "Igbo People (Igbo / Ibo / Ala Igbo / Ani Igbo)", source: "Jordi Zaragozà Anglès and team at 101LastTribes.com", link: "https://www.101lasttribes.com/tribes/igbo.html" },
          { title: "Tanzania reflects on 26 years without … (October 3, 2025)", source: "THE RESPONDENT ONLINE, The Respondent (there­spondents.co.tz)", link: "https://www.therespondents.co.tz/2025/10/tanzania-reflects-on-26-years-without.html" },
          { title: "A Nurse Beaten by an Oriokpa Masquerade (May 2, 2024)", source: "Instagram@harrison_gwamnishu", link: "https://www.instagram.com/reel/C6dd-fENMlP/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'mission-to-reconnect-and-advance-igbo-civilization': {
      title: "Mission to Reconnect and Advance Igbo Civilization",
      thumbnail: "",
      credits: {
        books: [
          { citation: "Elizabeth Allo Isichei (1976). A History of the Igbo People. Macmillan Publishers, London AUC Library." },
          { citation: "Elizabeth Allo Isichei (1977). Igbo Worlds: An Anthology of Oral Histories and Historical Descriptions. Macmillan." },
          { citation: "Chukwuma J. Obiagwu (2008). Adventures of Ojemba: The Chronicle of the Igbo People. Hamilton Books / Bloomsbury Publishing." },
          { citation: "Uchenna Nwankwo (2019). Pro-Biafra Movements, Ohanaeze & the Future of Nigeria. Centrist Books, The Guardian Nigeria." }
        ],
        visualSources: [
          { title: "Symbolbild – Weißkopfseeadler in Toronto (March 19, 2024)", source: "Veronika Andrews", link: "https://mutmacherei.net/toronto-feiert-die-rueckkehr-der-weisskopfseeadler/" },
          { title: "Nze Akachukwu with Dr Ezuma (2025)", source: "Nwankpo A.S. Nwankpo, Ndigbo viva studios", link: "" },
          { title: "Nze Akachukwu and bishop (2025)", source: "Nwankpo A.S. Nwankpo, Ndigbo viva studios", link: "" },
          { title: "Nze Akachuku and soludo (2025)", source: "Nwankpo A.S. Nwankpo, Personnel Collection", link: "" },
          { title: "Nze Akachukwu with Ndi ichie (2025)", source: "Nwankpo A.S. Nwankpo, Personnel Collection", link: "" },
          { title: "Nze Akachukwu visit to Emir of Kano (2025)", source: "Nwankpo A.S. Nwankpo, Personnel Collection", link: "" },
          { title: "A video of Nze Akachukwu dancing to ogene tone (2025)", source: "Nwankpo A.S. Nwankpo, Personnel Collection", link: "" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputa Ifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'igbo-billionaire-shares-igbo-secret-to-wealth-with-dr-ezuma-part-1': {
      title: "Igbo Billionaire Shares Igbo Secret to Wealth with Dr. Ezuma Part 1",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Dr. I. O. Ezuma for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Dr. I. O. Ezuma in line with YouTube Policies. All views expressed by Dr. I. O. Ezuma do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Umeh, J. A. (1999). After God is Dibia: Igbo Cosmology, Divination & Sacred Science in Nigeria. London & New York: Karnak House. ISBN 978-0-907015-59-8" },
          { citation: "Onwuejeogwu, M. Angulu. An Igbo Civilization: Nri Kingdom & Hegemony. Benin City: Ethiope Publishing Corporation, 1981." },
          { citation: "Achebe, Chinua. 1983. The Trouble with Nigeria. Enugu: Fourth Dimension Publishers." }
        ],
        visualSources: [
          { title: "Image of Eta Zuma Logo (13 Dec, 2018)", source: "Business List Nigeria", link: "https://www.businesslist.com.ng/company/262805/eta-zuma-mining-and-industries-limited" },
          { title: "Image 20 of 20 (2006)", source: "Eta Zuma Group", link: "https://etazuma.com/gallery.html/" },
          { title: "Image from Zuma 828 (2006)", source: "OrigiZuma 828", link: "https://etazuma.com/zuma828/" },
          { title: "Avocado Video Stock (13 Dec, 2018)", source: "Vecteezy (Free License)", link: "https://www.vecteezy.com/video/50733813-avocados-in-tree-in-focus/" },
          { title: "Image of Ripe Mango Tree (2025)", source: "Bukuora Ka_diaki", link: "https://www.tiktok.com/@bakoura..ka..diaki/video/7532996578542472454/" },
          { title: "Honey Mango Seed on Top (April 9, 2021)", source: "Carrie – Forged Mettle Farm", link: "https://forgedmettlefarm.com/2021/04/09/growing-things-avocado-pits-and-mango-seeds/" },
          { title: "Image of Dissected Mango Seed (Feb. 28, 2025)", source: "Jamesmgonda367 (Instagram)", link: "https://www.instagram.com/p/DGoU1LztmUA/" },
          { title: "Mango Prume (2025)", source: "Nature_Lapse2 (TikTok)", link: "https://www.tiktok.com/@nature_lapse2/video/7555509279097163028/" },
          { title: "Condo Dwarf Mango (5 Jan 2025)", source: "Top Tropicals", link: "https://toptropicals.com/cgi-bin/store/blog_entry.cgi/href=https:/toptropicals.com/html/toptropicals/articles/%3Ciframeclass=?entry=1741191424&num=10&find=Mango/" },
          { title: "An early-20th-century Igbo medicine man in Nigeria, West Africa (14 April, 2009)", source: "Ukabia", link: "https://en.wikipedia.org/wiki/Portal:Traditional_African_religions/Selected_picture/7#/media/File:Igbo_medicine_man.jpg/" },
          { title: "Image of Ogilish Leaf (3 July, 2003)", source: "Okunola Adenrele Alabi et al.", link: "https://link.springer.com/article/10.1007/s00709-023-01880-4" },
          { title: "Oji Igbo (March 6, 2025)", source: "Yara Imo Asiri Worldwide (Facebook)", link: "https://www.facebook.com/100065667062106/posts/spiritual-work-for-money-drawer-workget-one-frog-opolo-aye-kanget-four-face-of-c/968412495357644/" },
          { title: "Ram (March 14, 2012)", source: "OloriSupergal Blog", link: "https://olorisupergal.blogspot.com/2011/03/event-ram-charging-pictures.html" },
          { title: "Efi Igbo (Sept. 10, 2025)", source: "Comr. Obinna Michael (Facebook)", link: "https://www.facebook.com/100034585504729/photos/1558390495323786/" },
          { title: "Chick (n.d.)", source: "Royalty-Free via PickPik", link: "https://www.pickpik.com/chick-chicken-hen-poultry-rooster-baby-120732" },
          { title: "Egg Cleasing (Jan. 2, 2025)", source: "Ifansoro Apesin Iranse Orunmila (Facebook)", link: "https://www.facebook.com/groups/348426025358737/posts/2818897691644879/" },
          { title: "Ifeoma Akona Anyi (Oct. 10, 2025)", source: "Onwa_Nnewi (X/Twitter)", link: "https://x.com/Kene_Nnewi/status/1976575382917906447/photo/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputa Ifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'the-solid-ethical-and-spiritual-foundation-of-the-igbo-society': {
      title: "THE SOLID ETHICAL AND SPIRITUAL FOUNDATION OF THE IGBO SOCIETY",
      thumbnail: "",
      credits: {
        guestAcknowledgement: `Ndigbo Viva thanks Prince C.I. Onyesoh for sharing valuable insights that have enriched our mission to advance Igbo civilization.

This video was made with the informed consent of Prince C.I. Onyesoh in line with YouTube Policies. All views expressed remain those of Prince C.I. Onyesoh and do not represent the position of Ndigbo Viva.`,
        books: [
          { citation: "Cookey, S. J. S., Alemika, E. E. O., Oyebode, A. B., Amucheazi, E. C., & Yahaya, A. D. (2010). Traditional rulers in Nigeria. Ibadan: Safari Books. https://www.safaribooks.com.ng/product/traditional-rulers-in-nigeria/" }
        ],
        visualSources: [
          { title: "Full Moon, moon, moonrise, night sky (August 18, 2022)", source: "adege", link: "https://pixabay.com/videos/full-moon-moon-moonrise-night-128118/" },
          { title: "Grasshopper, Insect, Migratory Locust (2020)", source: "adege", link: "https://pixabay.com/videos/grasshopper-insect-migratory-locust-49720/" },
          { title: "IGALA – The Most Ancient Civilization in Kogi State (June 4, 2020)", source: "OFFICE OF THE SPECIAL ADVISER ON CULTURE AND TOURISM", link: "https://kogicultureandtourism.wordpress.com/2020/06/04/ancient-and-relevant-civilization/" },
          { title: "Amucheazi, Secretary, Igbo Leaders of Thought: Yoruba, not Igbo, planned 1966 coup (July 29, 2023)", source: "Arinze, F. A.", link: "https://thesun.ng/amucheazi-secretary-igbo-leaders-of-thought-yoruba-not-igbo-planned-1966-coup/" },
          { title: "Professor SJS Cookey clocks 85 years … first PhD holder … (April 9, 2019)", source: "Opobo Kingdom Online", link: "https://www.facebook.com/OpoboKingdomOnline/posts/professor-sjs-cookey-clocks-85years-born-april-9th-1934-he-was-the-first-phd-hol/419654941945950/" },
          { title: "Nigeria's insecurity crisis rooted in poor governance, corruption – Prof. Alemika (February 5, 2025)", source: "Federal University Lokoja", link: "https://www.fulokoja.edu.ng/news-page.php?i=1011&a=nigerias-insecurity-crisis-rooted-in-poor-governance-corruption-prof-alemika" },
          { title: "President Buhari, Late Prof. AD Yahaya made Nigeria a better place; he deserved his… (October 2, 2021)", source: "GarShehu", link: "https://www.facebook.com/GarShehu/photos/president-buhari-late-prof-ad-yahaya-made-nigeria-a-better-place-he-deserved-his/410815367066520/" },
          { title: "Nigerian Teachers Facebook Group Post (January 2, 2023)", source: "Nigerian Teachers Group", link: "https://www.facebook.com/groups/nigerianteachers/posts/4212571388968215/" },
          { title: "Igbo Ichi marks (c. 1921)", source: "G. T. Basden", link: "https://commons.wikimedia.org/wiki/File:Igbo_ichi_marks.jpg" },
          { title: "Veteran beekeeper dispels 'killer bee' myths (March 23, 2016)", source: "Manuka Honey USA LLC", link: "https://www.manukahoneyusa.com/blog/veteran-beekeeper-dispels-killer-bee-myths.html" },
          { title: "As an Igbo child I hope you already knew that part of our ancient ancestors… (September 18, 2024)", source: "@Maazi_Dibia", link: "https://www.facebook.com/MaaziDibia/posts/as-an-igbo-child-i-hope-you-already-knew-that-part-of-our-ancient-ancestors-were/541627501774242/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.`
      }
    },
    'igbo-health-alert-prof-aghaji-warns-of-rising-sudden-deaths': {
      title: "Igbo Health Alert: Prof. Aghaji Warns of Rising Sudden Deaths",
      thumbnail: "",
      credits: {
        books: [],
        visualSources: [
          { title: "Accident, Automobile Damage (2016, May 23)", source: "garten-gg, Pixabay", link: "https://pixabay.com/photos/accident-automobile-damage-vehicle-1409012/" },
          { title: "Industrial designer working 3D model (n.d.)", source: "Author Unknown, Freepik", link: "https://www.freepik.com/free-photo/industrial-designer-working-3d-model_25177096.htm" },
          { title: "Uganda Airlines CRJ-900 Cockpit landing at Kinshasa (2024, November 29)", source: "AirNavRadar, AirNavRadar Blog", link: "https://www.airnavradar.com/blog/uganda-airlines-crj-900-cockpit-landing-at-kinshasa" },
          { title: "A truck accident at Ugwu Onyeama, Enugu (2015, August 21)", source: "AmazingViewpoints [Blog post]", link: "https://amazingviewpoints.blogspot.com/2015/08/a-truck-accident-at-ugwu-onyeama-enugu.htm" },
          { title: "Nigeria's $5bn tyre-production industry requires investors (2024, February 19)", source: "Enimola, O., Independent Newspaper Nigeria", link: "https://independent.ng/nigerias-5bn-tyre-production-industry-requires-investors/" },
          { title: "What is UTPRON – Eco-friendly management of used tyres in Nigeria (n.d.)", source: "TPRON", link: "https://utpron.com.ng/learn.html" },
          { title: "Drinking 'pure water' could be risky – Here's what you should know (2025, May 13)", source: "Ajayi, A., Pulse Nigeria", link: "https://www.pulse.ng/articles/lifestyle/is-pure-water-bad-for-you-2025051310204536032" },
          { title: "Lagos govt clarifies ban on single-use plastics, says 'pure water' not affected (2025, May 20)", source: "gency Report, The Premium Times", link: "https://www.premiumtimesng.com/regional/ssouth-west/795676-lagos-govt-clarifies-ban-on-single-use-plastics-says-pure-water-not-affected.html" },
          { title: "First 20 words of the post (19 August, 2022)", source: "Amarachi Lilian, Facebook group post", link: "https://www.facebook.com/groups/903307780039021/posts/1729938060709318/" },
          { title: "Can plastic bottles go in the microwave? (1 February, 2024)", source: "KimEcopak", link: "https://www.kimecopak.ca/blogs/news/can-plastic-bottles-go-in-the-microwave?srsltid=AfmBOoquDkVczad6h9TQa8c8hg4FHV2iWXsf0HCYiEvnTgLkbp3n6kMi" },
          { title: "How to make sachet water (n.d.)", source: "Neptune Machinery", link: "https://www.neptunemachinery.com/how-to-make-sachet-water/" },
          { title: "What is refined sugar? A complete beginner's guide (2025, September 29)", source: "Wilmot, J., Oats My Goodness", link: "https://oatsmygoodness.com.au/what-is-refined-sugar/" },
          { title: "Indomie Chicken – Hungry Man Size 180 g [Instant noodles] (n.d.)", source: "Indomie, The Rice Man", link: "https://www.thericeman.com.ng/product/indomie-chicken-hungry-man-size/" },
          { title: "Domestic violence in marriage and the position of the law in Nigeria (2023, October 1)", source: "Hilary, J., Appylaw", link: "https://appylaw.com/2023/10/01/domestic-violence-in-marriage-and-the-position-of-the-law-in-nigeria/" },
          { title: "Does Nigerian culture permit domestic violence? (2017, August 24)", source: "Agbonkhese, J. & Onuoha, C., Vanguard", link: "https://www.vanguardngr.com/2017/08/nigerian-culture-permit-domestic-violence/" },
          { title: "Nigeria confronts worst health crisis in decades (2024, July 16)", source: "Anudu, O., Olufemi, D., Ayetoto-Oladehinde, T., & Bailey, B., BusinessDay", link: "https://businessday.ng/news/article/nigeria-confronts-worst-health-crisis-in-decades/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    },
    'key-health-practices-for-ndigbo': {
      title: "Key Health Practices for Ndigbo",
      thumbnail: "",
      credits: {
        books: [],
        visualSources: [
          { title: "Accident, Automobile Damage (2016, May 23)", source: "garten-gg, Pixabay", link: "https://pixabay.com/photos/accident-automobile-damage-vehicle-1409012/" },
          { title: "Industrial designer working 3D model (n.d.)", source: "Author Unknown, Freepik", link: "https://www.freepik.com/free-photo/industrial-designer-working-3d-model_25177096.htm" },
          { title: "Uganda Airlines CRJ-900 Cockpit landing at Kinshasa (2024, November 29)", source: "AirNavRadar, AirNavRadar Blog", link: "https://www.airnavradar.com/blog/uganda-airlines-crj-900-cockpit-landing-at-kinshasa" },
          { title: "A truck accident at Ugwu Onyeama, Enugu (2015, August 21)", source: "AmazingViewpoints [Blog post]", link: "https://amazingviewpoints.blogspot.com/2015/08/a-truck-accident-at-ugwu-onyeama-enugu.htm" },
          { title: "Nigeria's $5bn tyre-production industry requires investors (2024, February 19)", source: "Enimola, O., Independent Newspaper Nigeria", link: "https://independent.ng/nigerias-5bn-tyre-production-industry-requires-investors/" },
          { title: "What is UTPRON – Eco-friendly management of used tyres in Nigeria (n.d.)", source: "TPRON", link: "https://utpron.com.ng/learn.html" },
          { title: "Drinking 'pure water' could be risky – Here's what you should know (2025, May 13)", source: "Ajayi, A., Pulse Nigeria", link: "https://www.pulse.ng/articles/lifestyle/is-pure-water-bad-for-you-2025051310204536032" },
          { title: "Lagos govt clarifies ban on single-use plastics, says 'pure water' not affected (2025, May 20)", source: "gency Report, The Premium Times", link: "https://www.premiumtimesng.com/regional/ssouth-west/795676-lagos-govt-clarifies-ban-on-single-use-plastics-says-pure-water-not-affected.html" },
          { title: "First 20 words of the post (19 August, 2022)", source: "Amarachi Lilian, Facebook group post", link: "https://www.facebook.com/groups/903307780039021/posts/1729938060709318/" },
          { title: "Can plastic bottles go in the microwave? (1 February, 2024)", source: "KimEcopak", link: "https://www.kimecopak.ca/blogs/news/can-plastic-bottles-go-in-the-microwave?srsltid=AfmBOoquDkVczad6h9TQa8c8hg4FHV2iWXsf0HCYiEvnTgLkbp3n6kMi" },
          { title: "How to make sachet water (n.d.)", source: "Neptune Machinery", link: "https://www.neptunemachinery.com/how-to-make-sachet-water/" },
          { title: "What is refined sugar? A complete beginner's guide (2025, September 29)", source: "Wilmot, J., Oats My Goodness", link: "https://oatsmygoodness.com.au/what-is-refined-sugar/" },
          { title: "Indomie Chicken – Hungry Man Size 180 g [Instant noodles] (n.d.)", source: "Indomie, The Rice Man", link: "https://www.thericeman.com.ng/product/indomie-chicken-hungry-man-size/" },
          { title: "Domestic violence in marriage and the position of the law in Nigeria (2023, October 1)", source: "Hilary, J., Appylaw", link: "https://appylaw.com/2023/10/01/domestic-violence-in-marriage-and-the-position-of-the-law-in-nigeria/" },
          { title: "Does Nigerian culture permit domestic violence? (2017, August 24)", source: "Agbonkhese, J. & Onuoha, C., Vanguard", link: "https://www.vanguardngr.com/2017/08/nigerian-culture-permit-domestic-violence/" },
          { title: "Nigeria confronts worst health crisis in decades (2024, July 16)", source: "Anudu, O., Olufemi, D., Ayetoto-Oladehinde, T., & Bailey, B., BusinessDay", link: "https://businessday.ng/news/article/nigeria-confronts-worst-health-crisis-in-decades/" }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.

For content permissions or collaboration inquiries, please contact ndigbovivalimited@gmail.com`
      }
    }
  }
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to create slug from title (matching YouTube's createSlug function)
function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  if (longer.length === 0) return 1.0

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase())
  return (longer.length - distance) / longer.length
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[str2.length][str1.length]
}

// Helper function to extract key words from title
function extractKeyWords(title: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
}

export default async function VideoCreditsPage({ params }: PageProps) {
  // Await params in Next.js 15
  const { slug } = await params
  
  // Get the credits data directly using the slug
  const allCredits = getVideoCredits()
  let videoCredits = allCredits[slug]
  
  // Get YouTube video data for title and thumbnail
  let ytVideo = null
  try {
    const videos = await getLatestVideos(50)
    ytVideo = videos.find(v => v.slug === slug)
  } catch {
    ytVideo = null
  }
  
  // If not found by exact slug match, try to find by matching title
  if (!videoCredits && ytVideo) {
    const ytTitleLower = ytVideo.title.toLowerCase()
    const ytSlug = ytVideo.slug || createSlugFromTitle(ytVideo.title)
    const ytKeyWords = extractKeyWords(ytVideo.title)
    
    let bestMatch: { credits: VideoCredit; score: number } | null = null
    
    for (const [creditsSlug, credits] of Object.entries(allCredits)) {
      const creditsTitleLower = credits.title.toLowerCase()
      const normalizedCreditsSlug = createSlugFromTitle(credits.title)
      const creditsKeyWords = extractKeyWords(credits.title)
      
      let score = 0
      
      // Check if slugs match (after normalization) - try multiple variations
      if (ytSlug === creditsSlug || 
          ytSlug === normalizedCreditsSlug || 
          slug === creditsSlug || 
          slug === normalizedCreditsSlug) {
        score = 1.0
      } else {
        // Calculate title similarity
        const titleSimilarity = calculateSimilarity(ytVideo.title, credits.title)
        score = titleSimilarity

        // Boost score if key words match
        const matchingKeyWords = ytKeyWords.filter(word =>
          creditsKeyWords.some(cw => cw.includes(word) || word.includes(cw))
        )
        if (matchingKeyWords.length > 0) {
          score += (matchingKeyWords.length / Math.max(ytKeyWords.length, creditsKeyWords.length)) * 0.3
        }

        // Check if YouTube title contains significant parts of credits title
        const creditsWords = creditsTitleLower.split(/\s+/).filter(w => w.length > 3)
        const matchingWords = creditsWords.filter(word => ytTitleLower.includes(word))
        if (matchingWords.length >= Math.min(3, creditsWords.length)) {
          score += 0.2
        }
      }

      if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { credits, score }
      }
    }

    if (bestMatch && bestMatch.score > 0.5) {
      videoCredits = bestMatch.credits
    }
  }

  const video = {
    title: ytVideo?.title || videoCredits?.title || '',
    thumbnail: ytVideo?.thumbnail || videoCredits?.thumbnail || '/Ndigbo Viva Logo.jpg',
    credits: videoCredits?.credits || {
      books: [],
      visualSources: [],
      aiAssistance: ytVideo ? "Video data sourced from YouTube API" : undefined
    }
  }

  if (!video.title) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h1>
          <p className="text-gray-600 mb-8">The requested video credits page could not be found.</p>
          <Link
            href="/acknowledgements"
            className="bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Acknowledgements
          </Link>
        </div>
      </div>
    )
  }

  const credits = video.credits

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/Ndigbo Viva Logo.jpg"
            alt="Ndigbo Viva Logo Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/acknowledgements"
              className="text-brand-gold hover:text-brand-gold-light transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Acknowledgements
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-brand-gold">Credits & References</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold">
              {video.title}
            </p>
          </div>
        </div>
      </section>

      {/* Video Thumbnail Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Thumbnail on the left */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Credits on the right */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{video.title}</h1>

              {/* Guest Acknowledgement */}
              {credits?.guestAcknowledgement && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">GUEST ACKNOWLEDGEMENT AND CONSENT:</h3>
                  <div className="border-l-4 border-brand-gold pl-4">
                    <pre className="text-gray-800 whitespace-pre-wrap font-sans">{credits.guestAcknowledgement}</pre>
                  </div>
                </div>
              )}

              {/* Books and Articles */}
              {credits?.books && credits.books.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1. BOOKS AND ARTICLES:</h3>
                  <div className="space-y-3">
                    {credits.books.map((book: { citation: string }, index: number) => (
                      <div key={index} className="border-l-4 border-brand-gold pl-4">
                        <p className="text-gray-800">{book.citation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Sources */}
              {credits?.visualSources && credits.visualSources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. VISUAL SOURCES:</h3>
                  <div className="space-y-4">
                    {credits.visualSources.map((source: { title: string; source: string; link: string }, index: number) => (
                      <div key={index} className="border-l-4 border-brand-forest pl-4">
                        <h4 className="font-semibold text-gray-900">{source.title}</h4>
                        <p className="text-gray-600">Original Source: {source.source}</p>
                        <p className="text-gray-600">
                          Source Link: <a href={source.link} className="text-brand-gold hover:underline" target="_blank" rel="noopener noreferrer">{source.link}</a>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Acknowledgements */}
              {credits?.teamAcknowledgements && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">TEAM ACKNOWLEDGEMENTS:</h3>
                  <div className="border-l-4 border-brand-bronze pl-4">
                    <pre className="text-gray-800 whitespace-pre-wrap font-sans">{credits.teamAcknowledgements}</pre>
                  </div>
                </div>
              )}

              {/* AI Assistance */}
              {credits?.aiAssistance && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI ASSISTANCE:</h3>
                  <div className="border-l-4 border-brand-gold pl-4">
                    <p className="text-gray-800">{credits.aiAssistance}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

