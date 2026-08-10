import type { NextApiRequest, NextApiResponse } from "next"

import { getTheme } from "../../themes"
import { renderToSVG } from "../../utils/image"

const randomStats = {
  name: "John Doe",
  login: "johndoe",
  repoCount: 42,
  stars: 1234,
  followers: 567,
  following: 89,
  issues: 12,
  commits: 3456,
  closedPRs: 78,
  reviews: 9,
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  languages: [
    { name: "TypeScript", color: "#3178c6", size: 5000 },
    { name: "JavaScript", color: "#f1e05a", size: 3000 },
    { name: "Python", color: "#3572A5", size: 2000 },
  ],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { theme = "city", show = "", about_me = "", fg = "", bg = "", hide_avatar = "false", langs = "false" } = req.query

  const showList = typeof show === "string" && show.length > 0 ? show.split(",") : []
  const aboutMeStr = typeof about_me === "string" ? about_me : ""
  const fgColor = typeof fg === "string" ? fg : ""
  const bgColor = typeof bg === "string" ? bg : ""
  const langsFlag = langs === "true"

  const themeData = getTheme(typeof theme === "string" ? theme : "city", fgColor, bgColor)

  const svg = await renderToSVG({
    stats: randomStats,
    theme: themeData,
    show: showList,
    about_me: aboutMeStr,
    hide_avatar: hide_avatar === "true",
    langs: langsFlag,
  })

  res.setHeader("Content-Type", "image/svg+xml")
  res.status(200).send(svg)
}
