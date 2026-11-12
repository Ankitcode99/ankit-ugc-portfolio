# Ankit Pandey | Tech UGC Portfolio

A responsive, single-page portfolio built with semantic HTML, CSS, and vanilla JavaScript.

## Run locally
Open `index.html` in a browser, or serve this folder with any static HTTP server.

## Contact and profiles
- Collaboration email: ankitcode99@outlook.com
- LinkedIn: https://www.linkedin.com/in/ankitpandey99/
- Medium: https://ankitpandeycu.medium.com
- Topmate: https://topmate.io/ankitcode99

## Before publishing
- Replace sample work videos and posters with approved published UGC samples.
- Profile photo is loaded from the supplied LinkedIn image URL and requires internet access.
- Topmate testimonial images are loaded from external URLs.

## Typography and palette
- Audiowide: display headlines and prominent figures.
- General Sans: body copy, navigation, and labels.
- Neon Nocturne palette: `#0A0A0B`, `#F4F4F0`, `#C6FF3D` (with accent tint `#8FB32A`).

Audiowide is served by Google Fonts; General Sans is served by Fontshare. A system sans-serif fallback is configured.

## Testimonials and themes
33 published Topmate testimonials are embedded in two continuous, opposite-direction marquees. Original Topmate image cards are used where supplied; other reviews use text cards. Hovering or focusing a card pauses its row. Reduced-motion preferences disable auto-scrolling. Light mode uses white, navy blue and orange; the theme toggle persists the selection locally.

## Verified links
- Email: ankitcode99@outlook.com
- LinkedIn: https://www.linkedin.com/in/ankitpandey99/
- Medium: https://ankitpandeycu.medium.com
- Topmate: https://topmate.io/ankitcode99
- Intro photo: https://res.cloudinary.com/v5o4ftzh/image/upload/f_auto,q_auto/IMG_0744

AC99 branding: the Cloudinary PNG is used as the header logo and browser favicon/apple-touch-icon. It loads from the external Cloudinary URL.


## Published work reels
The three Selected Work cards now embed real published reels. Reel 1 uses a Instagram Reel embed with an Instagram link; reels 2 and 3 use Instagram embeds. Instagram may require cookies, login, or permission from Instagram to play in an embedded frame; each card includes a direct link as a fallback.


Selected Work uses YouTube Shorts for all three reels, in an on-demand popup player.


## YouTube embed troubleshooting (Error 153)
YouTube requires an HTTP Referer or equivalent client identity for embedded playback.
Do not open `index.html` with a `file://` URL when testing embedded videos.
Run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`.
For production, deploy the site over HTTPS and avoid `Referrer-Policy: no-referrer`
or iframe sandbox rules that prevent YouTube from receiving origin information.
The modal uses the standard youtube.com embed and an explicit iframe referrer policy.
When opened as a local file, the video button instead opens YouTube directly.
Some videos can still disallow embedding; direct Watch on YouTube links remain available.


Reel 1 uses a Cloudinary-hosted MP4 for silent desktop hover preview and native playback in the modal. Reels 2 and 3 still use YouTube. Hover preview is disabled on touch devices and when reduced motion is preferred.

All three reels use Cloudinary MP4 muted autoplay on desktop hover; YouTube links provide sound playback.
