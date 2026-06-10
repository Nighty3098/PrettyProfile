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
    <>
      <div className="deco-circle" />
      <div className="deco-triangle" />
      <div className="deco-rect" />

      <header className="header">
        <h1>Pretty Profile</h1>
      </header>

      <div className="settings-grid">
        <div className="card card-pink">
          <div className="card-label">// 01</div>
          <h3>Style</h3>
          <div className="item">
            <p>Theme</p>
            <select value={theme} onChange={e => setTheme(e.target.value)}>
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
              <div className="item">
                <p>Foreground</p>
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
              </div>
              <div className="item">
                <p>Background</p>
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
              </div>
            </>
          )}
        </div>

        <div className="card card-yellow">
          <div className="card-label">// 02</div>
          <h3>Identity</h3>
          <div className="item">
            <p>Username</p>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          {!langs && (
            <div className="item">
              <p>Show Avatar</p>
              <input type="checkbox" className="checkbox" checked={!hideAvatar} onChange={e => setHideAvatar(!e.target.checked)} />
            </div>
          )}
          <div className="item">
            <p>Languages</p>
            <input type="checkbox" className="checkbox" checked={langs} onChange={e => setLangs(e.target.checked)} />
          </div>
        </div>

        <div className="card card-blue card-full">
          <div className="card-label">// 03</div>
          <h3>Fields</h3>
          <div className="item">
            <p className="field-preview">{showFields.join(", ") || "none selected"}</p>
            <button type="button" className="btn-pink" onClick={() => setShowModal(true)}>
              Select
            </button>
          </div>
        </div>
      </div>

      <div className="preview-section">
        <h2 className="section-heading">Preview</h2>
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
          <button type="button" onClick={handleCopy}>
            Copy Link
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-stripe" />
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
              <button type="button" className="btn-blue" onClick={() => setShowModal(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
