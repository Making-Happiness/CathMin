import becLogo from "../assets/BEC_LOGO.png";
import cfdLogo from "../assets/Logo-removebg-preview.png";
import yfcLogo from "../assets/YFC_LOGO__1_-removebg-preview.png";

export type MinistrySlug = "cfd" | "bec" | "yfc";

export interface MinistrySummary {
  slug: MinistrySlug;
  shortName: string;
  name: string;
  logo: string;
  charism: string;
  description: string;
}

export interface MinistryDetail extends MinistrySummary {
  pageTitle: string;
  introduction: string;
  missionObjective: string;
  coreInitiatives: string;
  targetAudience: string;
  recruitment: string;
  email: string;
}

export interface MinistryMatrixRow {
  organization: string;
  charism: string;
  function: string;
  alignment: string;
}

export const MINISTRY_INTRO =
  "ABOUT OUR MINISTRIES: Welcome to the central hub of our Catholic Campus Ministries. Operating as an interconnected network of accredited, student-led religious organizations, our ministries provide spiritual anchorage, community, and moral leadership for the student body. We aim to nurture mature Christian citizens who balance academic excellence with deep spiritual formation.";

export const MINISTRY_DETAILS: Record<MinistrySlug, MinistryDetail> = {
  cfd: {
    slug: "cfd",
    shortName: "CFD",
    name: "Catholic Faith Defenders",
    logo: cfdLogo,
    charism: "Apologetics, Theology, and Scripture",
    pageTitle: "The Intellectual Defense and Formation of the Faith",
    description:
      "The Catholic Faith Defenders is an organization dedicated to Catholic apologetics, doctrinal clarity, and scriptural study.",
    introduction:
      "The Catholic Faith Defenders is an organization dedicated to Catholic apologetics, doctrinal clarity, and scriptural study.",
    missionObjective:
      "To equip students with a profound understanding of Church doctrines, enabling them to explain and defend their faith with intellectual rigor, clarity, and charity.",
    coreInitiatives:
      "Doctrinal seminars, scriptural lectures, and apologetics forums aimed at resolving contemporary questions about Catholic theology.",
    targetAudience:
      "Individuals seeking to deepen their knowledge of sacred scripture, tradition, and the rational foundations of the Catholic Church.",
    recruitment:
      "Open to all students interested in apologetics and theological study. Membership drives are conducted at the beginning of each academic semester.",
    email: "cfd_obrero@usep.edu.ph",
  },
  bec: {
    slug: "bec",
    shortName: "BEC",
    name: "Basic Ecclesial Community",
    logo: becLogo,
    charism: "Sacraments, Liturgy, and Small Groups",
    pageTitle: "The Liturgical and Communitarian Heart of the Campus",
    description:
      "The Basic Ecclesial Community serves as the primary liturgical partner, fostering communal prayer, spiritual support, and small-group fellowship modeled after the early Christian church.",
    introduction:
      "The Basic Ecclesial Community serves as the primary liturgical partner, fostering communal prayer, spiritual support, and small-group fellowship modeled after the early Christian church.",
    missionObjective:
      "To build a Christ-centered community where students can experience spiritual accompaniment and encounter the Sacraments in their daily academic lives.",
    coreInitiatives:
      "Coordination of regular community Holy Masses, liturgical animations, communal rosaries, and specialized prayer services (such as pre-licensure examination blessings).",
    targetAudience:
      "Individuals looking for a prayer-centered spiritual family and regular sacramental opportunities.",
    recruitment:
      "Open to all students wishing to serve in liturgical ministries (choir, lectors, altar servers) or join small faith-sharing circles.",
    email: "bec_obrero@usep.edu.ph",
  },
  yfc: {
    slug: "yfc",
    shortName: "YFC",
    name: "CFC Youth for Christ",
    logo: yfcLogo,
    charism: "Evangelization, Fellowship, and Leadership",
    pageTitle: "Leadership Development and Youth Evangelization",
    description:
      "CFC Youth for Christ is a ministry designed to empower students through vibrant fellowship, leadership training, and active evangelization.",
    introduction:
      "CFC Youth for Christ is a ministry designed to empower students through vibrant fellowship, leadership training, and active evangelization.",
    missionObjective:
      "To renew the community by molding young leaders who embody the pillars of Faith, Freedom, Fun, and Friendship, extending Christian values into their families, careers, and society.",
    coreInitiatives:
      "Youth camps, leadership empowerment workshops, creative ministries (music, multimedia, and performing arts), and regional student conferences.",
    targetAudience:
      "Individuals seeking dynamic peer fellowship, creative outlets for worship, and personal leadership development opportunities.",
    recruitment:
      "New members are integrated into the ministry by participating in our entry-level weekend dynamic retreat (Youth Camp), hosted semi-annually.",
    email: "bec_yfc@usep.edu.ph",
  },
};

export const MINISTRY_SUMMARIES = Object.values(MINISTRY_DETAILS);

export const MINISTRY_MATRIX: MinistryMatrixRow[] = [
  {
    organization: "Catholic Faith Defenders (CFD)",
    charism: "Apologetics, Theology, & Scripture",
    function: "Doctrinal lectures and theological discussions",
    alignment: "Individuals focused on defense of the faith, scriptural literacy, and theology.",
  },
  {
    organization: "Basic Ecclesial Community (BEC)",
    charism: "Sacraments, Liturgy, & Small Groups",
    function: "Holy Mass coordination, liturgical prayer, and blessings",
    alignment: "Individuals seeking consistent sacramental life and a close-knit prayer community.",
  },
  {
    organization: "CFC Youth for Christ (YFC)",
    charism: "Evangelization, Fellowship, & Leadership",
    function: "Peer youth camps, creative ministries, and conferences",
    alignment: "Individuals looking for dynamic leadership, creative ministry expression, and peer mentorship.",
  },
];
