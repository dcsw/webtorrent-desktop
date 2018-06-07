const appConfig = require("application-config")("WebContent");
const path = require("path");
const electron = require("electron");
const arch = require("arch");

const APP_NAME = "WebContent";
const APP_TEAM = "WebContent, LLC";
const APP_VERSION = require("../package.json").version;

const IS_TEST = isTest();
const PORTABLE_PATH = IS_TEST
  ? path.join(process.platform === "win32" ? "C:\\Windows\\Temp" : "/tmp", "WebContentTest")
  : path.join(path.dirname(process.execPath), "Portable Settings");
const IS_PRODUCTION = isProduction();
const IS_PORTABLE = isPortable();

const UI_HEADER_HEIGHT = 38;
const UI_CONTENT_HEIGHT = 100;

module.exports = {
  ANNOUNCEMENT_URL: "https://webcontent.io/desktop/announcement",
  AUTO_UPDATE_URL: "https://webcontent.io/desktop/update",
  CRASH_REPORT_URL: "https://webcontent.io/desktop/crash-report",
  TELEMETRY_URL: "https://webcontent.io/desktop/telemetry",

  APP_COPYRIGHT: "Copyright © 2014-2017 " + APP_TEAM,
  APP_FILE_ICON: path.join(__dirname, "..", "static", "WebContentFile"),
  APP_ICON: path.join(__dirname, "..", "static", "WebContent"),
  APP_NAME: APP_NAME,
  APP_TEAM: APP_TEAM,
  APP_VERSION: APP_VERSION,
  APP_WINDOW_TITLE: APP_NAME + " (BETA)",

  CONFIG_PATH: getConfigPath(),

  GENERIC_CONTENT_ITEMS: [
    {
      url: "http://portfolios.risd.edu/gallery/60588389/Decay-Ceramic-Composter",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1066b660588389.5a52eeedb0328.jpg",
      name: "Decay",
      description:
        "Imagining reviving soil ecostructures beneath cities. An installation in which the unpredictable organic shatters the architectural shell. Inspired by composting processes, a fancifully functioning composter unit. To employ organic processes as performance art.",
      infoHash: "0"
    },
    {
      url: "http://portfolios.risd.edu/gallery/60633641/Cradle-Ceramic-Hydroponics",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/a2d51860633641.5a91e5aa9c224.jpg",
      name: "Cradle",
      description: "Cradle: Ceramic Hydroponics",
      infoHash: "1"
    },
    {
      url: "http://portfolios.risd.edu/gallery/63190115/Test-Slides",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/861c4d63190115.5aa8bb05ec5b2.jpg",
      name: "Test Slides",
      description: "Bringing intentionality to the test tiles necessary for ceramics by adding to an ever-growing collection of ceramic test slides.",
      infoHash: "2"
    },
    {
      url: "http://portfolios.risd.edu/gallery/62492355/Acequia-Erosion-Module",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ca98ae62492355.5a922b0fb45a7.jpg",
      name: "Acequia Erosion Module",
      description: "Creating modules to mitigate erosion on the Ditch system of the Rio Grande, New Mexico.",
      infoHash: "3"
    },
    {
      url: "http://portfolios.risd.edu/gallery/62566427/Vegetable-Dyes",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/46937f62566427.5a94a03ceb374.jpg",
      name: "Vegetable Dyes",
      description: "Ceramic cups and Eggshells dyed with Beet, Cabbage, and Turmeric dyes, set with vinegar. Experimental organic finishes to clay.",
      infoHash: "4"
    },
    {
      name: "NEAQ DIVEST\n🌊🌊\n#wizardryrealquick #neaqdivest #patch #cool #shades #icewine",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/17ffb6cc12b4d63498ac1b06089aae62/5BA74229/t51.2885-15/s640x640/sh0.08/e35/19933468_1575088239208314_9208235592851128320_n.jpg",
      description: "NEAQ DIVEST\n🌊🌊\n#wizardryrealquick #neaqdivest #patch #cool #shades #icewine",
      infoHash: "5"
    },
    {
      name: "Grape goals\n🌿🌿\n#garden #freshgrapes #grapevine #trellis #plants #sticks #camp #maine #fruitofthevine",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/4ef1cfaa3a51f7882b7cabc5ac4d4a13/5BA027FC/t51.2885-15/s640x640/sh0.08/e35/19954845_1988862111393158_4724314157011173376_n.jpg",
      description: "Grape goals\n🌿🌿\n#garden #freshgrapes #grapevine #trellis #plants #sticks #camp #maine #fruitofthevine",
      infoHash: "6"
    },
    {
      name:
        "This is what a layers of the earth sculpture by 100 first-fourth graders looks like - so much creative energy\nGlad we could all bond over squishing mud\n🌫🌫\n#summer #campkids #clay #mud #lotsofsnakes #pinchpinchpinch \n#clay #ceramics #ceramicsculpture",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/9dce123929c1e674fec896d90bc77153/5BA4023C/t51.2885-15/s640x640/sh0.08/e35/19932242_689152321288302_9097502273579253760_n.jpg",
      description:
        "This is what a layers of the earth sculpture by 100 first-fourth graders looks like - so much creative energy\nGlad we could all bond over squishing mud\n🌫🌫\n#summer #campkids #clay #mud #lotsofsnakes #pinchpinchpinch \n#clay #ceramics #ceramicsculpture",
      infoHash: "7"
    },
    {
      name: "Deanna holds a cat for the second time ever\nFirst time she dropped it\n😾\n#cat #cow #catcow #droppedcat #ouch #sistertryingtokillmycat #fluffy",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/46adb506ba05490e96cb500397edf760/5B17F2B9/t51.2885-15/s640x640/e15/19624546_676166732580991_6818510463597281280_n.jpg",
      description: "Deanna holds a cat for the second time ever\nFirst time she dropped it\n😾\n#cat #cow #catcow #droppedcat #ouch #sistertryingtokillmycat #fluffy",
      infoHash: "8"
    },
    {
      name:
        "Always very fun to load kilns of #claycamp #pottery\nInspiring to see how much excitement is thrown into every piece !\n🍳🍳🍳🍳\n#pottery #kids #artkids #art #camp #summer #bowls #ceramics #clay",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/15b557959ae48ebf9829bf2da7ee87c7/5BBEC56C/t51.2885-15/s640x640/sh0.08/e35/19623422_138178280094872_723739102188404736_n.jpg",
      description:
        "Always very fun to load kilns of #claycamp #pottery\nInspiring to see how much excitement is thrown into every piece !\n🍳🍳🍳🍳\n#pottery #kids #artkids #art #camp #summer #bowls #ceramics #clay",
      infoHash: "9"
    },
    {
      name: "Some very big steps\n🌻🌻\n#moss #stairs #hiddenvalleycamp #outdoors #river #steps #plants #dirt #smallpeople",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/7a2104fb6b4604fd8afcd69d4770710f/5BA26820/t51.2885-15/s640x640/sh0.08/e35/19379837_897322533758268_486222806514663424_n.jpg",
      description: "Some very big steps\n🌻🌻\n#moss #stairs #hiddenvalleycamp #outdoors #river #steps #plants #dirt #smallpeople",
      infoHash: "10"
    },
    {
      name: "#catstraw 🙀\n.\n.\n#cat #juice #smartasscat #fluffy #cowcat #ceramics #clay #straw #straws #funnycat #catsofinstagram",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/c9396f7d8ca6a907cffc6721245f5a12/5B17FC0C/t51.2885-15/s640x640/e15/18299778_1598923400119214_6855611353172803584_n.jpg",
      description: "#catstraw 🙀\n.\n.\n#cat #juice #smartasscat #fluffy #cowcat #ceramics #clay #straw #straws #funnycat #catsofinstagram",
      infoHash: "11"
    },
    {
      name: "Definitely past bedtime\n🍳🍳\n#ceramic #zombie #terracotta #clay #sculpture #ceramics #selfportrait #lifesculpture #orange",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/70ea22d71300ac1f8867c7201eb31c8e/5BB7DFD6/t51.2885-15/s640x640/sh0.08/e35/18253093_1709014769397979_1453589929954115584_n.jpg",
      description: "Definitely past bedtime\n🍳🍳\n#ceramic #zombie #terracotta #clay #sculpture #ceramics #selfportrait #lifesculpture #orange",
      infoHash: "12"
    },
    {
      name: 'Early Postmodernist "Face House," 1 and 2',
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/c39f3094cf6e2d9312df966a8e5e3ae6/5BBD04CD/t51.2885-15/e35/18252528_301926366887695_2101640219349483520_n.jpg",
      description: 'Early Postmodernist "Face House," 1 and 2',
      infoHash: "13"
    },
    {
      name: "Oooo dunk 💃\n#glaze #gloss #red #redonred #checkmeout #cermaics #ceramicglaze #chemistry #dunk #pottery #slipcast #hand #wet #yum",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/198db8857473d82d8f0c7c8fe83efe7c/5BB77E63/t51.2885-15/s640x640/sh0.08/e35/18298520_772613616247906_5034268207163113472_n.jpg",
      description: "Oooo dunk 💃\n#glaze #gloss #red #redonred #checkmeout #cermaics #ceramicglaze #chemistry #dunk #pottery #slipcast #hand #wet #yum",
      infoHash: "14"
    },
    {
      name: "Variations on a theme 😱\n#lifesculpture #clay #ceramic #ceramicsculpture #terracotta #risd #ceramics",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/3390f73fc2738102d7ee18d5278dc9d7/5BB4E6A9/t51.2885-15/s640x640/sh0.08/e35/18094873_765124846998415_7712325911315480576_n.jpg",
      description: "Variations on a theme 😱\n#lifesculpture #clay #ceramic #ceramicsculpture #terracotta #risd #ceramics",
      infoHash: "15"
    },
    {
      name: "Even in March the beach is magical\n#happyearthday🌎 💛\n.\n#mom\n#beach #mousehunting #beachhaus #greyday",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/366134270b98eeab05d12a92688bbacd/5B17F40B/t51.2885-15/s640x640/e15/18095807_278130669278500_2214626790133989376_n.jpg",
      description: "Even in March the beach is magical\n#happyearthday🌎 💛\n.\n#mom\n#beach #mousehunting #beachhaus #greyday",
      infoHash: "16"
    },
    {
      name:
        'Marble head of a veiled woman\nGreek, late 4th Century B.C.\n"The majority of veiled heads of this type belonged to three-quarter-length figures that served as funerary markers. Either they may represent a divinity, or the half-veiled face may be a sign of mourning."\n-MET, NYC\n🙀\n#greek #geek #marble #veiled #statue #met #ancient #bust #nyc #stone #carving #carved #beautiful #mystery #woman',
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/dc9135270fee22de8ce6f009927a76c4/5BA6CA93/t51.2885-15/s640x640/sh0.08/e35/c5.0.1069.1069/18160693_1437222469682651_4132177568646299648_n.jpg",
      description:
        'Marble head of a veiled woman\nGreek, late 4th Century B.C.\n"The majority of veiled heads of this type belonged to three-quarter-length figures that served as funerary markers. Either they may represent a divinity, or the half-veiled face may be a sign of mourning."\n-MET, NYC\n🙀\n#greek #geek #marble #veiled #statue #met #ancient #bust #nyc #stone #carving #carved #beautiful #mystery #woman',
      infoHash: "17"
    },
    {
      name:
        "13% shrinkage on this beautiful porcelain body\nAmazing difference between greenware and vitrified 🙀\n. #greenware #porcelain #vitrified #shrinkage #white #red #black #clay #ceramics #ceramic #mug #planter #glaze #galaxy #platelets #surprise",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/7986aaf51130e2e53a411b93157f2e7a/5BC2A23D/t51.2885-15/s640x640/sh0.08/e35/18096271_105871003311481_1170569701319770112_n.jpg",
      description:
        "13% shrinkage on this beautiful porcelain body\nAmazing difference between greenware and vitrified 🙀\n. #greenware #porcelain #vitrified #shrinkage #white #red #black #clay #ceramics #ceramic #mug #planter #glaze #galaxy #platelets #surprise",
      infoHash: "18"
    },
    {
      name: "Kickin it on top of the woodkiln\n💃\nThanks Somie xo\n#woodkiln #shippingcontainer #steelyard #ceramics #clay #firing #porcelaingetready",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/56648c866f16a7172c8be628facd8bce/5BB02200/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/17882282_1380029375379676_6788497683104399360_n.jpg",
      description: "Kickin it on top of the woodkiln\n💃\nThanks Somie xo\n#woodkiln #shippingcontainer #steelyard #ceramics #clay #firing #porcelaingetready",
      infoHash: "19"
    },
    {
      name: "Wood kiln theater 💥💥\n#harrypotter #woodkiln #clay #ceramics #fire",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/d45c6f7431cb661406d0c421e531223e/5BBDF19F/t51.2885-15/s640x640/sh0.08/e35/17934342_1457480330977859_1044011231448399872_n.jpg",
      description: "Wood kiln theater 💥💥\n#harrypotter #woodkiln #clay #ceramics #fire",
      infoHash: "20"
    },
    {
      name: "Wood kiln's in\n💥💥\n#hot #ceramic #ceramics #clay #wood #woodkiln #firing #cone10 #risdceramics #risd",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/095a50362957c333b6f856b425748d51/5BA83AAD/t51.2885-15/s640x640/sh0.08/e35/18011551_282399098879007_2809372794469482496_n.jpg",
      description: "Wood kiln's in\n💥💥\n#hot #ceramic #ceramics #clay #wood #woodkiln #firing #cone10 #risdceramics #risd",
      infoHash: "21"
    },
    {
      name:
        "Back together in one piece\n#wholeagain\n🌻🌻🌻🌻🌻🌻🌻🌻🌻\n. #ceramic #portrait #risd #lifemodeling #adam #ceramics #clay #terracotta #bust #busy #pottery #clay #firing #greenware # sculpture",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/7fe310e94cc0ceeb9803cb85da711ee5/5B1870E9/t51.2885-15/e15/17934094_282160025564190_7563484210514624512_n.jpg",
      description:
        "Back together in one piece\n#wholeagain\n🌻🌻🌻🌻🌻🌻🌻🌻🌻\n. #ceramic #portrait #risd #lifemodeling #adam #ceramics #clay #terracotta #bust #busy #pottery #clay #firing #greenware # sculpture",
      infoHash: "22"
    },
    {
      name:
        "So much good change this year, eager to return to my mushrooms though 🍄 .\n.\n#mushroom #benningtoncollege #bennington #risd #providence #nature #woods #foraging #porcelain #growth #wearable #dirt #slipcast #fungi #necklace #dirty #white #cold #scarf #ceramic #ceramics #clay #glaze",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/8b9be43b6df8c44f7ded3d71a0d9cf72/5BB45A37/t51.2885-15/e35/17932261_466308590427450_9087060688391634944_n.jpg",
      description:
        "So much good change this year, eager to return to my mushrooms though 🍄 .\n.\n#mushroom #benningtoncollege #bennington #risd #providence #nature #woods #foraging #porcelain #growth #wearable #dirt #slipcast #fungi #necklace #dirty #white #cold #scarf #ceramic #ceramics #clay #glaze",
      infoHash: "23"
    },
    {
      name:
        "Working when it's nice out like\n🤖\n.\n#midnight #surgery #portrait #sculpture #clay #ceramics #greenware #leatherhard #lifemodelling #bust #sculpturesurgery #terracotta #spring #headache",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/2e5339975db65871dcebe427e3f8641c/5BC5130B/t51.2885-15/s640x640/sh0.08/e35/17881118_411608319221287_8157018127834546176_n.jpg",
      description:
        "Working when it's nice out like\n🤖\n.\n#midnight #surgery #portrait #sculpture #clay #ceramics #greenware #leatherhard #lifemodelling #bust #sculpturesurgery #terracotta #spring #headache",
      infoHash: "24"
    },
    {
      name: "🍩👌🍩👌🍩👌🍩\n#donuthuntri #kneaddoughnuts #ceramics #hiddenfoodproject #risd",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/13244cb008b3475983b3b99dbac3866e/5BA79D6F/t51.2885-15/s640x640/sh0.08/e35/17818951_278715915887408_2421256262290243584_n.jpg",
      description: "🍩👌🍩👌🍩👌🍩\n#donuthuntri #kneaddoughnuts #ceramics #hiddenfoodproject #risd",
      infoHash: "25"
    },
    {
      name: "Bittersweet to pack this room up\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊 #selfportrait #cardboard #headsculpture",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/8dfd30ddb7729dbc5d6a09d8782e8f52/5BC30F22/t51.2885-15/s640x640/sh0.08/e35/17662653_1820512531546907_838218668029509632_n.jpg",
      description: "Bittersweet to pack this room up\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊 #selfportrait #cardboard #headsculpture",
      infoHash: "26"
    },
    {
      name: "Mood\n💃\n#gross #spaghettiarms \n#risdceramics #figuremodeling #figuresculpting #terracotta #clay #ceramics",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/0d55751acc6a6a7b900ec54f46441ecf/5BA6FC74/t51.2885-15/s640x640/sh0.08/e35/17438969_1828665787348881_1249143228897165312_n.jpg",
      description: "Mood\n💃\n#gross #spaghettiarms \n#risdceramics #figuremodeling #figuresculpting #terracotta #clay #ceramics",
      infoHash: "27"
    },
    {
      name: "Some skull stuff\n@somie_ssom @kylestrack31",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/30002762d8524c16c9d3f552419cdf21/5B18522F/t51.2885-15/s640x640/e15/17075846_276335466136358_2345748654167425024_n.jpg",
      description: "Some skull stuff\n@somie_ssom @kylestrack31",
      infoHash: "29"
    },
    {
      name: "Beautiful textures 🌬\n#ocean #pottery #glazes",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/6eb8668874920b0ffc878c9e266ca0ea/5BB5119E/t51.2885-15/s640x640/sh0.08/e35/16906230_298094140607406_2427627373827457024_n.jpg",
      description: "Beautiful textures 🌬\n#ocean #pottery #glazes",
      infoHash: "30"
    },
    {
      name:
        "Progression right to left of re-learning to throw this week. Very grateful to have come so far since hand surgery this summer - cheers to the future !\n🌻🌻🌻\n#wheelthrowing #pottery #potterywheel #potteryisrrelaxing",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/3a80372d0c1ce9e28e8a53e426f975f0/5BB5C533/t51.2885-15/s640x640/sh0.08/e35/16788928_1391585334245914_875293757736484864_n.jpg",
      description:
        "Progression right to left of re-learning to throw this week. Very grateful to have come so far since hand surgery this summer - cheers to the future !\n🌻🌻🌻\n#wheelthrowing #pottery #potterywheel #potteryisrrelaxing",
      infoHash: "31"
    },
    {
      name: "Mmmm nostalgic view\n.\n.\n.\n.\n.\n#bigbigpines at #home in a #snowstorm #bostonblizzard #boston #growing",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/586ed1c2f99cffd03727c70ef31ca880/5B183272/t51.2885-15/s640x640/e15/16464714_183390162147228_7769025170454347776_n.jpg",
      description: "Mmmm nostalgic view\n.\n.\n.\n.\n.\n#bigbigpines at #home in a #snowstorm #bostonblizzard #boston #growing",
      infoHash: "32"
    },
    {
      name: "So satisfying to see everything all photographed\nVery lucky to have had a great teacher this winter 🌻\n#bookmaking #bookbinding #artistbook",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/445db21f1c22c68289ce7cf9d50b3dd4/5BAF3CC4/t51.2885-15/s640x640/sh0.08/e35/16465166_1804575766462566_2767224515162275840_n.jpg",
      description: "So satisfying to see everything all photographed\nVery lucky to have had a great teacher this winter 🌻\n#bookmaking #bookbinding #artistbook",
      infoHash: "33"
    },
    {
      name:
        "Peak at body of artist books this winter, in addition to the blank books I showed before\nHm apparently lots of blacks and whites\n🎞🎞🎞\n#artistbook #bookbinding #bookmaking #grey",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/f513286a5bef0323337b9f8dfbc65d5f/5BA0F1E0/t51.2885-15/s640x640/sh0.08/e35/16464439_317336361996188_1694171320448712704_n.jpg",
      description:
        "Peak at body of artist books this winter, in addition to the blank books I showed before\nHm apparently lots of blacks and whites\n🎞🎞🎞\n#artistbook #bookbinding #bookmaking #grey",
      infoHash: "34"
    },
    {
      name: "Baby's first solder !!\n💡 \n#artistbook #bookmaking #hologram #bookbinding",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/a2c14ed94e41a018b543efa8aa4ffd46/5B181475/t51.2885-15/s640x640/e15/16464910_1111509822304962_7653796815719890944_n.jpg",
      description: "Baby's first solder !!\n💡 \n#artistbook #bookmaking #hologram #bookbinding",
      infoHash: "35"
    },
    {
      name: "Great 💡 \n#soldering #artistbook #hologram #bookmaking #tinkering",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/f90044c45cca0cfa0cf7bd56a7760b60/5B187077/t51.2885-15/s640x640/e15/16464436_1011950445615505_323198183104577536_n.jpg",
      description: "Great 💡 \n#soldering #artistbook #hologram #bookmaking #tinkering",
      infoHash: "36"
    },
    {
      name: "Enclosed tunnel book coming together tho\n🍳\n#artistbook #bookbinding #bookmaking #accordion",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/ba80b3de56038fca05f1d126cef8f089/5B182447/t51.2885-15/s640x640/e15/14723722_1838385079707502_1012505279805259776_n.jpg",
      description: "Enclosed tunnel book coming together tho\n🍳\n#artistbook #bookbinding #bookmaking #accordion",
      infoHash: "37"
    },
    {
      name: "Aaand done ! Learned so much this winter 🌻🌻🌻\n#bookmaking #bookbinding #artistbook #traditional",
      img: "https://instagram.fbed1-1.fna.fbcdn.net/vp/6b09bd6aaa114d7ac55f307f6ac36bf8/5BC16218/t51.2885-15/s640x640/sh0.08/e35/16465189_767776643379241_894898771614236672_n.jpg",
      description: "Aaand done ! Learned so much this winter 🌻🌻🌻\n#bookmaking #bookbinding #artistbook #traditional",
      infoHash: "39"
    },
    {
      name: "8 of 10 blank books 📚 .\n.\n.\n#blankbook #artistbook #bookbinding",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/6ea50e547b4d25ecaac9a759b02ebccb/5BC3F7D3/t51.2885-15/s640x640/sh0.08/e35/16123886_1883532831891005_817541578775068672_n.jpg",
      description: "8 of 10 blank books 📚 .\n.\n.\n#blankbook #artistbook #bookbinding",
      infoHash: "40"
    },
    {
      name: "Exposin some laser-light sensitive holographic film with @finefurniturefeel 🚀🚀🚀🚀🚀\n#artistsbook #hologram #realbiglaser",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/5bc7444ae69193c1e9758989094a3f9a/5BC155CD/t51.2885-15/s640x640/sh0.08/e35/16122585_1648585698779951_6572449403502592000_n.jpg",
      description: "Exposin some laser-light sensitive holographic film with @finefurniturefeel 🚀🚀🚀🚀🚀\n#artistsbook #hologram #realbiglaser",
      infoHash: "41"
    },
    {
      name: "Building up my library of traditional binding methods 💛💛\n#cookyourbooksfromscratch \n#sketchbook #bookmaking",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/27657dd253709a152c80d44feb475e65/5BA5B732/t51.2885-15/s640x640/sh0.08/e35/15875822_1118717288232973_4570623798910386176_n.jpg",
      description: "Building up my library of traditional binding methods 💛💛\n#cookyourbooksfromscratch \n#sketchbook #bookmaking",
      infoHash: "42"
    },
    {
      name: "Into tha oven #tinycow\nGonna #eatyoufordinner",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/bfeb9eeae433e694379efa43877ca38c/5BB61FE8/t51.2885-15/s640x640/sh0.08/e35/16123854_242787556133707_6786773713296556032_n.jpg",
      description: "Into tha oven #tinycow\nGonna #eatyoufordinner",
      infoHash: "43"
    },
    {
      name:
        "Cooking up a fully decomposable book board outta espresso grounds, paper pulp, flour, and gum Arabic -- we'll see !!!\n🌿🌿\n#compost #gardening #artistbook #environmentalart #espresso #bakeyourart #gumarabic",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/33cc9c19e5b2350d3cf8bdc247e11312/5B9E84E6/t51.2885-15/s640x640/sh0.08/e35/15803340_1010139599091502_5262831441644879872_n.jpg",
      description:
        "Cooking up a fully decomposable book board outta espresso grounds, paper pulp, flour, and gum Arabic -- we'll see !!!\n🌿🌿\n#compost #gardening #artistbook #environmentalart #espresso #bakeyourart #gumarabic",
      infoHash: "44"
    },
    {
      name: "Pages gettin ready for this fully decomposable artist book !\n🌻🌻\n#artistbook #decomposable #compost #silk #seeds #plants #bookmaking #environmentalart",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/62d14b755e1a049c5c97b981c1aad1c1/5BB8374B/t51.2885-15/s640x640/sh0.08/e35/16123295_1651512275142521_2277490736091889664_n.jpg",
      description: "Pages gettin ready for this fully decomposable artist book !\n🌻🌻\n#artistbook #decomposable #compost #silk #seeds #plants #bookmaking #environmentalart",
      infoHash: "45"
    },
    {
      name:
        "TONIGHT // 6:00 // FREE FOOD // COME THROUGH -- SUPPORT LOCAL ART <3 ! 🎉🎉🎉\n.\n#triennial #risd #risdceramics #woodsgerry #goodart #opening #galleryopening #providence #ceramics #fineart #providencelocal #providencelove #localart",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/af16d06a25b0398df28a7ed8fa657ac5/5BBAC6BA/t51.2885-15/s640x640/sh0.08/e35/15876955_1310574929000508_6835871644825681920_n.jpg",
      description:
        "TONIGHT // 6:00 // FREE FOOD // COME THROUGH -- SUPPORT LOCAL ART <3 ! 🎉🎉🎉\n.\n#triennial #risd #risdceramics #woodsgerry #goodart #opening #galleryopening #providence #ceramics #fineart #providencelocal #providencelove #localart",
      infoHash: "46"
    },
    {
      name: "Still in awe of this west coast earthscape\n🌬 \n#ceramicinspiration #earthscape #sand #beachcliff #halfmoonbay #winterbeach",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/baebfb71afd5f84df3df069cd6a3a6a2/5BBF02B0/t51.2885-15/s640x640/sh0.08/e35/c60.0.960.960/15623777_1418564011495928_2379729726743773184_n.jpg",
      description: "Still in awe of this west coast earthscape\n🌬 \n#ceramicinspiration #earthscape #sand #beachcliff #halfmoonbay #winterbeach",
      infoHash: "47"
    },
    {
      name: "Bound my first thesis style book this weekend\n💛\n.\n#thesisbinding #bookmaking #handmadebook #handmade #bookbinding #paleyellow",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/d68062b3ccfa3346f1de55a5059abc2b/5BA532DC/t51.2885-15/s640x640/sh0.08/e35/14733508_368476203518542_6028090044223324160_n.jpg",
      description: "Bound my first thesis style book this weekend\n💛\n.\n#thesisbinding #bookmaking #handmadebook #handmade #bookbinding #paleyellow",
      infoHash: "48"
    },
    {
      name:
        "Sneak peak: RISD Ceramics Department Triennial un-boxing -- Exciting ! \nSee you at Woods Gerry on Thursday 😘!!\n.\n.\n#risdceramics #woodsgerry #risd #ceramics #vermicomposter #pedestal #gallery",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/49683be069d74778ed178f7cd9a6d127/5BA0A9C4/t51.2885-15/s640x640/sh0.08/e35/15803195_1394918500552232_5913207554615279616_n.jpg",
      description:
        "Sneak peak: RISD Ceramics Department Triennial un-boxing -- Exciting ! \nSee you at Woods Gerry on Thursday 😘!!\n.\n.\n#risdceramics #woodsgerry #risd #ceramics #vermicomposter #pedestal #gallery",
      infoHash: "49"
    },
    {
      name: "Big day coming up Thursday for RISD Ceramics Dept. -- stay tuned !!\n🎉\n#risd #ceramics #vermicomposting",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/8610194ae894f5de0f1f745c794c5694/5BA823C4/t51.2885-15/s640x640/sh0.08/e35/15803396_230824423995225_1889237018362249216_n.jpg",
      description: "Big day coming up Thursday for RISD Ceramics Dept. -- stay tuned !!\n🎉\n#risd #ceramics #vermicomposting",
      infoHash: "50"
    },
    {
      name: "Tested and true - perfect size for a double shot ! 👋👋\n.\n#doubleshot #espresso #ceramic  #rockcup #cat #coffeecat #sundaymorning #porcelain #risd",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/f64626ae4671c3734bba60ac6b0969e7/5BBAD2F8/t51.2885-15/s640x640/sh0.08/e35/15801831_242699956158270_5692471837900931072_n.jpg",
      description: "Tested and true - perfect size for a double shot ! 👋👋\n.\n#doubleshot #espresso #ceramic  #rockcup #cat #coffeecat #sundaymorning #porcelain #risd",
      infoHash: "51"
    },
    {
      name: "Choppy texture from clams that grind into rocks and live there like no big deal🙀\n#ceramicinspiration #texture #piddock #rock #clam #fitzgeraldmarinereserve",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/8d1533fbf2439c7abbad48c9dd99e03b/5BAE4E91/t51.2885-15/s640x640/sh0.08/e35/15801919_372697866424643_1397021607188234240_n.jpg",
      description: "Choppy texture from clams that grind into rocks and live there like no big deal🙀\n#ceramicinspiration #texture #piddock #rock #clam #fitzgeraldmarinereserve",
      infoHash: "52"
    },
    {
      name: "Got a lot to learn from tide pool colors\n🌿\n#tidepools #fitzgeraldmarinereserve #naturepaintings #readymade #ceramicinspiration #orange #lavender",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/90fd01a018c1118a462315288614a3db/5BC31B07/t51.2885-15/s640x640/sh0.08/e35/15876466_1840161732865947_6347568974628126720_n.jpg",
      description: "Got a lot to learn from tide pool colors\n🌿\n#tidepools #fitzgeraldmarinereserve #naturepaintings #readymade #ceramicinspiration #orange #lavender",
      infoHash: "53"
    },
    {
      name:
        "Dirt can do such amazing things!  This trilobite fossil's gotta be a few hundred-thousand years old!!\n🌾\n#naturepainting #trilobite #wickedolddirt #fossil #dirt #ceramicinspiration",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/4ecba8f81a67a7e9f4ccfd6351e10c70/5BA823DC/t51.2885-15/s640x640/sh0.08/e35/15876061_719471324871526_8703405914268368896_n.jpg",
      description:
        "Dirt can do such amazing things!  This trilobite fossil's gotta be a few hundred-thousand years old!!\n🌾\n#naturepainting #trilobite #wickedolddirt #fossil #dirt #ceramicinspiration",
      infoHash: "54"
    },
    {
      name: "Big slipcasting plaster mold lookin like a space machine 🚀 \n#slipcast #slipcasting #plastermold #spacemachine",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/cecd9f73ff9d0a5e1ae79473c1a90566/5BBBB9A1/t51.2885-15/s640x640/sh0.08/e35/15624646_1506707169359370_5790605316559208448_n.jpg",
      description: "Big slipcasting plaster mold lookin like a space machine 🚀 \n#slipcast #slipcasting #plastermold #spacemachine",
      infoHash: "55"
    },
    {
      name: "Our yankee swap inspired this new baby - excited to cast some more and experiment with feet\n#slipcast #moldmaking of the #butternutsquash #teapot",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/f5eb9dc22ea2a4e9088153b451e6aecd/5B9E7CE7/t51.2885-15/s640x640/sh0.08/e35/15624246_557147411158889_7387910903846404096_n.jpg",
      description: "Our yankee swap inspired this new baby - excited to cast some more and experiment with feet\n#slipcast #moldmaking of the #butternutsquash #teapot",
      infoHash: "56"
    },
    {
      name: "Found some secret #gnomes earlier~~",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/5e7e9e765b63e44e373f9aeeaf7004f3/5BA32F7F/t51.2885-15/s640x640/sh0.08/e35/c121.0.837.837/15306784_1848741572030226_6834754833069637632_n.jpg",
      description: "Found some secret #gnomes earlier~~",
      infoHash: "57"
    },
    {
      name:
        "Traded a rock cup with a friend for a barnacle-esque mother-daughter collab piece of pottery 💛\nGreat welcome to winter break 🎉🎉\n.\n.\n.\n#risd #ceramics #cupexchange #porcelain",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/e2088561a5fab1ea6414c9a3340620c5/5BADF464/t51.2885-15/s640x640/sh0.08/e35/14607205_1297995923596165_7270287825671553024_n.jpg",
      description:
        "Traded a rock cup with a friend for a barnacle-esque mother-daughter collab piece of pottery 💛\nGreat welcome to winter break 🎉🎉\n.\n.\n.\n#risd #ceramics #cupexchange #porcelain",
      infoHash: "58"
    },
    {
      name: "Such a great cup exchange last night ! Thanks David @dsolomonk gifting me your yellow one !\n.\n.\n.\n#risd #ceramics #cupexchange",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/6dd9922e395de12dcb9094a9cf7b92e2/5B9FCA56/t51.2885-15/s640x640/sh0.08/e35/15535118_1786155181645166_6858754131067142144_n.jpg",
      description: "Such a great cup exchange last night ! Thanks David @dsolomonk gifting me your yellow one !\n.\n.\n.\n#risd #ceramics #cupexchange",
      infoHash: "59"
    },
    {
      name: "Survived the kiln\ntoo cold to install\n.\n.\n.\n#vermicompost #vermicomposting #ceramics #compost #garden #installationart #glaze",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/5d02704f4903217cbb4bb2cec4ac3504/5BA16219/t51.2885-15/s640x640/sh0.08/e35/c0.82.657.657/15253309_200780620383208_5280233373522984960_n.jpg",
      description: "Survived the kiln\ntoo cold to install\n.\n.\n.\n#vermicompost #vermicomposting #ceramics #compost #garden #installationart #glaze",
      infoHash: "60"
    },
    {
      name: "🚀\n.\n.\n.\n.\n#rocketship #ceramic #cup",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/f0134f51fd2d6a63e638546fe96b3ef6/5BBF502C/t51.2885-15/s640x640/sh0.08/e35/15403347_1138814149572754_7382920516920672256_n.jpg",
      description: "🚀\n.\n.\n.\n.\n#rocketship #ceramic #cup",
      infoHash: "61"
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/472379_orig.jpg",
      name: "Untitled",
      description: "",
      infoHash: 0
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7218287_orig.jpg",
      name: "Untitled",
      description: "",
      infoHash: 100
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2623942_orig.jpg",
      name: "For The Home​",
      description: "",
      infoHash: 200
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9811351_orig.jpg",
      name: "Wearable Porcelain Mushrooms",
      description: "",
      infoHash: 300
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6409425_orig.jpg",
      name: "Wearable Porcelain Mushrooms",
      description: "",
      infoHash: 301
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1678689_orig.jpg",
      name: "Slipcasting molds",
      description: "",
      infoHash: 400
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9716237_orig.jpg",
      name: "Flexible",
      description: "",
      infoHash: 500
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2058813_orig.jpg",
      name: "Fish Diptych  [Collaboration]",
      description: "",
      infoHash: 600
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2670512.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 700
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9521691.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 701
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/87344.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 702
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6766857.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 703
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9830053.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 704
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6487056.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 705
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/5942837.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 706
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9368894.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 707
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6240865.jpg",
      name: "2 Hour Paintings",
      description: "",
      infoHash: 708
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7508009.jpg",
      name: "Still Life Introduction",
      description: "Still life of pepper.  Acrylic on canvas board.  12 x 9 inches. March, 2015.",
      infoHash: 800
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9887389.jpg",
      name: "Still Life Introduction",
      description: "Pairs.  Acrylic on canvas board.  9 x 12 inches.  March, 2015.",
      infoHash: 801
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3485365.jpg?647",
      name: "Estranged",
      description: "",
      infoHash: 900
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8432005.jpg?878",
      name: "rotten hearing gerome",
      description: "",
      infoHash: 1000
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8414598_orig.jpg",
      name: "Waste",
      description: "",
      infoHash: 1100
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6454870.jpg",
      name: "Self Portrait  [Front and Back]",
      description: "",
      infoHash: 1200
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1035075.jpg",
      name: "Self Portrait  [Front and Back]",
      description: "",
      infoHash: 1201
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9968303_orig.jpg",
      name: "UNTITLED",
      description: "",
      infoHash: 1300
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8902298.jpg",
      name: "Collage, Surrealism",
      description: "1800s woodblock open-source print photocopy collage.  6 x 9 inches.",
      infoHash: 1400
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3013304.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5 x 3.75 inches.",
      infoHash: 1401
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3279863.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  6 x 6.25 inches",
      infoHash: 1402
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3486905.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5 x 6.5 inches",
      infoHash: 1403
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8680010.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5.5 x 12 inches.",
      infoHash: 1404
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7134191.jpg",
      name: "High School Senior Portfolio",
      description:
        "This is a selection from a total of 10 abstractions on a small tricycle.  This sort of abstraction was difficult for me to impute at first, I began very literally.  The first few sequential abstractions simplified the gradient while holding onto the overall shape.  After a time, I felt like I was running out of places to go because, compared to the original form, I had already reduced the image to critical contours.  I realized at this point that I did not need to feel limited to the literal form of the tricycle simply because I had begun with it.  I, as the artist, had and have the ability to manipulate form while still capturing its essence with integrity.  After exploring a different route, I restarted from the middle and became partial to this pair because their angular and swooping aesthetics hold true to the voice of the whole assemblage.",
      infoHash: 1500
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/188586.jpg",
      name: "High School Senior Portfolio",
      description:
        "For this, I layered the last version of my bike digression over a drawing made with water and charcoal powder.  The original purpose of this piece was to see how far from the still life my digression had come.  To me, the piece itself surpasses that aim.  The clear division of tone creates a sense of depth, and the movement of the marks in the midground complements that of the foreground in a way that visually locks the tempera in place.  I have chosen to separate it from the digression because to me it has a charge that allows it to stand on its own.",
      infoHash: 1501
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9645022.jpg",
      name: "High School Senior Portfolio",
      description:
        "I found this to be a strange abstracting process, I had never tried to mimic existing form with other form so closely before.  For reference, I had four flat images of my own head where I had traced out the basic surface forms.  I was using flat representations of curvaceous form to create form with flat planes.  But the flat images only accounted for the outermost layer.  I inferred the spherical shape of the back of a skull, and created a frequency 2 geodome.  That cranium structure is now entirely covered with a representation of the surface forms depicted by the flat images.",
      infoHash: 1502
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8103214.jpg",
      name: "High School Senior Portfolio",
      description:
        "This is a found book whose pages I glued into 14 sections to create 30 separate pages that I whitewashed on both sides.  On October 15th, I began adding a colored-pencil self portrait daily, as the last action of the night before turning off the lights and falling asleep.  At the time this scan was taken, the daily portion had been going on for 13 days.  As a work in progress I do not feel ready to analyze the take away from the experience yet, as to keep my lens unfiltered through to the end and allow myself to focus on the process rather than the result.  This is a small study of the self, and my first formal quotidian time lapse project.  ",
      infoHash: 1503
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2987523.jpg",
      name: "High School Senior Portfolio",
      description:
        "Before Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 1504
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7184475.jpg",
      name: "High School Senior Portfolio",
      description:
        "*repeat*\nBefore Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 1505
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6423726.jpg",
      name: "High School Senior Portfolio",
      description:
        "*repeat*\nBefore Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 1506
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/296287.jpg",
      name: "High School Senior Portfolio",
      description:
        "Through this project, I was introduced to the balance of Wabi Sabi.  Wabi speaks to the beauty of imperfection, and Sabi is the beauty of age and wear that exposes the impermanence of things.  Over the course of a week I methodically started 30 basic Japanese Tea Bowls.  For each one, I pinched a fist-sized ball of mineral-laden Raku clay into a small pot, then returned 24 hours later to embark on the tedious task of shaving it down to a delicate shell.  This was where I broke the most bowls because the more I shaved them down the easier it became to apply too much pressure and shatter the wall.  It was this stage in which I began to understand the essence of Wabi Sabi.  I realized I had to release preconceived visions of a final product as they tarnish the entire process, putting a disproportional amount of weight on the importance of having produced versus the beauty of creating the production.  I knew this had honestly settled with me when my ultimate absence of control over the clay and glaze reaction didn’t rattle me.  As a final test and tribute, I chose to make the ultimate sacrifice in this project, and smash the bowl I felt was most beautiful after all had been glazed, and scatter its pieces among others in the woods.  I now think back on this project as being an important primer to more recent experiments in abstraction and abstract expressionism.",
      infoHash: 1507
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1768336.jpg",
      name: "High School Senior Portfolio",
      description:
        "These raku water buckets were made with a different construction technique from that of the Tea Bowls, but the essential teachings relating to the balance of Wabi Sabi remained an extension of the same, as both projects progressed simultaneously.  ",
      infoHash: 1508
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/519751.jpg",
      name: "High School Senior Portfolio",
      description:
        "Bowling for Merry-Go-Round\n\nThis is a piece made in three layers where I grew accustomed to using semi discernable objective images as tools to layer abstractly.  I took multiple days drawing a monochromatic still life in green colored pencil, and upon completion, I made the cut.  To combine them one once again, I painted in a contour of a moving subject with an aim of sending the eye around the page to notice more.  While the eye then had more places to go, the image felt rather shallow. As a final layer, I chose to censor a few areas of small detail by adding large bold spheres, the result ultimately worth the sacrifice as it pushed the other layers far back and added understandable depth.  I consider this project a notable bridge between being able to represent form on paper and being able to manipulate it.",
      infoHash: 1509
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/936330.jpg",
      name: "High School Senior Portfolio",
      description:
        "For this non-objective diptych, I worked in layers on two 18 in x 24 in pages.  I focused on observation, constantly responding intuitively to what was already put down.  In each case, I began with layers of small detailed work, designs growing bigger with each overlapping addition.  When they grew dark and chaotic, I mixed colors to match the energy of the drawings, and blocked everything else out with many coats.  I alternated between drying the pieces with a heat gun and washing or sanding them to etch away the paint and give an effect of semi-transparency none of the other censoring layers had.  Finally, I sliced each part in half and re-assembled them in the orientation that sparked the most effective dialogue between the two.",
      infoHash: 1510
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1258760.jpg",
      name: "High School Senior Portfolio",
      description:
        "Missing\n\nThis is a mixed media drawing created from the remaining two pieces after Diptych 3.  With a detailed overdrawing, I united the two images in a single drawing.  The final result is a map of important relationships that exist for me and what the ghost or essence of each looks like to me with distance.",
      infoHash: 1511
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/4573814.jpg",
      name: "High School Senior Portfolio",
      description:
        "I find that when I carry spiral bound sketchbooks with me, I am more likely to make entries in image form, whereas when my sketchbook is bound I more often scrawl in prose or list form.  \nThese are four entries from two different spiral bound books.  The top left was made with a borrowed set of watercolors and the Mediterranean Sea, the salt is a little course on the page.  The top right is a slightly longer duration form drawing of a statue in the Musée d'Orsay.  The bottom two are commemorations of more fleeting moments, a passing stranger portrait with leftover paint and a fast collage of leaves and litter from a fall walk.",
      infoHash: 1512
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3606259.jpg",
      name: "High School Senior Portfolio",
      description:
        "This is an assembly of clippings collected from various found discarded items.  Being in the jar frames its phrases without their original context, so they are free to be inspiring.  Through their collection, my own small moments are made.  Specific strips hold tiny recollections, like passing a house with a particularly large collection of garden statues on a comfortable Autumn morning, finding a newspaper leaf blowing against a tree, and snipping it later in the privacy of the train station.  There must be hundreds of tiny texts and tiny moments sealed up in my jar now, and it continues to grow.",
      infoHash: 1513
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9414782.jpg",
      name: "High School Senior Portfolio",
      description:
        "Ugly Devil\n\nThis was not a pretty piece to make.  The number seven correlates to the superstition that breaking a mirror brings on seven years of bad luck.  This is a broken self portrait, broken reflection, of the ugly devils I have, maybe anyone has that normally I and others excuse to the self as natural.  It’s uncomfortable to think about the true difference between naive imminent human nature and thinly veiled ugly devils.  Maybe the difference between them is a layer of narcissism and self forgiveness.  By the end, the making had me in a shaken state, my sense of security inside my protective natural narcissism shell was broken.  I documented this posture by rewriting my full name until I could do so smoothly again.",
      infoHash: 1514
    }
  ],

  DELAYED_INIT: 3000 /* 3 seconds */,

  DEFAULT_DOWNLOAD_PATH: getDefaultDownloadPath(),

  GITHUB_URL: "https://github.com/webcontent/webcontent-desktop",
  GITHUB_URL_ISSUES: "https://github.com/webcontent/webcontent-desktop/issues",
  GITHUB_URL_RAW: "https://raw.githubusercontent.com/webcontent/webcontent-desktop/master",

  HOME_PAGE_URL: "https://webcontent.io",

  IS_PORTABLE: IS_PORTABLE,
  IS_PRODUCTION: IS_PRODUCTION,
  IS_TEST: IS_TEST,

  OS_SYSARCH: arch() === "x64" ? "x64" : "ia32",

  POSTER_PATH: path.join(getConfigPath(), "Posters"),
  ROOT_PATH: path.join(__dirname, ".."),
  STATIC_PATH: path.join(__dirname, "..", "static"),
  CONTENT_PATH: path.join(getConfigPath(), "Contents"),

  WINDOW_ABOUT: "file://" + path.join(__dirname, "..", "static", "about.html"),
  WINDOW_MAIN: "file://" + path.join(__dirname, "..", "static", "main.html"),
  WINDOW_WEBCONTENT: "file://" + path.join(__dirname, "..", "static", "webcontent.html"),

  WINDOW_INITIAL_BOUNDS: {
    width: 500,
    height: UI_HEADER_HEIGHT + UI_CONTENT_HEIGHT * 6 // header + 6 contents
  },
  WINDOW_MIN_HEIGHT: UI_HEADER_HEIGHT + UI_CONTENT_HEIGHT * 2, // header + 2 contents
  WINDOW_MIN_WIDTH: 425,

  UI_HEADER_HEIGHT: UI_HEADER_HEIGHT,
  UI_CONTENT_HEIGHT: UI_CONTENT_HEIGHT
};

