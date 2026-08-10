import fs from "fs"
import path from "path"
import satori from "satori"

import type { Theme } from "../themes"

interface RenderParams {
  stats: any
  theme: Theme
  show?: string[]
  about_me: string
  hide_avatar?: boolean
  langs?: boolean
}

const fontPath = path.resolve(process.cwd(), "public/fonts/IosevkaNerdFont-Bold.ttf")
const fontExists = fs.existsSync(fontPath)
console.log("[satori] Font exists:", fontExists, fontPath)
const fontData = fontExists ? fs.readFileSync(fontPath) : undefined

const FIELD_LABELS: Record<string, string> = {
  repoCount: "Repos",
  public_repos: "Repos",
  stars: "Stars",
  forks: "Forks",
  followers: "Followers",
  following: "Following",
  public_gists: "Gists",
  issues: "Issues",
  commits: "Commits",
  closedPRs: "Closed PRs",
  reviews: "Reviews",
  name: "Name",
  login: "Login",
  rating_score: "Rating Score",
  rating_percentile: "Rating Percentile",
  rating_level: "Rating Level",
  rating_name: "Rating Name",
}

function getFieldsToShow(show: string[], allFields: string[], defaultFields: string[]): string[] {
  return show.length > 0 ? show.filter(f => allFields.includes(f)) : defaultFields
}

const bgImageCache = new Map<string, string>()

function getBgDataUri(theme: Theme): string | undefined {
  if (!theme.backgroundImage) return undefined

  const cached = bgImageCache.get(theme.backgroundImage)
  if (cached) return cached

  try {
    const absPath = path.resolve(process.cwd(), "public", theme.backgroundImage.replace(/^\//, ""))
    const buf = fs.readFileSync(absPath)
    const ext = path.extname(absPath).toLowerCase()
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png"
    const dataUri = `data:${mime};base64,${buf.toString("base64")}`
    bgImageCache.set(theme.backgroundImage, dataUri)

    return dataUri
  } catch (e) {
    console.error("[satori] Failed to inline background image:", theme.backgroundImage, e)

    return undefined
  }
}

function renderLangsBlock(sortedLangs: any[], total: number, theme: Theme) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, zIndex: 2, width: 1100 }}>
      {sortedLangs.map(lang => {
        const percent = total > 0 ? (lang.size / total) * 100 : 0

        return (
          <div
            key={lang.name}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 10,
              width: 1100,
              height: 40,
              justifyContent: "space-between",
            }}>
            <span
              style={{
                minWidth: 180,
                textShadow: "0px 0px 20px rgba(0, 0, 0, 0.35)",
                lineHeight: 1.2,
              }}>
              {lang.name}
            </span>
            <span
              style={{
                height: 40,
                marginLeft: 18,
                color: theme.color,
                fontWeight: 900,
                minWidth: 70,
                lineHeight: 1.2,
              }}>
              {percent.toFixed(1)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

function renderOverlay(bgUrl: string | undefined) {
  return (
    bgUrl && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 70,
          zIndex: 1,
        }}
      />
    )
  )
}

function renderFieldsBlock(fieldsToShow: string[], stats: any, theme: Theme, hide_avatar: boolean) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
        color: theme.color,
      }}>
      {fieldsToShow.map(
        field =>
          typeof stats[field] !== "undefined" && (
            <div
              key={field}
              style={{
                display: "flex",
                flexDirection: "row",
                width: hide_avatar ? "1100" : "800",
                justifyContent: "space-between",
                color: theme.color,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.2,
                height: 40,
                marginBottom: 10,
                textShadow: "0px 0px 20px rgba(0, 0, 0, 0.35)",
              }}>
              {FIELD_LABELS[field] || field} <b>{stats[field]}</b>
            </div>
          ),
      )}
    </div>
  )
}

function renderAvatarBlock(stats: any, theme: Theme) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        width: "auto",
      }}>
      <img
        src={stats.avatar_url}
        width={400}
        height={400}
        style={{
          borderRadius: "30%",
          marginBottom: 0,
          border: `0px solid ${theme.accent}`,
        }}
      />
    </div>
  )
}

function renderAboutMeBlock(about_me: string) {
  return (
    <h1
      style={{
        width: "100%",
        textAlign: "center",
        margin: 0,
        marginBottom: 15,
        zIndex: 2,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {about_me}
    </h1>
  )
}

export async function renderToSVG({ stats, theme, show = [], about_me, hide_avatar = false, langs = false }: RenderParams): Promise<string> {
  console.log("[satori] stats:", stats)
  console.log("[satori] theme:", theme)

  const allFields = [
    "repoCount",
    "public_repos",
    "stars",
    "forks",
    "followers",
    "following",
    "public_gists",
    "issues",
    "commits",
    "closedPRs",
    "reviews",
    "name",
    "login",
    "rating_score",
    "rating_percentile",
    "rating_level",
    "rating_name",
  ]
  const defaultFields = ["repoCount", "stars", "followers", "following", "issues"]
  const fieldsToShow = getFieldsToShow(show, allFields, defaultFields)
  const bgUrl = getBgDataUri(theme)

  if (langs && Array.isArray(stats.languages) && stats.languages.length > 0) {
    const sortedLangs = [...stats.languages].sort((a, b) => b.size - a.size).slice(0, 6)
    const total = sortedLangs.reduce((sum, l) => sum + l.size, 0)

    return await satori(
      <div
        style={{
          width: 1500,
          height: 600,
          background: bgUrl ? `url(${bgUrl})` : theme.background,
          backgroundSize: "1500 600",
          backgroundPosition: "center",
          color: theme.color,
          fontFamily: "Iosevka Nerd Font",
          borderRadius: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 100,
          boxSizing: "border-box",
          position: "relative",
        }}>
        {renderOverlay(bgUrl)}
        {renderLangsBlock(sortedLangs, total, theme)}
      </div>,
      {
        width: 1500,
        height: 600,
        fonts: fontData
          ? [
              {
                name: "Iosevka Nerd Font",
                data: fontData,
                weight: 700,
                style: "normal",
              },
            ]
          : [],
      },
    )
  }

  try {
    return await satori(
      <div
        style={{
          width: 1500,
          height: 600,
          background: bgUrl ? `url(${bgUrl})` : theme.background,
          backgroundSize: "1500 600",
          backgroundPosition: "center",
          color: theme.color,
          fontFamily: "Iosevka Nerd Font",
          borderRadius: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 100,
          boxSizing: "border-box",
          position: "relative",
        }}>
        {renderOverlay(bgUrl)}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            zIndex: 2,
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 16,
              marginRight: hide_avatar ? 0 : 60,
            }}>
            {renderFieldsBlock(fieldsToShow, stats, theme, hide_avatar)}
          </div>
          {!hide_avatar && renderAvatarBlock(stats, theme)}
        </div>
        {about_me && renderAboutMeBlock(about_me)}
      </div>,
      {
        width: 1500,
        height: 600,
        fonts: fontData
          ? [
              {
                name: "Iosevka Nerd Font",
                data: fontData,
                weight: 700,
                style: "normal",
              },
            ]
          : [],
      },
    )
  } catch (e) {
    console.error("[satori] ERROR:", e)
    throw e
  }
}
