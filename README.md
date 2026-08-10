# Pretty Banner

**Pretty Banner** is a Next.js-based service for generating beautiful, customizable SVG banners with GitHub profile statistics. It is designed for use in GitHub READMEs, personal websites, and dashboards, providing visually appealing, themeable, and informative profile cards.

https://pretty-profile.vercel.app/

## Features
- Fetches and visualizes GitHub user statistics (repos, stars, followers, languages, etc.)
- Generates SVG banners with multiple themes and custom backgrounds
- Supports custom color schemes and user-defined themes
- Optionally displays top programming languages
- Supports hiding the avatar and adding a custom "about me" text
- Fast, stateless API endpoint for easy integration

## Demo

### Anime:

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=anime&hide_avatar=true)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=anime&hide_avatar=true
```

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=anime&langs=true)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=anime&langs=true
```

<details>
<summary>MORE...</summary>

### Ancient

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=ancient)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=ancient
```

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=ancient&langs=true)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=ancient&langs=true
```

### Landscape with a Cottage:

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=landscape_with_a_cottage)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=landscape_with_a_cottage
```


![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=landscape_with_a_cottage&langs=true)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=landscape_with_a_cottage&langs=true
```

### Custom

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=custom&fg=%23000000&bg=%23caa7ca)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=custom&fg=%23000000&bg=%236a55e8
```

</details>


## API Usage
### Endpoint
```
GET /api/github-stats
```

### Query Parameters
| Name         | Type    | Default | Description                                                                 |
|--------------|---------|---------|-----------------------------------------------------------------------------|
| username     | string  | —       | **(Required)** GitHub username                                              |
| theme        | string  | city    | Theme name (see below for available themes)                                 |
| fg           | string  |         | Custom foreground (text) color (hex or CSS)                                 |
| bg           | string  |         | Custom background color (hex or CSS)                                        |
| show         | string  |         | Comma-separated list of fields to show (e.g. `stars,followers`)             |
| about_me     | string  |         | Custom text to display at the bottom of the banner                          |
| hide_avatar  | boolean | false   | Hide the user's avatar ("true" or "false")                                 |
| langs        | boolean | false   | Show top programming languages ("true" or "false")                         |

### Example
```
/api/github-stats?username=Nighty3098&theme=night&show=stars,followers,commits&about_me=Open%20Source%20Enthusiast&hide_avatar=true&langs=true
```

## Available Themes
- city
- landscape_with_a_cottage
- california_spring
- forest
- japan
- night
- waterfall
- ancient
- solarized
- mac_bigsur
- mac_bigsur_dark
- white
- simple
- everforest_sea
- gradient
- anime

Each theme has its own background image and color palette. You can also use custom colors via `fg` and `bg` parameters.

## Customization
- **Custom Colors:** Use `fg` and `bg` to override text and background colors.
- **Custom Fields:** Use `show` to select which stats to display.
- **Languages:** Set `langs=true` to show a bar of top languages.
- **Avatar:** Set `hide_avatar=true` to hide the profile picture.
- **About Me:** Add a custom message with `about_me`.

## Installation & Development
1. Clone the repository:
   ```
   git clone https://github.com/Nighty3098/pretty_banner.git
   cd pretty_banner
   ```
2. Install dependencies:
   ```
   yarn install
   # or
   npm install
   ```
3. Create a `.env` file and add your GitHub API tokens as `GITHUB_TOKEN_PT1`, `GITHUB_TOKEN_PT2`, ...
4. Run the development server:
   ```
   yarn dev
   # or
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) and use the API endpoint as described above.

## Scripts
- `dev` — Start Next.js in development mode
- `build` — Build the project for production
- `start` — Start the production server
- `lint` — Run ESLint with auto-fix
- `format` — Format code with Prettier

## Code Style
- TypeScript, React, Next.js
- Prettier and ESLint are configured (see `.prettierrc.yaml` and `eslint.config.mjs`)
- Main font: [Iosevka Nerd Font](https://github.com/ryanoasis/nerd-fonts)

## Issues
Please report bugs and suggestions via [GitHub Issues](https://github.com/Nighty3098/pretty-profile/issues).

## License
This project is for personal use and demonstration. See repository for details.$$

<img alt="Screenshot 2026-08-10 at 12-13-52 " src="https://github.com/user-attachments/assets/08cb121e-ef06-46e9-b2aa-1c175c459e30" />
