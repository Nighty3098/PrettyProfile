import type { NextApiRequest, NextApiResponse } from "next"

import { getTheme } from "../../themes"
import { getAnySvg, getFreshSvg, setCachedSvg } from "../../utils/cache"
import { getGithubStats } from "../../utils/github"
import { renderToSVG } from "../../utils/image"

function buildCacheKey(query: NextApiRequest["query"]): string {
  return Object.keys(query)
    .sort()
    .map(k => `${k}=${String(query[k])}`)
    .join("&")
}

function sendSvg(res: NextApiResponse, svg: string, source: "cache" | "stale" | "fresh") {
  res.setHeader("Content-Type", "image/svg+xml")
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400")
  res.setHeader("X-Data-Source", source === "stale" ? "cache-stale" : "github")
  if (source === "stale") {
    res.setHeader("Warning", '110 - "Response is stale"')
  }
  res.status(200).send(svg)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, theme = "city", show = "", about_me = "", fg = "", bg = "", hide_avatar = "false", langs = "false" } = req.query
  const usernameStr = String(username)
  const themeStr = String(theme)
  const showStr = String(show)
  const fgStr = String(fg)
  const bgStr = String(bg)
  const langsStr = String(langs)
  console.log(`[api] username: ${usernameStr}, theme: ${themeStr}`)
  const aboutMeLog = String(about_me)
  console.log(`[api] show: ${showStr}, about_me: ${aboutMeLog}, fg: ${fgStr}, bg: ${bgStr}, langs: ${langsStr}`)

  if (!username || typeof username !== "string") {
    res.status(400).send("Missing username")

    return
  }

  const cacheKey = buildCacheKey(req.query)

  const cachedSvg = getFreshSvg(cacheKey)
  if (cachedSvg) {
    console.log("[api] serving fresh cached SVG")
    sendSvg(res, cachedSvg, "cache")

    return
  }

  const showList = typeof show === "string" && show.length > 0 ? show.split(",") : []
  const aboutMeStr = typeof about_me === "string" ? about_me : ""
  const fgColor = typeof fg === "string" ? fg : ""
  const bgColor = typeof bg === "string" ? bg : ""
  const langsFlag = langs === "true"

  let stats
  try {
    stats = await getGithubStats(username)
  } catch (e) {
    console.error("[api] ERROR getGithubStats:", e)

    const staleSvg = getAnySvg(cacheKey)
    if (staleSvg) {
      console.log("[api] GitHub unavailable, serving stale cached SVG")
      sendSvg(res, staleSvg, "stale")

      return
    }

    res.status(500).send("Failed to fetch GitHub data")

    return
  }

  try {
    const themeData = getTheme(typeof theme === "string" ? theme : "city", fgColor, bgColor)
    const svg = await renderToSVG({
      stats,
      theme: themeData,
      show: showList,
      about_me: aboutMeStr,
      hide_avatar: hide_avatar === "true",
      langs: langsFlag,
    })
    setCachedSvg(cacheKey, svg)
    sendSvg(res, svg, "fresh")
  } catch (e) {
    console.error("[api] ERROR renderToSVG:", e)

    const staleSvg = getAnySvg(cacheKey)
    if (staleSvg) {
      console.log("[api] render failed, serving stale cached SVG")
      sendSvg(res, staleSvg, "stale")

      return
    }

    res.status(500).send("Failed to render SVG")
  }
}
