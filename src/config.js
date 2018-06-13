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
      name: "Definitely past bedtime\n🍳🍳\n#ceramic #zombie #terracotta #clay #sculpture #ceramics #selfportrait #lifesculpture #orange",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/70ea22d71300ac1f8867c7201eb31c8e/5BB7DFD6/t51.2885-15/s640x640/sh0.08/e35/18253093_1709014769397979_1453589929954115584_n.jpg",
      description: "Definitely past bedtime\n🍳🍳\n#ceramic #zombie #terracotta #clay #sculpture #ceramics #selfportrait #lifesculpture #orange",
      infoHash: "12"
    },
    {
      name: "Variations on a theme 😱\n#lifesculpture #clay #ceramic #ceramicsculpture #terracotta #risd #ceramics",
      img:
        "https://instagram.fbed1-1.fna.fbcdn.net/vp/3390f73fc2738102d7ee18d5278dc9d7/5BB4E6A9/t51.2885-15/s640x640/sh0.08/e35/18094873_765124846998415_7712325911315480576_n.jpg",
      description: "Variations on a theme 😱\n#lifesculpture #clay #ceramic #ceramicsculpture #terracotta #risd #ceramics",
      infoHash: "15"
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
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/472379_orig.jpg",
      name: "Untitled",
      description: "Water-soluble oil and acrylic paints on matte board.  Approx. 6 x 6 in.  July, 2015.",
      infoHash: 61
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9811351_orig.jpg",
      name: "Wearable Porcelain Mushrooms",
      description: " \n",
      infoHash: 91
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6409425_orig.jpg",
      name: "Wearable Porcelain Mushrooms",
      description: " \n",
      infoHash: 92
    },
    

    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2670512.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 131
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9521691.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 132
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/87344.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 133
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6766857.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 134
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9830053.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 135
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6487056.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 136
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/5942837.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 137
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9368894.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 138
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6240865.jpg",
      name: "2 Hour Paintings",
      description: "Oil pastel [or] sepia watercolor ink on extra-smooth bristol paper.  11 x 14 inches.  April 2015.",
      infoHash: 139
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7508009.jpg",
      name: "Still Life Introduction",
      description: "Still life of pepper.  Acrylic on canvas board.  12 x 9 inches. March, 2015.",
      infoHash: 141
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9887389.jpg",
      name: "Still Life Introduction",
      description: "Pairs.  Acrylic on canvas board.  9 x 12 inches.  March, 2015.",
      infoHash: 142
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3485365.jpg?647",
      name: "Estranged",
      description: "Found charcoal drawings on newsprint, india ink, gouache.  Approximately 18 x 22 inches.  February 2015.",
      infoHash: 151
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8414598_orig.jpg",
      name: "Waste",
      description: "February 2015",
      infoHash: 171
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6454870.jpg",
      name: "Self Portrait  [Front and Back]",
      description: "Found paper collage, cut with scissors.  Approximately 14 x 12 inches.  January-February 2015.",
      infoHash: 181
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1035075.jpg",
      name: "Self Portrait  [Front and Back]",
      description: "Found paper collage, cut with scissors.  Approximately 14 x 12 inches.  January-February 2015.",
      infoHash: 182
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9968303_orig.jpg",
      name: "UNTITLED",
      description: "​Glossy paper mounted on matte board.  6.25 x 12.75 inches.  January 2015.",
      infoHash: 191
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8902298.jpg",
      name: "Collage, Surrealism",
      description: "1800s woodblock open-source print photocopy collage.  6 x 9 inches.",
      infoHash: 201
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3013304.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5 x 3.75 inches.",
      infoHash: 202
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3279863.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  6 x 6.25 inches",
      infoHash: 203
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3486905.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5 x 6.5 inches",
      infoHash: 204
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8680010.jpg",
      name: "Collage, Surrealism",
      description: "Glossy paper mounted on matte board.  5.5 x 12 inches.",
      infoHash: 205
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7134191.jpg",
      name: "Portfolio Item",
      description:
        "This is a selection from a total of 10 abstractions on a small tricycle.  This sort of abstraction was difficult for me to impute at first, I began very literally.  The first few sequential abstractions simplified the gradient while holding onto the overall shape.  After a time, I felt like I was running out of places to go because, compared to the original form, I had already reduced the image to critical contours.  I realized at this point that I did not need to feel limited to the literal form of the tricycle simply because I had begun with it.  I, as the artist, had and have the ability to manipulate form while still capturing its essence with integrity.  After exploring a different route, I restarted from the middle and became partial to this pair because their angular and swooping aesthetics hold true to the voice of the whole assemblage.",
      infoHash: 211
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/188586.jpg",
      name: "Portfolio Item",
      description:
        "For this, I layered the last version of my bike digression over a drawing made with water and charcoal powder.  The original purpose of this piece was to see how far from the still life my digression had come.  To me, the piece itself surpasses that aim.  The clear division of tone creates a sense of depth, and the movement of the marks in the midground complements that of the foreground in a way that visually locks the tempera in place.  I have chosen to separate it from the digression because to me it has a charge that allows it to stand on its own.",
      infoHash: 212
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9645022.jpg",
      name: "Portfolio Item",
      description:
        "I found this to be a strange abstracting process, I had never tried to mimic existing form with other form so closely before.  For reference, I had four flat images of my own head where I had traced out the basic surface forms.  I was using flat representations of curvaceous form to create form with flat planes.  But the flat images only accounted for the outermost layer.  I inferred the spherical shape of the back of a skull, and created a frequency 2 geodome.  That cranium structure is now entirely covered with a representation of the surface forms depicted by the flat images.",
      infoHash: 213
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/8103214.jpg",
      name: "Portfolio Item",
      description:
        "This is a found book whose pages I glued into 14 sections to create 30 separate pages that I whitewashed on both sides.  On October 15th, I began adding a colored-pencil self portrait daily, as the last action of the night before turning off the lights and falling asleep.  At the time this scan was taken, the daily portion had been going on for 13 days.  As a work in progress I do not feel ready to analyze the take away from the experience yet, as to keep my lens unfiltered through to the end and allow myself to focus on the process rather than the result.  This is a small study of the self, and my first formal quotidian time lapse project.  ",
      infoHash: 214
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/2987523.jpg",
      name: "Portfolio Item",
      description:
        "Before Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 215
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/7184475.jpg",
      name: "Portfolio Item",
      description:
        "*repeat*\nBefore Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 216
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/6423726.jpg",
      name: "Portfolio Item",
      description:
        "*repeat*\nBefore Drawing Naturalism my sophomore year, I hadn’t taken any formal drawing for fear of frustration.  In retrospect, it wouldn’t be an exaggeration to say that this class changed the way I think of and see the world every day.  For me, it was not a class about how to make something look realistic so much as it was about understanding what I am looking at.  The retina perceives only flat images at any given moment, and it is the brain that uses a combination of visual cues and memory from different angles and times to create the illusion of the depth we feel.  Naturally, it is impossible to create a dimensional object on a flat paper because a flat paper does not allow for the dimension of time.  For this reason, every naturalistic drawing is a stationary illusion of tone and proportions that aim to trick the eye into perceiving the depth that is lacking on the physical paper.  When drawing naturalistically in the past, I have more often than not drawn an incoherent mix between the flattened retinal image that I see at one given time, and an empty knowledge of how gradient creates the illusion of depth.  Meaning more of a representation of the three dimensional object than an observation.  I’ve carried out of the classroom two notions that have remained relevant ever since.  First, an understanding of proportional and shading techniques I can use to my advantage when communicating depth to the brain.  Last, that the integrity of my drawings increases when I remember to view my subject as a figure in time and space instead of an already flat image.",
      infoHash: 217
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/296287.jpg",
      name: "Portfolio Item",
      description:
        "Through this project, I was introduced to the balance of Wabi Sabi.  Wabi speaks to the beauty of imperfection, and Sabi is the beauty of age and wear that exposes the impermanence of things.  Over the course of a week I methodically started 30 basic Japanese Tea Bowls.  For each one, I pinched a fist-sized ball of mineral-laden Raku clay into a small pot, then returned 24 hours later to embark on the tedious task of shaving it down to a delicate shell.  This was where I broke the most bowls because the more I shaved them down the easier it became to apply too much pressure and shatter the wall.  It was this stage in which I began to understand the essence of Wabi Sabi.  I realized I had to release preconceived visions of a final product as they tarnish the entire process, putting a disproportional amount of weight on the importance of having produced versus the beauty of creating the production.  I knew this had honestly settled with me when my ultimate absence of control over the clay and glaze reaction didn’t rattle me.  As a final test and tribute, I chose to make the ultimate sacrifice in this project, and smash the bowl I felt was most beautiful after all had been glazed, and scatter its pieces among others in the woods.  I now think back on this project as being an important primer to more recent experiments in abstraction and abstract expressionism.",
      infoHash: 218
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1768336.jpg",
      name: "Portfolio Item",
      description:
        "These raku water buckets were made with a different construction technique from that of the Tea Bowls, but the essential teachings relating to the balance of Wabi Sabi remained an extension of the same, as both projects progressed simultaneously.  ",
      infoHash: 219
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/519751.jpg",
      name: "Portfolio Item",
      description:
        "Bowling for Merry-Go-Round\n\nThis is a piece made in three layers where I grew accustomed to using semi discernable objective images as tools to layer abstractly.  I took multiple days drawing a monochromatic still life in green colored pencil, and upon completion, I made the cut.  To combine them one once again, I painted in a contour of a moving subject with an aim of sending the eye around the page to notice more.  While the eye then had more places to go, the image felt rather shallow. As a final layer, I chose to censor a few areas of small detail by adding large bold spheres, the result ultimately worth the sacrifice as it pushed the other layers far back and added understandable depth.  I consider this project a notable bridge between being able to represent form on paper and being able to manipulate it.",
      infoHash: 220
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/936330.jpg",
      name: "Portfolio Item",
      description:
        "For this non-objective diptych, I worked in layers on two 18 in x 24 in pages.  I focused on observation, constantly responding intuitively to what was already put down.  In each case, I began with layers of small detailed work, designs growing bigger with each overlapping addition.  When they grew dark and chaotic, I mixed colors to match the energy of the drawings, and blocked everything else out with many coats.  I alternated between drying the pieces with a heat gun and washing or sanding them to etch away the paint and give an effect of semi-transparency none of the other censoring layers had.  Finally, I sliced each part in half and re-assembled them in the orientation that sparked the most effective dialogue between the two.",
      infoHash: 221
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/1258760.jpg",
      name: "Portfolio Item",
      description:
        "Missing\n\nThis is a mixed media drawing created from the remaining two pieces after Diptych 3.  With a detailed overdrawing, I united the two images in a single drawing.  The final result is a map of important relationships that exist for me and what the ghost or essence of each looks like to me with distance.",
      infoHash: 222
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/4573814.jpg",
      name: "Portfolio Item",
      description:
        "I find that when I carry spiral bound sketchbooks with me, I am more likely to make entries in image form, whereas when my sketchbook is bound I more often scrawl in prose or list form.  \nThese are four entries from two different spiral bound books.  The top left was made with a borrowed set of watercolors and the Mediterranean Sea, the salt is a little course on the page.  The top right is a slightly longer duration form drawing of a statue in the Musée d'Orsay.  The bottom two are commemorations of more fleeting moments, a passing stranger portrait with leftover paint and a fast collage of leaves and litter from a fall walk.",
      infoHash: 223
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/3606259.jpg",
      name: "Portfolio Item",
      description:
        "This is an assembly of clippings collected from various found discarded items.  Being in the jar frames its phrases without their original context, so they are free to be inspiring.  Through their collection, my own small moments are made.  Specific strips hold tiny recollections, like passing a house with a particularly large collection of garden statues on a comfortable Autumn morning, finding a newspaper leaf blowing against a tree, and snipping it later in the privacy of the train station.  There must be hundreds of tiny texts and tiny moments sealed up in my jar now, and it continues to grow.",
      infoHash: 224
    },
    {
      url: "https://kaitlyncirielliportfolio.weebly.com/",
      img: "https://kaitlyncirielliportfolio.weebly.com/uploads/5/7/6/4/57646795/9414782.jpg",
      name: "Portfolio Item",
      description:
        "Ugly Devil\n\nThis was not a pretty piece to make.  The number seven correlates to the superstition that breaking a mirror brings on seven years of bad luck.  This is a broken self portrait, broken reflection, of the ugly devils I have, maybe anyone has that normally I and others excuse to the self as natural.  It’s uncomfortable to think about the true difference between naive imminent human nature and thinly veiled ugly devils.  Maybe the difference between them is a layer of narcissism and self forgiveness.  By the end, the making had me in a shaken state, my sense of security inside my protective natural narcissism shell was broken.  I documented this posture by rewriting my full name until I could do so smoothly again.",
      infoHash: 225
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
