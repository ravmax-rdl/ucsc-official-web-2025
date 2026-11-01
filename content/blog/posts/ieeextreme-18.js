// SAMPLE POST — replace with real content
export default {
  slug: "ieeextreme-18",
  title: "Inside IEEEXtreme 18.0: 24 hours of code at UCSC",
  date: "2024-10-26",
  excerpt:
    "Teams gathered overnight at UCSC to solve IEEEXtreme 18.0's programming problems against students worldwide.",
  image: "/images/blog/ieeextreme-18/cover.webp",
  imageAlt: "Students coding at laptops in a university lab during IEEEXtreme 18.0",
  imageFocus: "50% 40%",
  tags: ["competitions", "tech"],
  author: { name: "IEEE UCSC Media Team" },
  body: [
    {
      type: "p",
      text: "IEEEXtreme is a global challenge in which teams of IEEE Student members compete in a **24-hour** time span to solve programming problems. This year UCSC hosted teams in person for the first time.",
    },
    { type: "h2", text: "The setup" },
    {
      type: "p",
      text: "Teams of up to three registered through the [IEEEXtreme portal](https://ieeextreme.org/) and met at the university on the evening of October 26.",
    },
    {
      type: "list",
      items: [
        "Three-person teams with one shared machine",
        "Problems released at the start, scored *as they are solved*",
        "An IEEE member proctoring each venue",
      ],
    },
    { type: "h2", text: "Through the night" },
    {
      type: "p",
      text: "By 2 a.m. the lab was quiet apart from keyboards. Teams split problems three ways and checked the leaderboard every few minutes.",
    },
    {
      type: "image",
      src: "/images/blog/ieeextreme-18/lab.webp",
      alt: "Participants working through the night in the main lab",
      caption: "The main lab a few hours in.",
    },
    {
      type: "quote",
      text: "We solved our hardest problem at 5:40 a.m. — the **best** part of the night.",
      cite: "A participating team",
    },
    {
      type: "code",
      language: "py",
      code: "def solve(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return n\n        seen.add(n)\n    return -1",
    },
    { type: "h2", text: "Results" },
    {
      type: "p",
      text: "Every team submitted solutions before the deadline, and several placed in the national rankings.",
    },
    {
      type: "gallery",
      images: [
        { src: "/images/blog/ieeextreme-18/gallery-1.webp", alt: "Branch members at an event" },
        { src: "/images/blog/ieeextreme-18/gallery-2.webp", alt: "Students collaborating at a table" },
      ],
      caption: "Moments from the night.",
    },
    { type: "divider" },
    { type: "h2", text: "What's next" },
    {
      type: "callout",
      title: "IEEEXtreme 19.0",
      text: "Registration opens in September. Follow the branch on [LinkedIn](https://www.linkedin.com/company/ucscieeesb/) for the announcement.",
    },
  ],
};
