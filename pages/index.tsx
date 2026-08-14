import React, { useEffect, useRef, useState } from "react"

import { themes } from "../themes"

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

export default function Home() {
  const [theme, setTheme] = useState("city")
  const [fg, setFg] = useState("#ffffff")
  const [bg, setBg] = useState("#0b1929")
  const [username, setUsername] = useState("User")
  const [hideAvatar, setHideAvatar] = useState(false)
  const [langs, setLangs] = useState(false)
  const [svg, setSvg] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState("")
  const linkRef = useRef<HTMLParagraphElement>(null)
  const [showFields, setShowFields] = useState<string[]>(["repoCount", "stars", "followers", "following", "issues"])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({
      theme,
      fg,
      bg,
      hide_avatar: hideAvatar ? "true" : "false",
      langs: langs ? "true" : "false",
      show: showFields.join(","),
    })
    fetch(`/api/preview-banner?${params.toString()}`)
      .then(res => res.text())
      .then(setSvg)
      .catch(() => setSvg(null))
  }, [theme, fg, bg, hideAvatar, langs, showFields])

  const handleCopy = () => {
    if (linkRef.current) {
      const text = linkRef.current.innerText
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopySuccess("Copied!")
          setTimeout(() => setCopySuccess(""), 1500)
        })
        .catch(() => setCopySuccess("Failed to copy"))
    }
  }

  const handleFieldChange = (field: string) => {
    setShowFields(prev => (prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]))
  }

  return (
    <div className="app">
      <div className="bg-noise" aria-hidden="true" />

      <section className="hero">
        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span className="hero-line hero-line-left">Pretty</span>
            <span className="hero-line hero-line-right">Banner</span>
          </h1>
        </div>
      </section>

      <div className="studio">
        <header className="studio-headbar">
          <h2 className="studio-heading">Configure your banner</h2>
        </header>

        <section className="studio-section">
          <h3 className="studio-label">Style</h3>
          <div className="studio-fields">
            <div className="field-row">
              <label htmlFor="theme">Theme</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                <option key="custom" value="custom">
                  Custom
                </option>
                {Object.keys(themes).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {theme === "custom" && (
              <>
                <div className="field-row">
                  <label htmlFor="fg">Foreground</label>
                  <input id="fg" type="color" value={fg} onChange={e => setFg(e.target.value)} />
                </div>
                <div className="field-row">
                  <label htmlFor="bg">Background</label>
                  <input id="bg" type="color" value={bg} onChange={e => setBg(e.target.value)} />
                </div>
              </>
            )}
          </div>
        </section>

        <section className="studio-section">
          <h3 className="studio-label">Identity</h3>
          <div className="studio-fields">
            <div className="field-row">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            {!langs && (
              <div className="field-row">
                <label htmlFor="hideAvatar">Show Avatar</label>
                <input id="hideAvatar" type="checkbox" className="checkbox" checked={!hideAvatar} onChange={e => setHideAvatar(!e.target.checked)} />
              </div>
            )}
            <div className="field-row">
              <label htmlFor="langs">Languages</label>
              <input id="langs" type="checkbox" className="checkbox" checked={langs} onChange={e => setLangs(e.target.checked)} />
            </div>
          </div>
        </section>

        <section className="studio-section">
          <h3 className="studio-label">Fields</h3>
          <div className="studio-fields">
            <div className="fields-chips">
              {showFields.length === 0 && <span className="fields-empty">none selected</span>}
              {showFields.map(field => (
                <span key={field} className="field-chip">
                  {field}
                  <button type="button" className="chip-remove" onClick={() => handleFieldChange(field)} aria-label={`Remove ${field}`}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="fields-footer">
              <button type="button" className="btn-accent" onClick={() => setShowModal(true)}>
                Select Fields
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="preview-section">
        <div className="preview-frame">
          {svg ? (
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="Banner preview" />
          ) : (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                fontFamily: "Iosevka Nerd Font",
                fontSize: 14,
                color: "#999",
              }}
            >
              loading...
            </div>
          )}
        </div>
      </div>

      <div className="link-section">
        <p ref={linkRef} className="link-paragraph">
          {`https://pretty-profile.vercel.app/api/github-stats?username=${username}`}
          {`&theme=${theme}`}
          {`&hide_avatar=${hideAvatar ? "true" : "false"}`}
          {`&langs=${langs ? "true" : "false"}`}
          {!langs && `&show=${showFields.join(",")}`}
        </p>
        <div className="link-actions">
          <button type="button" className="btn-dark" onClick={handleCopy}>
            Copy Link
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-frame" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <h2>Select Fields</h2>
              <div className="field-grid">
                {allFields.map(field => (
                  <label key={field} className="field-item">
                    <input type="checkbox" className="checkbox" checked={showFields.includes(field)} onChange={() => handleFieldChange(field)} />
                    {field}
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-accent" onClick={() => setShowModal(false)}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Pretty Banner</p>
        <span>design your github profile banner</span>
      </footer>
    </div>
  )
}