function getConfigPath() {
  if (IS_PORTABLE) {
    return PORTABLE_PATH;
  } else {
    return path.dirname(appConfig.filePath);
  }
}

function getDefaultDownloadPath() {
  if (IS_PORTABLE) {
    return path.join(getConfigPath(), "Downloads");
  } else {
    return getPath("downloads");
  }
}

function getPath(key) {
  if (!process.versions.electron) {
    // Node.js process
    return "";
  } else if (process.type === "renderer") {
    // Electron renderer process
    return electron.remote.app.getPath(key);
  } else {
    // Electron main process
    return electron.app.getPath(key);
  }
}

function isTest() {
  return process.env.NODE_ENV === "test";
}

function isPortable() {
  if (IS_TEST) {
    return true;
  }

  if (process.platform !== "win32" || !IS_PRODUCTION) {
    // Fast path: Non-Windows platforms should not check for path on disk
    return false;
  }

  const fs = require("fs");

  try {
    // This line throws if the "Portable Settings" folder does not exist, and does
    // nothing otherwise.
    fs.accessSync(PORTABLE_PATH, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function isProduction() {
  if (!process.versions.electron) {
    // Node.js process
    return false;
  }
  if (process.platform === "darwin") {
    return !/\/Electron\.app\//.test(process.execPath);
  }
  if (process.platform === "win32") {
    return !/\\electron\.exe$/.test(process.execPath);
  }
  if (process.platform === "linux") {
    return !/\/electron$/.test(process.execPath);
  }
}
